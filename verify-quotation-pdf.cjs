const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const compile=(source)=>ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
const generatorPath=path.resolve('src/lib/quotation-pdf.ts');
const generator=new Module(generatorPath,module);generator.filename=generatorPath;generator.paths=module.paths;
generator._compile(compile(fs.readFileSync(generatorPath,'utf8')),generatorPath);
const {generateQuotationPdf,quotationPdfFilename}=generator.exports;
const settings={name:'RoadLenz',legalName:'Bigfox Technologies Pvt Ltd',parentCompany:'Bigfox',contact:{email:'quotes@example.test',phone:'1234567890',address:'Test business address, Bengaluru, India'}};
const quote={id:'quote-test',number:'RL-Q-2026-001',customerUserId:'owner',customerName:'Customer (Example)',company:'Fleet & Logistics',email:'customer@example.test',date:'2026-09-15',validUntil:'2026-10-15',status:'sent',items:Array.from({length:30},(_,i)=>({productSlug:`camera-${i+1}`,description:`Fleet camera ${i+1} with GPS and road recording equipment`,quantity:2,unitPrice:1000,discount:100,gstRate:18,lineTotal:2242})),subtotal:60000,discount:3000,gst:10260,freight:100,installation:500,additionalCharges:50,total:67910,paymentTerms:'50% advance; balance before delivery.',deliveryTerms:'Dispatch within the agreed delivery period.',customerNotes:'Thank you for your enquiry.',terms:'Warranty applies to manufacturing defects.\n'+('Detailed customer terms with long lines and consistent wrapping. '.repeat(100)),internalNotes:'SECRET-INTERNAL-NOTES-MUST-NEVER-APPEAR',createdAt:'2026-09-15',updatedAt:'2026-09-15'};
const bytes=generateQuotationPdf(quote,settings);
const pdf=bytes.toString('ascii');
assert(pdf.startsWith('%PDF-1.4\n'));
assert(pdf.endsWith('%%EOF\n'));
assert(!pdf.includes(quote.internalNotes));
assert(pdf.includes('Bigfox Technologies Pvt Ltd'));
assert(pdf.includes('Customer \\(Example\\)'));
assert(pdf.includes('GRAND TOTAL             INR 67910.00'));
const count=Number(pdf.match(/\/Type \/Pages \/Count (\d+)/)[1]);
assert(count>=4,'Long quote must paginate');
assert.equal((pdf.match(/\/Type \/Page /g)||[]).length,count);
const xref=Number(pdf.match(/startxref\n(\d+)/)[1]);
assert.equal(pdf.slice(xref,xref+4),'xref');
const rows=pdf.slice(xref).split('\n');
const total=Number(rows[1].split(' ')[1]);
for(let i=1;i<total;i++){const offset=Number(rows[i+2].slice(0,10));assert(pdf.slice(offset).startsWith(`${i} 0 obj\n`),`Object ${i} xref offset must be exact`);}
for(const match of pdf.matchAll(/\/Length (\d+) >>\nstream\n/g)){const start=match.index+match[0].length;assert.equal(pdf.slice(start+Number(match[1]),start+Number(match[1])+9),'endstream');}
for(const match of pdf.matchAll(/1 0 0 1 ([\d.]+) ([\d.]+) Tm/g)){assert(Number(match[1])>=0&&Number(match[1])<=595);assert(Number(match[2])>=24&&Number(match[2])<=818);}
assert.equal(quotationPdfFilename('../bad\r\n"name'),'quotation----bad---name.pdf');
fs.mkdirSync('tmp/pdfs',{recursive:true});fs.writeFileSync('tmp/pdfs/quotation-verification.pdf',bytes);
let currentRole='customer',userId='owner',authenticated=true;
const db={admin:{quotations:[quote]},settings};
function loadRoute(file){const filename=path.resolve(file);const mod=new Module(filename,module);mod.filename=filename;mod.paths=module.paths;mod.require=name=>name==='@/lib/api'?{requireRole:(_,role)=>!authenticated?{ok:false,res:new Response('Unauthorized',{status:401})}:role===currentRole?{ok:true,session:{userId}}:{ok:false,res:new Response('Forbidden',{status:403})},jsonErr:(status,error)=>new Response(JSON.stringify({error}),{status})}:name==='@/lib/db'?{readDb:()=>db}:name==='@/lib/quotation-pdf'?generator.exports:require(name);mod._compile(compile(fs.readFileSync(filename,'utf8')),filename);return mod.exports.GET;}
const admin=loadRoute('src/app/api/admin/quotations/[id]/pdf/route.ts');
const customer=loadRoute('src/app/api/customer/quotations/[id]/pdf/route.ts');
const context={params:Promise.resolve({id:quote.id})};
(async()=>{assert.equal((await admin({},context)).status,403);userId='other';assert.equal((await customer({},context)).status,404);userId='owner';quote.status='draft';assert.equal((await customer({},context)).status,404);quote.status='sent';const res=await customer({},context);assert.equal(res.status,200);assert.equal(res.headers.get('Content-Type'),'application/pdf');assert(res.headers.get('Content-Disposition').includes('attachment; filename="quotation-RL-Q-2026-001.pdf"'));assert.equal(res.headers.get('Cache-Control'),'private, no-store');assert(!(await res.text()).includes(quote.internalNotes));authenticated=false;assert.equal((await customer({},context)).status,401);authenticated=true;currentRole='admin';quote.status='draft';const draft=await admin({},context);assert.equal(draft.status,200);assert(!(await draft.text()).includes(quote.internalNotes));console.log(`Quotation PDF verification passed: ${count} pages, exact xref/stream byte offsets, wrapping boundaries, totals, escaping, private downloads, role/ownership/draft checks, no internal notes.`);})().catch(error=>{console.error(error);process.exitCode=1;});
