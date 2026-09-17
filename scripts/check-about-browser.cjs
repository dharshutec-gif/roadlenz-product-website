const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.ROADLENZ_URL || 'http://localhost:3100';

(async () => {
  fs.mkdirSync('artifacts/about', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [name, width, height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small-mobile',320,720]]) {
      const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce', isMobile:width<540, hasTouch:width<800 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const response = await page.goto(url+'/about', { waitUntil:'networkidle' });
      assert.equal(response.status(),200);
      assert.equal(await page.locator('h1').innerText(),'People. Purpose. Progress.');
      assert.equal(await page.locator('main > div > section').count(),7);
      assert.equal(await page.locator('footer').count(),1);
      assert.equal(await page.locator('[aria-roledescription="slide"]').count(),3);
      assert.equal(await page.locator('[aria-label="Choose an office"] [role="tab"]').count(),6);
      assert.equal(await page.locator('[aria-label="Our journey"] li').count(),4);
      assert.equal(await page.locator('[aria-label="Leadership"] article').count(),2);
      const header = await page.locator('header').boundingBox();
      const h1 = await page.locator('h1').boundingBox();
      assert.ok(h1.y >= header.y + header.height, 'Header overlaps heading');
      if (width>=1280) assert.equal(await page.locator('header a[href="/about"]').getAttribute('aria-current'),'page');
      await page.getByRole('button',{name:'Next slide',exact:true}).click();
      assert.equal(await page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label'),'02 — Installation & deployment');
      await page.getByRole('button',{name:'Previous slide',exact:true}).click();
      for (let i=0;i<6;i++) {
        await page.locator('#office-tab-'+i).click();
        assert.equal(await page.locator('#office-tab-'+i).getAttribute('aria-selected'),'true');
        const mapLink = await page.locator('#office-panel a[target="_blank"]').getAttribute('href');
        assert.ok(mapLink.startsWith('https://www.google.com/maps/search/?api=1&query='));
        assert.equal(await page.locator('#office-panel a[href^="tel:"]').count(),i<3?1:0);
      }
      if(width>540) {
        await page.getByRole('button',{name:'01 Bigfox Office, Chennai',exact:true}).click();
        assert.equal(await page.locator('#office-panel h3').innerText(),'Bigfox Office');
      }
      await page.locator('#office-tab-0').focus();
      await page.keyboard.press('End');
      assert.equal(await page.locator('#office-panel h3').innerText(),'USA Office');
      for(let i=0;i<3;i++) {
        await page.locator('#support-tab-'+i).click();
        assert.equal(await page.locator('#support-tab-'+i).getAttribute('aria-selected'),'true');
        assert.equal(await page.locator('#support-panel a[href^="tel:"]').getAttribute('href'),'tel:+919841600444');
        assert.equal(await page.locator('#support-panel a[href^="mailto:"]').getAttribute('href'),'mailto:sales@bigfox.co.in');
      }
      await page.locator('#support-tab-0').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#support-panel h3').innerText(),'Technical Support');
      await page.locator('#office-tab-0').click();
      await page.locator('#support-tab-0').click();
      await page.locator('[aria-label="Leadership"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      const badImages = await page.locator('main img[src^="/media/about/"]').evaluateAll(imgs=>imgs.filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src));
      assert.deepEqual(badImages,[]);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
      assert.deepEqual(errors,[]);
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/about/${name}.png`,fullPage:true});
      await page.close();
      console.log(name+': section order/counts, controls, office data, support contacts, keyboard, media, overflow and runtime checks passed');
    }
    const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
    await page.goto(url+'/about',{waitUntil:'networkidle'});
    await page.mouse.move(1,1);
    await page.waitForTimeout(5300);
    assert.equal(await page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label'),'02 — Installation & deployment');
    await page.locator('h1').hover();
    await page.waitForTimeout(5300);
    assert.equal(await page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label'),'02 — Installation & deployment');
    await page.mouse.move(1,1);
    await page.getByRole('button',{name:'Show slide 1: Fleet operations',exact:true}).focus();
    await page.waitForTimeout(5300);
    assert.equal(await page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label'),'02 — Installation & deployment');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.getByRole('button',{name:'Show slide 1: Fleet operations',exact:true}).click();
    await page.locator('h1').click();
    await page.mouse.move(1,1);
    await page.waitForTimeout(5300);
    assert.equal(await page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label'),'01 — Fleet operations');
    await page.locator('[aria-label="About RoadLenz"]').evaluate(element => {
      const start = new Touch({identifier:1,target:element,clientX:300,clientY:300});
      const end = new Touch({identifier:1,target:element,clientX:100,clientY:310});
      element.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[start]}));
      element.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[end]}));
    });
    assert.equal(await page.locator('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label'),'02 — Installation & deployment');
    assert.equal((await page.request.get(url+'/api/c/aboutOffices')).status(),401);
    console.log('Autoplay, hover/focus pause, reduced motion, swipe and CMS access protection passed');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
