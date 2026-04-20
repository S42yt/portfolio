import BackHome from "@/components/back-home";

export default function SoonPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-16">
      <p
        className="text-xs tracking-[0.3em] uppercase font-mono mb-6"
        style={{ color: "var(--text-faint)" }}
      >
        Coming Soon
      </p>

      <h1
        className="font-display font-black leading-[0.85] tracking-tight mb-8"
        style={{ fontSize: "clamp(6rem, 22vw, 16rem)", color: "var(--text)" }}
      >
        Soon.
      </h1>

      <div className="section-rule mb-8" />

      <p
        className="text-base font-mono font-light"
        style={{ color: "var(--text-muted)" }}
      >
        Expect something big.
      </p>

      <div className="mt-16">
        <BackHome />
      </div>
    </div>
  );
}
