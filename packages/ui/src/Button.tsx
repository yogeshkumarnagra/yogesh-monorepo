import React from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white",
  outline: "border border-[#1e1e2e] text-[#e2e8f0] hover:border-[#7c3aed] hover:text-[#a78bfa]",
  ghost:   "text-[#94a3b8] hover:text-[#e2e8f0]",
};

const sizeStyles: Record<Size, string> = {
  sm:  "text-xs px-3 py-1.5",
  md:  "text-sm px-5 py-2.5",
  lg:  "text-base px-7 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
