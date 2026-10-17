import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-[#111118] border border-[#1e1e2e] rounded-xl p-6
        ${hover ? "hover:border-[#7c3aed]/40 hover:bg-[#16161f] transition-all" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
