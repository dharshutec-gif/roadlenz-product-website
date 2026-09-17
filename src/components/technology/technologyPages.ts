import { technologyRoutes as legacyRoutes } from "./technologyRoutes";

export type VisualKind = "map" | "route" | "status" | "chart" | "table" | "video" | "alerts" | "groups" | "mobile";
export type DetailItem = { title: string; copy: string; icon: string };
export type OutputItem = { title: string; copy: string; kind: VisualKind };
export type TechnologyPageData = {
  slug: string; label: string; eyebrow: string; title: string; subtitle: string; description: string;
  desktop: string; mobile: string; scene?: string; icon: string; indicators: string[];
  definition: string; uses: string; processTitle: string; steps: DetailItem[];
  features: DetailItem[]; benefitsTitle: string; benefits: DetailItem[];
  outputTitle: string; outputs: OutputItem[]; related: string[]; ctaTitle: string; ctaCopy: string;
};
export const item = (title: string, copy: string, icon: string): DetailItem => ({ title, copy, icon });
export const output = (title: string, copy: string, kind: VisualKind): OutputItem => ({ title, copy, kind });
const tracking: TechnologyPageData = {
  slug: "gps-tracking", label: "Tracking", eyebrow: "GPS Tracking", title: "Explore Tracking",
  subtitle: "Real-time visibility. Smarter decisions. Always in control.",
  description: "Track every vehicle with live location and movement context. Bring your fleet, routes and daily operations into one clear view.",
  desktop: "tracking", mobile: "fleet-map", scene: "/media/solutions/logistics-hero.jpg", icon: "map", indicators: ["Live fleet map", "Journey context", "Web & mobile"],
  definition: "GPS tracking connects satellite positioning with cellular data to show vehicle location, movement and status on an interactive fleet map.",
  uses: "Help operators locate vehicles, review routes and stops, and respond to exceptions. Keep dispatch decisions connected to what is happening on the road.",
  processTitle: "From vehicle data to smarter decisions.",
  steps: [item("GPS Device", "Collect location and movement data from the vehicle.", "satellite"), item("Data Transmission", "Send updates over the device’s available mobile network.", "radio"), item("Cloud Processing", "Connect position data to the right vehicle and fleet.", "cloud"), item("View & Act", "Review the live map and take the next operational action.", "monitor")],
  features: [item("Real-time Vehicle Tracking", "Locate connected vehicles and review their latest map positions.", "map"), item("Live Speed & Direction", "Understand how a vehicle is moving with speed and heading context.", "gauge"), item("Route History Playback", "Follow previous journeys through a time-based route replay.", "route"), item("Geo-fencing & Alerts", "Use configured boundaries to identify relevant vehicle movements.", "fence"), item("Stops & Idle Monitoring", "Review stopped periods alongside ignition and trip activity.", "clock"), item("Driver & Vehicle Status", "Keep vehicle identity, driver context and device status together.", "truck")],
  benefitsTitle: "Visibility that improves every operation.",
  benefits: [item("Improved Fleet Security", "Spot unexpected movement and investigate with location context.", "shield"), item("Higher Operational Efficiency", "Use route and stop information to reduce avoidable delays.", "settings"), item("Better Customer Service", "Give customers more informed updates on vehicle progress.", "users"), item("Data-Driven Decisions", "Ground dispatch and fleet reviews in recorded activity.", "chart")],
  outputTitle: "Visibility that turns data into action.",
  outputs: [output("Live Tracking Map", "Latest vehicle locations and movement.", "map"), output("Trip Summary", "Distance, duration and trip context.", "status"), output("Route History", "A connected view of the journey.", "route"), output("Speed & Idle Analysis", "Review movement and stationary periods.", "chart"), output("Detailed Reports", "Structured records for operational review.", "table")],
  related: ["track-history", "live-video", "reports"], ctaTitle: "Ready for complete fleet visibility?", ctaCopy: "See how RoadLenz Tracking can support your fleet operation.",
};
const configuredPages: TechnologyPageData[] = [
  {
    "slug": "real-time-status",
    "label": "Platform",
    "eyebrow": "Connected platform",
    "title": "Explore the Platform",
    "subtitle": "One connected environment for your complete fleet operation.",
    "description": "Bring tracking, video, safety and reporting together. Start with fleet status and move directly to the information your team needs.",
    "desktop": "overview",
    "mobile": "overview",
    "icon": "layers",
    "indicators": [
      "Unified overview",
      "Connected modules",
      "Company workspaces"
    ],
    "definition": "The RoadLenz platform brings connected vehicle information and operating tools into one fleet workspace.",
    "uses": "Give dispatchers and managers a shared starting point for daily checks, exception reviews and company-level fleet activity.",
    "processTitle": "One platform, from connection to action.",
    "steps": [
      {
        "title": "Connect Devices",
        "copy": "Bring compatible vehicle devices online.",
        "icon": "radio"
      },
      {
        "title": "Unify Data",
        "copy": "Organise incoming activity by vehicle and company.",
        "icon": "database"
      },
      {
        "title": "Understand Operations",
        "copy": "Review fleet status and relevant exceptions.",
        "icon": "monitor"
      },
      {
        "title": "Take Action",
        "copy": "Open the map, cameras, alerts or reports.",
        "icon": "check"
      }
    ],
    "features": [
      {
        "title": "Unified Fleet Dashboard",
        "copy": "See vehicle states and open activity in one overview.",
        "icon": "monitor"
      },
      {
        "title": "Vehicle Management",
        "copy": "Find vehicles and their connected operating context.",
        "icon": "truck"
      },
      {
        "title": "Device Management",
        "copy": "Review device identity and connectivity information.",
        "icon": "radio"
      },
      {
        "title": "User & Role Access",
        "copy": "Align workspace access with assigned user roles.",
        "icon": "lock"
      },
      {
        "title": "Live Intelligence",
        "copy": "Connect available maps, video and alerts.",
        "icon": "map"
      },
      {
        "title": "Cross-Module Context",
        "copy": "Move between tools without losing the vehicle context.",
        "icon": "layers"
      }
    ],
    "benefitsTitle": "One connected view of your operation.",
    "benefits": [
      {
        "title": "Less Tool Switching",
        "copy": "Find related vehicle information in one workspace.",
        "icon": "layers"
      },
      {
        "title": "Clearer Priorities",
        "copy": "Start the day with status and exceptions in view.",
        "icon": "check"
      },
      {
        "title": "Better Team Context",
        "copy": "Work from a consistent picture of fleet activity.",
        "icon": "users"
      },
      {
        "title": "Room to Grow",
        "copy": "Organise expanding operations by company and fleet.",
        "icon": "building"
      }
    ],
    "outputTitle": "Your operation, connected at a glance.",
    "outputs": [
      {
        "title": "Fleet Overview",
        "copy": "Connected vehicles and current states.",
        "kind": "status"
      },
      {
        "title": "Live Map",
        "copy": "Vehicle locations in fleet context.",
        "kind": "map"
      },
      {
        "title": "Open Alerts",
        "copy": "Exceptions for operational review.",
        "kind": "alerts"
      },
      {
        "title": "Company Workspaces",
        "copy": "An organised route into each fleet.",
        "kind": "groups"
      },
      {
        "title": "Activity Reports",
        "copy": "Records for daily performance reviews.",
        "kind": "table"
      }
    ],
    "related": [
      "gps-tracking",
      "multi-fleet",
      "reports"
    ],
    "ctaTitle": "Ready to connect your fleet operation?",
    "ctaCopy": "Explore the RoadLenz workspace with our team."
  },
  {
    "slug": "live-video",
    "label": "Video",
    "eyebrow": "Video telematics",
    "title": "Explore Video",
    "subtitle": "See what happened. See what is happening.",
    "description": "Bring connected camera views and vehicle context together. Review live footage and available recordings from your fleet workspace.",
    "desktop": "video",
    "mobile": "live-video",
    "icon": "camera",
    "indicators": [
      "Multi-camera views",
      "Vehicle context",
      "Recorded footage"
    ],
    "definition": "Video telematics connects compatible vehicle cameras and recorders to a fleet viewing workspace.",
    "uses": "Understand road and cabin conditions, review incidents and support operational follow-up with visual context.",
    "processTitle": "From camera capture to a clearer view.",
    "steps": [
      {
        "title": "Camera Capture",
        "copy": "Capture road and cabin views on configured channels.",
        "icon": "camera"
      },
      {
        "title": "MDVR Processing",
        "copy": "Process footage on the connected recording device.",
        "icon": "database"
      },
      {
        "title": "Data Transmission",
        "copy": "Send available video over the device connection.",
        "icon": "radio"
      },
      {
        "title": "Live / Recorded Viewing",
        "copy": "Open live channels or available recorded footage.",
        "icon": "video"
      }
    ],
    "features": [
      {
        "title": "Live Video",
        "copy": "Open available feeds from connected vehicle cameras.",
        "icon": "video"
      },
      {
        "title": "Multi-Channel Camera View",
        "copy": "Review configured road, cabin and other camera channels.",
        "icon": "layers"
      },
      {
        "title": "Remote Playback",
        "copy": "Review available recordings for a selected vehicle and period.",
        "icon": "play"
      },
      {
        "title": "Event Recording",
        "copy": "Find footage associated with supported recorded events.",
        "icon": "camera"
      },
      {
        "title": "Driver / Cabin Camera",
        "copy": "Add visual context from the configured cabin channel.",
        "icon": "users"
      },
      {
        "title": "Video Download & Evidence",
        "copy": "Use supported recording exports for incident follow-up.",
        "icon": "download"
      }
    ],
    "benefitsTitle": "Better context for every fleet decision.",
    "benefits": [
      {
        "title": "Clearer Incident Reviews",
        "copy": "Understand what happened with relevant footage.",
        "icon": "search"
      },
      {
        "title": "Informed Operator Response",
        "copy": "Check visual context before coordinating a response.",
        "icon": "users"
      },
      {
        "title": "Better Driver Support",
        "copy": "Use observed events to guide constructive follow-up.",
        "icon": "shield"
      },
      {
        "title": "Connected Evidence",
        "copy": "Keep vehicle and journey context close to the recording.",
        "icon": "report"
      }
    ],
    "outputTitle": "See the detail behind each journey.",
    "outputs": [
      {
        "title": "Live Camera View",
        "copy": "Road and cabin channels in one workspace.",
        "kind": "video"
      },
      {
        "title": "Recorded Playback",
        "copy": "Available footage for a selected period.",
        "kind": "video"
      },
      {
        "title": "Event Clips",
        "copy": "Visual context for an event review.",
        "kind": "video"
      },
      {
        "title": "Driver Events",
        "copy": "Relevant safety events alongside footage.",
        "kind": "alerts"
      },
      {
        "title": "Video Evidence",
        "copy": "Recorded context for investigation.",
        "kind": "video"
      }
    ],
    "related": [
      "recordings",
      "alerts",
      "gps-tracking"
    ],
    "ctaTitle": "Ready to see more of your fleet?",
    "ctaCopy": "Discuss camera connectivity and video workflows with RoadLenz."
  },
  {
    "slug": "track-history",
    "label": "History",
    "eyebrow": "Journey history",
    "title": "Explore History",
    "subtitle": "Every trip. Every route. Every movement.",
    "description": "Look back at routes, stops and movement over time. Replay a recorded journey and understand how a trip unfolded.",
    "desktop": "history",
    "mobile": "track-history",
    "scene": "/images/home-cta/fleet-road.webp",
    "icon": "route",
    "indicators": [
      "Route playback",
      "Trip timeline",
      "Journey summaries"
    ],
    "definition": "Track History organises recorded vehicle positions into a time-based view of past journeys.",
    "uses": "Investigate delays, review routes and stops, and answer questions about a selected vehicle and period.",
    "processTitle": "From recorded positions to a journey story.",
    "steps": [
      {
        "title": "Collect Positions",
        "copy": "Record available vehicle location and movement data.",
        "icon": "satellite"
      },
      {
        "title": "Store by Time",
        "copy": "Associate updates with a vehicle and timestamp.",
        "icon": "database"
      },
      {
        "title": "Reconstruct the Route",
        "copy": "Connect the recorded positions into a journey.",
        "icon": "route"
      },
      {
        "title": "Replay & Review",
        "copy": "Follow the route and inspect trip context.",
        "icon": "play"
      }
    ],
    "features": [
      {
        "title": "Route Playback",
        "copy": "Follow the recorded route with playback controls.",
        "icon": "play"
      },
      {
        "title": "Trip History",
        "copy": "Select a vehicle and period for journey review.",
        "icon": "route"
      },
      {
        "title": "Stop Detection",
        "copy": "Review stationary periods along the journey.",
        "icon": "truck"
      },
      {
        "title": "Historical Speed",
        "copy": "Understand recorded movement and speed context.",
        "icon": "gauge"
      },
      {
        "title": "ACC Status History",
        "copy": "Review available ignition activity alongside the route.",
        "icon": "radio"
      },
      {
        "title": "Event Timeline",
        "copy": "Connect time-stamped activity to journey context.",
        "icon": "clock"
      }
    ],
    "benefitsTitle": "Your fleet history, always accessible.",
    "benefits": [
      {
        "title": "Explain Delays",
        "copy": "Review where and when journeys slowed down.",
        "icon": "clock"
      },
      {
        "title": "Resolve Route Questions",
        "copy": "Use recorded movement to support follow-up.",
        "icon": "route"
      },
      {
        "title": "Improve Planning",
        "copy": "Learn from completed trips before the next journey.",
        "icon": "chart"
      },
      {
        "title": "Support Accountability",
        "copy": "Keep a consistent record of vehicle activity.",
        "icon": "report"
      }
    ],
    "outputTitle": "A clearer record of every journey.",
    "outputs": [
      {
        "title": "Trip Timeline",
        "copy": "Recorded activity through the selected period.",
        "kind": "chart"
      },
      {
        "title": "Route Replay",
        "copy": "A map of the recorded journey.",
        "kind": "route"
      },
      {
        "title": "Stops & Idle",
        "copy": "Stationary periods within trip context.",
        "kind": "table"
      },
      {
        "title": "Historical Events",
        "copy": "Events associated with the journey.",
        "kind": "alerts"
      },
      {
        "title": "Journey Summary",
        "copy": "Distance, duration and movement context.",
        "kind": "status"
      }
    ],
    "related": [
      "gps-tracking",
      "reports",
      "live-video"
    ],
    "ctaTitle": "Ready to understand every journey?",
    "ctaCopy": "See how route history supports your daily fleet reviews."
  },
  {
    "slug": "alerts",
    "label": "Safety & Alerts",
    "eyebrow": "Fleet safety",
    "title": "Explore Safety & Alerts",
    "subtitle": "Know sooner. Respond faster.",
    "description": "Bring supported safety events and fleet alerts into one workflow. Find the affected vehicle and the information needed for follow-up.",
    "desktop": "safety",
    "mobile": "ai-events",
    "scene": "/media/solutions/employee-transport-hero.jpg",
    "icon": "shield",
    "indicators": [
      "Safety events",
      "Vehicle alerts",
      "Event context"
    ],
    "definition": "Safety & Alerts brings configured device and vehicle events into a connected operator workspace.",
    "uses": "Review exceptions, investigate driver and road events supported by your devices, and coordinate timely operational responses.",
    "processTitle": "From detected events to informed action.",
    "steps": [
      {
        "title": "Detect",
        "copy": "Capture events supported by connected devices.",
        "icon": "camera"
      },
      {
        "title": "Analyse",
        "copy": "Associate each event with vehicle and time context.",
        "icon": "database"
      },
      {
        "title": "Notify",
        "copy": "Surface relevant events in the alert workspace.",
        "icon": "alerts"
      },
      {
        "title": "Respond",
        "copy": "Review context and coordinate the next action.",
        "icon": "shield"
      }
    ],
    "features": [
      {
        "title": "ADAS Events",
        "copy": "Review supported road-risk events from enabled devices.",
        "icon": "shield"
      },
      {
        "title": "DMS Alerts",
        "copy": "Investigate driver-monitoring events from configured cameras.",
        "icon": "camera"
      },
      {
        "title": "Overspeed Alerts",
        "copy": "Review speed exceptions against configured thresholds.",
        "icon": "gauge"
      },
      {
        "title": "Geo-fence Alerts",
        "copy": "Track events at configured operating boundaries.",
        "icon": "fence"
      },
      {
        "title": "Device Status Alerts",
        "copy": "Identify connectivity issues that need attention.",
        "icon": "radio"
      },
      {
        "title": "SOS / Emergency Events",
        "copy": "Surface supported emergency events for operator review.",
        "icon": "alerts"
      }
    ],
    "benefitsTitle": "Smarter alerts. Faster response.",
    "benefits": [
      {
        "title": "Earlier Risk Visibility",
        "copy": "Bring supported safety signals to the operator.",
        "icon": "shield"
      },
      {
        "title": "Focused Follow-Up",
        "copy": "Identify the vehicle and event that need attention.",
        "icon": "search"
      },
      {
        "title": "Better Driver Conversations",
        "copy": "Use recorded context to support safety discussions.",
        "icon": "users"
      },
      {
        "title": "Connected Reviews",
        "copy": "Keep event investigations close to fleet activity.",
        "icon": "layers"
      }
    ],
    "outputTitle": "The context behind every safety event.",
    "outputs": [
      {
        "title": "Live Alert Feed",
        "copy": "Recent configured fleet events.",
        "kind": "alerts"
      },
      {
        "title": "Safety Event Timeline",
        "copy": "Event activity across a review period.",
        "kind": "chart"
      },
      {
        "title": "Driver Safety Summary",
        "copy": "Recorded event context for follow-up.",
        "kind": "table"
      },
      {
        "title": "Alert Map",
        "copy": "Location context behind a fleet event.",
        "kind": "map"
      },
      {
        "title": "Safety Reports",
        "copy": "Structured safety records for review.",
        "kind": "table"
      }
    ],
    "related": [
      "live-video",
      "track-history",
      "reports"
    ],
    "ctaTitle": "Ready for a more informed safety workflow?",
    "ctaCopy": "Discuss the safety capabilities supported by your fleet devices."
  },
  {
    "slug": "multi-fleet",
    "label": "Multi-Company",
    "eyebrow": "Company management",
    "title": "Explore Multi-Company",
    "subtitle": "Manage every business and fleet from one environment.",
    "description": "Keep company fleets and their operating tools connected. Switch workspaces while maintaining the right vehicle and access context.",
    "desktop": "companies",
    "mobile": "companies",
    "icon": "building",
    "indicators": [
      "Company workspaces",
      "Fleet organisation",
      "User access"
    ],
    "definition": "Multi-Company organises separate company fleets and their tools within a shared RoadLenz platform.",
    "uses": "Help teams work across operating businesses while keeping vehicles, modules and user access aligned to each company.",
    "processTitle": "Manage every company from one platform.",
    "steps": [
      {
        "title": "Create Company Context",
        "copy": "Establish a workspace for each operating company.",
        "icon": "building"
      },
      {
        "title": "Organise Fleets",
        "copy": "Associate vehicles with the correct company.",
        "icon": "truck"
      },
      {
        "title": "Assign Access",
        "copy": "Align users with the appropriate workspace.",
        "icon": "lock"
      },
      {
        "title": "Manage & Review",
        "copy": "Open fleet tools and review company activity.",
        "icon": "monitor"
      }
    ],
    "features": [
      {
        "title": "Company Management",
        "copy": "Organise available operating company workspaces.",
        "icon": "building"
      },
      {
        "title": "Fleet Groups",
        "copy": "Keep vehicles connected to the correct company context.",
        "icon": "truck"
      },
      {
        "title": "Role-Based Access",
        "copy": "Align workspace access with assigned user roles.",
        "icon": "lock"
      },
      {
        "title": "Shared Intelligence",
        "copy": "Use connected tools across your available workspaces.",
        "icon": "layers"
      },
      {
        "title": "User Management",
        "copy": "Keep user access aligned to operational responsibilities.",
        "icon": "users"
      },
      {
        "title": "Unified Reporting",
        "copy": "Review fleet records within the selected company.",
        "icon": "report"
      }
    ],
    "benefitsTitle": "Built to scale with your business.",
    "benefits": [
      {
        "title": "Clearer Ownership",
        "copy": "Keep vehicles connected to the right organisation.",
        "icon": "building"
      },
      {
        "title": "Simpler Administration",
        "copy": "Manage company access within one platform.",
        "icon": "settings"
      },
      {
        "title": "Consistent Operations",
        "copy": "Give teams familiar tools across workspaces.",
        "icon": "users"
      },
      {
        "title": "Controlled Access",
        "copy": "Keep users focused on their assigned fleets.",
        "icon": "lock"
      }
    ],
    "outputTitle": "Every company, in the right context.",
    "outputs": [
      {
        "title": "Company Overview",
        "copy": "Available operating workspaces.",
        "kind": "groups"
      },
      {
        "title": "Fleet Groups",
        "copy": "Vehicle organisation by company.",
        "kind": "groups"
      },
      {
        "title": "User Access",
        "copy": "Workspace and role context.",
        "kind": "groups"
      },
      {
        "title": "Company Reports",
        "copy": "Records within the selected fleet.",
        "kind": "table"
      },
      {
        "title": "Fleet Activity",
        "copy": "A view of operational fleet states.",
        "kind": "status"
      }
    ],
    "related": [
      "real-time-status",
      "reports",
      "mobile-access"
    ],
    "ctaTitle": "Ready to organise your growing fleet?",
    "ctaCopy": "Explore a company structure that fits your operation."
  },
  {
    "slug": "mobile-access",
    "label": "Mobile Access",
    "eyebrow": "RoadLenz mobile",
    "title": "Fleet Intelligence Wherever You Go",
    "subtitle": "Stay connected to your fleet beyond the control room.",
    "description": "Stay close to fleet activity when you are away from your desk. Access your available maps, cameras, history and alerts through the RoadLenz app.",
    "desktop": "overview",
    "mobile": "overview",
    "icon": "mobile",
    "indicators": [
      "Fleet on the go",
      "Connected cameras",
      "Company access"
    ],
    "definition": "RoadLenz mobile brings key fleet tools into a phone interface connected to your account and workspaces.",
    "uses": "Check vehicle activity, follow up on an alert and review journey context while moving between operational tasks.",
    "processTitle": "Your fleet, wherever the day takes you.",
    "steps": [
      {
        "title": "Sign In",
        "copy": "Use your assigned RoadLenz account.",
        "icon": "lock"
      },
      {
        "title": "Select Your Fleet",
        "copy": "Open the company workspace you need.",
        "icon": "building"
      },
      {
        "title": "Monitor Activity",
        "copy": "Check available maps, cameras and alerts.",
        "icon": "mobile"
      },
      {
        "title": "Review & Respond",
        "copy": "Use vehicle context to coordinate follow-up.",
        "icon": "check"
      }
    ],
    "features": [
      {
        "title": "Live Vehicle Map",
        "copy": "Locate connected vehicles through the mobile map.",
        "icon": "map"
      },
      {
        "title": "Vehicle Status",
        "copy": "Check available movement and connectivity details.",
        "icon": "truck"
      },
      {
        "title": "Alerts",
        "copy": "Review relevant fleet events on the go.",
        "icon": "alerts"
      },
      {
        "title": "Trip History",
        "copy": "Look back at recorded vehicle journeys.",
        "icon": "route"
      },
      {
        "title": "Video Access",
        "copy": "Open available connected camera views.",
        "icon": "video"
      },
      {
        "title": "Quick Actions",
        "copy": "Move directly into the tools your workspace provides.",
        "icon": "mobile"
      }
    ],
    "benefitsTitle": "Stay connected beyond the control room.",
    "benefits": [
      {
        "title": "Less Dependence on a Desk",
        "copy": "Access key tools while away from the workstation.",
        "icon": "mobile"
      },
      {
        "title": "Faster Context Checks",
        "copy": "Find the vehicle information behind an enquiry.",
        "icon": "search"
      },
      {
        "title": "Continuity Across Teams",
        "copy": "Keep mobile and office work connected.",
        "icon": "users"
      },
      {
        "title": "Flexible Fleet Oversight",
        "copy": "Review available company activity wherever you work.",
        "icon": "building"
      }
    ],
    "outputTitle": "A complete fleet view, made for mobile.",
    "outputs": [
      {
        "title": "Mobile Dashboard",
        "copy": "Your fleet overview on the phone.",
        "kind": "mobile"
      },
      {
        "title": "Live Map",
        "copy": "Connected vehicle locations.",
        "kind": "map"
      },
      {
        "title": "Vehicle Details",
        "copy": "Identity and operating status.",
        "kind": "status"
      },
      {
        "title": "Alert Feed",
        "copy": "Available fleet events on the go.",
        "kind": "alerts"
      },
      {
        "title": "Trip Timeline",
        "copy": "Recorded movement through the journey.",
        "kind": "route"
      }
    ],
    "related": [
      "gps-tracking",
      "live-video",
      "real-time-status"
    ],
    "ctaTitle": "Ready to take your fleet tools with you?",
    "ctaCopy": "Ask our team about account setup and mobile access."
  },
  {
    "slug": "reports",
    "label": "Reports",
    "eyebrow": "Reports & insights",
    "title": "Explore Reports",
    "subtitle": "Turn fleet data into decisions you can act on.",
    "description": "Find the fleet records you need in one report workspace. Review journeys, distance, stops and connectivity across selected periods.",
    "desktop": "reports",
    "mobile": "reports",
    "icon": "report",
    "indicators": [
      "Trip records",
      "Operational review",
      "Report catalogue"
    ],
    "definition": "RoadLenz Reports organises recorded fleet information into structured views for operational review.",
    "uses": "Compare activity across vehicles and periods, investigate exceptions and support repeatable fleet performance discussions.",
    "processTitle": "From fleet activity to useful reports.",
    "steps": [
      {
        "title": "Collect",
        "copy": "Record available vehicle and device activity.",
        "icon": "database"
      },
      {
        "title": "Organise",
        "copy": "Structure data by vehicle, period and report type.",
        "icon": "layers"
      },
      {
        "title": "Analyse",
        "copy": "Review the measures relevant to your operation.",
        "icon": "chart"
      },
      {
        "title": "Export / Act",
        "copy": "Use available reports to support follow-up.",
        "icon": "download"
      }
    ],
    "features": [
      {
        "title": "Trip Reports",
        "copy": "Review recorded journeys and key trip measures.",
        "icon": "route"
      },
      {
        "title": "Speed Reports",
        "copy": "Review available speed information over selected periods.",
        "icon": "gauge"
      },
      {
        "title": "Idle Reports",
        "copy": "Understand ignition-idle and stopped activity.",
        "icon": "clock"
      },
      {
        "title": "Alert Reports",
        "copy": "Review recorded exceptions and their vehicle context.",
        "icon": "alerts"
      },
      {
        "title": "Driver Reports",
        "copy": "Use available driver activity to support fleet reviews.",
        "icon": "users"
      },
      {
        "title": "Custom Export",
        "copy": "Use supported export options for your reporting workflow.",
        "icon": "download"
      }
    ],
    "benefitsTitle": "Reports that turn data into decisions.",
    "benefits": [
      {
        "title": "Repeatable Fleet Reviews",
        "copy": "Bring consistent records into operational meetings.",
        "icon": "report"
      },
      {
        "title": "Clearer Performance Context",
        "copy": "Compare distance, trips and stationary activity.",
        "icon": "chart"
      },
      {
        "title": "Focused Investigation",
        "copy": "Find the period and vehicle behind an exception.",
        "icon": "search"
      },
      {
        "title": "Better Planning",
        "copy": "Use recorded operations to inform the next decision.",
        "icon": "settings"
      }
    ],
    "outputTitle": "Useful records for every fleet review.",
    "outputs": [
      {
        "title": "Activity Charts",
        "copy": "Illustrative fleet activity by period.",
        "kind": "chart"
      },
      {
        "title": "Report Tables",
        "copy": "Structured records for review.",
        "kind": "table"
      },
      {
        "title": "Fleet KPIs",
        "copy": "Availability and current vehicle states.",
        "kind": "status"
      },
      {
        "title": "Operating Trends",
        "copy": "Patterns across recorded activity.",
        "kind": "chart"
      },
      {
        "title": "CSV / PDF Export",
        "copy": "Supported report export formats.",
        "kind": "table"
      }
    ],
    "related": [
      "track-history",
      "analytics",
      "multi-fleet"
    ],
    "ctaTitle": "Ready to make more of your fleet data?",
    "ctaCopy": "Explore reporting workflows for your daily operation."
  }
];
export const primaryTechnologyPages: TechnologyPageData[] = [tracking, ...configuredPages];
const extraPages: TechnologyPageData[] = legacyRoutes.filter(route => !primaryTechnologyPages.some(page => page.slug === route.slug)).map(route => {
 const base = primaryTechnologyPages.find(page => page.slug === (route.slug === "recordings" ? "live-video" : "reports"))!;
 return {...base, slug:route.slug, label:route.label, eyebrow:route.eyebrow, title:route.slug === "recordings" ? "Explore Recordings" : route.slug === "analytics" ? "Explore Analytics" : "Explore Fuel Monitoring", description:route.description, definition:route.description, uses:route.storyDescription, subtitle:route.storyTitle, benefitsTitle:route.storyTitle,
 features:[...route.features.map(feature=>item(feature.title,feature.copy,route.slug === "recordings" ? "video" : "chart")),...base.features.slice(4)],
 ctaTitle:route.ctaTitle, ctaCopy:route.ctaDescription,
 ...(route.slug === "fuel-monitoring" ? {
 icon:"fuel", desktop:"reports", mobile:"reports", indicators:["Fuel sensor context","Trip comparison","Exception review"],
 processTitle:"From fuel readings to operational context.",
 steps:[item("Measure","Capture readings from compatible fuel sensors.","fuel"),item("Transmit","Send available sensor data with vehicle updates.","radio"),item("Compare","Review readings alongside trips and distance.","chart"),item("Investigate","Follow up on unusual activity with context.","search")],
 benefits: [item("Cost Visibility","Review fuel activity alongside vehicle use.","fuel"),item("Focused Investigations","Identify unusual readings for follow-up.","search"),item("Better Trip Context","Compare fuel information with recorded routes.","route"),item("Informed Planning","Use operating patterns in fleet reviews.","chart")],
 outputTitle:"Fuel activity in its operating context.",outputs:[output("Fuel Trend","Illustrative sensor activity over time.","chart"),output("Fuel Records","Available sensor records for review.","table"),output("Trip Context","The route behind vehicle activity.","route"),output("Exceptions","Events for operational follow-up.","alerts"),output("Period Comparison","Illustrative changes across review periods.","chart")]
 } : route.slug === "recordings" ? {
 processTitle:"From captured footage to useful evidence.",steps:[item("Record","Capture configured camera channels.","camera"),item("Index","Associate available recordings with vehicle and time.","database"),item("Find","Select the relevant period and camera.","search"),item("Review","Play available footage and investigate the event.","play")],
 outputTitle:"Recorded detail for your next investigation.",outputs:[output("Camera Recordings","Available vehicle camera channels.","video"),output("Playback","Footage for a selected time period.","video"),output("Event Context","Associated vehicle events.","alerts"),output("Journey Context","Recorded route information.","route"),output("Evidence Review","Visual information for follow-up.","video")]
 } : {
 processTitle:"From operating records to fleet patterns.",steps:[item("Gather","Bring recorded fleet activity together.","database"),item("Compare","Review vehicles and operating periods.","chart"),item("Understand","Find recurring patterns in the activity.","search"),item("Plan","Use the findings in operational reviews.","settings")],
 outputTitle:"Patterns that inform fleet planning.",outputs:[output("Fleet Trends","Illustrative changes across periods.","chart"),output("Route Patterns","Journey context for recurring activity.","route"),output("Operational KPIs","A snapshot of fleet states.","status"),output("Period Comparison","Illustrative activity comparisons.","chart"),output("Review Records","Structured information for follow-up.","table")]
 }),
 related:route.slug === "recordings" ? ["live-video","alerts","track-history"] : ["reports","gps-tracking","multi-fleet"]};
});
export const technologyPages = [...primaryTechnologyPages, ...extraPages];
export const getTechnologyPage = (slug: string) => technologyPages.find(page => page.slug === slug);
