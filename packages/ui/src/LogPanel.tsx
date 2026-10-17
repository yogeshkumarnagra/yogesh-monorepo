"use client";
import React from "react";

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "success" | "error";
}

interface LogPanelProps {
  logs: LogEntry[];
}

const typeColor = {
  info:    "text-[#94a3b8]",
  success: "text-[#10b981]",
  error:   "text-red-400",
};

export function LogPanel({ logs }: LogPanelProps) {
  return (
    <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs">
      {logs.length === 0 && (
        <p className="text-[#475569]">Logs will appear here...</p>
      )}
      {logs.map((l, i) => (
        <div key={i} className={`flex gap-2 mb-1 ${typeColor[l.type]}`}>
          <span className="text-[#475569] shrink-0">[{l.time}]</span>
          <span>{l.message}</span>
        </div>
      ))}
    </div>
  );
}
