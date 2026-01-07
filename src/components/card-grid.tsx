import { ReactNode } from "react";

interface CardGridProps {
  children: ReactNode;
}

export default function CardGrid({ children }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto px-4">
      {children}
    </div>
  );
}
