# RoadLenz About Us

Route: `/about`. Uses the existing Next.js application, shared header/footer, authentication, CMS store, entity APIs and media uploader.

## Admin content

The existing Admin console has an **About Us** group:

- **Page copy & backgrounds:** headings, descriptions, closing notes, section images and CTA links. Keep the existing section keys (`hero`, `vision`, `mission`, `journey`, `locations`, `support`, `leadership`, `contact`).
- **Hero slides:** three ordered images or videos, with accessible descriptions and video posters.
- **Journey milestones:** year, title, description, image, display order and publication.
- **Worldwide offices:** six supplied office records, including address lines, office type, city, region, country, phone, email, headquarters flag, geographic coordinates, optional office photograph and Google Maps URL.
- **Support teams:** three teams with editable image, description, phone and email.
- **Leadership:** Managing Director and Chief Executive Officer, with editable name, portrait and quotation.

All groups use the existing upload, save, reorder, preview and publication controls. Missing collections are initialized once; edited, empty or unpublished records are not overwritten on later reads. About-specific office records leave the existing Global Presence content unchanged.

The page displays up to three published slides, four milestones, six offices, three support teams and two leaders in display order. Unpublishing a record hides it; keep the supplied records published to retain the requested counts.

## Content still to supply

Milestone titles/descriptions/photos and leadership names/portraits/quotes were not supplied. Years and leadership roles are present, with neutral portrait silhouettes. No historical claims or identities were invented. Office photographs are optional; a location identity treatment appears until a real office photo is uploaded. Support teams initially use the supplied shared India phone and sales email; international offices have no invented phone numbers.

Four generated editorial photographs are stored as local WebP files in `public/media/about/`. They illustrate fleet, deployment, support and road scenes, and are not represented as verified photographs of actual staff or facilities. Replace them through Admin as needed. The map uses the project's existing `world-atlas` geographic data.

The existing header, logo and full footer intentionally retain their site styling. About Us is a direct active link on this route, including the mobile menu.

## Verification

- `npm.cmd run build`
- `node node_modules/typescript/bin/tsc --noEmit`
- `node scripts/verify-about.cjs`: real storage migration and save/reload behavior against an isolated fixture, ordering, publication, API field whitelist, supplied records, absence of fabricated details, and hashes confirming all unrelated live database collections are unchanged.
- `node scripts/check-about-browser.cjs`: desktop 1440px, tablet 768px, mobile 390px and 320px; seven sections, header clearance, media loading, no horizontal overflow or runtime errors, all six office selectors/map links, all three support panels/contacts, keyboard controls, five-second autoplay, hover/focus pause, live reduced-motion preference changes, swipe and unauthorized CMS access.

The browser script uses installed Chrome and Playwright. Set `PLAYWRIGHT_MODULE` to the installed module path if it is outside this project's dependencies. `ROADLENZ_URL` defaults to `http://localhost:3100`.

Screenshots: [desktop](desktop.png), [tablet](tablet.png), [mobile](mobile.png), [small mobile](small-mobile.png).
