import Icon from "@/components/icon";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function HeroSection() {
  return (
    <div className="mb-16">
      <p className="eyebrow mb-6">Bio Page Platform · Web</p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{ fontSize: "clamp(4rem, 14vw, 10rem)", color: "var(--text)" }}
      >
        Burnt.net.
      </h1>

      <div className="section-rule mb-8" />

      <p className="prose-body text-base md:text-lg max-w-2xl mb-8">
        Create beautiful online profiles with deep Discord integration for
        gamers and streamers. One link — all your platforms.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="https://burnt.rip"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <Icon icon={faGlobe} className="w-4 h-4" />
          Visit Burnt.rip
        </a>
      </div>
    </div>
  );
}
