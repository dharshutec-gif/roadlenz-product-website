"use client";

import styles from "./TechnologyPage.module.css";

import TechnologyHero from "./TechnologyHero";
import SoftwareIntro from "./SoftwareIntro";
import LiveFleet from "./LiveFleet";
import VideoIntelligence from "./VideoIntelligence";
import SafetyIntelligence from "./SafetyIntelligence";
import JourneyReports from "./JourneyReports";
import IndustryPlatform from "./IndustryPlatform";
import PricingWhiteLabel from "./PricingWhiteLabel";

export default function TechnologyPage() {
  return (
    <main className={styles.page}>
      <TechnologyHero />
      <SoftwareIntro />
      <LiveFleet />
      <VideoIntelligence />
      <SafetyIntelligence />
      <JourneyReports />
      <IndustryPlatform />
      <PricingWhiteLabel />
    </main>
  );
}