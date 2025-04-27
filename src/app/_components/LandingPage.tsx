"use client";

import Link from "next/link";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import SecurityArchitectureSection from "./SecurityArchitectureSection";
import CallToActionSection from "./CallToActionSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <HeroSection />

      <HowItWorksSection />

      <SecurityArchitectureSection />

      {/* <CallToActionSection /> */}
    </div>
  );
}
