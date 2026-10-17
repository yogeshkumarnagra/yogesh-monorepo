import React from "react";

type BadgeVariant = "accent" | "green" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  accent: "bg-[#7c3aed]/10 border-[#7c3aed]/25 text-[#a78bfa]",
  green:  "bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]",
  muted:  "bg-[#0a0a0f] border-[#1e1e2e] text-[#475569]",
};

export function Badge({ children, variant = "accent", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-block border rounded font-mono text-[0.72rem] px-2 py-0.5
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}
