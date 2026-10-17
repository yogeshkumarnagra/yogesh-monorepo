// ─── Pipeline shared types (lifted from ai-story-ui) ────────────────────────
// Any app that talks to the AI story pipeline imports from here.

export type StepName =
  | "idle" | "story" | "dialog" | "image"
  | "audio" | "video" | "falvideo" | "capcut" | "done";

export type PipelineMode = "ollama" | "chatgpt" | "capcut";

export interface Log {
  time: string;
  message: string;
  type: "info" | "success" | "error";
}

export interface Character {
  id: string;
  name: string;
  age: string;
  gender: "boy" | "girl";
  description: string;
  isMain: boolean;
}

export interface DialogScene {
  scene: number;
  setting: string;
  characters: string[];
  dialog: {
    character: string;
    line: string;
    emotion: string;
    action: string;
  }[];
  camera: string;
  image_prompt: string;
  narration: string;
}

export interface PipelineConfig {
  storyInput: string;
  title: string;
  environment: string;
  scenes: number;
  characterType: "common" | "specific";
  characters: Character[];
  language: string;
  falModel: string;
}

export interface CapCutSlot {
  slot: number;
  file: string;
  duration_sec: number;
  start_sec: number;
  setting: string;
  camera_hint: string;
}

export interface CapCutManifest {
  title: string;
  total_scenes: number;
  estimated_total_duration_sec: number;
  capcut_steps: string[];
  tracks: { video: CapCutSlot[]; subtitle: string };
}

export interface YTMeta {
  title: string;
  description: string;
  tags: string[];
  thumbnail_hint: string;
  upload_steps: string[];
}

export interface PipelineData {
  story: string;
  scenes: string[];
  dialogScenes: DialogScene[];
  character: string;
  title: string;
  folder: string;
  imagePaths: string[];
  audioSrc: string;
  videoSrc: string;
  capcut: {
    manifest: CapCutManifest;
    yt_meta: YTMeta;
    total_duration: number;
  } | null;
}

export type StepDef = {
  key: StepName;
  label: string;
  icon: string;
  description: string;
};
