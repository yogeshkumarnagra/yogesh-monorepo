"use client";
import { PipelineConfig, PipelineMode, PREDEFINED_CHARACTERS } from "./types";

interface Props {
  config: PipelineConfig;
  mode: PipelineMode;
  onChange: (k: keyof PipelineConfig, v: string | number) => void;
  onAddChar: () => void;
  onRemoveChar: (id: string) => void;
  onChangeChar: (id: string, k: string, v: string) => void;
}

export default function StoryInput({ config, mode, onChange, onAddChar, onRemoveChar, onChangeChar }: Props) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-rose-100 p-6 space-y-5">
      <h2 className="text-sm font-bold text-rose-500 uppercase tracking-widest">✍️ Story Input</h2>

      {/* Main story input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">
          Story / Action Description <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={4}
          value={config.storyInput}
          onChange={e => onChange("storyInput", e.target.value)}
          placeholder="e.g. Guddu finds an abandoned puppy in the park on a rainy evening. She takes it home and names it Bruno. They become best friends..."
          className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none"
        />
        <p className="text-xs text-slate-400">This will be used to generate the dialog JSON and voiceover.</p>
      </div>

      {/* Row: title, environment, scenes, language */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Title <span className="text-slate-300">(optional)</span></label>
          <input
            type="text" value={config.title}
            onChange={e => onChange("title", e.target.value)}
            placeholder="e.g. Guddu aur Bruno"
            className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Setting</label>
          <input
            type="text" value={config.environment}
            onChange={e => onChange("environment", e.target.value)}
            placeholder="e.g. park, rainy"
            className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Scenes</label>
          <select
            value={config.scenes} onChange={e => onChange("scenes", Number(e.target.value))}
            className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-rose-400"
          >
            {[2,3,4,5,6,8].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">Language</label>
          <select
            value={config.language} onChange={e => onChange("language", e.target.value)}
            className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-rose-400"
          >
            <option value="hindi">Hindi</option>
            <option value="hinglish">Hinglish</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>

      {/* fal model - chatgpt mode only */}
      {mode === "chatgpt" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">fal.ai Video Model</label>
          <select
            value={config.falModel} onChange={e => onChange("falModel", e.target.value)}
            className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-400"
          >
            <option value="fal-ai/kling-video/v1.6/standard/image-to-video">Kling 1.6 Standard (~$0.045/clip)</option>
            <option value="fal-ai/kling-video/v1.6/pro/image-to-video">Kling 1.6 Pro (~$0.09/clip)</option>
            <option value="fal-ai/minimax/video-01/image-to-video">Minimax Video-01 (~$0.05/clip)</option>
            <option value="fal-ai/luma-dream-machine/image-to-video">Luma Dream Machine (~$0.05/clip)</option>
          </select>
        </div>
      )}

      {/* Characters */}
      <CharactersSection
        characters={config.characters}
        predefined={PREDEFINED_CHARACTERS}
        onAdd={onAddChar}
        onRemove={onRemoveChar}
        onChange={onChangeChar}
      />
    </div>
  );
}

function CharactersSection({ characters, predefined, onAdd, onRemove, onChange }: {
  characters: PipelineConfig["characters"];
  predefined: PipelineConfig["characters"];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, k: string, v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">👥 Characters</label>
        <button
          onClick={onAdd}
          className="text-xs px-3 py-1 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full font-semibold shadow hover:shadow-md transition-all"
        >
          + Add Character
        </button>
      </div>

      {/* Predefined character chips */}
      <div className="flex gap-2 flex-wrap">
        {predefined.map(p => (
          <span key={p.id} className="flex items-center gap-1 text-xs bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200 rounded-full px-3 py-1 font-medium">
            {p.isMain ? "⭐" : "🐾"} {p.name}
            <span className="text-rose-400 ml-1">(preset)</span>
          </span>
        ))}
      </div>

      {/* Character cards */}
      {characters.map(char => (
        <div key={char.id} className={`rounded-xl border p-4 space-y-3 ${
          char.isMain ? "border-rose-300 bg-gradient-to-br from-rose-50 to-pink-50" : "border-slate-200 bg-slate-50"
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${char.isMain ? "text-rose-500" : "text-slate-500"}`}>
              {char.isMain ? "⭐ Main Character" : "👤 Side Character"}
            </span>
            {!char.isMain && (
              <button onClick={() => onRemove(char.id)} className="text-xs text-red-400 hover:text-red-500">✕ Remove</button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Name</label>
              <input
                type="text" value={char.name}
                onChange={e => onChange(char.id, "name", e.target.value)}
                placeholder={char.isMain ? "Guddu" : "Character name"}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-rose-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Age</label>
              <input
                type="number" min={1} max={100} value={char.age}
                onChange={e => onChange(char.id, "age", e.target.value)}
                placeholder="20"
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-rose-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Gender</label>
              <div className="flex gap-2">
                {(["girl","boy"] as const).map(g => (
                  <button key={g} onClick={() => onChange(char.id, "gender", g)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      char.gender === g
                        ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white border-rose-300"
                        : "bg-white border-slate-200 text-slate-500 hover:border-rose-200"
                    }`}
                  >
                    {g === "girl" ? "👧" : "👦"} {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Physical Description</label>
            <textarea
              rows={char.isMain ? 2 : 1} value={char.description}
              onChange={e => onChange(char.id, "description", e.target.value)}
              placeholder={char.isMain ? "fair skin, blue eyes..." : "tall, grey beard..."}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-rose-300 resize-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
