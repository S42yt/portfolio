import type { CSSProperties } from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

type Props = {
  icon: IconDefinition;
  className?: string;
  style?: CSSProperties;
};

export default function Icon({ icon, className, style }: Props) {
  const [width, height, , , path] = icon.icon;
  const paths = Array.isArray(path) ? path : [path];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      className={className ? `svg-inline--fa ${className}` : "svg-inline--fa"}
      style={style}
    >
      {paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
