"use client";

import { ReactNode, useState, MouseEvent, useRef, useEffect } from "react";
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
  hoverColor = "#3b82f6",
  href,
  route,
  archived = false,
}: CardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    if (!isHovered) return;

    const animateLight = () => {
      setLightPosition((prev) => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;

        const lerp = 0.15;

        return {
          x: prev.x + dx * lerp,
          y: prev.y + dy * lerp,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animateLight);
    };

    animationFrameRef.current = requestAnimationFrame(animateLight);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition, isHovered]);

  const commonCardProps = {
    className: `${archived ? "filter grayscale saturate-50 brightness-90 opacity-85 group-hover:grayscale-0 group-hover:saturate-100 group-hover:brightness-100 group-hover:opacity-100" : ""} relative p-4 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group h-full`,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: {
      background: isHovered
        ? `radial-gradient(500px circle at ${lightPosition.x}px ${lightPosition.y}px, ${hoverColor}15, black 40%)`
        : "black",
    },
  };

  const CardVisualContent = (
    <>
      <div
        className={`absolute pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-20" : "opacity-0"
        }`}
        style={{
          left: lightPosition.x - 100,
          top: lightPosition.y - 100,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${hoverColor}, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10">
        {icon && (
          <div
            className={`mb-3 transition-colors duration-300 ${
              archived
                ? "text-zinc-500 group-hover:text-white"
                : "text-zinc-400 group-hover:text-white"
            }`}
          >
            {icon}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <h3
            className={`text-lg font-medium transition-colors duration-300 ${
              archived
                ? "text-zinc-300 group-hover:text-white"
                : "text-white group-hover:text-white"
            }`}
          >
            {title}
          </h3>
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt={`${title} icon`}
              className="w-6 h-6 object-contain transition-all duration-300"
            />
          )}
        </div>
        <p
          className={`text-sm leading-relaxed transition-colors duration-300 ${archived ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-300"}`}
        >
          {description}
        </p>
      </div>
    </>
  );

  if (route) {
    return (
      <Link href={route} className="block h-full group">
        <div className="relative h-full">
          <div
            {...commonCardProps}
            className={`${commonCardProps.className} cursor-pointer`}
          >
            {CardVisualContent}
          </div>

          {archived && (
            <span
              className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full border-2 border-yellow-400 text-yellow-400 bg-yellow-400/20"
              aria-label="Archived"
            >
              Archived
            </span>
          )}
        </div>
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full group"
      >
        <div className="relative h-full">
          <div
            {...commonCardProps}
            className={`${commonCardProps.className} cursor-pointer`}
          >
            {CardVisualContent}
          </div>

          {archived && (
            <span
              className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full border-2 border-yellow-400 text-yellow-400 bg-yellow-400/20"
              aria-label="Archived"
            >
              Archived
            </span>
          )}
        </div>
      </a>
    );
  }

  return (
    <div className="relative h-full">
      <div {...commonCardProps}>{CardVisualContent}</div>

      {archived && (
        <span
          className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full border-2 border-yellow-400 text-yellow-400 bg-yellow-400/20"
          aria-label="Archived"
        >
          Archived
        </span>
      )}
    </div>
  );
}
