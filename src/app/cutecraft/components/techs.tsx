export default function TechnologiesSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            Technologies & Tools
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">Frontend</h3>
              <p className="text-sm text-zinc-400">Next.js, Astro.js</p>
            </div>

            <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">Design</h3>
              <p className="text-sm text-zinc-400">Aseprite, Figma</p>
            </div>

            <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">Minecraft</h3>
              <p className="text-sm text-zinc-400">Java Plugins, Paper</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
