const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(__dirname + '/Code.gs', 'utf8');
function fixture() {
  let rows = [], cached = false, released = 0;
  let ctx;
  const sheet = {
    getLastRow: () => rows.length + 1,
    getRange: (r) => r === 1 ? {getValues: () => [ctx.LEAD_HEADERS]} : {createTextFinder: (id) => ({matchEntireCell: () => ({findNext: () => rows.find(row => row[0] === id) || null})})},
    appendRow: (row) => rows.push(row)
  };
  ctx = vm.createContext({Date, JSON,
    PropertiesService: {getScriptProperties: () => ({getProperty: () => 'test-sheet'})},
    SpreadsheetApp: {openById: () => ({getSheetByName: () => sheet}), flush: () => {}},
    LockService: {getScriptLock: () => ({tryLock: () => true, releaseLock: () => released++})},
    CacheService: {getScriptCache: () => ({get: () => cached, put: () => {cached = true;}})},
    Utilities: {base64EncodeWebSafe: () => 'hash', computeDigest: () => [], DigestAlgorithm: {SHA_256: 'sha'}, formatDate: () => '2026-10-20 15:00:00'},
    HtmlService: {createHtmlOutput: html => ({html, setXFrameOptionsMode() {return this;}}), XFrameOptionsMode: {ALLOWALL: 1}},
    ContentService: {createTextOutput: text => ({text, setMimeType() {return this;}}), MimeType: {JSON: 'json'}}
  });
  vm.runInContext(source, ctx);
  const valid = {request_id:'12345678-abcd-1234-abcd-123456789abc', name:'ТЕСТ — не пациент', phone:'+77000000000', service:'katarakta', page:'/katarakta-almaty/', lang:'ru', consent:true, consent_version:'lead-2026-10-20', parent_origin:'https://asiakoz.com'};
  return {ctx, valid, rows, released: () => released};
}
test('saves one row and acknowledges only the matching request ID', () => {
  const {ctx, valid, rows} = fixture();
  const result = ctx.doPost({parameter:{payload:JSON.stringify(valid)}});
  assert.equal(rows.length, 1); assert.equal(rows[0][3], "'+77000000000");
  assert.match(result.html, /"ok":true/); assert.ok(result.html.includes(valid.request_id));
  assert.ok(!result.html.includes(valid.phone)); assert.ok(!result.html.includes(valid.name));
});
test('a retry of the same saved ID does not duplicate the row', () => {
  const {ctx, valid, rows, released} = fixture(); ctx.saveLead(valid); ctx.saveLead(valid);
  assert.equal(rows.length, 1); assert.equal(released(), 2);
});
test('rejects missing consent, malformed contacts and forged page/service combinations', () => {
  for (const patch of [{consent:false},{phone:'123'},{name:' '},{page:'/laser/'},{parent_origin:'https://other.example'},{website:'bot'},{service:'constructor'},{lang:'en'}]) {
    const {ctx, valid, rows} = fixture();
    const result = ctx.doPost({parameter:{payload:JSON.stringify({...valid,...patch})}});
    assert.equal(rows.length, 0); assert.match(result.html, /"ok":false/);
  }
});
test('untrusted strings remain literal cells and cannot inject spreadsheet formulas', () => {
  const {ctx, valid, rows} = fixture(); ctx.saveLead({...valid,name:'=IMPORTXML("https://example.test")',utm_term:'@command'});
  assert.ok(rows[0][2].startsWith("'=")); assert.ok(rows[0][15].startsWith("'@"));
});
test('KK service routes are validated and stored', () => {
  const {ctx, valid, rows} = fixture(); ctx.saveLead({...valid, lang:'kk',page:'/kk/katarakta-almaty/'});
  assert.equal(rows[0][7], 'kk');
});
test('GET never exposes contact rows or spreadsheet identifiers', () => {
  const {ctx, valid} = fixture(); ctx.saveLead(valid); const result=ctx.doGet();
  assert.ok(!result.text.includes(valid.phone)); assert.ok(!result.text.includes('test-sheet'));
});
test('stores age separately and rejects invalid ages', () => {
  const {ctx, valid, rows} = fixture(); ctx.saveLead({...valid,age:42}); assert.equal(rows[0][19], '42');
  for (const age of [-1,121,1.5,'42']) {
    const f=fixture(); assert.throws(()=>f.ctx.saveLead({...f.valid,age}));
  }
});
