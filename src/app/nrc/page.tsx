import BackHome from "@/components/back-home";
import HeroSection from "./components/hero";
import WhatIsNRCSection from "./components/what-is-nrc";
import ContributionsSection from "./components/contributions";
import DownloadSection from "./components/download";
import ProjectsSection from "./components/projects";

export default function NRCPage() {
  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <HeroSection />
        <WhatIsNRCSection />
        <ContributionsSection />
        <ProjectsSection />
        <DownloadSection />
        <BackHome />
      </div>
    </div>
  );
}
