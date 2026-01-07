import BackHome from "@/components/back-home";

export default function SoonPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-mono font-light text-white tracking-tight">
            Soon
          </h1>
          <p className="mt-4 text-zinc-400">Expect something big :).</p>
        </div>
      </div>
      <BackHome />
    </>
  );
}
