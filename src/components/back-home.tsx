import Link from "next/link";

export default function BackHome() {
  return (
    <div className="text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all duration-300 rounded-lg group"
      >
        <span>← Back to Home</span>
      </Link>
    </div>
  );
}
