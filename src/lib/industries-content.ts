import type { Solution, SolutionBenefit } from "./types";

/** Page-specific editorial defaults from the approved brief, not duplicate solutions.
 * Optional presentation overrides live on the existing CMS solution record.
 * Solution publication, media, destination and non-editorial copy remain canonical.
 */
export interface IndustryPresentation {
  label?: string;
  order?: number;
  active?: boolean;
  phrase?: string;
  title?: string;
  summary?: string;
  action?: string;
  benefits?: SolutionBenefit[];
}

const editorial: Record<string, IndustryPresentation> = {
  taxi: { order: 1, label: "Cab & Taxi", phrase: "People keep cities moving" },
  "school-transport": { order: 2, phrase: "Safer journeys brighter tomorrows" },
  "public-transport": { order: 3, phrase: "Stronger communities through better transit" },
  "employee-transport": { order: 4, phrase: "People drive possibility" },
  logistics: {
    order: 5, phrase: "Every load. Every kilometre. In view.",
    title: "Every load. Every kilometre. In view.",
    summary: "Smarter visibility for a more efficient, more reliable supply chain.",
    action: "Explore Logistics Solution",
    benefits: [
      { title: "Driver Safety", description: "Safer drivers. Stronger operations.", icon: "shield" },
      { title: "Cargo Evidence", description: "Protecting what moves your business.", icon: "box" },
      { title: "Route Visibility", description: "Real-time visibility. Greater control.", icon: "pin" },
    ],
  },
  mining: { order: 6, phrase: "Tough environments greater possibilities" },
  agriculture: { order: 7, phrase: "A more productive and sustainable tomorrow" },
};

export function getIndustryPanels(solutions: Solution[]) {
  return solutions.filter(s => s.published && s.industryPresentation?.active !== false)
    .map(s => {
      const copy = { ...editorial[s.slug], ...s.industryPresentation };
      return {
        id: s.id, slug: s.slug, name: copy.label ?? s.name,
        order: copy.order ?? s.order,
        href: `/solutions/${s.slug}`,
        image: s.heroMedia.type === "image" ? s.heroMedia.src : s.heroMedia.poster ?? "",
        title: copy.title ?? s.heroTitle, phrase: copy.phrase ?? s.heroTitle,
        summary: copy.summary ?? s.heroSummary,
        action: copy.action ?? `Explore ${copy.label ?? s.name} Solution`,
        benefits: (copy.benefits ?? s.benefits ?? []).slice().sort((a,b) => (a.order ?? 0) - (b.order ?? 0)).slice(0,3),
      };
    }).sort((a,b) => a.order - b.order);
}

export type IndustryPanel = ReturnType<typeof getIndustryPanels>[number];
export interface IntelligenceProduct { label: string; copy: string; icon: string; image: string; href: string; name: string }
