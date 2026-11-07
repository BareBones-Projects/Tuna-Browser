'use strict';
const {app,BrowserWindow,WebContentsView,ipcMain,session,Menu}=require('electron');
const {createStore}=require('./browser-preferences');
const path=require('path');
const {normalizeAddress}=require('./url-policy');
const {isPublicHttpsUrl,mayOpenTab}=require('./navigation-guard');
const bridge=require('../launcher/bridge');

let win;
const tabs=new Map();
let activeTabId=null;
let nextTabId=1;
const chromeHeight=154;
let store;
let panelOpen=false;
function isChromeSender(event){return Boolean(win&&event.sender===win.webContents);}
function sendState(){
 if(!win||win.isDestroyed())return;
 const list=[...tabs.values()].map(tab=>{const wc=tab.view.webContents;return {id:tab.id,title:tab.title||tab.url||'New tab',url:tab.url||'',loading:tab.loading,error:tab.error||'',canGoBack:wc.navigationHistory.canGoBack(),canGoForward:wc.navigationHistory.canGoForward()};});
 win.webContents.send('browser:state',{tabs:list,activeTabId});
}
function setViewBounds(){
 if(!win||!activeTabId)return;
 const {width,height}=win.getContentBounds();
 const view=tabs.get(activeTabId)?.view;
 if(view)view.setBounds({x:0,y:chromeHeight,width:Math.max(0,width-(panelOpen?360:0)),height:Math.max(0,height-chromeHeight)});
}
function createTab(initialUrl=''){
 if(!mayOpenTab(tabs.size))return null;
 const id=String(nextTabId++);
 const view=new WebContentsView({webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,webviewTag:false,partition:'persist:tuna-browser'}});
 const tab={id,view,url:'',title:'New tab',loading:false,error:''};
 tabs.set(id,tab);
 const wc=view.webContents;
 wc.setWindowOpenHandler(({url})=>{
  const safe=normalizeAddress(url);
  if(safe&&isPublicHttpsUrl(safe)&&mayOpenTab(tabs.size))createTab(safe);
  return {action:'deny'};
 });
 wc.on('will-navigate',(event,url)=>{if(!isPublicHttpsUrl(url))event.preventDefault();});
 wc.on('will-redirect',(event,url)=>{if(!normalizeAddress(url))event.preventDefault();});
 wc.on('did-start-loading',()=>{tab.loading=true;tab.error='';sendState();});
 wc.on('did-stop-loading',()=>{tab.loading=false;tab.url=normalizeAddress(wc.getURL())||'';tab.title=wc.getTitle()||tab.url||'New tab';sendState();});
 wc.on('did-fail-load',(_event,errorCode,_description,_validatedURL,isMainFrame)=>{if(isMainFrame&&errorCode!==-3){tab.loading=false;tab.error='This page could not be loaded. Check your connection and try again.';sendState();}});
 wc.on('page-title-updated',(_event,title)=>{tab.title=title;sendState();});
 wc.on('did-navigate',(_event,url)=>{tab.url=normalizeAddress(url)||'';sendState();});
 wc.on('did-navigate-in-page',(_event,url,isMainFrame)=>{if(isMainFrame){tab.url=normalizeAddress(url)||'';sendState();}});
 if(win)win.contentView.addChildView(view);
 activateTab(id);
 if(initialUrl)navigateTab(tab,initialUrl);
 else openNewTabPage(wc);
 return id;
}
function openNewTabPage(wc){
 const prefs=store.read();
 wc.loadFile(path.join(__dirname,'new-tab.html'),{query:{wallpaper:prefs.wallpaper,linkText:prefs.linkText,linkUrl:prefs.linkUrl}}).catch(()=>{});
}
function activateTab(id){
 if(!tabs.has(id))return;
 if(activeTabId&&tabs.has(activeTabId))win.contentView.removeChildView(tabs.get(activeTabId).view);
 activeTabId=id;
 win.contentView.addChildView(tabs.get(id).view);
 setViewBounds();
 sendState();
}
function navigateTab(tab,input){
 const url=normalizeAddress(input);
 if(!url||!isPublicHttpsUrl(url)){win.webContents.send('browser:error','Only public HTTPS destinations are allowed.');return false;}
 tab.error='';tab.loading=true;tab.url=url;tab.title=url;tab.view.webContents.loadURL(url).catch(()=>{});sendState();return true;
}
function createWindow(){
 win=new BrowserWindow({width:1440,height:900,minWidth:800,minHeight:560,backgroundColor:'#0b1017',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true,webviewTag:false}});
 win.loadFile(path.join(__dirname,'index.html'));
 win.setMenuBarVisibility(false);
 win.webContents.on('did-finish-load',()=>{if(!tabs.size)createTab();else{activateTab(activeTabId);sendState();}});
 win.on('resize',setViewBounds);
 win.on('closed',()=>{tabs.clear();activeTabId=null;win=null;});
}
app.whenReady().then(()=>{
 Menu.setApplicationMenu(null);
 store=createStore(app.getPath('userData'));
 bridge.registerProtocol(app);
 session.defaultSession.setPermissionCheckHandler(()=>false);
 session.defaultSession.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
 session.fromPartition('persist:tuna-browser').setPermissionCheckHandler(()=>false);
 session.fromPartition('persist:tuna-browser').setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
 ipcMain.handle('browser:new-tab',(event,input)=>{if(!isChromeSender(event))return null;return createTab(typeof input==='string'?input:'');});
 ipcMain.handle('browser:activate',(event,id)=>{if(!isChromeSender(event))return false;activateTab(String(id));return true;});
 ipcMain.handle('browser:navigate',(event,{id,input})=>{if(!isChromeSender(event))return false;const tab=tabs.get(String(id));return tab?navigateTab(tab,input):false;});
 ipcMain.handle('browser:action',(event,{id,action})=>{if(!isChromeSender(event))return false;const tab=tabs.get(String(id));if(!tab)return false;const wc=tab.view.webContents;if(action==='back'&&wc.navigationHistory.canGoBack())wc.navigationHistory.goBack();else if(action==='forward'&&wc.navigationHistory.canGoForward())wc.navigationHistory.goForward();else if(action==='reload')wc.reload();else if(action==='stop')wc.stop();return true;});
 ipcMain.handle('browser:close-tab',(event,id)=>{if(!isChromeSender(event))return false;const tab=tabs.get(String(id));if(!tab)return false;const wasActive=activeTabId===tab.id;tabs.delete(tab.id);win.contentView.removeChildView(tab.view);tab.view.webContents.close();if(!tabs.size)createTab();else if(wasActive)activateTab([...tabs.keys()][Math.max(0,tabs.size-1)]);sendState();return true;});
 ipcMain.handle('browser:preferences:get',event=>isChromeSender(event)?store.read():null);
 ipcMain.handle('browser:preferences:save',(event,input)=>{
  if(!isChromeSender(event))return null;
  const prefs=store.save(input);
  win.webContents.send('browser:preferences',prefs);
  return prefs;
 });
 ipcMain.handle('browser:panel',(event,open)=>{if(!isChromeSender(event))return false;panelOpen=open===true;setViewBounds();return true;});
 ipcMain.handle('browser:devtools',(event,id)=>{
  if(!isChromeSender(event))return false;
  const tab=tabs.get(String(id));
  if(!tab)return false;
  tab.view.webContents.toggleDevTools();
  return true;
 });
 ipcMain.handle('browser:extensions',event=>{
  if(!isChromeSender(event))return [];
  const partition=session.fromPartition('persist:tuna-browser');
  return typeof partition.getAllExtensions==='function'
   ?Object.values(partition.getAllExtensions()).map(x=>({name:x.name||'Extension',id:x.id||''}))
   :[];
 });
 ipcMain.handle('tuna:version',()=>app.getVersion());
 createWindow();
 const launch=bridge.parseLauncherArgs(process.argv);if(launch.open&&isPublicHttpsUrl(launch.open))createTab(launch.open);
});
app.on('second-instance',(_event,argv)=>{const request=bridge.parseLauncherArgs(argv);if(request.open&&isPublicHttpsUrl(request.open))createTab(request.open);if(win){if(win.isMinimized())win.restore();win.focus();}});
app.on('open-url',(event,url)=>{event.preventDefault();const request=bridge.parseLauncherArgs([url]);if(request.open&&isPublicHttpsUrl(request.open))createTab(request.open);});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
