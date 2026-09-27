import { ReactNode } from "react";

interface AeroWindowProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export default function AeroWindow({
  title,
  icon = "/emojis/kuromi_love.gif",
  children,
}: AeroWindowProps) {
  return (
    <div className="aero-window" data-glitch>
      <div className="aero-titlebar aero-only" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" className="aero-titlebar-icon" />
        <span className="truncate">{title}</span>
        <span className="aero-caption">
          <span>&#8211;</span>
          <span>&#9633;</span>
          <span className="aero-close">&#10005;</span>
        </span>
      </div>
      <div className="aero-body">{children}</div>
    </div>
  );
}
