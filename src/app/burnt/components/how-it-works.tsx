import Icon from "@/components/icon";
import {
  faSpotify,
  faTwitch,
  faYoutube,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";

export default function HowItWorksSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
          color: "var(--text)",
        }}
      >
        How It Works
      </h2>
      <div className="section-rule mb-6" />

      <p
        className="text-xs tracking-[0.2em] uppercase mb-4"
        style={{ color: "var(--text-faint)" }}
      >
        burnt.rip/username
      </p>

      <div className="panel p-5 space-y-3">
        {[
          {
            icon: faSpotify,
            color: "text-green-400",
            text: 'Currently listening to: "Song Name" by Artist',
          },
          {
            icon: faTwitch,
            color: "text-purple-400",
            text: "🔴 Live streaming Minecraft",
          },
          {
            icon: faYoutube,
            color: "text-red-400",
            text: 'Latest video: "How to Build in Minecraft"',
          },
          {
            icon: faDiscord,
            color: "text-indigo-400",
            text: "Online — Playing Minecraft",
          },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3">
            <Icon
              icon={item.icon}
              className={`w-4 h-4 shrink-0 ${item.color}`}
            />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs mt-4" style={{ color: "var(--text-faint)" }}>
        One link, all your platforms.
      </p>
    </div>
  );
}
