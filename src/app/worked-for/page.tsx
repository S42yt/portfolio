import BackHome from "@/components/backHome";
import HeroSection from "./components/hero";
import MarqueeSection from "./components/marquee";
import GiggandSection from "./components/giggand";

export default function WorkedForPage() {
  // Get all profile pictures
  const pfpImages = ["giggand.png"];

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <HeroSection />
        <MarqueeSection images={pfpImages} />
        <GiggandSection />
        <BackHome />
      </div>
    </div>
  );
}
