"use client";

export default function DemoSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Demo
      </h2>
      <div className="section-rule mb-6" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://raw.githubusercontent.com/CuteCraft-Network/TradeCycle/refs/heads/master/assets/cycle_success.gif"
        alt="TradeCycle Plugin Demo"
        className="w-full max-w-md"
        style={{ border: "1px solid var(--border)" }}
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300' viewBox='0 0 500 300'%3E%3Crect width='500' height='300' fill='%230d0b12'/%3E%3Ctext x='250' y='150' font-family='monospace' font-size='18' fill='%23555' text-anchor='middle' dy='0.35em'%3ETradeCycle Demo%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>
  );
}
