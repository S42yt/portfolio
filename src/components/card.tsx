"use client";

import { ReactNode, useState, MouseEvent, useRef, useEffect } from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  hoverColor?: string;
  href?: string;
  route?: string;
}

export default function Card({
  title,
  description,
  icon,
  hoverColor = "#3b82f6",
  href,
  route,
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
    className: `relative p-4 bg-black border border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700 group h-full`,
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
          <div className="mb-3 text-zinc-400 group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </>
  );

  if (route) {
    return (
      <Link href={route} className="block h-full group">
        <div
          {...commonCardProps}
          className={`${commonCardProps.className} cursor-pointer`}
        >
          {CardVisualContent}
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
        <div
          {...commonCardProps}
          className={`${commonCardProps.className} cursor-pointer`}
        >
          {CardVisualContent}
        </div>
      </a>
    );
  }

  return <div {...commonCardProps}>{CardVisualContent}</div>;
}
