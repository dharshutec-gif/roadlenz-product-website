const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
const moduleFixture = { exports: {} };
new Function('module','exports','require',ts.transpileModule(fs.readFileSync('src/lib/technology-capabilities.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(moduleFixture,moduleFixture.exports,require);
const { getTechnologyCapabilities, getTechnologyCapability, getTechnologyOverview, getCapabilityProducts, technologySettings } = moduleFixture.exports;
const capabilities = getTechnologyCapabilities();
const expected = ['live-fleet','video-telematics','ai-safety','playback','reports','vehicle-health'];
assert.deepEqual(capabilities.map(c => c.slug), expected);
assert.equal(getTechnologyCapability('missing'), undefined);
const db = JSON.parse(fs.readFileSync('data/db.json','utf8'));
const before = JSON.stringify(db);
for (const capability of capabilities) {
  assert.ok(capability.outcomes.length >= 3 && capability.outcomes.length <= 4);
  assert.ok(capability.callouts.length >= 2 && capability.callouts.length <= 3);
  assert.equal(capability.stories.length, 3);
  const slots = [capability.hero,capability.workspace,...capability.stories.map(s => s.media)];
  assert.equal(new Set(slots).size, slots.length, 'Each media slot must be independently configurable');
  slots.forEach(slot => { assert.equal(slot.type,'placeholder'); assert.equal(slot.src,''); assert.ok(slot.alt); });
  assert.deepEqual(getCapabilityProducts(capability, []), []);
  assert.deepEqual(getCapabilityProducts(capability, db.products.map(p => ({ ...p,published:false }))), []);
  getCapabilityProducts(capability, db.products).forEach(product => {
    assert.ok(product.published && capability.productSlugs.includes(product.slug));
    assert.strictEqual(product, db.products.find(p => p.slug === product.slug));
  });
}
assert.equal(getTechnologyOverview().stories.length,6);
assert.equal(technologySettings.demo.href,'/book-demo');
assert.equal(technologySettings.expert.href,'/contact');
assert.equal(technologySettings.quote.href,'/request-quote');
assert.equal(JSON.stringify(db), before);
console.log('PASS: six routes, isolated media slots, shared content, existing request destinations, published/relevant products, empty states and source preservation');
