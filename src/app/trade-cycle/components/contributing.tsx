export default function ContributingSection() {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", color: "var(--text)" }}
      >
        Contributing
      </h2>
      <div className="section-rule mb-6" />

      <p
        className="text-sm font-mono font-light mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        Feel free to open an issue or a pull request — I&apos;ll be happy to
        help!
      </p>

      <div>
        <p
          className="text-xs tracking-[0.2em] uppercase font-mono mb-3"
          style={{ color: "var(--text-faint)" }}
        >
          Special thanks
        </p>
        <a
          href="https://github.com/tamikaschu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-mono transition-opacity duration-200 hover:opacity-60"
          style={{ color: "var(--accent)" }}
        >
          Tamikaschu
        </a>
      </div>
    </div>
  );
}
