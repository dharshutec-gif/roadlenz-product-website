const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const root = process.cwd();
const at = '2026-09-15T08:00:00.000Z';
const base = { order: 0, published: true, createdAt: at, updatedAt: at };
const customer = { id: 'customer_fixture', name: 'Fixture customer', email: 'customer@example.test', company: 'Fixture fleet', phone: '100', role: 'customer', passwordHash: 'HASH_CANARY', createdAt: at, active: true, fleetSize: '12' };
const admin = { ...customer, id: 'admin_fixture', role: 'admin', name: 'Fixture admin', email: 'admin@example.test', adminRole: 'ADMIN' };
const product = { ...base, id: 'product_fixture', name: 'Fixture device', slug: 'fixture-device', trackInventory: true, stockQuantity: 0, lowStockThreshold: 2, token: 'NESTED_TOKEN_CANARY' };
const quote = { ...base, id: 'quotation_fixture', customerUserId: customer.id, number: 'Q-FIXTURE', status: 'sent', total: 118 };
const ticket = { ...base, id: 'ticket_fixture', kind: 'ticket', ref: 'T-FIXTURE', subject: 'Installation', description: 'Fixture issue', status: 'open', priority: 'medium', replies: [], assignedAdminId: admin.id, internalNotes: 'Follow up', followUpDate: '2026-09-16' };
const fixture = {
  version: 1, updatedAt: at, users: [admin, customer], sessions: [{ token: 'SESSION_CANARY', userId: admin.id }],
  products: [product, { ...product, id: 'draft_fixture', published: false, stockQuantity: 1 }], productCategories: [],
  customers: { [customer.id]: { userId: customer.id, name: customer.name, company: customer.company, email: customer.email, phone: customer.phone, plan: '', memberSince: at, quotes: [{ id: quote.id, status: 'pending' }], tickets: [ticket], addresses: [], passwordHash: 'PROFILE_HASH_CANARY' } },
  orders: [{ id: 'order_fixture', customerUserId: customer.id, total: 118, status: 'pending', createdAt: at }, { id: 'cancelled_fixture', customerUserId: customer.id, total: 999, status: 'cancelled', createdAt: at }], invoices: [],
  quotes: [{ ...base, id: 'request_fixture', ref: 'QR-FIXTURE', name: customer.name, email: customer.email, status: 'new', products: 'fixture-device', message: 'Quote please' }],
  demos: [{ ...base, id: 'demo_fixture', ref: 'D-FIXTURE', name: customer.name, email: customer.email, status: 'new', date: '2026-09-16', timeSlot: '10:00', topics: 'fixture-device' }],
  messages: [{ ...base, id: 'message_fixture', ref: 'M-FIXTURE', email: customer.email, status: 'new', subject: 'Question', message: 'Fixture enquiry' }],
  settings: { name: 'RoadLenz fixture', contact: {}, seo: {} },
  admin: { quotations: [quote], inventoryHistory: [], media: [], activity: [], notificationReads: { [admin.id]: ['customer:' + customer.id] }, quotationDefaults: { gstRate: 18, validityDays: 30, paymentTerms: '', deliveryTerms: '', terms: '' } },
};
const session = { userId: admin.id, role: 'admin', name: admin.name, email: admin.email, company: '' };
let flushes = 0;
const sync = { configured: false, pending: false, lastSyncedAt: null, error: null };
const cache = new Map();
function load(file) {
  file = path.resolve(root, file); if (!path.extname(file)) file += '.ts';
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} }; cache.set(file, mod);
  const localRequire = name => {
    if (name === 'server-only') return {};
    const target = name.startsWith('@/') ? path.resolve(root, 'src', name.slice(2)) : name.startsWith('.') ? path.resolve(path.dirname(file), name) : '';
    if (target === path.resolve(root, 'src/lib/db')) return { readDb: () => fixture };
    if (target === path.resolve(root, 'src/lib/auth')) return { sessionFromRequest: req => req.headers.get('x-test-role') ? { ...session, role: req.headers.get('x-test-role') } : null };
    if (target === path.resolve(root, 'src/lib/supabase-sync')) return { supabaseSyncStatus: () => ({ ...sync }), flushSupabaseQueue: async () => { flushes++; return { ...sync }; } };
    return target ? load(target) : require(name);
  };
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'module', 'exports', js)(localRequire, mod, mod.exports);
  return mod.exports;
}
(async () => {
  const before = JSON.stringify(fixture);
  const { adminSnapshot } = load('src/lib/admin-snapshot.ts');
  const snapshot = adminSnapshot(fixture, session);
  assert.equal(snapshot.metrics.totalProducts, 2); assert.equal(snapshot.metrics.publishedProducts, 1); assert.equal(snapshot.metrics.draftProducts, 1);
  assert.equal(snapshot.metrics.lowStock, 1); assert.equal(snapshot.metrics.outOfStock, 1); assert.equal(snapshot.metrics.totalCustomers, 1);
  assert.equal(snapshot.metrics.orderValue, 118); assert.equal(snapshot.metrics.pendingQuotations, 2, 'Shared portal quote is not counted twice');
  assert.equal(snapshot.metrics.demoRequests, 1); assert.equal(snapshot.metrics.newEnquiries, 1);
  assert.equal(snapshot.session.adminRole, 'ADMIN');
  const support = snapshot.requests.find(row => row.kind === 'support');
  assert.equal(support.customerUserId, customer.id); assert.equal(support.email, customer.email); assert.equal(support.priority, 'normal'); assert.equal(support.assignedAdminId, admin.id);
  assert.equal(snapshot.requests.find(row => row.kind === 'quote').topics, 'fixture-device');
  assert.equal(snapshot.requests.find(row => row.kind === 'demo').timeSlot, '10:00');
  assert.equal(snapshot.notifications.find(row => row.id === 'customer:' + customer.id).read, true);
  const serialized = JSON.stringify(snapshot); for (const secret of ['HASH_CANARY', 'SESSION_CANARY', 'PROFILE_HASH_CANARY', 'NESTED_TOKEN_CANARY']) assert.ok(!serialized.includes(secret));
  assert.equal(snapshot.users, undefined); assert.equal(snapshot.sessions, undefined); assert.equal(snapshot.customers[0].profile.passwordHash, undefined);
  assert.equal(JSON.stringify(fixture), before, 'Snapshot construction does not mutate persisted input');
  const empty = structuredClone(fixture);
  for (const key of Object.keys(empty)) if (Array.isArray(empty[key])) empty[key] = [];
  empty.users = [admin];
  empty.customers = {};
  delete empty.admin;
  const emptyBefore = JSON.stringify(empty);
  const emptySnapshot = adminSnapshot(empty, session);
  for (const [metric, value] of Object.entries(emptySnapshot.metrics)) assert.equal(value, 0, `${metric} must be zero without business records`);
  for (const collection of ['products', 'categories', 'customers', 'requests', 'quotations', 'orders', 'inventoryHistory', 'media', 'activity', 'notifications']) assert.deepEqual(emptySnapshot[collection], [], `${collection} must never contain generated business data`);
  assert.equal(JSON.stringify(empty), emptyBefore, 'Opening an empty admin portal must not seed business records');
  assert.throws(() => adminSnapshot(fixture, { ...session, role: 'customer' }), /Administrator/);
  assert.throws(() => adminSnapshot(fixture, { ...session, userId: 'missing' }), /Administrator/);
  const route = load('src/app/api/admin/console/route.ts');
  const request = role => new NextRequest('http://localhost/api/admin/console', { headers: role ? { 'x-test-role': role } : {} });
  assert.equal((await route.GET(request())).status, 401); assert.equal((await route.GET(request('customer'))).status, 403); assert.equal(flushes, 0, 'Unauthorized requests cannot trigger sync');
  const response = await route.GET(request('admin')); assert.equal(response.status, 200); assert.match(response.headers.get('cache-control'), /no-store/); assert.equal(flushes, 1);
  assert.equal((await response.json()).metrics.totalProducts, 2);
  const customersRoute = load('src/app/api/admin/customers/route.ts');
  assert.equal((await customersRoute.GET(request('customer'))).status, 403);
  const result = await customersRoute.GET(request('admin')); assert.equal(result.status, 200); const body = await result.json();
  assert.equal(body.customers.length, 1); assert.equal(body.customers[0].quoteCount, 1); assert.equal(body.customers[0].totalSpend, 118); assert.equal(body.customers[0].registeredAt, at); assert.equal(body.customers[0].passwordHash, undefined);
  console.log('PASS admin snapshot: real metrics, quote deduplication, safe serialization, customer request mapping, read notifications, immutable fixture, admin authorization and legacy customer contract');
})().catch(error => { console.error(error); process.exitCode = 1; });
