"use client";
import React from "react";

interface Step {
  key: string;
  label: string;
  icon: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: string;
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex gap-1 flex-wrap">
      {steps.map((step, i) => {
        const done   = i < currentIdx;
        const active = step.key === currentStep;
        return (
          <div
            key={step.key}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border
              transition-all duration-300
              ${done   ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]" : ""}
              ${active ? "bg-[#7c3aed]/15 border-[#7c3aed]/40 text-[#a78bfa]" : ""}
              ${!done && !active ? "border-[#1e1e2e] text-[#475569]" : ""}
            `}
          >
            <span>{step.icon}</span>
            <span>{step.label}</span>
            {done   && <span>✓</span>}
            {active && <span className="animate-pulse">•</span>}
          </div>
        );
      })}
    </div>
  );
}
