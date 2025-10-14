interface Feature {
  title: string;
  description: string;
}

interface ServerFeaturesSectionProps {
  features: Feature[];
}

export default function ServerFeaturesSection({
  features,
}: ServerFeaturesSectionProps) {
  return (
    <div className="mb-16">
      <div className="relative p-6 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-medium text-white mb-8 text-center">
            Server Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all duration-300"
              >
                <h3 className="font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
