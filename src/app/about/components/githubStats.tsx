export default function GitHubStatsSection() {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-6 text-center">
            GitHub Stats
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github-readme-stats.vercel.app/api?username=S42yt&show_icons=true&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa&icon_color=3b82f6"
                alt="GitHub Stats"
                className="max-w-full h-auto"
              />
            </div>

            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=S42yt&layout=compact&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa"
                alt="Top Languages"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
