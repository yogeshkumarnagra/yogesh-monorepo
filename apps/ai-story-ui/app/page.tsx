"use client";
import { useState } from "react";
import axios from "axios";
import {
  PipelineMode, StepName, PipelineConfig, PipelineData, DialogScene,
  DEFAULT_CONFIG, EMPTY_DATA,
  OLLAMA_STEPS, CHATGPT_STEPS, CAPCUT_STEPS,
} from "./components/types";
import StoryInput   from "./components/StoryInput";
import ProgressBar  from "./components/ProgressBar";
import DialogPanel  from "./components/DialogPanel";
import ImagesPanel  from "./components/ImagesPanel";
import MediaPanel   from "./components/MediaPanel";
import CapCutPanel  from "./components/CapCutPanel";
import LogPanel     from "./components/LogPanel";

export default function Home() {
  const [mode, setMode]               = useState<PipelineMode>("chatgpt");
  const [config, setConfig]           = useState<PipelineConfig>(DEFAULT_CONFIG);
  const [currentStep, setCurrentStep] = useState<StepName>("idle");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [logs, setLogs]               = useState<{ time: string; message: string; type: "info"|"success"|"error" }[]>([]);
  const [data, setData]               = useState<PipelineData>(EMPTY_DATA);
  const [activeIdx, setActiveIdx]     = useState(0);

  const STEPS = mode === "chatgpt" ? CHATGPT_STEPS : mode === "capcut" ? CAPCUT_STEPS : OLLAMA_STEPS;

  const log = (message: string, type: "info"|"success"|"error" = "info") =>
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message, type }]);

  const call = async (step: string, body = {}) => {
    const res = await axios.post("/api/pipeline", { step, ...body });
    if (!res.data.success) throw new Error(res.data.error);
    return res.data;
  };

  const setField = (k: keyof PipelineConfig, v: string | number) =>
    setConfig(prev => ({ ...prev, [k]: v }));

  const setChar = (id: string, k: string, v: string) =>
    setConfig(prev => ({
      ...prev,
      characters: prev.characters.map(c => c.id === id ? { ...c, [k]: v } : c),
    }));

  const addChar = () =>
    setConfig(prev => ({
      ...prev,
      characters: [...prev.characters, { id: Date.now().toString(), name: "", age: "", gender: "boy" as const, description: "", isMain: false }],
    }));

  const removeChar = (id: string) =>
    setConfig(prev => ({ ...prev, characters: prev.characters.filter(c => c.id !== id) }));

  const resolved = {
    ...config,
    characters: config.characters.map(c => c.isMain ? { ...c, name: c.name.trim() || "Guddu" } : c),
  };

  // ── Ollama pipeline ─────────────────────────────────────────────
  const runOllama = async () => {
    setCurrentStep("story"); log("Generating story with Llama 3...");
    const sd = await call("story", { config: { ...resolved, storyInput: config.storyInput } });
    const { story, scenes, character, title, folder } = sd;
    setData(p => ({ ...p, story, scenes: scenes || [], character, title, folder }));
    log(`Story: ${title}`, "success");

    setCurrentStep("image"); log(`Generating ${scenes?.length} scene images...`);
    const imgData = await call("image", { character, scenes, folder, environment: config.environment, characterType: config.characterType });
    const ts = Date.now();
    setData(p => ({ ...p, imagePaths: (imgData.imagePaths||[]).map((x:string) => `/api/file?path=${encodeURIComponent(x)}&t=${ts}`) }));
    log(`${imgData.imagePaths?.length} images saved!`, "success");

    setCurrentStep("audio"); log("Generating voice narration...");
    await call("audio", { story, folder, scenes });
    setData(p => ({ ...p, audioSrc: `/api/file?path=${encodeURIComponent(folder+"/narration.mp3")}&t=${Date.now()}` }));
    log("Audio saved!", "success");

    setCurrentStep("video"); log("Creating video...");
    await call("video", { folder, imagePaths: imgData.imagePaths, sceneAudioPaths: (scenes||[]).map((_:string,i:number) => `${folder}/scene_${i+1}_narration.mp3`) });
    setData(p => ({ ...p, videoSrc: `/api/file?path=${encodeURIComponent(folder+"/story_video.mp4")}&t=${Date.now()}` }));
    log("Video saved!", "success");
  };

  // ── ChatGPT + fal.ai pipeline ────────────────────────────────────
  const runChatGPT = async () => {
    setCurrentStep("dialog"); log("Generating dialog JSON with ChatGPT...");
    const dd = await call("dialog", { config: { ...resolved, storyInput: config.storyInput } });
    const { title, folder, scenes: dScenes } = dd;
    const narrations = dScenes.map((s:DialogScene) => s.narration);
    const imgPrompts = dScenes.map((s:DialogScene) => s.image_prompt);
    setData(p => ({ ...p, title, folder, dialogScenes: dScenes, scenes: narrations }));
    log(`Dialog ready! ${dScenes.length} scenes`, "success");

    setCurrentStep("image"); log("Generating scene images...");
    const mainChar = resolved.characters.find(c => c.isMain);
    const charDesc = mainChar ? `${mainChar.name}, ${mainChar.description}` : "Guddu, fair skin, blue eyes";
    const imgData = await call("image", { character: charDesc, scenes: imgPrompts, folder, environment: config.environment, characterType: "specific" });
    const ts = Date.now();
    setData(p => ({ ...p, imagePaths: (imgData.imagePaths||[]).map((x:string) => `/api/file?path=${encodeURIComponent(x)}&t=${ts}`) }));
    log(`${imgData.imagePaths?.length} images saved!`, "success");

    setCurrentStep("audio"); log("Generating voice narration (Leda)...");
    await call("audio", { story: narrations.join("\n\n"), folder, scenes: narrations });
    setData(p => ({ ...p, audioSrc: `/api/file?path=${encodeURIComponent(folder+"/narration.mp3")}&t=${Date.now()}` }));
    log("Voiceover saved!", "success");

    setCurrentStep("falvideo"); log("Animating scenes with fal.ai...");
    await call("falvideo", { folder, scenes: dScenes, imagePaths: imgData.imagePaths, sceneAudioPaths: dScenes.map((_:DialogScene,i:number) => `${folder}/scene_${i+1}_narration.mp3`), falModel: config.falModel });
    setData(p => ({ ...p, videoSrc: `/api/file?path=${encodeURIComponent(folder+"/story_video.mp4")}&t=${Date.now()}` }));
    log("Animated video saved!", "success");
  };

  // ── CapCut Export pipeline ───────────────────────────────────────
  const runCapCut = async () => {
    setCurrentStep("dialog"); log("Generating script with ChatGPT...");
    const dd = await call("dialog", { config: { ...resolved, storyInput: config.storyInput } });
    const { title, folder, scenes: dScenes } = dd;
    const narrations = dScenes.map((s:DialogScene) => s.narration);
    const imgPrompts = dScenes.map((s:DialogScene) => s.image_prompt);
    setData(p => ({ ...p, title, folder, dialogScenes: dScenes, scenes: narrations }));
    log(`Script ready! ${dScenes.length} scenes`, "success");

    setCurrentStep("image"); log("Generating scene images...");
    const mainChar = resolved.characters.find(c => c.isMain);
    const charDesc = mainChar ? `${mainChar.name}, ${mainChar.description}` : "Guddu, fair skin, blue eyes";
    const imgData = await call("image", { character: charDesc, scenes: imgPrompts, folder, environment: config.environment, characterType: "specific" });
    const ts = Date.now();
    setData(p => ({ ...p, imagePaths: (imgData.imagePaths||[]).map((x:string) => `/api/file?path=${encodeURIComponent(x)}&t=${ts}`) }));
    log(`${imgData.imagePaths?.length} images saved!`, "success");

    setCurrentStep("audio"); log("Generating voice narration...");
    await call("audio", { story: narrations.join("\n\n"), folder, scenes: narrations });
    setData(p => ({ ...p, audioSrc: `/api/file?path=${encodeURIComponent(folder+"/narration.mp3")}&t=${Date.now()}` }));
    log("Voiceover saved!", "success");

    setCurrentStep("capcut"); log("Exporting CapCut package...");
    const cc = await call("capcut", { folder, title, scenes: dScenes, imagePaths: imgData.imagePaths, sceneAudioPaths: dScenes.map((_:DialogScene,i:number) => `${folder}/scene_${i+1}_narration.mp3`), characters: resolved.characters, language: config.language, environment: config.environment });
    setData(p => ({ ...p, capcut: { manifest: cc.manifest, yt_meta: cc.yt_meta, total_duration: cc.total_duration } }));
    log(`CapCut package ready! ~${cc.total_duration}s`, "success");
  };

  const runPipeline = async () => {
    setError(""); setLoading(true); setLogs([]); setData(EMPTY_DATA); setActiveIdx(0);
    try {
      if (mode === "chatgpt") await runChatGPT();
      else if (mode === "capcut") await runCapCut();
      else await runOllama();
      setCurrentStep("done");
      log("Pipeline completed! 🎉", "success");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg); log(`Error: ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (key: StepName): "done" | "active" | "pending" => {
    const order: StepName[] =
      mode === "chatgpt" ? ["dialog","image","audio","falvideo","done"] :
      mode === "capcut"  ? ["dialog","image","audio","capcut","done"] :
                           ["story","image","audio","video","done"];
    const ci = order.indexOf(currentStep), si = order.indexOf(key);
    if (currentStep === "idle") return "pending";
    if (si < ci) return "done";
    if (si === ci) return "active";
    return "pending";
  };

  const showResults = data.story || data.imagePaths.length > 0 || data.dialogScenes.length > 0;

  const MODE_BTNS: { key: PipelineMode; label: string; active: string; }[] = [
    { key: "chatgpt", label: "✨ ChatGPT + fal.ai", active: "from-orange-400 to-rose-400" },
    { key: "capcut",  label: "✂️ CapCut Export",    active: "from-emerald-400 to-teal-400" },
    { key: "ollama",  label: "🧠 Ollama (Free)",    active: "from-violet-400 to-purple-400" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-rose-100 shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              🎬 Guddu Story Studio
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Type your story → Get dialog JSON + voiceover</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {MODE_BTNS.map(btn => (
              <button key={btn.key}
                onClick={() => { setMode(btn.key); setCurrentStep("idle"); }}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === btn.key
                    ? `bg-gradient-to-r ${btn.active} text-white shadow`
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button onClick={runPipeline} disabled={loading || !config.storyInput.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? "⏳ Running..." : currentStep === "done" ? "🔄 Run Again" : "▶ Generate"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Story Input + Config */}
        {(!loading && currentStep === "idle") || currentStep === "done" ? (
          <StoryInput
            config={config} mode={mode}
            onChange={setField}
            onAddChar={addChar}
            onRemoveChar={removeChar}
            onChangeChar={setChar}
          />
        ) : null}

        {/* Progress */}
        {(loading || currentStep !== "idle") && (
          <ProgressBar steps={STEPS} currentStep={currentStep} loading={loading} folder={data.folder} getStatus={getStatus} />
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-medium shadow">
            ❌ {error}
          </div>
        )}

        {/* Results grid */}
        {showResults && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-5">
              <DialogPanel
                mode={mode}
                dialogScenes={data.dialogScenes}
                story={data.story}
                scenes={data.scenes}
                title={data.title}
                activeIdx={activeIdx}
                setActiveIdx={setActiveIdx}
                getStatus={getStatus}
              />
              <ImagesPanel
                imagePaths={data.imagePaths}
                activeIdx={activeIdx}
                setActiveIdx={setActiveIdx}
                getStatus={getStatus}
              />
            </div>
            {/* Right */}
            <div className="space-y-5">
              <MediaPanel
                audioSrc={data.audioSrc}
                videoSrc={data.videoSrc}
                mode={mode}
                getStatus={getStatus}
              />
              {mode === "capcut" && data.capcut && (
                <CapCutPanel
                  folder={data.folder}
                  manifest={data.capcut.manifest}
                  ytMeta={data.capcut.yt_meta}
                  totalDuration={data.capcut.total_duration}
                />
              )}
              {/* Output folder tree */}
              {data.folder && (
                <div className="bg-slate-900 rounded-2xl shadow-lg px-5 py-4 font-mono text-xs space-y-0.5">
                  <p className="text-rose-400 font-bold mb-1">📁 output/{data.folder}/</p>
                  {data.scenes.map((_,i) => <p key={i} className="text-slate-400">├── scene_{i+1}.png + audio</p>)}
                  <p className="text-slate-400">├── narration.mp3</p>
                  {mode === "capcut" && <>
                    <p className="text-emerald-400">├── subtitles.srt</p>
                    <p className="text-emerald-400">├── capcut_manifest.json</p>
                    <p className="text-emerald-400">└── youtube_metadata.json</p>
                  </>}
                  {mode !== "capcut" && <p className="text-slate-400">└── story_video.mp4</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logs */}
        {(loading || logs.length > 0) && <LogPanel logs={logs} loading={loading} />}

      </div>
    </main>
  );
}
