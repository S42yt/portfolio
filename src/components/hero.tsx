export default function Hero() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-12">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-6"
        style={{ color: "var(--text-faint)" }}
      >
        Developer · UI/UX · Performance
      </p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{
          fontSize: "clamp(6rem, 22vw, 16rem)",
          color: "var(--text)",
        }}
      >
        S42.
      </h1>

      <div className="section-rule mb-8" />

      <div className="flex items-start gap-3 max-w-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/emojis/kuromi_hey.gif"
          alt=""
          aria-hidden="true"
          className="w-5 h-5 object-contain flex-shrink-0 mt-1"
        />
        <p
          className="text-base md:text-lg leading-[1.75] font-mono font-light"
          style={{ color: "var(--text-muted)" }}
        >
          I build fast, beautiful applications with a focus on rendering
          performance and thoughtful UI/UX. Currently working on{" "}
          <span style={{ color: "var(--accent)" }}>NoRisk Client</span> and
          always exploring what the web can do.
        </p>
      </div>
    </div>
  );
}
