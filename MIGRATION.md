# Monorepo Migration Guide

## Final Structure

```
yogesh-monorepo/
├── package.json                   ← root (workspaces, all dev commands)
├── .gitignore
│
├── packages/                      ← shared libraries (build FIRST)
│   ├── config/                    ← @yogesh/config
│   │   ├── tsconfig/
│   │   │   ├── base.json          ← shared TS base
│   │   │   ├── nextjs.json        ← for Next.js apps
│   │   │   └── library.json       ← for buildable packages
│   │   └── eslint/index.mjs       ← shared ESLint flat config
│   │
│   ├── types/                     ← @yogesh/types
│   │   └── src/
│   │       ├── pipeline.ts        ← all AI pipeline types
│   │       ├── youtube.ts         ← youtube bot types
│   │       └── index.ts
│   │
│   ├── utils/                     ← @yogesh/utils
│   │   └── src/
│   │       ├── retry.ts           ← withRetry()
│   │       ├── cn.ts              ← classname helper
│   │       ├── voice-map.ts       ← language → Azure TTS voice
│   │       └── index.ts
│   │
│   └── ui/                        ← @yogesh/ui
│       └── src/
│           ├── Button.tsx
│           ├── Badge.tsx
│           ├── Card.tsx
│           ├── LogPanel.tsx
│           ├── ProgressBar.tsx
│           └── index.ts
│
└── apps/                          ← individual projects
    ├── portfolio/                 ← @yogesh/portfolio  (port 3000)
    ├── ai-story-ui/               ← @yogesh/ai-story-ui (port 3001)
    └── ai-youtube-bot/            ← @yogesh/ai-youtube-bot (Node.js)
```

---

## Step 1: Copy Your Existing App Code

### portfolio
Copy the source code from `d:\MyData\Projects\portfolio-next\` into `apps/portfolio/`:
```
apps/portfolio/app/          ← copy from portfolio-next/app/
apps/portfolio/components/   ← copy from portfolio-next/components/
apps/portfolio/lib/          ← copy from portfolio-next/lib/
apps/portfolio/public/       ← copy from portfolio-next/public/ (if any)
apps/portfolio/tailwind.config.ts   ← keep app-level tailwind config
apps/portfolio/postcss.config.mjs
```
The `package.json`, `tsconfig.json`, `next.config.ts` are already created in the monorepo — do NOT copy these from the old project.

### ai-story-ui
Copy source from `d:\MyData\Projects\AI\ai-story-ui\` into `apps/ai-story-ui/`:
```
apps/ai-story-ui/app/        ← copy from ai-story-ui/app/
apps/ai-story-ui/public/     ← copy from ai-story-ui/public/
apps/ai-story-ui/tailwind.config equivalent (globals.css has tailwind v4 config)
```

**Update one import** in `apps/ai-story-ui/app/components/types.ts` — the types have moved:
```ts
// BEFORE (in app/components/types.ts)
export type StepName = ...   ← remove, it now lives in @yogesh/types

// apps/ai-story-ui/app/page.tsx — update imports:
// BEFORE:
import { PipelineMode, StepName, ... } from "./components/types";
// AFTER:
import { PipelineMode, StepName, ... } from "@yogesh/types/pipeline";
```

### ai-youtube-bot
Copy source from `d:\MyData\Projects\AI\ai-youtube-bot\` into `apps/ai-youtube-bot/`:
```
apps/ai-youtube-bot/main.js
apps/ai-youtube-bot/pipeline.js
apps/ai-youtube-bot/modules/
apps/ai-youtube-bot/config/
apps/ai-youtube-bot/stories/      ← output dirs
apps/ai-youtube-bot/prompts/
```
Do NOT copy `node_modules/` or `package.json` (already created).

---

## Step 2: Install Everything (run ONCE from root)

```bash
cd "d:\MyData\Projects\yogesh-monorepo"
npm install
```

This installs ALL packages for ALL apps in a single `node_modules/` at the root.
No more `npm install` inside individual app folders.

---

## Step 3: Build Shared Packages First

```bash
npm run build:packages
```

This compiles `@yogesh/types`, `@yogesh/utils`, and `@yogesh/ui` into their `dist/` folders.
Run this once, and again whenever you change code in `packages/`.

---

## Step 4: Per-Project Commands

### Development
```bash
# Run portfolio (localhost:3000)
npm run dev:portfolio

# Run ai-story-ui (localhost:3001)
npm run dev:story-ui

# Run ai-youtube-bot
npm run dev:youtube-bot
```

### Build for production
```bash
# Build ONE app
npm run build:portfolio
npm run build:story-ui

# Build ALL apps (packages built first automatically)
npm run build
```

### Serve production build
```bash
npm run start:portfolio
npm run start:story-ui
npm run start:youtube-bot
```

### Run a custom npm script in any workspace
```bash
npm run <script> --workspace=apps/portfolio
npm run <script> --workspace=packages/utils
```

---

## Step 5: Using Shared Packages in App Code

### Import shared types
```ts
import { PipelineConfig, DialogScene } from "@yogesh/types/pipeline";
import { StoryOutput } from "@yogesh/types/youtube";
```

### Import shared utilities
```ts
import { withRetry, cn, getVoice } from "@yogesh/utils";
```

### Import shared UI components
```tsx
import { Button, Card, Badge, LogPanel, ProgressBar } from "@yogesh/ui";
```

---

## Step 6: Adding a New App

1. Create `apps/my-new-app/package.json` with `"name": "@yogesh/my-new-app"`
2. Add its scripts to root `package.json`
3. Run `npm install` from root

---

## Key Rules

| Rule | Why |
|---|---|
| Always `npm install` from **root** | Workspaces hoist deps to root `node_modules/` |
| Never `npm install` inside `apps/` | Breaks workspace hoisting |
| Run `build:packages` before `build:apps` | Apps depend on compiled packages |
| Each Next.js app runs on a **different port** | portfolio=3000, ai-story-ui=3001 |
| Python projects stay separate | `ai-story-pipeline`, `ai-trading`, `job-autobot` are Python — not part of npm workspaces |
