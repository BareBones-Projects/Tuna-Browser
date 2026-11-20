'use strict';
const params=new URLSearchParams(location.search);
function safeHttps(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}
}
const wallpaper=safeHttps(params.get('wallpaper'));
if(wallpaper){
 const img=document.createElement('img');
 img.className='wallpaper';
 img.alt='';
 img.src=wallpaper;
 document.body.prepend(img);
}
const url=safeHttps(params.get('linkUrl'));
const text=(params.get('linkText')||'').slice(0,100);
if(url&&text){
 const a=document.createElement('a');
 a.className='wallpaper-credit';
 a.href=url;a.textContent=text;a.rel='noopener noreferrer';
 document.body.append(a);
}
