export default function TechnicalDetailsSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            Technical Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">Language</h3>
              <p className="text-sm text-zinc-400">Kotlin</p>
            </div>

            <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">Platforms</h3>
              <p className="text-sm text-zinc-400">Spigot, Paper</p>
            </div>

            <div className="text-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <h3 className="font-medium text-white mb-2">Compatibility</h3>
              <p className="text-sm text-zinc-400">
                Java and Bedrock (via Geyser)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
