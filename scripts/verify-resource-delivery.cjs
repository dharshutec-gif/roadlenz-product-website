const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const {NextRequest}=require('next/server');
function load(file,deps={}) {const mod={exports:{}};new Function('module','exports','require',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText)(mod,mod.exports,name=>name in deps?deps[name]:require(name));return mod.exports;}
(async()=>{
 fs.mkdirSync('artifacts/resources',{recursive:true});
 const dir=fs.mkdtempSync(path.resolve('artifacts/resources/delivery-test-'));
 const root=path.resolve('artifacts/resources');assert.ok(dir.startsWith(root+path.sep));
 let session=null;const db={resources:[]};
 const content=load('src/lib/resource-content.ts');
 const fileTools=load('src/lib/resource-files.ts');
 const api=load('src/lib/api.ts',{'./db':{readDb:()=>db},'./auth':{sessionFromRequest:()=>session}});
 const deps={'@/lib/api':api,'@/lib/db':{readDb:()=>db},'@/lib/auth':{sessionFromRequest:()=>session},'@/lib/resource-server':{RESOURCE_FILE_DIR:dir},'@/lib/resource-content':content,'@/lib/resource-files':fileTools};
 const upload=load('src/app/api/resources/upload/route.ts',deps).POST;
 const delivery=load('src/app/api/resources/files/[name]/route.ts',deps).GET;
 const uploadRequest=(name,data)=>{const form=new FormData();form.append('file',new File([data],name));return new NextRequest('http://localhost/api/resources/upload',{method:'POST',body:form});};
 try {
  assert.equal((await upload(uploadRequest('guide.pdf','%PDF-1.4\nfixture'))).status,401);
  session={role:'customer'};assert.equal((await upload(uploadRequest('guide.pdf','%PDF-1.4\nfixture'))).status,403);
  session={role:'admin'};assert.equal((await upload(uploadRequest('guide.pdf','<script>bad</script>'))).status,400);
  assert.equal((await upload(uploadRequest('active.svg','<svg/>'))).status,400);
  const uploaded=await upload(uploadRequest('guide.pdf','%PDF-1.4\nfixture'));assert.equal(uploaded.status,201);
  const {url}=await uploaded.json();assert.match(url,/^\/api\/resources\/files\/[a-f0-9]{32}\.pdf$/);
  const name=path.basename(url),params={params:Promise.resolve({name})};
  const request=(headers={})=>new NextRequest('http://localhost'+url,{headers});
  let response=await delivery(request(),params);assert.equal(response.status,200);assert.equal(await response.text(),'%PDF-1.4\nfixture');
  session=null;assert.equal((await delivery(request(),params)).status,404,'Orphan upload must be private');
  const resource={published:false,type:'guide',file:{url}};db.resources.push(resource);
  assert.equal((await delivery(request(),params)).status,404,'Draft file must be private');
  session={role:'customer'};assert.equal((await delivery(request(),params)).status,404);
  session=null;resource.published=true;response=await delivery(request(),params);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'private, no-store');await response.arrayBuffer();
  response=await delivery(request({range:'bytes=0-4'}),params);assert.equal(response.status,206);assert.equal(await response.text(),'%PDF-');
  response=await delivery(request({range:'bytes=999-'}),params);assert.equal(response.status,416);
  resource.published=false;assert.equal((await delivery(request(),params)).status,404,'Unpublish must revoke access');
  resource.published=true;resource.type='case-study';resource.approved=false;assert.equal((await delivery(request(),params)).status,404);
  resource.approved=true;response=await delivery(request(),params);assert.equal(response.status,200);await response.arrayBuffer();
  assert.equal((await delivery(request(),{params:Promise.resolve({name:'../db.json'})})).status,404);
  console.log('PASS: real role gate, admin upload, content validation, private drafts/orphans, publication, revocation, case approval, byte ranges and traversal denial');
 } finally {
  for(const name of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir,name));fs.rmdirSync(dir);
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
