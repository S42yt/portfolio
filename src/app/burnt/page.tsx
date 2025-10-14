import BackHome from "@/components/backHome";
import {
  faDiscord,
  faSpotify,
  faTwitch,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faShield,
  faEye,
  faPalette,
  faLink,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import HeroSection from "./components/hero";
import WhatIsBurntSection from "./components/whatIsBurnt";
import FeaturesSection from "./components/features";
import PlatformsSection from "./components/platform";
import PerfectForSection from "./components/perfectFor";
import HowItWorksSection from "./components/howItWorks";
import CTASection from "./components/cta";
import PrivacySecuritySection from "./components/privacy";

export default function BurntPage() {
  const features = [
    {
      icon: faDiscord,
      title: "Discord Integration",
      description:
        "Sign in with Discord OAuth2 and display your real-time presence status",
      color: "text-indigo-400",
    },
    {
      icon: faPalette,
      title: "Customizable Profiles",
      description:
        "Add avatars, banners, and personalize your 'About Me' section",
      color: "text-purple-400",
    },
    {
      icon: faLink,
      title: "Social Links Hub",
      description:
        "Connect Twitch, YouTube, Spotify, and all your social platforms",
      color: "text-cyan-400",
    },
    {
      icon: faEye,
      title: "Real-Time Status",
      description:
        "Show your Discord presence, what you're playing, and streaming status",
      color: "text-green-400",
    },
    {
      icon: faGlobe,
      title: "Public Profiles",
      description: "Share your custom burnt.rip/username page with everyone",
      color: "text-blue-400",
    },
    {
      icon: faShield,
      title: "Privacy & Security",
      description:
        "SSL/TLS encryption, GDPR compliance, and secure data handling",
      color: "text-red-400",
    },
  ];

  const platforms = [
    { name: "Discord", icon: faDiscord, color: "text-indigo-400" },
    { name: "Twitch", icon: faTwitch, color: "text-purple-400" },
    { name: "YouTube", icon: faYoutube, color: "text-red-400" },
    { name: "Spotify", icon: faSpotify, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen py-20 noise-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <HeroSection />
        <WhatIsBurntSection />
        <FeaturesSection features={features} />
        <PlatformsSection platforms={platforms} />
        <PerfectForSection />
        <HowItWorksSection />
        <PrivacySecuritySection />
        <CTASection />
        <BackHome />
      </div>
    </div>
  );
}
