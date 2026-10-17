"use client";
import { useRef, useEffect } from "react";
import { Log } from "./types";

interface Props { logs: Log[]; loading: boolean; }

export default function LogPanel({ logs, loading }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-700">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700">
        <span>🖥️</span>
        <h2 className="font-bold text-sm text-slate-300">Live Pipeline Logs</h2>
        {loading && <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
      </div>
      <div ref={ref} className="p-4 h-44 overflow-y-auto font-mono text-xs space-y-1">
        {logs.length === 0 ? (
          <p className="text-slate-600">Logs will appear here when pipeline runs...</p>
        ) : logs.map((log, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-slate-600 shrink-0">[{log.time}]</span>
            <span className={
              log.type === "success" ? "text-emerald-400" :
              log.type === "error"   ? "text-red-400" : "text-slate-300"
            }>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
