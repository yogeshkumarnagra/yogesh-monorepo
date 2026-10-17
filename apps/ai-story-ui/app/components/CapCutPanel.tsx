"use client";
import { CapCutManifest, YTMeta } from "./types";

interface Props {
  folder: string;
  manifest: CapCutManifest;
  ytMeta: YTMeta;
  totalDuration: number;
}

export default function CapCutPanel({ folder, manifest, ytMeta, totalDuration }: Props) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-emerald-200 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <span>✂️</span>
        <h2 className="font-bold text-sm text-slate-700">CapCut Export Package</h2>
        <span className="ml-auto text-emerald-500 text-xs font-bold">✅ Ready</span>
      </div>
      <div className="p-5 space-y-4">

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">⏱️ Estimated duration:</span>
          <span className="text-sm font-bold text-emerald-600">{totalDuration}s</span>
        </div>

        {/* Track slots */}
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CapCut Track Slots</p>
          {manifest.tracks.video.map(slot => (
            <div key={slot.slot} className="flex items-center gap-2 text-xs bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
              <span className="text-emerald-600 font-bold w-14 shrink-0">Scene {slot.slot}</span>
              <span className="text-slate-600 font-mono">{slot.file}</span>
              <span className="ml-auto text-slate-400">{slot.duration_sec}s</span>
            </div>
          ))}
        </div>

        {/* CapCut steps */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">CapCut Steps</p>
          {manifest.capcut_steps.map((step, i) => (
            <p key={i} className="text-xs text-slate-600 flex gap-2">
              <span className="text-emerald-400 shrink-0">→</span>{step}
            </p>
          ))}
        </div>

        {/* YouTube metadata */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">📤 YouTube Upload</p>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl p-3 space-y-1 text-xs">
            <p><span className="text-slate-400">Title:</span> <span className="text-slate-800 font-medium">{ytMeta.title}</span></p>
            <p><span className="text-slate-400">Tags:</span> <span className="text-rose-500">{ytMeta.tags.slice(0,6).join(", ")}</span></p>
            <p className="text-slate-400 italic">{ytMeta.thumbnail_hint}</p>
          </div>
          {ytMeta.upload_steps.map((step, i) => (
            <p key={i} className="text-xs text-slate-500 flex gap-2">
              <span className="text-red-300 shrink-0">→</span>{step}
            </p>
          ))}
        </div>

        {/* Files saved */}
        <div className="bg-slate-800 rounded-xl px-4 py-3 font-mono text-xs space-y-0.5">
          <p className="text-emerald-400 font-bold">output/{folder}/</p>
          <p className="text-slate-400">├── scene_1.png … scene_N.png</p>
          <p className="text-slate-400">├── scene_1_narration.mp3 …</p>
          <p className="text-slate-400">├── subtitles.srt</p>
          <p className="text-slate-400">├── capcut_manifest.json</p>
          <p className="text-slate-400">├── youtube_metadata.json</p>
          <p className="text-slate-400">└── README.txt</p>
        </div>
      </div>
    </div>
  );
}
