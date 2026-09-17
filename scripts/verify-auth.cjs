const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const { NextRequest } = require('next/server');

const root = process.cwd();
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'roadlenz-auth-test-'));
const modules = new Map();
let cookieToken;
function load(file) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += fs.existsSync(file + '.ts') ? '.ts' : '.tsx';
  if (modules.has(file)) return modules.get(file).exports;
  const mod = { exports: {} };
  modules.set(file, mod);
  const localRequire = (id) => {
    if (id === 'server-only') return {};
    if (id === 'next/headers') return { cookies: async () => ({ get: () => cookieToken ? { value: cookieToken } : undefined }) };
    if (id === 'next/navigation') return { redirect: (url) => { throw new Error('REDIRECT:' + url); } };
    if (id === '@/components/admin/AdminConsole') return { default: function AdminConsole() {} , __esModule: true };
    if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id));
    return require(id);
  };
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('require', 'module', 'exports', compiled)(localRequire, mod, mod.exports);
  return mod.exports;
}

(async () => {
  fs.mkdirSync(path.join(fixture, 'data'));
  const db = JSON.parse(fs.readFileSync(path.join(root, 'data/db.json'), 'utf8'));
  db.users = [];
  db.sessions = [];
  fs.writeFileSync(path.join(fixture, 'data/db.json'), JSON.stringify(db));
  process.chdir(fixture);
  process.env.ROADLENZ_SUPERADMIN_USERNAME = 'test-admin';
  process.env.ROADLENZ_SUPERADMIN_EMAIL = 'admin@example.test';
  process.env.ROADLENZ_SUPERADMIN_NAME = 'Test Admin';
  process.env.ROADLENZ_SUPERADMIN_PASSWORD = 'test-password-123';
  const auth = load('src/lib/auth.ts');
  const database = load('src/lib/db.ts');
  const primary = load('src/lib/admin-primary.ts');
  primary.ensurePrimaryAdmin();
  const admin = database.readDb().users.find(u => u.role === 'admin');
  database.mutateDb(next => next.users.push({ id: 'test-customer', email: 'customer@example.test', name: 'Customer', company: '', phone: '', role: 'customer', createdAt: new Date().toISOString(), passwordHash: auth.hashPassword('customer-password') }));
  const page = load('src/app/admin/page.tsx').default;
  await assert.rejects(page(), /REDIRECT:\/admin\/login$/, 'Unauthenticated admin access must go to the login route');
  cookieToken = auth.createSession('test-customer', 'customer');
  await assert.rejects(page(), /REDIRECT:\/dashboard$/, 'Customer sessions must go to the dashboard');
  cookieToken = auth.createSession(admin.id, 'admin');
  const rendered = await page();
  assert.equal(rendered.props.session.name, 'Test Admin', 'Admins must reach the existing console without a redirect loop');
  const loginPage = load('src/app/admin/login/page.tsx').default;
  await assert.rejects(loginPage(), /REDIRECT:\/admin$/);
  cookieToken = auth.createSession('test-customer', 'customer');
  await assert.rejects(loginPage(), /REDIRECT:\/dashboard$/);

  const login = load('src/app/api/auth/login/route.ts').POST;
  const request = body => new NextRequest('http://localhost/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const sessionsBefore = database.readDb().sessions.length;
  const denied = await login(request({ email: 'customer@example.test', password: 'customer-password', intent: 'admin' }));
  assert.equal(denied.status, 403, 'Admin-intent login must reject customer credentials');
  assert.equal(database.readDb().sessions.length, sessionsBefore);
  assert.equal((await login(request({ email: 'admin@example.test', password: 'wrong', intent: 'admin' }))).status, 401);
  process.env.ROADLENZ_SUPERADMIN_PASSWORD = 'updated-test-password-123';
  const accepted = await login(request({ email: 'admin@example.test', password: 'updated-test-password-123', intent: 'admin' }));
  assert.equal(accepted.status, 200, 'Admin login must synchronize the fixed environment password');
  assert.equal((await accepted.json()).role, 'admin');
  const token = accepted.cookies.get('rl_session').value;
  assert.equal(auth.sessionFromToken(token).role, 'admin');
  const customer = await login(request({ email: 'customer@example.test', password: 'customer-password' }));
  assert.equal(customer.status, 200);
  assert.equal((await customer.json()).role, 'customer');
  const logout = load('src/app/api/auth/logout/route.ts').POST;
  assert.equal((await logout(new NextRequest('http://localhost/api/auth/logout', { method: 'POST', headers: { cookie: 'rl_session=' + token } }))).status, 204);
  assert.equal(auth.sessionFromToken(token), null);
  console.log('PASS admin/customer routing, role enforcement, primary password synchronization, existing sessions and logout');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  process.chdir(root);
  fs.rmSync(fixture, { recursive: true, force: true });
});
