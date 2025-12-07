import Image from "next/image";

export default function GiggandSection() {
  return (
    <div className="mb-20">
      <div className="max-w-4xl mx-auto">
        <div className="relative p-6 bg-black border border-zinc-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <a
                href="https://namemc.com/skin/6ddb655c5b495314"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
              >
                <Image
                  src="/image/preview/giggand_skin.png"
                  alt="giggand_skin"
                  width={640}
                  height={360}
                  className="object-contain w-full h-auto"
                />
              </a>

              <div>
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight font-mono">
                  Giggand Collaboration
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed font-mono mb-6">
                  I made a skin with my friend <span className="text-purple-400">einp2pe</span> for the famous
                  German Twitch streamer <span className="text-purple-400">Giggand</span>.
                </p>

                <a
                  href="https://namemc.com/skin/6ddb655c5b495314"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-all duration-300"
                >
                  View on NameMC
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
