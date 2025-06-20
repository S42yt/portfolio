export default function HeroSection() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight font-mono">
          TradeCycle
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed font-mono max-w-3xl mx-auto mb-6">
          A multiplatform plugin written in Kotlin to cycle through Villager
          trades from UI
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/github/workflow/status/S42YT/TradeCycle/Java%20CI%20with%20Gradle?style=for-the-badge"
            alt="Build Status"
            className="h-7"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/github/v/release/S42YT/TradeCycle?style=for-the-badge"
            alt="GitHub Release"
            className="h-7"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/spiget/downloads/122805?label=spigot%20downloads&style=for-the-badge&color=ee8917"
            alt="Spigot Downloads"
            className="h-7"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/modrinth/dt/tradecycle?label=modrinth%20downloads&style=for-the-badge&color=5da545"
            alt="Modrinth Downloads"
            className="h-7"
          />
        </div>

        <p className="text-zinc-400">
          Inspired by{" "}
          <a
            href="https://modrinth.com/user/henkelmax"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            henkelmax
          </a>
          &apos;s mod{" "}
          <a
            href="https://modrinth.com/mod/trade-cycling"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Trade Cycling
          </a>
        </p>
      </div>
    </div>
  );
}