import BackHome from "@/components/back-home";
import HeroSection from "./components/hero";
import DemoSection from "./components/demo";
import FeaturesSection from "./components/features";
import ConfigurationSection from "./components/config";
import DownloadSection from "./components/download";
import ContributingSection from "./components/contributing";
import ProjectLinksSection from "./components/links";
import TechnicalDetailsSection from "./components/tech";

export default function TradeCyclePage() {
  const downloads = [
    {
      name: "Spigot",
      url: "https://www.spigotmc.org/resources/tradecycle.122805/",
      description: "Spigot Version",
    },
    {
      name: "Modrinth",
      url: "https://modrinth.com/plugin/tradecycle",
      description: "Paper and Spigot Version",
    },
    {
      name: "Hangar",
      url: "https://hangar.papermc.io/S42yt/TradeCycle",
      description: "Paper Version",
    },
    {
      name: "CurseForge",
      url: "https://www.curseforge.com/minecraft/bukkit-plugins/tradecycle",
      description: "Paper Version",
    },
    {
      name: "GitHub Releases",
      url: "https://github.com/CuteCraft-Network/TradeCycle/releases/latest",
      description: "Paper and Spigot Version",
    },
  ];

  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
        <ConfigurationSection />
        <DownloadSection downloads={downloads} />
        <ContributingSection />
        <ProjectLinksSection />
        <TechnicalDetailsSection />
        <BackHome />
      </div>
    </div>
  );
}
