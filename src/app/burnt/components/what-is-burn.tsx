export default function WhatIsBurntSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        What is Burnt.rip?
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-4 font-mono font-light text-sm leading-[1.75]" style={{ color: "var(--text-muted)" }}>
        <p>
          Burnt.rip is an online profile platform designed specifically for{" "}
          <span style={{ color: "var(--text)" }}>gamers, streamers, and social media users</span>.
          Think of it as a modern, customizable bio page with deep Discord
          integration.
        </p>
        <p>
          Instead of sharing multiple links across different platforms, you can
          create a single, beautiful profile page that showcases all your social
          presence in one place.
        </p>
      </div>
    </div>
  );
}
