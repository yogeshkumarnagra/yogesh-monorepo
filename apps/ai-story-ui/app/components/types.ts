/**
 * Re-exports all shared pipeline types from @yogesh/types.
 * App-specific constants (defaults, predefined characters, step defs)
 * remain here since they belong to this app only.
 */
export type {
  StepName,
  PipelineMode,
  Log,
  Character,
  DialogScene,
  PipelineConfig,
  CapCutSlot,
  CapCutManifest,
  YTMeta,
  PipelineData,
  StepDef,
} from "@yogesh/types/pipeline";

// ── App-specific constants ─────────────────────────────────────────────────
import type { Character, PipelineConfig, PipelineData } from "@yogesh/types/pipeline";

export const GUDDU_DEFAULT: Character = {
  id: "guddu", name: "Guddu", age: "20", gender: "girl", isMain: true,
  description:
    "fair skin, beautiful and cute face, dog lover, short nose, medium length hair, short height, " +
    "big round blue eyes with dark shade on eyebrows, pink smooth lips, wearing a trishul kada on wrist, " +
    "5 rings total (4 on fingers, 1 on thumb), a mark on front neck",
};

export const PREDEFINED_CHARACTERS: Character[] = [
  GUDDU_DEFAULT,
  {
    id: "puppy", name: "Whiskey", age: "1", gender: "boy", isMain: false,
    description: "small golden retriever puppy, fluffy, big brown eyes, always happy, named Whiskey",
  },
];

export const DEFAULT_CONFIG: PipelineConfig = {
  storyInput: "",
  title: "", environment: "park", scenes: 3,
  characterType: "specific", characters: [GUDDU_DEFAULT],
  language: "hindi", falModel: "fal-ai/kling-video/v1.6/standard/image-to-video",
};

export const EMPTY_DATA: PipelineData = {
  story: "", scenes: [], dialogScenes: [], character: "", title: "", folder: "",
  imagePaths: [], audioSrc: "", videoSrc: "", capcut: null,
};

export type StepDef = { key: import("@yogesh/types/pipeline").StepName; label: string; icon: string; description: string };

export const OLLAMA_STEPS: StepDef[] = [
  { key: "story",   label: "Story",    icon: "📖", description: "Generating story with Llama 3..." },
  { key: "image",   label: "Images",   icon: "🎨", description: "Generating scene images..." },
  { key: "audio",   label: "Audio",    icon: "🎙️", description: "Generating voice narration..." },
  { key: "video",   label: "Video",    icon: "🎬", description: "Creating video with MoviePy..." },
];
export const CHATGPT_STEPS: StepDef[] = [
  { key: "dialog",   label: "Script",   icon: "💬", description: "Generating dialog JSON with ChatGPT..." },
  { key: "image",    label: "Images",   icon: "🎨", description: "Generating scene images..." },
  { key: "audio",    label: "Audio",    icon: "🎙️", description: "Generating voice narration..." },
  { key: "falvideo", label: "AI Video", icon: "🎬", description: "Animating scenes with fal.ai..." },
];
export const CAPCUT_STEPS: StepDef[] = [
  { key: "dialog",  label: "Script",  icon: "📝", description: "Generating script with ChatGPT..." },
  { key: "image",   label: "Images",  icon: "🎨", description: "Generating scene images..." },
  { key: "audio",   label: "Audio",   icon: "🎙️", description: "Generating voice narration..." },
  { key: "capcut",  label: "Export",  icon: "✂️",  description: "Exporting CapCut package..." },
];
