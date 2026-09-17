export type IndustryIntelligenceLayer = {
  id: string;
  label: string;
  icon: string;
  image: string;
  description: string;
};

export const industryIntelligenceLayers: IndustryIntelligenceLayer[] =
  [
    {
      id: "gps",
      label: "GPS Tracking",
      icon: "pin",

      /*
       * Replace with your image.
       *
       * Example:
       * "/media/industries/intelligence/gps.png"
       *
       * Keep empty to show the
       * animated blue glass layer.
       */
      image: "",

      description:
        "Live fleet location and movement intelligence.",
    },

    {
      id: "video",
      label: "Live Video",
      icon: "video",
      image: "",

      description:
        "Connected camera visibility from every journey.",
    },

    {
      id: "ai-safety",
      label: "AI Safety",
      icon: "shield",
      image: "",

      description:
        "ADAS and DMS safety intelligence where configured.",
    },

    {
      id: "alerts",
      label:
        "Alerts & Notifications",
      icon: "bell",
      image: "",

      description:
        "Operational events surfaced when they matter.",
    },

    {
      id: "reports",
      label:
        "Reports & Analytics",
      icon: "doc",
      image: "",

      description:
        "Fleet activity transformed into useful reports.",
    },

    {
      id: "fleet",
      label:
        "Fleet Management",
      icon: "fleet",
      image: "",

      description:
        "Company, vehicle and operational control in one place.",
    },
  ];