export default function ServerInfoSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            Server Information
          </h2>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-2">Server IP</h3>
                <code className="text-lg font-mono text-cyan-400 bg-zinc-800 px-3 py-1 rounded">
                  cutecraft.net
                </code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-medium text-white mb-1">Version</h4>
                  <p className="text-sm text-zinc-400">1.21.5</p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-1">Game Mode</h4>
                  <p className="text-sm text-zinc-400">CityBuild</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
