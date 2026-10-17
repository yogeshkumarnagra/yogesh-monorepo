"use client";
import { useState } from "react";
import { DialogScene, PipelineMode, StepName } from "./types";

interface Props {
  mode: PipelineMode;
  dialogScenes: DialogScene[];
  story: string;
  scenes: string[];
  title: string;
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  getStatus: (key: StepName) => string;
}

export default function DialogPanel({ mode, dialogScenes, story, scenes, title, activeIdx, setActiveIdx, getStatus }: Props) {
  const [showJson, setShowJson] = useState(false);

  if (mode === "chatgpt" || mode === "capcut") {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <span>💬</span>
          <h2 className="font-bold text-sm text-slate-700">Dialog JSON</h2>
          {dialogScenes.length > 0 && (
            <span className="ml-1 text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 font-semibold">
              {dialogScenes.length} scenes
            </span>
          )}
          {dialogScenes.length > 0 && <span className="ml-auto text-emerald-500 text-xs font-semibold">✅ Generated</span>}
          {getStatus("dialog") === "active" && <span className="ml-auto text-rose-400 text-xs animate-pulse font-semibold">⏳ Generating...</span>}
          {dialogScenes.length > 0 && (
            <button
              onClick={() => setShowJson(v => !v)}
              className="ml-2 text-xs text-slate-400 hover:text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5 transition-all"
            >
              {showJson ? "Hide" : "Show"} JSON
            </button>
          )}
        </div>

        {dialogScenes.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm italic">
            <div className="text-3xl mb-2">💬</div>
            Dialog JSON will appear here after generation...
          </div>
        ) : showJson ? (
          <pre className="p-4 text-xs text-emerald-700 overflow-auto max-h-80 bg-emerald-50 font-mono">
            {JSON.stringify(dialogScenes, null, 2)}
          </pre>
        ) : (
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {dialogScenes.map((s, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">Scene {s.scene}</span>
                  <span className="text-xs text-slate-500">{s.setting}</span>
                </div>
                {s.dialog.map((d, j) => (
                  <div key={j} className="flex gap-2 text-xs">
                    <span className="text-rose-500 font-bold shrink-0">{d.character}:</span>
                    <span className="text-slate-700">{d.line}</span>
                    <span className="text-slate-400 italic shrink-0">({d.emotion})</span>
                  </div>
                ))}
                <div className="text-xs text-slate-400 border-t border-amber-100 pt-1.5">
                  🎥 {s.camera}
                </div>
                <div className="text-xs text-slate-500 italic">🎙️ {s.narration}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Ollama mode - story text
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
        <span>📖</span>
        <h2 className="font-bold text-sm text-slate-700">Generated Story</h2>
        {title && <span className="ml-2 text-rose-500 text-xs font-semibold">— {title}</span>}
        {getStatus("story") === "done" && <span className="ml-auto text-emerald-500 text-xs font-semibold">✅ Done</span>}
        {getStatus("story") === "active" && <span className="ml-auto text-rose-400 text-xs animate-pulse">⏳ Generating...</span>}
      </div>
      {scenes.length > 1 && (
        <div className="flex gap-1 px-5 pt-3 flex-wrap">
          <button onClick={() => setActiveIdx(-1)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${activeIdx === -1 ? "bg-rose-400 text-white" : "bg-slate-100 text-slate-500 hover:bg-rose-50"}`}>
            Full Story
          </button>
          {scenes.map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${activeIdx === i ? "bg-rose-400 text-white" : "bg-slate-100 text-slate-500 hover:bg-rose-50"}`}>
              Scene {i+1}
            </button>
          ))}
        </div>
      )}
      <div className="p-5 min-h-[120px] max-h-72 overflow-y-auto">
        {story ? (
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {activeIdx >= 0 && scenes.length > 1 ? scenes[activeIdx] : story}
          </p>
        ) : (
          <p className="text-slate-400 text-sm italic text-center mt-6">Story will appear here after generation...</p>
        )}
      </div>
    </div>
  );
}
