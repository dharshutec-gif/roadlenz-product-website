const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    let submitted;
    await page.route('**/api/enquiries', async route => {
      submitted = route.request().postDataJSON();
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, ref: 'E-TEST' }) });
    });
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
    const labels = await page.locator('header nav a').evaluateAll(links => links.map(el => ({ size: getComputedStyle(el).fontSize, weight: getComputedStyle(el).fontWeight })));
    assert.equal(labels.length, 7); assert.ok(labels.every(label => label.size === '12px' && label.weight === '700'));
    for (const [name, value] of Object.entries({ name: 'Enquiry Test', company: 'Test Company', phone: '1234567890', email: 'test@example.test', message: 'Please advise on fleet tracking.' })) await page.locator(`[name="${name}"]`).fill(value);
    await page.getByRole('button', { name: /Submit Enquiry/ }).click();
    await page.waitForFunction(() => document.querySelector('[name="name"]').value === '');
    assert.equal(submitted.enquiryType, 'General Enquiry'); assert.equal(submitted.email, 'test@example.test'); assert.equal(submitted.company, 'Test Company');
    console.log('PASS equal header labels and unchanged contact form submission/reset. Browser request mocked; no test enquiry saved or emailed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
