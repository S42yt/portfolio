export default function WhatIsCuteCraftSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        What is CuteCraft?
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-4 font-mono font-light text-sm leading-[1.75]" style={{ color: "var(--text-muted)" }}>
        <p>
          <span style={{ color: "var(--text)" }}>CuteCraft</span> is a premium
          German Minecraft CityBuild network with custom-designed gameplay
          mechanics, unique items, and a thriving community.
        </p>
        <p>
          Whether you&apos;re a casual player or a more dedicated one,
          CuteCraft offers community events and an active German-speaking
          playerbase.
        </p>
      </div>
    </div>
  );
}
