import Link from "next/link";

export default function BackHome() {
  return (
    <div className="pt-8 mt-8" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono transition-opacity duration-200 hover:opacity-60"
        style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
