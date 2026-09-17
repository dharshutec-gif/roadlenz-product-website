const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.ROADLENZ_URL||'http://localhost:3000';
(async()=>{fs.mkdirSync('artifacts/resources',{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});try {
 for(const [name,width,height] of [['desktop',1536,1000],['tablet',768,1024],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))errors.push(m.text());});
  const response=await page.goto(base+'/resources',{waitUntil:'networkidle'});assert.equal(response.status(),200);
  const html=await response.text();assert.ok(!html.includes('PRIVATE-DRAFT'));assert.ok(!html.includes('passwordHash'),'Header must not serialize the full database');
  assert.equal(await page.locator('header').count(),1);assert.equal(await page.locator('footer').count(),1);assert.equal(await page.locator('main h1').count(),1);
  assert.ok(await page.getByRole('heading',{name:'Knowledge for every mile ahead.'}).isVisible());
  const header=await page.locator('header').boundingBox(),hero=await page.locator('#resources-heading').boundingBox();assert.ok(hero.y>=header.height);
  if(name==='desktop'){const bounds=await page.locator('section[aria-labelledby="resources-heading"]').boundingBox();assert.ok(bounds.height>=380&&bounds.height<=450,`Hero ${bounds.height}`);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const nav=page.getByRole('navigation',{name:'Resource sections'});assert.equal(await nav.getByRole('link').count(),6);
  await nav.getByRole('link',{name:'Documentation',exact:true}).click();await page.waitForTimeout(150);
  const query=page.getByRole('searchbox').or(page.getByRole('textbox',{name:'Search documentation',exact:true}));await query.fill('camera');
  assert.ok(await page.locator('#documentation [class*="docResults"] a').count()>0);
  await query.fill('nothing-matches-8291');assert.equal(await page.locator('#documentation [class*="docResults"] a').count(),0);await query.fill('');
  await nav.getByRole('link',{name:'Case Studies',exact:true}).click();await page.waitForTimeout(150);assert.equal(await nav.locator('[aria-current="location"]').getAttribute('href'),'#case-studies');
  assert.equal(await page.locator('#case-studies a[href^="/resources/"]').count(),0);
  await page.getByRole('link',{name:'Explore all resources',exact:true}).click();assert.ok(await page.locator('#resource-library').getAttribute('open')!==null);
  await page.locator('#resource-library summary').click();
  const downloads=await page.locator('#downloads a[download]').evaluateAll(a=>a.map(x=>x.getAttribute('href')));assert.ok(downloads.length>0);
  for(const href of downloads)assert.equal((await page.request.get(base+href)).status(),200);
  assert.equal(await page.locator('#videos video').getAttribute('autoplay'),null);assert.ok(await page.locator('#videos video').getAttribute('controls')!==null);
  if(name==='mobile'){await page.evaluate(()=>window.scrollTo(0,0));await page.getByRole('button',{name:'Open menu',exact:true}).click();const link=page.locator('header').getByRole('link',{name:'Resources',exact:true}).filter({visible:true});assert.equal(await link.getAttribute('href'),'/resources');await page.getByRole('button',{name:'Close menu',exact:true}).click();}
  for(const section of ['insights','videos','downloads','documentation','help','case-studies'])await page.locator('#'+section).scrollIntoViewIfNeeded();
  await page.setViewportSize({width,height:await page.evaluate(()=>document.documentElement.scrollHeight)});await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(100);await page.screenshot({path:`artifacts/resources/${name}.png`});
  const text=await page.locator('main').innerText();assert.ok(!/\uFFFD|\u00e2\u20ac/.test(text));assert.deepEqual(errors,[]);
  await page.getByRole('link',{name:'Read guide',exact:true}).click();await page.waitForURL('**/resources/*');assert.equal(await page.locator('main h1').count(),1);
  await page.close();console.log(`PASS ${name}: layout, section navigation, search, CMS empty states, downloads, video, menu and resource detail`);
 }
 const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
 await p.goto(base+'/resources',{waitUntil:'networkidle'});await p.waitForTimeout(600);assert.equal(await p.locator('#resources-heading').evaluate(el=>getComputedStyle(el).opacity),'1');
 await p.goto(base+'/resources?type=download',{waitUntil:'networkidle'});await p.waitForTimeout(300);assert.equal(await p.locator('nav[aria-label="Resource sections"] [aria-current="location"]').getAttribute('href'),'#downloads');
 assert.equal((await p.request.get(base+'/resources/missing-resource')).status(),404);
 assert.equal((await p.request.post(base+'/api/resources/upload',{multipart:{file:{name:'test.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4')}}})).status(),401);
 for(const suffix of ['', '/seed_1_z9oe94'])assert.equal((await p.request.get(base+'/api/c/resources'+suffix)).status(),401);
 assert.equal((await p.request.get(base+'/api/resources/files/'+ 'a'.repeat(32)+'.pdf')).status(),404);
 console.log('PASS: standard motion, legacy category deep link, anonymous CMS/upload denied, protected file denied, missing detail 404');await p.close();
} finally {await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
