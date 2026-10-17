"use client";
import { StepDef, StepName } from "./types";

interface Props {
  steps: StepDef[];
  currentStep: StepName;
  loading: boolean;
  folder: string;
  getStatus: (key: StepName) => "done" | "active" | "pending";
}

export default function ProgressBar({ steps, currentStep, loading, folder, getStatus }: Props) {
  const activeInfo = steps.find(s => s.key === currentStep);

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pipeline Progress</h2>
        <div className="flex items-center gap-3">
          {currentStep === "done" && <span className="text-emerald-500 text-sm font-bold">✅ All Done!</span>}
          {folder && <span className="text-slate-400 text-xs font-mono">📁 {folder}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const status = getStatus(step.key);
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center min-w-[64px]">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-500 ${
                  status === "done"   ? "bg-gradient-to-br from-emerald-400 to-teal-400 border-emerald-300 shadow-md" :
                  status === "active" ? "bg-gradient-to-br from-rose-400 to-pink-400 border-rose-300 ring-4 ring-rose-100 animate-pulse" :
                  "bg-slate-100 border-slate-200"
                }`}>
                  {status === "done" ? <span className="text-white font-bold text-sm">✓</span> : step.icon}
                </div>
                <span className={`text-xs mt-2 font-semibold ${
                  status === "active" ? "text-rose-500" :
                  status === "done"   ? "text-emerald-500" : "text-slate-400"
                }`}>{step.label}</span>
                {status === "active" && <span className="text-xs text-rose-400 mt-0.5">Running...</span>}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mb-6 rounded-full transition-all duration-500 ${
                  getStatus(steps[i+1].key) !== "pending" || status === "done"
                    ? "bg-gradient-to-r from-emerald-300 to-teal-300"
                    : "bg-slate-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {loading && activeInfo && (
        <div className="mt-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl px-4 py-2.5 text-rose-600 text-sm font-medium">
          {activeInfo.icon} {activeInfo.description}
        </div>
      )}
    </div>
  );
}
