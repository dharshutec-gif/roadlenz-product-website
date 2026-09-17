export const schoolTransport = {
  nav: ["Solutions", "Products", "Industries", "Technology", "Resources", "About Us"],
  hero: {
    eyebrow: "SCHOOL TRANSPORT",
    title: "Every school ride, accounted for.",
    description: "Live visibility, safer journeys and confidence at every stop. RoadLenz connects people, vehicles and routes so school transport teams can identify risks and respond with clearer operational context.",
    status: ["Bus 36", "Moving", "Route 07 – Northside", "ETA 08:05 AM"],
  },
  challenges: [
    { icon: "eye", title: "No live visibility", text: "Schools and parents don’t know where buses are or when students will arrive." },
    { icon: "shield", title: "Safety events lack context", text: "Incidents happen, but limited data makes root-cause and response difficult." },
    { icon: "clipboard", title: "Manual boarding follow-up", text: "Attendance taken on paper leads to delays, missing data, and extra admin work." },
  ],
  stages: [
    { time: "07:10 AM", title: "Pickup", place: "Maple St & 4th Ave", note: "8 students", progress: 18 },
    { time: "07:45 AM", title: "On Route", place: "Main St & River Rd", note: "On time", progress: 55 },
    { time: "08:05 AM", title: "Safe Drop-off", place: "Riverside Elementary", note: "28 students", progress: 88 },
  ],
  journeyStats: [["Bus", "36"], ["Route", "07 – Northside"], ["Started", "06:55 AM"], ["Next stop", "Riverside Elementary"], ["Students onboard", "28"]],
  devices: [
    { name: "AI Dashcam", image: "/images/ai-dashcam.png", benefit: "Captures the road ahead in high definition with AI event detection." },
    { name: "4CH MDVR", image: "/images/mdvr.png", benefit: "Records up to 4 channels of video with secure storage and remote access." },
    { name: "GPS Tracker", image: "/images/gps-tracker.png", benefit: "Provides real-time location, route history, and geofence alerts." },
    { name: "Driver Monitoring Camera", image: "/images/dms-camera.png", benefit: "Monitors driver behavior and fatigue to promote safer driving." },
    { name: "RFID Attendance Reader", image: "/images/rfid-reader.png", benefit: "Automatically records student boardings and drop-offs." },
  ],
  setupReasons: ["End-to-end visibility of every ride", "Richer context for every event", "Automated attendance and alerts", "Actionable insights for safer fleets"],
  benefits: [
    { icon: "shield", title: "Safer journeys", text: "Proactive alerts and driver monitoring reduce risks and promote safer driving." },
    { icon: "clock", title: "Faster incident review", text: "Synchronized video, location, and event data speed up investigations." },
    { icon: "chart", title: "Clearer operations", text: "Live tracking, route insights, and automated reporting improve efficiency." },
    { icon: "people", title: "Greater parent confidence", text: "On-time updates and automated attendance build trust with families." },
  ],
  faqs: [
    { question: "How does the RFID attendance system work?", answer: "Students tap their assigned RFID card when boarding and leaving the bus. The reader records each event against the vehicle, route, location and time for a clear attendance trail." },
    { question: "Can I access live tracking and video remotely?", answer: "Yes. Authorized transport teams can view connected vehicle location and available video context remotely through the RoadLenz platform." },
    { question: "Is the system easy to install and use?", answer: "The setup is designed for professional vehicle installation and straightforward daily operation, with connected devices working together as one system." },
  ],
} as const;
