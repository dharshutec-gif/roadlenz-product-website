const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  fs.mkdirSync('artifacts/industries', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [name, width, height] of [['desktop', 1536, 1000], ['tablet', 768, 1024], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: name === 'mobile', hasTouch: name !== 'desktop' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error' && !message.text().includes('Failed to load resource')) errors.push(message.text()); });
      const response = await page.goto(`${process.env.ROADLENZ_URL || 'http://localhost:3000'}/industries`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await page.locator('#industry-gallery').scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      assert.equal(await page.locator('#industry-gallery a').count(), 7);
      assert.equal(await page.locator('[class*="selected"] [class*="panelLabel"]').textContent(), 'Logistics & Trucking');
      assert.equal(await page.locator('footer').count(), 1);
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, body: document.documentElement.scrollWidth }));
      assert.ok(dimensions.body <= dimensions.viewport, `Horizontal overflow: ${JSON.stringify(dimensions)}`);
      await page.evaluate(() => window.scrollTo(0,0));
      const headingBounds = await page.locator('#industries-heading').boundingBox();
      const headerBounds = await page.locator('header').boundingBox();
      assert.ok(headingBounds.y >= headerBounds.y + headerBounds.height, 'Hero covered by header');
      const gallery = page.locator('#industry-gallery');
      await gallery.scrollIntoViewIfNeeded();
      if (name === 'desktop') {
        const selected = await page.locator('#industry-gallery a').nth(4).boundingBox();
        const normal = await page.locator('#industry-gallery a').nth(0).boundingBox();
        assert.ok(selected.width / normal.width > 2.3);
        await page.locator('#industry-gallery a').nth(0).hover();
        await page.waitForTimeout(100);
        assert.equal(await page.locator('[aria-label="Selected industry impact"] h2').innerText(), 'Cab & Taxi');
        await page.locator('#industry-gallery a').nth(1).focus();
        await page.waitForTimeout(100);
        assert.equal(await page.locator('[aria-label="Selected industry impact"] h2').innerText(), 'School Transport');
        await page.locator('#industry-gallery a').nth(4).hover();
        await page.locator('#industry-gallery a').nth(4).evaluate(el => el.blur());
      } else {
        await page.getByRole('button', { name: 'Select Mining', exact: true }).click();
        await page.waitForTimeout(150);
        assert.equal(await page.locator('[aria-label="Selected industry impact"] h2').innerText(), 'Mining');
        await page.getByRole('button', { name: 'Select Logistics & Trucking', exact: true }).click();
        await page.waitForTimeout(150);
        assert.equal(await page.locator('[aria-label="Selected industry impact"] h2').innerText(), 'Logistics & Trucking');
        await page.locator('#industry-gallery > div').first().evaluate(el => { el.scrollLeft += el.children[0].getBoundingClientRect().width; });
        await page.waitForTimeout(180);
        assert.equal(await page.locator('[aria-label="Selected industry impact"] h2').innerText(), 'Mining');
        await page.getByRole('button', { name: 'Select Logistics & Trucking', exact: true }).click();
        await page.evaluate(() => window.scrollTo(0,0));
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        const menuLink = page.getByRole('link', { name: 'Industries', exact: true }).filter({ visible: true });
        assert.equal(await menuLink.getAttribute('href'), '/industries');
        await page.getByRole('button', { name: 'Close menu', exact: true }).click();
      }
      await page.locator('#intelligence-heading').scrollIntoViewIfNeeded();
      await page.locator('[class*="outcomes"]').scrollIntoViewIfNeeded();
      await page.locator('footer').scrollIntoViewIfNeeded();
      // Chromium's fullPage capture can reset nested CSS snap scrollers during
      // its temporary resize. Resize explicitly, restore selection, then capture.
      await page.setViewportSize({ width, height: await page.evaluate(() => document.documentElement.scrollHeight) });
      if (name !== 'desktop') {
        await page.getByRole('button', { name: 'Select Logistics & Trucking', exact: true }).click();
        await page.waitForTimeout(150);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(150);
      await page.screenshot({ path: `artifacts/industries/${name}.png` });
      assert.equal(await page.locator('[class*="selected"] [class*="panelLabel"]').textContent(), 'Logistics & Trucking');
      const text = await page.locator('main').innerText();
      assert.ok(!/[\uFFFD]|\u00e2\u20ac|\u00c2\u00a9/.test(text), 'Broken text encoding');
      const broken = await page.locator('main img').evaluateAll(images => images.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
      assert.deepEqual(broken, []);
      assert.deepEqual(errors, []);
      console.log(`PASS ${name}: layout, selection, header, navigation, images, encoding, runtime errors`);
      await page.close();
    }
    const animated = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
    await animated.goto(`${process.env.ROADLENZ_URL || 'http://localhost:3000'}/industries`, { waitUntil: 'networkidle' });
    await animated.locator('#industries-heading').waitFor({ state: 'visible' });
    await animated.waitForTimeout(500);
    assert.equal(await animated.locator('#industries-heading').evaluate(el => getComputedStyle(el).opacity), '1');
    await animated.locator('[class*="products"]').scrollIntoViewIfNeeded();
    await animated.waitForTimeout(1600);
    assert.equal(await animated.locator('[class*="connection"] span').evaluate(el => getComputedStyle(el).animationPlayState), 'running');
    const links = await animated.locator('#industry-gallery a, [class*="product"] > a, [class*="ctaActions"] a[href^="/"]').evaluateAll(anchors => [...new Set(anchors.map(a => a.getAttribute('href')).filter(Boolean))]);
    for (const href of links) {
      const response = await animated.request.get(`${process.env.ROADLENZ_URL || 'http://localhost:3000'}${href}`);
      assert.equal(response.status(), 200, `Destination unavailable: ${href}`);
    }
    await animated.locator('#industry-gallery a').nth(4).click();
    await animated.waitForURL('**/solutions/logistics');
    console.log(`PASS: standard motion, visible connection pulse, panel click navigation, and ${links.length} published destinations`);
    await animated.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
