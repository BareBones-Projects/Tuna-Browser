'use strict';
const tabsElement=document.querySelector('[data-tabs]');
const address=document.querySelector('[data-address]');
const status=document.querySelector('[data-status]');
const backButton=document.querySelector('[data-back]');
const forwardButton=document.querySelector('[data-forward]');
const reloadButton=document.querySelector('[data-reload]');
let state={tabs:[],activeTabId:null};
function activeTab(){return state.tabs.find(tab=>tab.id===state.activeTabId);}
function render(){
 tabsElement.replaceChildren();
 for(const tab of state.tabs){
  const item=document.createElement('div');item.className='tab'+(tab.id===state.activeTabId?' active':'');item.setAttribute('role','presentation');
  const select=document.createElement('button');select.className='tab-title';select.setAttribute('role','tab');select.setAttribute('aria-selected',String(tab.id===state.activeTabId));select.textContent=tab.loading?'◌ '+tab.title:tab.title;select.title=tab.url||'New tab';select.addEventListener('click',()=>window.tuna.activateTab(tab.id));
  const close=document.createElement('button');close.className='tab-close';close.setAttribute('aria-label','Close tab');close.textContent='×';close.addEventListener('click',event=>{event.stopPropagation();window.tuna.closeTab(tab.id);});
  item.append(select,close);tabsElement.append(item);
 }
 const tab=activeTab();
 if(tab&&document.activeElement!==address)address.value=tab.url||'';
 if(tab){
  backButton.disabled=!tab.canGoBack;
  forwardButton.disabled=!tab.canGoForward;
  reloadButton.textContent=tab.loading?'×':'⟳';
  reloadButton.setAttribute('aria-label',tab.loading?'Stop loading':'Reload');
  reloadButton.title=tab.loading?'Stop loading':'Reload';
  status.textContent=tab.error|| (tab.loading?'Loading…':'HTTPS pages only');
 }
}
function newTab(){window.tuna.newTab();}
document.querySelector('[data-address-form]').addEventListener('submit',event=>{event.preventDefault();if(state.activeTabId){status.textContent='';window.tuna.navigate(state.activeTabId,address.value);}});
document.querySelector('[data-new-tab]').addEventListener('click',newTab);
document.querySelector('[data-new-tab-secondary]').addEventListener('click',newTab);
backButton.addEventListener('click',()=>state.activeTabId&&window.tuna.action(state.activeTabId,'back'));
forwardButton.addEventListener('click',()=>state.activeTabId&&window.tuna.action(state.activeTabId,'forward'));
reloadButton.addEventListener('click',()=>state.activeTabId&&window.tuna.action(state.activeTabId,activeTab()?.loading?'stop':'reload'));
window.tuna.onState(next=>{state=next;render();});
window.tuna.onError(message=>{status.textContent=message;});
document.addEventListener('keydown',event=>{
 const modifier=event.ctrlKey||event.metaKey;
 if(modifier&&event.key.toLowerCase()==='l'){event.preventDefault();address.focus();address.select();}
 if(modifier&&event.key.toLowerCase()==='t'){event.preventDefault();newTab();}
 if(modifier&&event.key.toLowerCase()==='r'){event.preventDefault();window.tuna.action(state.activeTabId,activeTab()?.loading?'stop':'reload');}
 if(event.altKey&&event.key==='ArrowLeft'){event.preventDefault();window.tuna.action(state.activeTabId,'back');}
 if(event.altKey&&event.key==='ArrowRight'){event.preventDefault();window.tuna.action(state.activeTabId,'forward');}
});

