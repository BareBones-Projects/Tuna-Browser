'use strict';
const tabsElement=document.querySelector('[data-tabs]');
const address=document.querySelector('[data-address]');
const status=document.querySelector('[data-status]');
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
 const tab=activeTab();if(tab&&tab.url&&document.activeElement!==address)address.value=tab.url;
}
function newTab(){window.tuna.newTab();}
document.querySelector('[data-address-form]').addEventListener('submit',event=>{event.preventDefault();if(state.activeTabId){status.textContent='';window.tuna.navigate(state.activeTabId,address.value);}});
document.querySelector('[data-new-tab]').addEventListener('click',newTab);
document.querySelector('[data-new-tab-secondary]').addEventListener('click',newTab);
document.querySelector('[data-back]').addEventListener('click',()=>state.activeTabId&&window.tuna.action(state.activeTabId,'back'));
document.querySelector('[data-forward]').addEventListener('click',()=>state.activeTabId&&window.tuna.action(state.activeTabId,'forward'));
document.querySelector('[data-reload]').addEventListener('click',()=>state.activeTabId&&window.tuna.action(state.activeTabId,'reload'));
window.tuna.onState(next=>{state=next;render();});
window.tuna.onError(message=>{status.textContent=message;});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='l'){event.preventDefault();address.focus();address.select();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='t'){event.preventDefault();newTab();}});
