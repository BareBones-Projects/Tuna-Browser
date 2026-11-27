'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {isPublicHttpsUrl,mayOpenTab,MAX_TABS}=require('../src/navigation-guard');
test('allows public HTTPS',()=>assert.equal(isPublicHttpsUrl('https://example.com/path'),true));
for(const input of ['http://example.com','file:///etc/passwd','javascript:alert(1)','https://user:pass@example.com','https://localhost','https://127.0.0.1','https://192.168.1.2','https://10.0.0.1','https://172.16.0.1','https://169.254.1.1','https://example.localhost','https://[::1]']){
 test('blocks unsafe destination '+input,()=>assert.equal(isPublicHttpsUrl(input),false));
}
test('tab limit',()=>{assert.equal(mayOpenTab(MAX_TABS-1),true);assert.equal(mayOpenTab(MAX_TABS),false);assert.equal(mayOpenTab(-1),false);});
