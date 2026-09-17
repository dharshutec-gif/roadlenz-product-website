const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const mod = { exports: {} };
new Function('module', 'exports', 'require', ts.transpileModule(fs.readFileSync('src/lib/industries-content.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText)(mod, mod.exports, require);
const { getIndustryPanels } = mod.exports;
const { solutions } = JSON.parse(fs.readFileSync('data/db.json', 'utf8'));
const before = JSON.stringify(solutions);
assert.deepEqual(getIndustryPanels([]), []);
assert.deepEqual(getIndustryPanels(solutions.map(s => ({ ...s, published: false }))), []);
const panels = getIndustryPanels(solutions);
assert.deepEqual(panels.map(p => p.slug), ['taxi', 'school-transport', 'public-transport', 'employee-transport', 'logistics', 'mining', 'agriculture']);
for (const panel of panels) {
  assert.equal(panel.href, `/solutions/${panel.slug}`);
  assert.ok(fs.existsSync(`public${panel.image}`), `Missing scene: ${panel.image}`);
}
const fixture = structuredClone(solutions);
fixture[0].industryPresentation = { order: 99, label: 'Custom taxi label', summary: 'CMS summary', benefits: [] };
let result = getIndustryPanels(fixture);
assert.equal(result.at(-1).name, 'Custom taxi label');
assert.equal(result.at(-1).summary, 'CMS summary');
assert.deepEqual(result.at(-1).benefits, []);
fixture[0].industryPresentation.active = false;
assert.equal(getIndustryPanels(fixture).some(p => p.slug === fixture[0].slug), false);
fixture[1].heroMedia = { type: 'video', src: '/video.mp4', poster: '/poster.jpg' };
assert.equal(getIndustryPanels(fixture).find(p => p.slug === fixture[1].slug).image, '/poster.jpg');
assert.equal(JSON.stringify(solutions), before, 'Canonical solutions must remain unchanged');
console.log('PASS: approved order, existing destinations and scenes, publication, empty state, CMS overrides, poster fallback, and source isolation');
