"use client";
import { PipelineMode, StepName } from "./types";

interface Props {
  audioSrc: string;
  videoSrc: string;
  mode: PipelineMode;
  getStatus: (key: StepName) => string;
}

export default function MediaPanel({ audioSrc, videoSrc, mode, getStatus }: Props) {
  return (
    <div className="space-y-4">
      {/* Audio */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-blue-50">
          <span>🎙️</span>
          <h2 className="font-bold text-sm text-slate-700">Voice Narration</h2>
          <span className="text-xs text-slate-400">(Leda voice)</span>
          {getStatus("audio") === "done"   && <span className="ml-auto text-emerald-500 text-xs font-semibold">✅ Ready</span>}
          {getStatus("audio") === "active" && <span className="ml-auto text-rose-400 text-xs animate-pulse font-semibold">⏳ Generating...</span>}
        </div>
        <div className="p-5 min-h-[72px] flex items-center justify-center">
          {audioSrc ? (
            <audio controls className="w-full accent-rose-400" src={audioSrc} />
          ) : (
            <div className="text-slate-300 text-sm text-center">
              <div className="text-3xl mb-1">🎵</div>
              <p>Voiceover will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Video */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-fuchsia-50 to-pink-50">
          <span>🎬</span>
          <h2 className="font-bold text-sm text-slate-700">
            {mode === "chatgpt" ? "fal.ai Animated Video" : "Generated Video"}
          </h2>
          {(getStatus("video") === "done" || getStatus("falvideo") === "done")   && <span className="ml-auto text-emerald-500 text-xs font-semibold">✅ Saved</span>}
          {(getStatus("video") === "active" || getStatus("falvideo") === "active") && <span className="ml-auto text-rose-400 text-xs animate-pulse font-semibold">⏳ Creating...</span>}
        </div>
        <div className="p-5 flex items-center justify-center min-h-48">
          {videoSrc ? (
            <video controls className="w-full rounded-xl max-h-64" src={videoSrc} />
          ) : (
            <div className="text-slate-300 text-sm text-center">
              <div className="text-3xl mb-1">🎥</div>
              <p>Video preview will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
