const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  fs.mkdirSync('artifacts/industries-hero', { recursive: true });
  try {
    for (const [name, width, height] of [['desktop', 1536, 1000], ['tablet', 768, 1024], ['mobile', 390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3000/industries', { waitUntil: 'networkidle' });
      const hero = page.locator('section[aria-labelledby="industries-title"]');
      await hero.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      assert.equal(await hero.locator('h1').textContent(), 'Built for real operations.');
      const typography = await page.locator('main h1, main h2').evaluateAll(headings => headings.map(el => {
        const style = getComputedStyle(el);
        return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, lineHeight: style.lineHeight, italic: style.fontStyle };
      }));
      assert.ok(typography.every(item => item.family.includes('Inter') && item.weight === '400' && item.size === typography[0].size && item.lineHeight === typography[0].lineHeight), JSON.stringify(typography));
      assert.equal(typography[0].italic, 'italic');
      assert.ok(typography.slice(1).every(item => item.italic === 'normal'));
      const bodySizes = await page.locator('main h1 + p, main h2 + p').evaluateAll(paragraphs => paragraphs.map(el => getComputedStyle(el).fontSize));
      assert.ok(bodySizes.every(size => size === '16px'), JSON.stringify(bodySizes));
      assert.equal(await hero.getByRole('navigation', { name: 'Featured industries' }).getByRole('link').count(), 5);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}: overflow`);
      assert.equal(await hero.locator('[class*="convoy"]').evaluate(el => getComputedStyle(el).animationName), 'none');
      const heading = await hero.locator('h1').boundingBox();
      const header = await page.locator('header').first().boundingBox();
      assert.ok(heading.y >= header.y + header.height, `${name}: header overlaps heading`);
      await page.screenshot({ path: `artifacts/industries-hero/${name}.png`, fullPage: false });
      await hero.getByRole('link', { name: 'Explore Industries', exact: true }).click();
      assert.equal(new URL(page.url()).hash, '#industry-explorer');
      assert.deepEqual(errors, []);
      console.log(`PASS ${name}: loaded artwork, layout, links, header clearance, reduced motion, no runtime errors`);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1536, height: 1000 }, reducedMotion: 'no-preference' });
    await page.goto('http://localhost:3000/industries', { waitUntil: 'networkidle' });
    await page.locator('[class*="convoyReady"]').waitFor();
    const motion = await page.locator('[class*="convoyReady"]').evaluate(el => {
      const animation = el.getAnimations()[0];
      animation.pause();
      animation.currentTime = 200;
      const start = new DOMMatrix(getComputedStyle(el).transform).a;
      animation.currentTime = 2400;
      const end = new DOMMatrix(getComputedStyle(el).transform).a;
      return { start, end };
    });
    assert.ok(motion.start < 0.6 && motion.end === 1, JSON.stringify(motion));
    console.log('PASS convoy: vehicles grow forward together from 48% to full size');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
