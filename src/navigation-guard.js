'use strict';
const MAX_TABS=20;
const MAX_ADDRESS_LENGTH=2048;
const BLOCKED_HOSTS=new Set(['localhost']);
function isPublicHttpsUrl(value){
 if(typeof value!=='string'||value.length>MAX_ADDRESS_LENGTH||/[\u0000-\u001f\u007f]/.test(value))return false;
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.username||url.password||url.hostname.endsWith('.')||url.hostname.endsWith('.localhost'))return false;
  const hostname=url.hostname.toLowerCase();
  if(BLOCKED_HOSTS.has(hostname))return false;
  if(/^\[(?:\:\:1|\:\:ffff:127\.)/i.test(hostname))return false;
  if(/^(?:127|10|0|169\.254|192\.168)\./.test(hostname))return false;
  const parts=hostname.split('.');
  if(parts.length===4&&parts.every(p=>/^\d+$/.test(p))){
   const n=parts.map(Number);
   if(n.some(p=>p>255))return false;
   if(n[0]===172&&n[1]>=16&&n[1]<=31)return false;
   if(n[0]>=224)return false;
  }
  return true;
 }catch{return false;}
}
function mayOpenTab(count){return Number.isInteger(count)&&count>=0&&count<MAX_TABS;}
module.exports={MAX_TABS,isPublicHttpsUrl,mayOpenTab};
