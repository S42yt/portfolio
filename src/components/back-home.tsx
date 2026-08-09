import Link from "next/link";

export default function BackHome() {
  return (
    <div
      className="mt-12 pt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <Link href="/" className="btn">
        ← Back to Home
      </Link>
    </div>
  );
}
