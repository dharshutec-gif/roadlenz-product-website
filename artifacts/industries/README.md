# Industries implementation review

The `/industries` route uses the existing Next.js app, shared header/footer, CMS solution records, product records, and quote route. Logistics & Trucking is selected initially. The seven scenes expand on hover/focus on desktop and use horizontal snap selection on tablet/mobile. Selection updates the linked impact strip. The intelligence layer links to published products. Reduced motion is respected, and route pulses pause outside the viewport.

## Files changed

- `src/app/industries/page.tsx` — route, metadata, published CMS products, local image availability checks.
- `src/components/industries/IndustriesExperience.tsx` — hero, interactive gallery, impact strip, intelligence layer, CTA, motion and accessibility.
- `src/components/industries/IndustriesExperience.module.css` — page-scoped responsive styling and motion.
- `src/lib/industries-content.ts` — approved page-specific editorial defaults and mapping of existing solutions.
- `src/lib/types.ts` — optional `industryPresentation` property on existing solution records.
- `src/components/Header.tsx` — direct Industries link on desktop/mobile, active underline, direct remaining navigation links on this route.
- `scripts/verify-industries.cjs` — CMS mapping checks.
- `scripts/check-industries-browser.cjs` — responsive, interaction, accessibility-state, motion, console and destination checks; review screenshots.

No product/solution records were duplicated or mutated. Existing page implementations, admin, authentication, cart and footer code were not edited. Shared header behavior changes are limited to the requested Industries link and direct navigation on `/industries`.

## Verification

- `npm.cmd run build` — passed.
- `npx.cmd tsc --noEmit` — passed after the build completed.
- `node scripts/verify-industries.cjs` — passed. Covers approved order, publication, inactive overrides, empty input, source preservation, custom copy/order, and video-poster fallback.
- Headless Chrome against the production build — passed at 1536×1000, 768×1024 and 390×844.
- Verified initial selection, desktop expansion ratio, hover/focus updates, mobile controls/native snap scrolling, header clearance, no document overflow, single shared footer, image loading, encoding and hydration/runtime errors.
- Verified standard-motion reveal and connection pulse, reduced-motion mode, actual panel-click navigation, and HTTP 200 responses for all seven solutions, four linked products, and Request Quote.

The browser script uses `playwright` plus installed Chrome. If Playwright is supplied by the local runtime rather than this project's dependencies, set `PLAYWRIGHT_MODULE` to that module's absolute location. `ROADLENZ_URL` defaults to `http://localhost:3000`; these final checks used `http://localhost:3100`.

## Screenshots

- [Desktop](desktop.png)
- [Tablet](tablet.png)
- [Mobile](mobile.png)

Screenshots show the entire page, including the existing footer. Layout assertions run at the viewport dimensions above before capture.

## Limitations versus the approved image

- The approved vehicle/environment compositions and mountain-road background are not in the available assets. The page uses existing solution hero photographs and the existing highway image. The reference's separate vehicle-cutout overhang is not reproduced.
- All four published product image paths point to absent files. Professional category icons are used until those CMS image paths resolve; existing product links remain functional.
- The existing logo, header actions and footer differ from the reference and were retained as requested.
- Names, publication, solution destinations, scene images, and non-editorial selected copy/outcomes derive from existing CMS solution records. The approved gallery order and page-specific editorial copy are defaults in `industries-content.ts`; optional `industryPresentation` overrides are supported on those same records. The existing admin editor has not been extended with new fields.
