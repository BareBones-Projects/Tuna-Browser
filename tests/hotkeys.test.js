'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {ACTIONS,DEFAULT_KEYS,normalizeShortcut,validateBindings,matchShortcut}=require('../src/hotkeys');
test('all commands have unique IDs and descriptions',()=>{
 assert.equal(new Set(ACTIONS.map(x=>x.id)).size,ACTIONS.length);
 assert.ok(ACTIONS.every(x=>x.description&&x.label&&x.category&&DEFAULT_KEYS[x.id]));
});
test('normalizes platform modifiers and rejects bare printable keys',()=>{
 assert.equal(normalizeShortcut('CtrlOrCmd+Shift+t'),'Mod+Shift+T');
 assert.equal(normalizeShortcut('A'),null);
 assert.equal(normalizeShortcut('Alt+F4'),null);
 assert.equal(normalizeShortcut('Ctrl+L'),'Mod+L');
});
test('duplicate bindings cannot override existing commands',()=>{
 const result=validateBindings({newTab:'Mod+L',focusAddress:'Mod+L'});
 assert.equal(result.newTab,DEFAULT_KEYS.newTab);
 assert.equal(result.focusAddress,DEFAULT_KEYS.focusAddress);
});
test('valid customized keys are preserved and unknown actions discarded',()=>{
 const v=validateBindings({newTab:'Mod+Shift+Y',notACommand:'Mod+X'});
 assert.equal(v.newTab,'Mod+Shift+Y');
 assert.equal(v.notACommand,undefined);
});
test('keyboard input matches platform shortcut',()=>{
 const event={key:'t',ctrlKey:true,metaKey:false,shiftKey:false,altKey:false};
 assert.equal(matchShortcut(event,{newTab:'Mod+T'},'linux'),'newTab');
 assert.equal(matchShortcut(event,{newTab:'Mod+T'},'darwin'),null);
});
