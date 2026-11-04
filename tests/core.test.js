
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const {normalizeAddress}=require('../src/url-policy');const {parseLauncherArgs}=require('../launcher/bridge');
test('HTTPS normalization',()=>assert.equal(normalizeAddress('example.com'),'https://example.com/'));
test('search query',()=>assert.match(normalizeAddress('cats and dogs'),/^https:\/\/duckduckgo.com\/\?q=/));
test('dangerous schemes are not opened directly',()=>assert.notEqual(normalizeAddress('javascript:alert(1)'),'javascript:alert(1)'));
test('credential URLs rejected',()=>assert.equal(normalizeAddress('https://user:pass@example.com'),null));
test('launcher rejects file URL',()=>assert.equal(parseLauncherArgs(['--launcher-open','file:///etc/passwd']).open,null));
test('launcher accepts HTTPS URL',()=>assert.equal(parseLauncherArgs(['--launcher-open','https://example.com']).open,'https://example.com/'));
test('protocol launch accepts encoded HTTPS URL',()=>assert.equal(parseLauncherArgs(['tunabrowser://open?url=https%3A%2F%2Fexample.com']).open,'https://example.com/'));
test('javascript scheme is rejected',()=>assert.equal(normalizeAddress('javascript:alert(1)'),null));
test('local file scheme is rejected',()=>assert.equal(normalizeAddress('file:///etc/passwd'),null));
test('data scheme is rejected',()=>assert.equal(normalizeAddress('data:text/html,test'),null));

test('HTTP addresses are rejected',()=>assert.equal(normalizeAddress('http://example.com'),null));

test('every visible browser toolbar button has a click handler',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../src/index.html'),'utf8');
 const renderer=fs.readFileSync(path.join(__dirname,'../src/renderer.js'),'utf8');
 const buttons=[...html.matchAll(/<button\b[^>]*\bdata-([a-z-]+)/g)].map(match=>match[1]);
 assert.ok(buttons.length>0);
 for(const name of buttons){
  assert.match(renderer,new RegExp(`querySelector\\(['"]\\[data-${name}\\]['"]\\)\\.addEventListener\\(['"]click['"]`),`data-${name} must be wired to a click handler`);
 }
});

test('browser address form submits to the active tab',()=>{
 const renderer=fs.readFileSync(path.join(__dirname,'../src/renderer.js'),'utf8');
 assert.match(renderer,/querySelector\('\[data-address-form\]'\)\.addEventListener\('submit'/);
 assert.match(renderer,/window\.tuna\.navigate\(state\.activeTabId,address\.value\)/);
});

test('safe HTTPS popups are routed into tabs and capped',()=>{
 const main=fs.readFileSync(path.join(__dirname,'../src/main.js'),'utf8');
 assert.match(main,/setWindowOpenHandler\(\(\{url\}\)=>/);
 assert.match(main,/const safe=normalizeAddress\(url\)/);
 assert.match(main,/if\(safe&&tabs\.size<20\)createTab\(safe\)/);
});
