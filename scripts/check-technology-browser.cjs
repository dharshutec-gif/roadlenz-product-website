const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.ROADLENZ_URL || 'http://localhost:3000';
const routes = ['live-fleet','video-telematics','ai-safety','playback','reports','vehicle-health'];

(async () => {
  fs.mkdirSync('artifacts/technology',{recursive:true});
  const browser = await chromium.launch({ channel:'chrome',headless:true });
  try {
    for (const [viewport,width,height] of [['desktop',1536,1000],['tablet',768,1024],['mobile',390,844]]) {
      const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce', hasTouch:viewport !== 'desktop' });
      let errors = [];
      page.on('pageerror',error => errors.push(error.message));
      page.on('console',message => { if(message.type() === 'error' && !message.text().includes('Failed to load resource')) errors.push(message.text()); });
      for (const slug of [...routes,'']) {
        errors = [];
        const response = await page.goto(`${base}/technology${slug ? '/'+slug : ''}`,{waitUntil:'networkidle'});
        assert.equal(response.status(),200);
        assert.equal(await page.locator('main h1').count(),1);
        assert.equal(await page.locator('header').count(),1);
        assert.equal(await page.locator('footer').count(),1);
        assert.equal(await page.getByRole('navigation',{name:'Technology capabilities',exact:true}).getByRole('link').count(),6);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(overflow,false,`Overflow at ${viewport}/${slug}`);
        const header = await page.locator('header').boundingBox();
        const heading = await page.locator('#technology-heading').boundingBox();
        assert.ok(heading.y >= header.y+header.height,'Heading covered by header');
        if(viewport === 'desktop') {
          const hero = await page.locator('section[aria-labelledby="technology-heading"]').boundingBox();
          assert.ok(hero.height <= 560 && hero.height >= 480,`Hero height ${hero.height}`);
        }
        if(slug) {
          assert.equal(await page.locator('#outcomes-heading').count(),1);
          assert.equal(await page.locator('#workspace-heading').count(),1);
          assert.equal(await page.getByRole('navigation',{name:'Related technology',exact:true}).locator('[aria-current="page"]').getAttribute('href'),`/technology/${slug}`);
          const workspace = page.locator('section[aria-labelledby="workspace-heading"]');
          if(slug === 'live-fleet') {
            await workspace.getByRole('button',{name:'Preview vehicle B',exact:true}).click();
            assert.equal(await workspace.locator('[aria-live="polite"]').innerText(),'Vehicle B\nLocation and state appear here when a source is connected.');
          } else if(slug === 'video-telematics' || slug === 'ai-safety') {
            await workspace.getByRole('button',{name:'Cabin',exact:true}).click();
            assert.ok(await workspace.getByText('Cabin camera placeholder',{exact:true}).isVisible());
          } else if(slug === 'playback') {
            const slider = workspace.getByRole('slider',{name:'Preview journey position'});
            await slider.fill('65');
            assert.equal(await workspace.locator('output').innerText(),'65%');
          } else if(slug === 'reports') {
            await workspace.getByRole('button',{name:'Safety',exact:true}).click();
            assert.ok(await workspace.getByText('Safety overview',{exact:true}).isVisible());
          } else if(slug === 'vehicle-health') {
            await workspace.getByRole('button',{name:'Battery',exact:true}).click();
            assert.ok(await workspace.getByRole('heading',{name:'Battery signal',exact:true}).isVisible());
          }
        }
        await page.evaluate(() => window.scrollTo(0,0));
        if(viewport === 'mobile' && slug === 'live-fleet') {
          await page.getByRole('button',{name:'Open menu',exact:true}).click();
          const technology = page.locator('header').getByRole('link',{name:'Technology',exact:true}).filter({visible:true});
          assert.equal(await technology.getAttribute('href'),'/technology');
          assert.equal(await technology.getAttribute('aria-current'),'page');
          await page.getByRole('button',{name:'Close menu',exact:true}).click();
        }
        const text = await page.locator('main').innerText();
        assert.ok(!/\uFFFD|\u00e2\u20ac|\u00c2\u00a9/.test(text),'Broken encoding');
        assert.deepEqual(errors,[],`${viewport}/${slug} console errors`);
        if(slug === 'live-fleet' || slug === '' || (viewport === 'desktop' && slug === 'ai-safety')) {
          await page.setViewportSize({width,height:await page.evaluate(() => document.documentElement.scrollHeight)});
          await page.evaluate(() => window.scrollTo(0,0));
          await page.waitForTimeout(100);
          await page.screenshot({path:`artifacts/technology/${slug || 'overview'}-${viewport}.png`});
          await page.setViewportSize({width,height});
        }
      }
      console.log(`PASS ${viewport}: all six capabilities + overview; layout, controls, header, related links, encoding and runtime`);
      await page.close();
    }
    const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
    await page.goto(`${base}/technology/live-fleet`,{waitUntil:'networkidle'});
    await page.waitForTimeout(700);
    assert.equal(await page.locator('#technology-heading').evaluate(el => getComputedStyle(el).opacity),'1');
    await page.getByRole('navigation',{name:'Technology capabilities',exact:true}).getByRole('link').nth(2).click();
    await page.waitForURL('**/technology/ai-safety');
    const hrefs = await page.locator('main a[href^="/products/"],main a[href="/book-demo"],main a[href="/contact"],main a[href="/request-quote"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute('href')))]);
    for(const href of hrefs) assert.equal((await page.request.get(base+href)).status(),200,href);
    assert.equal((await page.request.get(`${base}/technology/not-a-capability`)).status(),404);
    console.log('PASS: standard motion, actual capability navigation, product/request destinations and unknown-route 404');
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode=1; });
