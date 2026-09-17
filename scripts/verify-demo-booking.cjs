const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/lib/demo-booking.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {}, Date };
vm.runInNewContext(compiled.outputText, context);
const { earliestDemoDate, buildDemoRequest } = context.exports;
assert.equal(earliestDemoDate(new Date(2026, 8, 15, 23, 59)), '2026-09-18');
assert.equal(earliestDemoDate(new Date(2026, 11, 30)), '2027-01-02');
assert.equal(earliestDemoDate(new Date(2028, 1, 27)), '2028-03-01');
const payload = buildDemoRequest({
  enquiryType: 'Hardware Overview', name: 'Test Person', company: 'Test Fleet',
  email: 'test@example.com', countryCode: '+91', phone: '9876543210',
  fleetSize: '11–50 vehicles', date: '2026-09-18', timeSlot: '10:00 AM – 12:00 PM',
  message: 'Show the camera features.',
}, 'rl-dash');
assert.equal(payload.type, 'demo');
assert.equal(payload.phone, '+91 9876543210');
assert.equal(payload.date, '2026-09-18');
assert.match(payload.topics, /Hardware Overview.*rl-dash/);
assert.match(payload.message, /11–50 vehicles/);
assert.match(payload.message, /10:00 AM – 12:00 PM.*IST/);
assert.match(payload.message, /Show the camera features\./);
console.log('Demo booking: date boundaries and complete submission payload passed.');

// Exercise the existing API handler with an in-memory database, without saving test leads.
const database = { demos: [] };
const apiContext = {
  exports: {}, Date,
  require(name) {
    if (name === '@/lib/api') return {
      jsonOk: (body, init) => Response.json(body, init),
      jsonErr: (status, error) => Response.json({ error }, { status }),
    };
    if (name === '@/lib/db') return {
      mutateDb: callback => callback(database),
      createEntity: (db, key, item) => { db[key].push(item); return item; },
    };
    throw new Error(`Unexpected dependency: ${name}`);
  },
};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/api/requests/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, apiContext);
(async () => {
  const response = await apiContext.exports.POST(new Request('http://localhost/api/requests', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  }));
  assert.equal(response.status, 201);
  assert.match((await response.json()).ref, /^D-/);
  assert.equal(database.demos.length, 1);
  assert.equal(database.demos[0].topics, payload.topics);
  assert.equal(database.demos[0].message, payload.message);
  assert.equal(database.demos[0].date, payload.date);
  console.log('Demo booking: API retains product, enquiry, fleet size, date, time and message.');
})().catch(error => { console.error(error); process.exitCode = 1; });
