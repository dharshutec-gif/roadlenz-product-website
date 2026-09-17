export const industryGallery: Record<string, { panel: number; description: string; icon: string }> = {
  "cab-taxi": { panel: 0, description: "Seamless mobility for every destination.", icon: "car" },
  "school-transport": { panel: 1, description: "Safer journeys for brighter futures.", icon: "school" },
  "public-transport": { panel: 2, description: "Connected cities. Stronger communities.", icon: "users" },
  "employee-transport": { panel: 3, description: "Reliable movement for a productive workforce.", icon: "users" },
  "trucking-logistics": { panel: 4, description: "Moving businesses forward.", icon: "box" },
  mining: { panel: 5, description: "Safer operations. Greater output.", icon: "mountain" },
  agriculture: { panel: 6, description: "Smarter farming for a sustainable tomorrow.", icon: "leaf" },
};

// Exact seams in the generated 1915px-wide vehicle atlas.
export function explorerPanelStyle(panel: number) {
  const edges = [0, 287, 554, 823, 1093, 1362, 1629, 1915];
  const start = edges[panel] + 1;
  const width = edges[panel + 1] - edges[panel] - 2;
  return { backgroundSize: `${1915 / width * 100}% 100%`, backgroundPosition: `${start / (1915 - width) * 100}% center` };
}
