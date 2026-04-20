export default function HeroSection() {
  return (
    <div className="mb-16">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-6"
        style={{ color: "var(--text-faint)" }}
      >
        Minecraft Plugin · Kotlin
      </p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{ fontSize: "clamp(4rem, 14vw, 10rem)", color: "var(--text)" }}
      >
        TradeCycle.
      </h1>

      <div className="section-rule mb-8" />

      <p
        className="text-base md:text-lg leading-[1.75] font-mono font-light max-w-2xl mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        A multiplatform plugin written in Kotlin to cycle through Villager trades
        from the UI. Inspired by{" "}
        <a
          href="https://modrinth.com/user/henkelmax"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity duration-200 hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          henkelmax
        </a>
        &apos;s{" "}
        <a
          href="https://modrinth.com/mod/trade-cycling"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity duration-200 hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          Trade Cycling
        </a>{" "}
        mod.
      </p>

      <div className="flex flex-wrap gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.shields.io/github/workflow/status/S42YT/TradeCycle/Java%20CI%20with%20Gradle?style=flat-square"
          alt="Build Status"
          className="h-5 opacity-70"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.shields.io/github/v/release/S42YT/TradeCycle?style=flat-square"
          alt="GitHub Release"
          className="h-5 opacity-70"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.shields.io/spiget/downloads/122805?label=spigot&style=flat-square&color=ee8917"
          alt="Spigot Downloads"
          className="h-5 opacity-70"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.shields.io/modrinth/dt/tradecycle?label=modrinth&style=flat-square&color=5da545"
          alt="Modrinth Downloads"
          className="h-5 opacity-70"
        />
      </div>
    </div>
  );
}
