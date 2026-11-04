'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('tuna',{
 version:()=>ipcRenderer.invoke('tuna:version'),
 newTab:(url='')=>ipcRenderer.invoke('browser:new-tab',url),
 activateTab:id=>ipcRenderer.invoke('browser:activate',id),
 navigate:(id,input)=>ipcRenderer.invoke('browser:navigate',{id,input}),
 action:(id,action)=>ipcRenderer.invoke('browser:action',{id,action}),
 closeTab:id=>ipcRenderer.invoke('browser:close-tab',id),
 onState:callback=>{const listener=(_event,state)=>callback(state);ipcRenderer.on('browser:state',listener);return ()=>ipcRenderer.removeListener('browser:state',listener);},
 onError:callback=>{const listener=(_event,message)=>callback(message);ipcRenderer.on('browser:error',listener);return ()=>ipcRenderer.removeListener('browser:error',listener);}
});
