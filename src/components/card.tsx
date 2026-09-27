"use client";

import { CSSProperties, ReactNode, MouseEvent, useRef } from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  image?: string;
  hoverColor?: string;
  href?: string;
  route?: string;
  archived?: boolean;
}

export default function Card({
  title,
  description,
  icon,
  image,
  hoverColor = "var(--accent)",
  href,
  route,
  archived = false,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  };

  const content = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      data-archived={archived}
      className="panel project-card relative flex h-full flex-col overflow-hidden p-5"
      style={{ "--orb": hoverColor } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="project-glow pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full"
        style={{
          background: `radial-gradient(circle, ${hoverColor}, transparent 70%)`,
          filter: "blur(48px)",
          transform:
            "translate3d(calc(var(--pointer-x, 50%) - 7rem), calc(var(--pointer-y, 50%) - 7rem), 0)",
        }}
      />

      {archived && (
        <span className="archived-badge absolute right-4 top-4 rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium">
          Archived
        </span>
      )}

      <div className="relative z-10 flex h-full flex-col">
        {icon && <div className="project-icon mb-4 w-fit">{icon}</div>}

        <div className="mb-2 flex items-center gap-2">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--text)" }}
          >
            {title}
          </h3>
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt=""
              aria-hidden="true"
              className="project-emoji h-6 w-6 object-contain"
            />
          )}
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );

  if (route) {
    return (
      <Link href={route} className="block h-full">
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }

  return content;
}
