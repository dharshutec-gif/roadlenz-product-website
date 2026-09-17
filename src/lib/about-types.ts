import type { BaseEntity, MediaRef } from "./types";

export interface AboutSection extends BaseEntity {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
}
export interface AboutSlide extends BaseEntity {
  title: string;
  alt: string;
  media: MediaRef;
}
export interface AboutMilestone extends BaseEntity {
  year: string;
  title: string;
  description: string;
  image: string;
}
export interface AboutOffice extends BaseEntity {
  title: string;
  officeType: string;
  city: string;
  region: string;
  country: string;
  address: string[];
  phone?: string;
  email: string;
  headquarters: boolean;
  mapsUrl: string;
  image: string;
  lat: number;
  lng: number;
}
export interface AboutSupport extends BaseEntity {
  title: string;
  description: string;
  phone: string;
  email: string;
  image: string;
}
export interface AboutLeader extends BaseEntity {
  name: string;
  role: string;
  quote: string;
  image: string;
}
export interface AboutData {
  aboutSections: AboutSection[];
  aboutSlides: AboutSlide[];
  aboutMilestones: AboutMilestone[];
  aboutOffices: AboutOffice[];
  aboutSupport: AboutSupport[];
  aboutLeaders: AboutLeader[];
}
