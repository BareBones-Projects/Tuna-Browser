'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {isPublicHttpsUrl}=require('./navigation-guard');
const DEFAULTS=Object.freeze({wallpaper:'',linkText:'',linkUrl:'',showBookmarks:true,bookmarks:[]});
function validateSettings(input){
 const o=input&&typeof input==='object'?input:{};
 const url=(v)=>typeof v==='string'&&isPublicHttpsUrl(v)?v:'';
 const text=(v)=>typeof v==='string'?v.slice(0,100):'';
 const bookmarks=Array.isArray(o.bookmarks)?o.bookmarks.slice(0,100).filter(b=>b&&typeof b==='object'&&url(b.url)).map(b=>({title:text(b.title)||new URL(b.url).hostname,url:url(b.url)})):[];
 return {wallpaper:url(o.wallpaper),linkText:text(o.linkText),linkUrl:url(o.linkUrl),showBookmarks:o.showBookmarks!==false,bookmarks};
}
function createStore(userData){
 const filename=path.join(userData,'browser-preferences.json');
 function read(){
  try{return validateSettings(JSON.parse(fs.readFileSync(filename,'utf8')));}catch{return validateSettings(DEFAULTS);}
 }
 function save(input){
  const next=validateSettings(input);
  fs.mkdirSync(userData,{recursive:true});
  const temp=filename+'.tmp';
  fs.writeFileSync(temp,JSON.stringify(next,null,2),{mode:0o600});
  fs.renameSync(temp,filename);
  return next;
 }
 return {read,save};
}
module.exports={DEFAULTS,validateSettings,createStore};
