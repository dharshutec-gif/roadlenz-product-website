# Technology page image sources

Source: `C:/Users/acer/Downloads/Roadlenz-software.pdf` (19 pages).

Original mobile PNGs were extracted directly from the PDF. At the user's request, desktop dashboard presentation images were subsequently recreated with HTML/CSS and captured as PNGs using `scripts/create-technology-desktop.cjs`. They reuse the PDF's map and camera imagery and are illustrative desktop mockups, not captured desktop product screens. Display values are illustrative and are not live site metrics.

Seven desktop images are in `public/media/technology/desktop/`: overview, tracking, video, history, safety, reports, and companies. Each feature section pairs a desktop with an original mobile screenshot. The hero pairs one desktop with three mobile screens, uses a smaller single-line heading, and omits the four capability navigation links.

Assets are saved in `public/media/technology/software/`.

| Asset | PDF page |
| --- | --- |
| overview.png | 1 |
| vehicles.png | 2 |
| vehicle-detail.png | 3 |
| companies.png | 4 |
| video-map.png | 5 |
| live-video.png | 6 |
| fleet-map.png | 7 |
| alerts.png | 8 |
| driver-camera.png | 9 |
| road-camera.png | 10 |
| workspace.png | 12 |
| track-history.png | 14 |
| account.png | 16 |
| ai-fleet.png | 17 |
| ai-events.png | 18 |
| reports.png | 19 |

The closing background reuses `public/media/solutions/logistics-hero.jpg`.

## Layout

Hero with no description paragraph, followed by eight separate alternating sections: Complete View, Live Tracking, Live Video, Track History, Smarter Safety, Actionable Reports, Fleet On The Go, and Multi-Company. Desktop sections use generous horizontal and vertical spacing; mobile sections stack copy above imagery. The existing global navigation remains visible.

## Validation

`scripts/check-technology-redesign.cjs` checks desktop, tablet, and mobile layouts, all section images, section anchors, overflow, and runtime errors. Hero animation respects reduced-motion preferences.
