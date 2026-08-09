import { Children, ReactNode } from "react";
import Reveal from "./reveal";

interface CardGridProps {
  children: ReactNode;
}

export default function CardGrid({ children }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Children.map(children, (child, index) => (
        <Reveal className="h-full" delay={index * 60}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
