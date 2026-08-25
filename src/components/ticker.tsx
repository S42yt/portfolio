interface TickerProps {
  items: string[];
  reverse?: boolean;
  className?: string;
}

export default function Ticker({ items, reverse, className }: TickerProps) {
  const line = items.map((item) => `${item} ✦ `).join("");
  return (
    <div
      aria-hidden="true"
      data-gsap="ticker"
      className={`ticker ${className ?? ""}`}
    >
      <div className={`ticker-track ${reverse ? "ticker-track-reverse" : ""}`}>
        <span>{line.repeat(4)}</span>
        <span>{line.repeat(4)}</span>
      </div>
    </div>
  );
}
