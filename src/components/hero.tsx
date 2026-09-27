export default function Hero() {
  return (
    <div
      data-gsap="hero"
      className="max-w-5xl mx-auto px-6 md:px-12 pt-32 md:pt-36 pb-14"
    >
      <div
        data-gsap="hero-item"
        data-glitch
        className="hero-eyebrow-row flex items-center gap-4 mb-6"
      >
        <div className="user-tile aero-only">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/emojis/kuromi_hey.gif" alt="" aria-hidden="true" />
        </div>
        <p className="eyebrow">Developer · UI/UX · Performance</p>
      </div>

      <h1
        data-glitch
        data-aero-trigger
        className="hero-wordmark font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{
          fontSize: "clamp(4.5rem, 18vw, 13rem)",
          color: "var(--text)",
        }}
      >
        {"S42.".split("").map((char, index) => (
          <span key={index} className="char-mask">
            <span data-gsap="hero-char" className="inline-block">
              {char}
            </span>
          </span>
        ))}
      </h1>

      <div data-gsap="hero-item" data-glitch className="hero-card">
        <div className="section-rule mb-8" />

        <div className="flex items-start gap-3 max-w-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/emojis/kuromi_hey.gif"
            alt=""
            aria-hidden="true"
            className="w-5 h-5 object-contain shrink-0 mt-1.5"
          />
          <p className="prose-body text-base md:text-lg">
            I build fast, beautiful applications with a focus on rendering
            performance and thoughtful UI/UX. Currently working on{" "}
            <a
              href="https://norisk.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent"
            >
              NoRisk Client
            </a>{" "}
            and always exploring what the web can do.
          </p>
        </div>
      </div>
    </div>
  );
}
