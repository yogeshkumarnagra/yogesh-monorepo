"use client";
import { StepName } from "./types";

interface Props {
  imagePaths: string[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  getStatus: (key: StepName) => string;
  label?: string;
}

export default function ImagesPanel({ imagePaths, activeIdx, setActiveIdx, getStatus, label }: Props) {
  const displayIdx = activeIdx >= 0 ? Math.min(activeIdx, imagePaths.length - 1) : 0;

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
        <span>🎨</span>
        <h2 className="font-bold text-sm text-slate-700">{label || `Scene Images (${imagePaths.length})`}</h2>
        {getStatus("image") === "done"   && <span className="ml-auto text-emerald-500 text-xs font-semibold">✅ Saved</span>}
        {getStatus("image") === "active" && <span className="ml-auto text-rose-400 text-xs animate-pulse font-semibold">⏳ Generating...</span>}
      </div>
      <div className="p-5">
        {imagePaths.length > 0 ? (
          <div className="space-y-3">
            {imagePaths.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {imagePaths.map((src, i) => (
                  <button key={i} onClick={() => setActiveIdx(i)}
                    className={`border-2 rounded-xl overflow-hidden transition-all ${activeIdx === i ? "border-rose-400 shadow-md" : "border-slate-200 hover:border-rose-200"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Scene ${i+1}`} className="w-16 h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center rounded-xl overflow-hidden bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePaths[displayIdx]} alt="Scene" className="max-h-64 object-contain w-full" />
            </div>
            {imagePaths.length > 1 && (
              <p className="text-center text-xs text-slate-400 font-medium">
                Scene {displayIdx + 1} of {imagePaths.length}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-40 text-slate-300">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm">Images will appear here</p>
            {getStatus("image") === "active" && (
              <p className="text-rose-400 text-xs mt-1 animate-pulse">Generating with AI...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
