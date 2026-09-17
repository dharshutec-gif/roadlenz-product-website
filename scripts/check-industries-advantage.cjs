const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  fs.mkdirSync('artifacts/industries-advantage', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [name, width, height] of [['desktop', 1536, 1000], ['tablet', 768, 1024], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3000/industries', { waitUntil: 'networkidle' });
      const section = page.locator('section[aria-labelledby="roadlenz-intelligence-title"]');
      await section.scrollIntoViewIfNeeded();
      await section.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      assert.equal(await section.getByRole('navigation').getByRole('link').count(), 6);
      assert.equal(await section.getByRole('link', { name: 'Explore Our Technology' }).getAttribute('href'), '/technology');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, name + ': horizontal overflow');
      const layout = await section.locator('a').evaluateAll(links => links.map(el => {
        const rect = el.getBoundingClientRect();
        return { width: rect.width, height: rect.height, fits: el.scrollWidth <= el.clientWidth };
      }));
      assert.ok(layout.every(item => item.width > 44 && item.height > 44 && item.fits), JSON.stringify(layout));
      assert.equal(await section.locator('[data-layer]').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      assert.deepEqual(errors, []);
      await section.screenshot({ path: `artifacts/industries-advantage/${name}.png` });
      console.log(`PASS ${name}: artwork, six cards, CTA, layout, reduced motion, no runtime errors`);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1536, height: 1000 }, reducedMotion: 'no-preference' });
    await page.goto('http://localhost:3000/industries', { waitUntil: 'networkidle' });
    const section = page.locator('section[aria-labelledby="roadlenz-intelligence-title"]');
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('section[aria-labelledby="roadlenz-intelligence-title"]').dataset.inView === 'true');
    const layers = section.locator('[data-layer]');
    assert.equal(await layers.count(), 1);
    await section.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    const start = await layers.evaluateAll(els => els.map(el => getComputedStyle(el).transform));
    await page.waitForTimeout(900);
    const middle = await layers.evaluateAll(els => els.map(el => getComputedStyle(el).transform));
    assert.notDeepEqual(start, middle, 'Layers must actually move as time passes');
    const names = await section.evaluate(el => el.getAnimations({ subtree: true }).map(a => a.animationName));
    assert.ok(names.some(name => name?.includes('orbitTravel')));
    assert.ok(names.some(name => name?.includes('layerExpand')));
    await section.screenshot({ path: 'artifacts/industries-advantage/animated.png' });
    assert.equal(await section.getByRole('button', { name: /animation/i }).count(), 0);
    console.log('PASS real-time motion: artwork animates automatically, no animation button');
    await section.getByRole('link', { name: 'AI Safety' }).click();
    await page.waitForURL('**/technology#ai-safety');
    await page.locator('#ai-safety').waitFor();
    console.log('PASS AI Safety link: navigates to the existing technology section');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
