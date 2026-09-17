/* Run with node scripts/verify-taxi.cjs. No database writes or extra dependencies. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

function loadTypeScript(file) {
  const mod = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function("module", "exports", "require", output)(mod, mod.exports, require);
  return mod.exports;
}

const { upgradeTaxiSolution } = loadTypeScript("src/lib/taxi-content.ts");
const { taxiCtaHref } = loadTypeScript("src/lib/taxi-links.ts");
const db = JSON.parse(fs.readFileSync("data/db.json", "utf8"));
const original = db.solutions.find((solution) => solution.slug === "taxi");
assert.ok(original, "Taxi solution exists");
const fixture = structuredClone(original);
delete fixture.taxiContent;
delete fixture.painPoints;
delete fixture.faqs;
fixture.journeyStages = ["Booking", "Live Trip", "Destination"].map((title, index) => ({
  title, label: title,
  description: ["The journey begins with live operational visibility.", "Location and vehicle context remain visible while the journey is active.", "The completed stage is recorded for operational review."][index],
  media: { type: "image", src: "" }, nodeX: [6, 36, 69][index], nodeY: [64, 54, 58][index],
}));
upgradeTaxiSolution(fixture);
assert.deepEqual(fixture.journeyStages.map((stage) => stage.title), ["Booking", "Passenger Pickup", "Destination Reached"]);
assert.equal(fixture.taxiContent.challengeTitle, "Built around every trip.");
assert.equal(fixture.painPoints.length, 3);
assert.ok(fixture.faqs.length);
assert.deepEqual(fixture.relatedProductSlugs, original.relatedProductSlugs);
assert.deepEqual(fixture.recommendedProducts, original.recommendedProducts);
const upgraded = structuredClone(fixture);
upgradeTaxiSolution(fixture);
assert.deepEqual(fixture, upgraded, "Migration is idempotent");

const custom = structuredClone(original);
Object.assign(custom, {
  heroTitle: "Custom fleet title", heroMedia: { type: "image", src: "" }, vehicleImage: "",
  taxiContent: { challengeTitle: "", journeyTitle: "My trip room" },
  journeyStages: [], painPoints: [], benefits: [], capabilities: [], faqs: [], recommendedProducts: [], relatedProductSlugs: [],
});
upgradeTaxiSolution(custom);
for (const field of ["journeyStages", "painPoints", "benefits", "capabilities", "faqs", "recommendedProducts", "relatedProductSlugs"]) assert.deepEqual(custom[field], [], `${field} stays intentionally empty`);
assert.equal(custom.heroTitle, "Custom fleet title");
assert.equal(custom.heroMedia.src, "");
assert.equal(custom.vehicleImage, "");
assert.equal(custom.taxiContent.challengeTitle, "");
assert.equal(custom.taxiContent.journeyTitle, "My trip room");
const customIcon = structuredClone(original);
customIcon.capabilities = [{ title: "Fleet Safety", description: "Fleet Safety is brought into the same RoadLenz operational view for this solution.", icon: "bell", visual: { type: "image", src: "" } }];
upgradeTaxiSolution(customIcon);
assert.equal(customIcon.capabilities[0].icon, "bell", "Customized capability icons survive legacy copy upgrades");
const other = structuredClone(db.solutions.find((solution) => solution.slug !== "taxi"));
const otherBefore = structuredClone(other);
upgradeTaxiSolution(other);
assert.deepEqual(other, otherBefore, "Other solutions are untouched");

for (const href of ["https://example.com", "//example.com", "/\\example.com", "javascript:alert(1)", "#capabilities", "/products", "", undefined]) assert.equal(taxiCtaHref(href, "/request-quote"), "/request-quote?solution=taxi");
assert.equal(taxiCtaHref("/contact?solution=taxi", "/request-quote"), "/contact?solution=taxi");
assert.equal(taxiCtaHref("/request-quote?solution=taxi", "/contact"), "/request-quote?solution=taxi");
console.log("PASS: taxi migration, custom/empty field preservation, product assignments, isolation, idempotence and CTA route restrictions.");
const { upgradeTaxiOperations } = loadTypeScript('src/lib/taxi-content.ts');
const operations = structuredClone(original);
upgradeTaxiOperations(operations);
const firstOperations = JSON.stringify(operations);
upgradeTaxiOperations(operations);
assert.equal(JSON.stringify(operations), firstOperations);
const emptyOperations = { ...structuredClone(original), journeyStages: [], painPoints: [], benefits: [], liveStatus: [], taxiContent: { heroEyebrow: 'Custom operations' } };
upgradeTaxiOperations(emptyOperations);
assert.equal(emptyOperations.taxiContent.heroEyebrow, 'Custom operations');
for (const key of ['journeyStages', 'painPoints', 'benefits', 'liveStatus']) assert.deepEqual(emptyOperations[key], []);
console.log('PASS: v16 operations migration, custom copy and empty lists.');