let preferences={wallpaper:'',linkText:'',linkUrl:'',showBookmarks:true,bookmarks:[]};
const panel=document.querySelector('[data-settings]');
const bookmarksBar=document.querySelector('[data-bookmarks-bar]');
const bookmarkItems=document.querySelector('[data-bookmarks]');
const menuButtons=[...document.querySelectorAll('[data-menu-toggle]')];
function closeMenus(){
 document.querySelectorAll('[data-menu]').forEach(menu=>menu.hidden=true);
 menuButtons.forEach(button=>button.setAttribute('aria-expanded','false'));
}
function renderBookmarks(){
 bookmarksBar.hidden=!preferences.showBookmarks;
 bookmarkItems.replaceChildren();
 for(const bookmark of preferences.bookmarks){
  const button=document.createElement('button');
  button.textContent=bookmark.title;button.title=bookmark.url;
  button.addEventListener('click',()=>state.activeTabId&&window.tuna.navigate(state.activeTabId,bookmark.url));
  const remove=document.createElement('button');
  remove.textContent='×';remove.title='Remove '+bookmark.title;
  remove.setAttribute('aria-label','Remove '+bookmark.title);
  remove.addEventListener('click',async()=>{preferences=await window.tuna.savePreferences({...preferences,bookmarks:preferences.bookmarks.filter(b=>b.url!==bookmark.url)});renderBookmarks();});
  const item=document.createElement('span');item.append(button,remove);bookmarkItems.append(item);
 }
}
function showSettings(mode){
 panel.hidden=false;
 window.tuna.panel(true);
 document.querySelector('[data-settings-title]').textContent=mode==='extensions'?'Extensions':'System preferences';
 document.querySelector('[data-preferences-view]').hidden=mode==='extensions';
 document.querySelector('[data-extensions-view]').hidden=mode!=='extensions';
 if(mode==='extensions'){
  window.tuna.extensions().then(list=>{
   document.querySelector('[data-extensions-list]').textContent=list.length?list.map(e=>e.name).join(', '):'No extensions installed.';
  }).catch(()=>{document.querySelector('[data-extensions-list]').textContent='Extensions unavailable.';});
 }else{
  document.querySelector('[data-wallpaper]').value=preferences.wallpaper;
  document.querySelector('[data-link-text]').value=preferences.linkText;
  document.querySelector('[data-link-url]').value=preferences.linkUrl;
  document.querySelector('[data-show-bookmarks]').checked=preferences.showBookmarks;
 }
}
async function bookmarkCurrent(){
 const tab=activeTab();
 if(!tab?.url||!tab.url.startsWith('https://'))return;
 if(preferences.bookmarks.some(b=>b.url===tab.url))return;
 preferences=await window.tuna.savePreferences({...preferences,bookmarks:[...preferences.bookmarks,{title:tab.title||new URL(tab.url).hostname,url:tab.url}]});
 renderBookmarks();
}
async function command(name){
 closeMenus();
 if(name==='new-tab')return newTab();
 if(name==='bookmark')return bookmarkCurrent();
 if(name==='focus-address'){address.focus();address.select();return;}
 if(name==='copy-url'){const url=activeTab()?.url;if(url)await navigator.clipboard.writeText(url);return;}
 if(name==='preferences'||name==='extensions')return showSettings(name);
 if(name==='devtools'&&state.activeTabId)return window.tuna.devtools(state.activeTabId);
 if(name==='reload'&&state.activeTabId)return window.tuna.action(state.activeTabId,'reload');
}
menuButtons.forEach(button=>button.addEventListener('click',()=>{
 const menu=document.querySelector('[data-menu="'+button.dataset.menuToggle+'"]');
 const wasHidden=menu.hidden;closeMenus();menu.hidden=!wasHidden;button.setAttribute('aria-expanded',String(wasHidden));
}));
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>Promise.resolve(command(button.dataset.command)).catch(error=>{status.textContent=error.message;})));
document.querySelector('[data-bookmark-current]').addEventListener('click',()=>bookmarkCurrent().catch(error=>{status.textContent=error.message;}));
document.querySelector('[data-settings-close]').addEventListener('click',()=>{panel.hidden=true;window.tuna.panel(false);});
document.querySelector('[data-save-settings]').addEventListener('click',async()=>{
 try{
  preferences=await window.tuna.savePreferences({
   ...preferences,
   wallpaper:document.querySelector('[data-wallpaper]').value.trim(),
   linkText:document.querySelector('[data-link-text]').value,
   linkUrl:document.querySelector('[data-link-url]').value.trim(),
   showBookmarks:document.querySelector('[data-show-bookmarks]').checked
  });
  renderBookmarks();panel.hidden=true;window.tuna.panel(false);status.textContent='Preferences saved. Open a new tab to see wallpaper changes.';
 }catch(error){status.textContent='Could not save preferences.';}
});
document.addEventListener('click',event=>{if(!event.target.closest('.menu-anchor'))closeMenus();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenus();panel.hidden=true;window.tuna.panel(false);}});
window.tuna.getPreferences().then(prefs=>{if(prefs){preferences=prefs;renderBookmarks();}}).catch(()=>{status.textContent='Could not load preferences.';});
