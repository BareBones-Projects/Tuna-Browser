'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {validateSettings,createStore}=require('../src/browser-preferences');
test('filters invalid wallpaper and bookmark URLs',()=>{
 const v=validateSettings({wallpaper:'javascript:alert(1)',linkUrl:'file:///etc/passwd',bookmarks:[{title:'OK',url:'https://example.com'},{title:'bad',url:'http://localhost'}]});
 assert.equal(v.wallpaper,'');assert.equal(v.linkUrl,'');assert.equal(v.bookmarks.length,1);
});
test('limits text, bookmark count and retains valid HTTPS link',()=>{
 const v=validateSettings({linkText:'a'.repeat(200),linkUrl:'https://example.com',bookmarks:Array.from({length:110},(_,i)=>({title:'x',url:'https://example.com/'+i}))});
 assert.equal(v.linkText.length,100);assert.equal(v.bookmarks.length,100);assert.equal(v.linkUrl,'https://example.com');
});
test('persists validated settings in user data',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tuna-preferences-'));
 try{const store=createStore(dir);store.save({showBookmarks:false,wallpaper:'https://example.com/bg.png'});assert.equal(createStore(dir).read().showBookmarks,false);assert.equal(store.read().wallpaper,'https://example.com/bg.png');}
 finally{fs.rmSync(dir,{recursive:true,force:true});}
});
