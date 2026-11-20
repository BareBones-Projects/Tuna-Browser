'use strict';
const ACTIONS=[
 ['newTab','New tab','Open a blank browser tab','Tabs','Mod+T'],
 ['closeTab','Close tab','Close the active browser tab','Tabs','Mod+W'],
 ['reopenTab','Reopen closed tab','Restore the most recently closed page','Tabs','Mod+Shift+T'],
 ['nextTab','Next tab','Switch to the tab on the right','Tabs','Mod+PageDown'],
 ['previousTab','Previous tab','Switch to the tab on the left','Tabs','Mod+PageUp'],
 ['focusAddress','Focus address bar','Select the current address for editing or search','Navigation','Mod+L'],
 ['reload','Reload page','Reload the active website','Navigation','Mod+R'],
 ['hardReload','Reload without cache','Reload the page while bypassing cached resources','Navigation','Mod+Shift+R'],
 ['stop','Stop loading','Stop the current page request','Navigation','Escape'],
 ['back','Go back','Return to the previous page','Navigation','Alt+ArrowLeft'],
 ['forward','Go forward','Move to the next page in history','Navigation','Alt+ArrowRight'],
 ['bookmark','Bookmark page','Save the active HTTPS page to bookmarks','Bookmarks','Mod+D'],
 ['toggleBookmarks','Show or hide bookmarks bar','Toggle the bookmarks bar','Bookmarks','Mod+Shift+B'],
 ['preferences','System preferences','Open the browser settings panel','System','Mod+Comma'],
 ['hotkeys','Keyboard shortcuts','Open the editable hotkey settings page','System','Mod+Shift+Comma'],
 ['extensions','Extensions','Show installed extensions','System','Mod+Shift+E'],
 ['devtools','Developer tools','Toggle developer tools for the active page','Tools','Mod+Shift+I'],
 ['copyUrl','Copy page address','Copy the current page URL','Tools','Mod+Shift+C'],
 ['find','Find on page','Search for text within the active website','Tools','Mod+F'],
 ['zoomIn','Zoom in','Increase the active page zoom level','View','Mod+Equal'],
 ['zoomOut','Zoom out','Decrease the active page zoom level','View','Mod+Minus'],
 ['zoomReset','Reset zoom','Restore the active page to 100% zoom','View','Mod+0']
].map(([id,label,description,category,shortcut])=>({id,label,description,category,shortcut}));
const DEFAULT_KEYS=Object.freeze(Object.fromEntries(ACTIONS.map(a=>[a.id,a.shortcut])));
const RESERVED=new Set(['Alt+F4','Mod+Q','Mod+Alt+Delete','Mod+Shift+Escape']);
function normalizeShortcut(value){
 if(typeof value!=='string'||value.length>64)return null;
 const tokens=value.split('+').map(s=>s.trim()).filter(Boolean);
 const mods=new Set();let key=null;
 for(let token of tokens){
  const t=token.toLowerCase();
  if(['ctrlorcmd','cmdorctrl','commandorcontrol','mod','ctrl','meta','cmd','command'].includes(t)){mods.add('Mod');continue;}
  if(t==='shift'){mods.add('Shift');continue;}
  if(t==='alt'||t==='option'){mods.add('Alt');continue;}
  if(key!==null)return null;
  const specials={',':'Comma','comma':'Comma','=':'Equal','equal':'Equal','-':'Minus','minus':'Minus','esc':'Escape','escape':'Escape','left':'ArrowLeft','right':'ArrowRight','arrowleft':'ArrowLeft','arrowright':'ArrowRight','pageup':'PageUp','pagedown':'PageDown','space':'Space'};
  token=specials[t]||(/^f(?:[1-9]|1[0-2])$/i.test(token)?token.toUpperCase():token.length===1?token.toUpperCase():null);
  if(!token)return null;key=token;
 }
 if(!key)return null;
 const result=[...['Mod','Alt','Shift'].filter(m=>mods.has(m)),key].join('+');
 if(!mods.size&&key!=='Escape')return null;
 if(RESERVED.has(result))return null;
 return result;
}
function validateBindings(input){
 const output={...DEFAULT_KEYS};
 if(!input||typeof input!=='object'||Array.isArray(input))return output;
 for(const action of ACTIONS){
  if(!Object.hasOwn(input,action.id))continue;
  const next=normalizeShortcut(input[action.id]);
  if(!next||Object.entries(output).some(([id,v])=>id!==action.id&&v===next))continue;
  output[action.id]=next;
 }
 return output;
}
function eventShortcut(event,platform=process.platform){
 const mods=[];
 if(platform==='darwin'?(event.metaKey||event.meta):(event.ctrlKey||event.control))mods.push('Mod');
 if(event.altKey||event.alt)mods.push('Alt');
 if(event.shiftKey||event.shift)mods.push('Shift');
 let key=event.key;
 if(key===' ')key='Space';
 if(key===',')key='Comma';
 if(key==='= '||key==='=')key='Equal';
 if(key==='-')key='Minus';
 if(key==='Esc')key='Escape';
 if(key.length===1)key=key.toUpperCase();
 return [...mods,key].join('+');
}
function matchShortcut(event,bindings,platform=process.platform){
 const combo=eventShortcut(event,platform);
 return Object.keys(DEFAULT_KEYS).find(id=>bindings[id]===combo)||null;
}
module.exports={ACTIONS,DEFAULT_KEYS,normalizeShortcut,validateBindings,eventShortcut,matchShortcut};
