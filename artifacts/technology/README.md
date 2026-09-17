# Technology capability pages

The existing Next.js app now serves six software capability pages through one flexible template. The Technology overview uses the same template with a six-step editorial journey inspired by the supplied reference. The shared navbar links directly to `/technology` and highlights Technology on its capability pages. The existing logo, footer, request forms, authentication, CMS product records and product routes are reused.

## Routes

- `/technology/live-fleet`
- `/technology/video-telematics`
- `/technology/ai-safety`
- `/technology/playback`
- `/technology/reports`
- `/technology/vehicle-health`
- `/technology` — updated overview linking to all six capabilities.

Unknown or unpublished capability slugs return 404.

## Files changed

1. `src/app/technology/page.tsx` — Technology overview and metadata.
2. `src/app/technology/[slug]/page.tsx` — shared dynamic route for the six capabilities, per-page metadata and unknown-slug handling.
3. `src/lib/technology-capabilities.ts` — the single local capability content/media source, publication/order helpers, product associations and shared CTA settings.
4. `src/lib/technology-page.ts` — server-side mapping to existing published products and graceful handling of missing local product images.
5. `src/components/technology/TechnologyExperience.tsx` — shared hero, outcomes, featured workspace/callouts, editorial journey, connected hardware, related navigator and CTA template.
6. `src/components/technology/TechnologyMedia.tsx` — configurable image/video renderer and interactive local workspace placeholders.
7. `src/components/technology/TechnologyExperience.module.css` — page-scoped styling, responsive layouts and reduced-motion rules.
8. `src/components/Header.tsx` — direct Technology links and active state on desktop/mobile; removed the Technology dropdown.
9. `scripts/verify-technology.cjs` — content/media/product association checks.
10. `scripts/check-technology-browser.cjs` — responsive route, interaction, navigation, motion and runtime checks; screenshot capture.

Additional review artifacts are this file and the screenshots linked below. Product, Solution, Industries, Cart, Admin, authentication and shared footer implementations were not edited by this task. No product or solution records were created or changed.

## Replacing placeholders

Edit only `src/lib/technology-capabilities.ts`. Each capability has independent `hero`, `workspace` and `stories[n].media` slots. The initial `media(...)` values set `type: "placeholder"` and an empty `src`.

For a real screenshot, replace the relevant slot with:

```ts
hero: {
  type: "image",
  src: "/media/technology/live-fleet/hero.webp",
  alt: "RoadLenz Live Fleet showing vehicle location and status",
  workspace: "fleet",
},
```

The corresponding file belongs at `public/media/technology/live-fleet/hero.webp`. The sample path above is an example, not a file supplied by this implementation.

For a video:

```ts
workspace: {
  type: "video",
  src: "/media/technology/live-fleet/workspace.mp4",
  poster: "/media/technology/live-fleet/workspace-poster.webp",
  alt: "RoadLenz Live Fleet software walkthrough",
  workspace: "fleet",
},
```

Videos use native controls and do not autoplay. Missing media falls back to its matching local workspace placeholder. Keep `workspace` to identify that fallback; supported values are `fleet`, `video`, `safety`, `playback`, `reports` and `health`. Shared CTA imagery is configured in `technologySettings.ctaBackground` in the same file. Product images continue to come from existing product records.

Publication, display order, copy, callouts, stories and related product slugs are also in this source. This is a local typed configuration, not a new Admin editing screen; Admin functionality was left unchanged. Local source edits require the usual production rebuild/deployment.

## Placeholder behavior and limits

- Workspaces are explicitly labeled as illustrative placeholders with no live fleet connection.
- Live Fleet supports example vehicle/map-marker selection. Video and AI Safety switch between road/cabin illustrations. Playback has a controllable example timeline. Reports switches illustrative report views. Vehicle Health switches example sensor views.
- Illustrative charts contain no asserted operational metrics. The playback percentage describes only the preview slider position.
- The supplied reference's real screenshots, footage and hardware photographs are not recreated. They can replace these slots later.
- Relevant published product records are linked directly. Missing product photos use line icons. Unpublished hardware and absent standalone fuel/temperature sensor products are not fabricated or exposed.
- Slow visual pulses pause offscreen; reduced motion suppresses transitions and pulses. Mobile workspaces scroll horizontally within their frame, and their interactive targets are at least 44px.

## Validation

- `npx.cmd tsc --noEmit` — passed.
- `npm.cmd run build` — passed.
- `node scripts/verify-technology.cjs` — passed for all six capabilities, independent placeholder slots, existing CTA routes, relevant/published product filtering, empty product inputs and source preservation.
- Browser checks cover all six pages and the overview at 1536×1000, 768×1024 and 390×844, including interactive placeholders, header clearance, single shared header/footer, horizontal overflow, current capability highlighting, encoding and runtime/hydration errors.
- Desktop heroes are checked to stay within 480–560px. Standard-motion rendering, actual capability navigation, linked hardware/request destinations and unknown-route 404 handling are also checked.

The browser script uses Playwright with installed Chrome. Set `PLAYWRIGHT_MODULE` to an available runtime module path if Playwright is not installed in this project. `ROADLENZ_URL` defaults to `http://localhost:3000`. The final production preview runs at `http://localhost:3101`.

## Review screenshots

- Live Fleet: [desktop](live-fleet-desktop.png), [tablet](live-fleet-tablet.png), [mobile](live-fleet-mobile.png).
- Overview: [desktop](overview-desktop.png), [tablet](overview-tablet.png), [mobile](overview-mobile.png).
- [AI Safety desktop](ai-safety-desktop.png).

Screenshots include the unchanged shared footer. Viewport assertions run before the page height is expanded for full-page capture.
