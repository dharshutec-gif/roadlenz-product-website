// Zero-dependency minimal PDF writer (Helvetica, multiple pages)
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/media/documents");
fs.mkdirSync(OUT, { recursive: true });

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// Build content stream for one page: array of ops like {t, x, y, size, bold}
function pageOps(lines) {
  let s = "";
  for (const ln of lines) {
    const font = ln.bold ? "F2" : "F1";
    s += `BT /${font} ${ln.size || 10} Tf ${ln.x ?? 56} ${ln.y} Td (${esc(ln.t)}) Tj ET\n`;
  }
  return s;
}

function makePdf(file, docTitle, pages) {
  // pages: array of arrays of line objects
  const objs = [];
  const addObject = (body) => {
    objs.push(body);
    return objs.length; // 1-based object number
  };

  const pagesCount = pages.length;
  const pageObjNums = [];
  const contentNums = [];
  // 1=catalog, 2=pages, 3=F1, 4=F2, then per page: page obj + content obj
  for (let i = 0; i < pagesCount; i++) {
    pageObjNums.push(5 + i * 2);
    contentNums.push(6 + i * 2);
  }

  const bodies = {};
  bodies[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  const kids = pageObjNums.map((n) => `${n} 0 R`).join(" ");
  bodies[2] = `<< /Type /Pages /Kids [${kids}] /Count ${pagesCount} >>`;
  bodies[3] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  bodies[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`;

  const W = 595.28;
  for (let i = 0; i < pagesCount; i++) {
    bodies[pageObjNums[i]] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNums[i]} 0 R >>`;
    const stream = pageOps(pages[i]);
    bodies[contentNums[i]] = `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`;
  }

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  const nums = Object.keys(bodies).map(Number).sort((a, b) => a - b);
  for (const n of nums) {
    offsets[n] = Buffer.byteLength(pdf);
    pdf += `${n} 0 obj\n${bodies[n]}\nendobj\n`;
  }
  const xrefPos = Buffer.byteLength(pdf);
  const count = Math.max(...nums) + 1;
  pdf += `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let n = 1; n < count; n++) {
    pdf += `${String(offsets[n]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

  const full = `RoadLenz Intelligent Mobility — ${docTitle}\nGenerated ${new Date().toISOString().slice(0, 10)}\n\n${pdf}`;
  // note: header text above is NOT part of pdf; just for logs
  fs.writeFileSync(path.join(OUT, file), pdf);
  console.log("wrote", file, Buffer.byteLength(pdf), "bytes,", pagesCount, "pages");
}

// ---------- content builders ----------
const H1 = (t, y = 790) => ({ t, size: 20, bold: true, y });
const H2 = (t, y) => ({ t, size: 13, bold: true, y });
const P = (t, y) => ({ t, size: 10, y });
const S = (t, y) => ({ t, size: 8.5, y, x: 72 });
const blank = (y) => ({ t: "", y });
const row = (a, b, y) => [
  { t: a, size: 9.5, y, x: 64 },
];
function table(lines, startY, labelW, valW) {
  const out = [];
  let y = startY;
  lines.forEach((ln, i) => {
    const [a, b] = Array.isArray(ln) ? ln : [ln, ""];
    out.push({ t: `${a}`.slice(0, 34), size: 9.5, y, x: 64 });
    out.push({ t: `${b}`.slice(0, 78), size: 9.5, y, x: 64 + labelW });
    y -= 16;
  });
  return out;
}

function datasheetFile(specs, intro) {
  const page1 = [
    H1("Product Data Sheet"),
    blank(780),
    P("RoadLenz Intelligent Mobility  |  Powered by Bigfox Engineering Private Limited", 766),
    blank(750),
    H2(intro.title, 726),
    ...[...intro.lines].map((t, i) => P(t, 708 - i * 14)),
    blank(640),
    H2("Key specifications", 620),
    ...table(specs, 598, 170, 300),
    blank(300),
    P("This is demo sample content for the RoadLenz website build. Specifications are", 300),
    P("illustrative and must be replaced with verified data through the CMS before launch.", 286),
    P("support@roadlenz.in  |  www.roadlenz.in", 250),
  ];
  return [page1];
}

function guideFile(steps) {
  const page1 = [
    H1("Installation & Field Guide"),
    P("RoadLenz Intelligent Mobility  |  Powered by Bigfox Engineering Private Limited", 766),
    blank(750),
    H2("Scope", 726),
    P("This document covers the standard field installation procedure for RoadLenz hardware.", 706),
    P("Always follow vehicle manufacturer guidance and local electrical safety rules.", 692),
    blank(676),
    H2("Before you begin", 656),
    ...[
      "Confirm the part number against the packing list and order.",
      "Verify vehicle make, model, year and battery rating.",
      "Prepare the toolkit: wire strippers, crimpers, multimeter, zip ties, heat shrink.",
      "Confirm network coverage at the installation site.",
    ].map((t, i) => P(`•  ${t}`, 636 - i * 15)),
    blank(560),
    H2("Procedure", 540),
    ...steps.map((t, i) => P(`${i + 1}.  ${t}`, 520 - i * 17)),
    blank(280),
    P("Demo sample content — replace with verified documentation before launch.", 270),
    P("support@roadlenz.in  |  www.roadlenz.in", 250),
  ];
  return [page1];
}

// ---------- generate ----------
makePdf(
  "rl-vision-datasheet.pdf",
  "RL-Vision AI Camera",
  datasheetFile(
    [
      ["Sensor", "1/2.8\" CMOS, 1080p @ 30 fps"],
      ["Lens", "130° wide, 3-axis image stabilisation"],
      ["AI processing", "On-device ADAS: lane departure, forward collision, driver state"],
      ["Connectivity", "4G/LTE + Wi-Fi backup, GPS/BeiDou positioning"],
      ["Storage", "64 GB eMMC, loop recording, event lock"],
      ["Power", "9–32 V DC, reverse polarity protection"],
      ["Operating temp", "-30°C to +70°C"],
      ["Mounting", "Windshield bracket, vibration-rated"],
      ["Compliance", "IP67 housing"],
      ["Warranty", "24 months, parts and labour"],
    ],
    { title: "RL-Vision AI Camera", lines: ["Edge AI safety camera that watches the road, the lane and the driver — and flags risk before it becomes an incident."] }
  )
);

makePdf(
  "rl-vision-install.pdf",
  "RL-Vision AI Camera — Installation",
  guideFile([
    "Disconnect the negative battery terminal.",
    "Select a bracket position with an unobstructed view of the lane ahead and no dashboard glare.",
    "Clean the windshield area and attach the bracket with 3M VHB tape plus the screw clip.",
    "Route the power harness along the A-pillar into the fuse box; tap an always-on and an ignition-switched feed.",
    "Connect GPS antenna to the sun visor location and route the cable through the seal.",
    "Restore power, verify boot on the display, and confirm a network connection in the app.",
    "Calibrate: drive 500 m straight on a marked road and complete ADAS calibration.",
    "Record the serial number and installation date in the customer record; take 3 photos.",
  ])
);

makePdf(
  "rl-mdvr-datasheet.pdf",
  "RL-MDVR 8CH",
  datasheetFile(
    [
      ["Channels", "8 analogue (AHD 1080p) + 2 IP channels"],
      ["Codec", "H.265, 8 Mbps total"],
      ["Connectivity", "4G/LTE, Wi-Fi, Ethernet (optional)"],
      ["Positioning", "GPS/BeiDou/GLONASS, 1 Hz, ±2.5 m"],
      ["Storage", "1 TB SSD, 8 TB expandable (optional)"],
      ["Black box", "Vibration + impact triggered event lock"],
      ["Power", "9–36 V DC, supercapacitor for clean shutdown"],
      ["Operating temp", "-35°C to +75°C"],
      ["Enclosure", "Die-cast aluminium, IP66"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-MDVR 8CH", lines: ["Multi-channel vehicle DVR with black-box event capture, built for long-haul fleets that need evidence-grade video."] }
  )
);

makePdf(
  "rl-mdvr-wiring.pdf",
  "RL-MDVR 8CH — Wiring",
  guideFile([
    "Identify the MDVR terminal block: BAT, IGN, GND, ACC-12, GPS+, GPS-.",
    "Connect BAT to the vehicle battery positive through a 5 A fuse (10 cm max lead).",
    "Connect GND to a clean chassis ground away from EMI sources.",
    "Connect ACC-12 to an ignition-switched 12 V feed for start/stop detection.",
    "Route the GPS antenna cable to the roof location; keep it away from the 4G antenna (min. 15 cm).",
    "Connect camera channels 1–8 per the channel map: 1 front, 2 rear, 3–4 sides, 5–8 cargo.",
    "Verify all channels show live video in the app before closing the enclosure.",
    "Tie and dress all wiring with zip ties every 15 cm; no dangling cables near pedals.",
  ])
);

makePdf(
  "rl-track-datasheet.pdf",
  "RL-Track Pro",
  datasheetFile(
    [
      ["Positioning", "GPS + GLONASS, ±2.5 m CEP"],
      ["Radio", "Cat 4 LTE, 850/900/1800/2100 MHz"],
      ["Sensors", "3-axis IMU, geofence entry/exit, speeding, idling, harsh events"],
      ["I/O", "2 digital in, 1 digital out, 1 RS-232"],
      ["Backup battery", "700 mAh Li-ion, 4 h offline tracking"],
      ["Power", "9–36 V DC, low-battery alarm"],
      ["Operating temp", "-40°C to +85°C"],
      ["Enclosure", "IP67, tamper detect"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-Track Pro", lines: ["The workhorse GPS tracker: dependable positioning, event detection and hours of offline memory for every vehicle in the fleet."] }
  )
);

makePdf(
  "rl-dash-datasheet.pdf",
  "RL-Dash 2K",
  datasheetFile(
    [
      ["Resolution", "2K (2560×1440) front + 1080p rear"],
      ["Frame rate", "30 fps, HDR"],
      ["Storage", "128 GB, loop recording, event lock"],
      ["Parking mode", "Motion + impact triggered, 12 V monitor"],
      ["Power", "9–32 V DC"],
      ["Display", "None (head unit) / optional 2.4\" OLED status"],
      ["Operating temp", "-30°C to +70°C"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-Dash 2K", lines: ["High-resolution evidence dashcam with parking mode and seamless MDVR integration."] }
  )
);

makePdf(
  "rl-fuel-datasheet.pdf",
  "RL-FuelSense",
  datasheetFile(
    [
      ["Measurement", "Fuel level ±0.5 L, flow ±1%"],
      ["Sensors", "Capacitive level probe, ultrasonic flow meter"],
      ["Connectivity", "Wired to RL-Track Pro / MDVR, 4G relay"],
      ["Alarms", "Sudden drain, tamper, off-hour fueling, discrepancy"],
      ["Fuel types", "Diesel, petrol, CNG (separate probe)"],
      ["Operating temp", "-35°C to +80°C (probe)"],
      ["Enclosure", "IP67 probe, IP65 module"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-FuelSense", lines: ["Continuous fuel telemetry with drain and tamper alarms — protect the fuel you are already paying for."] }
  )
);

makePdf(
  "rl-io-datasheet.pdf",
  "RL-IO Hub",
  datasheetFile(
    [
      ["Inputs", "8 isolated digital inputs (door, brake, door, temp)"],
      ["Outputs", "4 relay outputs (10 A) + 2 PWM"],
      ["Analog", "4 channels, 0–24 V, 12-bit"],
      ["Bus", "CAN 2.0B, RS-485, RS-232"],
      ["Power", "9–36 V DC, reverse polarity + surge protected"],
      ["Operating temp", "-40°C to +85°C"],
      ["Enclosure", "IP65, DIN-rail mount"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-IO Hub", lines: ["Expand any RoadLenz tracker into a full vehicle data gateway: doors, temperature, refrigeration, PTO and more."] }
  )
);

makePdf(
  "rl-count-datasheet.pdf",
  "RL-Count",
  datasheetFile(
    [
      ["Cameras", "1× forward + 1× reverse, 1080p"],
      ["Counting", "Per-vehicle person count, bidirectional"],
      ["Accuracy", "≥ 95% in daylight (school bus validation)"],
      ["Connectivity", "Wired to RL-Track Pro, 4G relay"],
      ["Storage", "On-device ring buffer + cloud sync"],
      ["Power", "9–32 V DC"],
      ["Operating temp", "-30°C to +70°C"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-Count", lines: ["AI person counting for school buses and shuttles — verified boarding per stop, per day, per route."] }
  )
);

makePdf(
  "rl-rfid-datasheet.pdf",
  "RL-Access RFID",
  datasheetFile(
    [
      ["Tags", "125 kHz EM4100 / Mifare 13.56 MHz (select)"],
      ["Readers", "1 external gate reader + 1 cabin reader"],
      ["Zones", "Entry/exit gates, parking bays, geo-zones"],
      ["Events", "Access grant/deny, dwell time, zone occupancy"],
      ["Connectivity", "Wired to RL-Track Pro, 4G relay"],
      ["Power", "9–36 V DC"],
      ["Enclosure", "IP65 readers"],
      ["Warranty", "24 months"],
    ],
    { title: "RL-Access RFID", lines: ["Gate and zone access for depots and yards — who entered, when, and for how long."] }
  )
);

makePdf(
  "roadlenz-catalogue.pdf",
  "Product Catalogue",
  [
    [
      H1("Product Catalogue 2026"),
      P("RoadLenz Intelligent Mobility  |  Powered by Bigfox Engineering Private Limited", 766),
      blank(750),
      H2("01  RL-Vision AI Camera", 726),
      P("Edge AI safety camera — ADAS, driver monitoring, event capture.", 710),
      H2("02  RL-MDVR 8CH", 680),
      P("Multi-channel vehicle DVR with black-box event capture.", 664),
      H2("03  RL-Track Pro", 634),
      P("GPS tracker with event detection and offline memory.", 618),
      H2("04  RL-Dash 2K", 588),
      P("2K evidence dashcam with parking mode.", 572),
      H2("05  RL-FuelSense", 542),
      P("Fuel telemetry with drain and tamper alarms.", 526),
      H2("06  RL-IO Hub", 496),
      P("Vehicle data gateway — doors, temperature, CAN.", 480),
      H2("07  RL-Count", 450),
      P("AI person counting for school buses and shuttles.", 434),
      H2("08  RL-Access RFID", 404),
      P("Gate and zone access for depots and yards.", 388),
      blank(340),
      P("Demo sample content — replace with the approved catalogue before launch.", 330),
      P("www.roadlenz.in  |  sales@roadlenz.in", 310),
    ],
  ]
);

makePdf(
  "onboarding-checklist.pdf",
  "Onboarding Checklist",
  [
    [
      H1("Fleet Onboarding Checklist"),
      P("RoadLenz Intelligent Mobility  |  Demo sample content", 766),
      blank(750),
      H2("Week 0 — Discovery", 726),
      ...[
        "x  Fleet audit: vehicle list, ages, current equipment",
        "x  Use-case mapping: which KPIs the fleet manager cares about",
        "x  Site survey: depot power, network coverage, gate layout",
        "x  Pilot plan: vehicle count, duration, success metrics",
      ].map((t, i) => P(t, 706 - i * 16)),
      blank(640),
      H2("Week 1 — Pilot install", 620),
      ...[
        "x  Hardware staged and tested on bench",
        "x  Pilot vehicles installed and verified on network",
        "x  Dashboard accounts created for the pilot team",
        "x  Alert thresholds agreed with the safety team",
      ].map((t, i) => P(t, 600 - i * 16)),
      blank(534),
      H2("Weeks 2–4 — Scale-up", 514),
      ...[
        "x  Pilot review: KPI readout with the fleet manager",
        "x  Rollout plan: installers, schedule, QA per vehicle",
        "x  Training for on-ground team and dispatch",
        "x  Go-live and handover to support",
      ].map((t, i) => P(t, 494 - i * 16)),
      blank(428),
      P("Questions? support@roadlenz.in", 420),
    ],
  ]
);

console.log("done");
