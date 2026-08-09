interface Download {
  name: string;
  url: string;
  description: string;
}

interface DownloadSectionProps {
  downloads: Download[];
}

export default function DownloadSection({ downloads }: DownloadSectionProps) {
  return (
    <div className="mb-16">
      <h2
        className="font-display font-black leading-none mb-4"
        style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
          color: "var(--text)",
        }}
      >
        Download
      </h2>
      <div className="section-rule mb-6" />

      <div className="space-y-0">
        {downloads.map((download, index) => (
          <a
            key={index}
            href={download.url}
            target="_blank"
            rel="noopener noreferrer"
            className="row-link flex items-center justify-between px-4 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {download.name}
              </span>
              <span
                className="text-xs ml-3"
                style={{ color: "var(--text-faint)" }}
              >
                {download.description}
              </span>
            </div>
            <span
              className="row-arrow text-xs"
              style={{ color: "var(--text-faint)" }}
            >
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
