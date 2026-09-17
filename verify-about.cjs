const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const ts = require('typescript');

function load(file, requireFn = require, processRef = process) {
  const mod = { exports:{} };
  const compiled = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
  new Function('module','exports','require','process',compiled)(mod,mod.exports,requireFn,processRef);
  return mod.exports;
}
const defaultsModule = load('src/lib/about-content.ts');
const defaults = defaultsModule.getAboutDefaults();
assert.equal(defaults.aboutSlides.length,3);
assert.equal(defaults.aboutOffices.length,6);
assert.equal(defaults.aboutSupport.length,3);
assert.equal(defaults.aboutLeaders.length,2);
assert.deepEqual(defaults.aboutMilestones.map(m=>m.year),['2016','2019','2022','Today']);
assert.ok(defaults.aboutMilestones.every(m=>!m.title&&!m.description),'No invented history');
assert.ok(defaults.aboutLeaders.every(m=>!m.name&&!m.quote),'No invented identities or quotations');
assert.ok(defaults.aboutOffices.slice(3).every(o=>!o.phone),'No invented international phone numbers');
assert.equal(defaults.aboutOffices.filter(o=>o.headquarters).length,1);
assert.equal(defaults.aboutOffices[3].address[0],'Fraunhoferstraße 27');
for(const item of defaults.aboutSlides) assert.ok(fs.existsSync('public'+item.media.src));

// Test actual DB migration and persistence against an isolated, non-sensitive fixture.
const fixture = path.resolve('artifacts/about/cms-fixture');
fs.mkdirSync(path.join(fixture,'data'),{recursive:true});
const fixtureDb = path.join(fixture,'data/db.json');
fs.writeFileSync(fixtureDb,JSON.stringify({version:19,productCategories:[],solutions:[],products:[{id:'keep',published:false}],settings:{sentinel:'preserve'}}));
const storage = load('src/lib/db.ts', name => {
  if(name==='server-only') return {};
  if(name==='./about-content') return defaultsModule;
  if(name==='./seed') return {buildSeedDb(){throw new Error('Unexpected reseed');}};
  if(name.startsWith('./')) return {};
  return require(name);
},{...process,cwd:()=>fixture});
const migrated = storage.readDb();
assert.equal(migrated.aboutOffices.length,6);
assert.deepEqual(migrated.products,[{id:'keep',published:false}]);
const api = load('src/lib/api.ts', name => name==='./db' ? storage : name==='./auth' ? {} : require(name));
for(const key of Object.keys(defaults)) assert.ok(api.isEntityKey(key));
const milestone = migrated.aboutMilestones[0];
const patch = api.sanitizedEntityData('aboutMilestones',{title:'Approved historical title',description:'Approved company history.',year:'2016',image:'/media/about/fleet.webp',order:4,published:false,id:'cannot-change',users:[]});
assert.equal(patch.id,undefined);
assert.equal(patch.users,undefined);
storage.mutateDb(db=>storage.updateEntity(db,'aboutMilestones',milestone.id,patch));
const saved = storage.readDb(true);
assert.equal(saved.aboutMilestones[0].title,'Approved historical title');
assert.equal(saved.aboutMilestones[0].published,false);
assert.equal(saved.aboutMilestones[0].order,4);
assert.equal(storage.publishedOf(storage.listEntity(saved,'aboutMilestones')).length,3);
storage.mutateDb(db=>storage.updateEntity(db,'aboutOffices',db.aboutOffices[0].id,api.sanitizedEntityData('aboutOffices',{phone:'+91 12345 67890',headquarters:false,address:['Edited address'],mapsUrl:'https://maps.google.com/',image:'/media/about/fleet.webp'})));
assert.deepEqual(storage.readDb(true).aboutOffices[0].address,['Edited address']);
storage.mutateDb(db=>{db.aboutLeaders=[];});
assert.equal(storage.readDb(true).aboutLeaders.length,0,'Do not repopulate removed CMS content');
fs.unlinkSync(fixtureDb);
fs.rmdirSync(path.join(fixture,'data'));
fs.rmdirSync(fixture);

const baseline = JSON.parse(fs.readFileSync('artifacts/about/baseline-hashes.json','utf8'));
const live = JSON.parse(fs.readFileSync('data/db.json','utf8'));
for(const [key,hash] of Object.entries(baseline)) assert.equal(crypto.createHash('sha256').update(JSON.stringify(live[key])).digest('hex'),hash,`Unrelated data changed: ${key}`);
console.log('About CMS migration, persistence, publication, ordering, field whitelist, honest defaults and unrelated-data preservation passed.');
