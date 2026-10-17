import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFileSync, existsSync, unlinkSync } from "fs";
import { join } from "path";

const PIPELINE_DIR = "D:\\MyData\\Projects\\AI\\ai-story-pipeline";
const PYTHON = PIPELINE_DIR + "\\venv\\Scripts\\python.exe";
const ARGS_FILE = join(PIPELINE_DIR, "_tmp_args.json");
const TMP_SCRIPT = join(PIPELINE_DIR, "_tmp_run.py");

function run(lines: string[]): Promise<string> {
  const script = lines.join("\n");
  writeFileSync(TMP_SCRIPT, script, "utf8");
  return new Promise((resolve, reject) => {
    exec(
      `"${PYTHON}" "${TMP_SCRIPT}"`,
      {
        cwd: PIPELINE_DIR,
        timeout: 600000,  // 10 min — dialog step may retry on 429
        maxBuffer: 100 * 1024 * 1024,
        encoding: "utf8",
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1",
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          writeFileSync(
            join(PIPELINE_DIR, "_last_error.txt"),
            "STDERR:\n" + stderr + "\n\nSTDOUT:\n" + stdout + "\n\nSCRIPT:\n" + script,
            "utf8"
          );
          reject(new Error((stderr || stdout || err.message).slice(0, 2000).trim()));
        } else {
          try { unlinkSync(TMP_SCRIPT); } catch {}
          resolve(stdout.trim());
        }
      }
    );
  });
}

function writeArgs(data: unknown) {
  writeFileSync(ARGS_FILE, JSON.stringify(data), "utf8");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { step } = body;

  try {
    if (step === "story") {
      writeArgs(body.config || {});
      const output = await run([
        "import json, os, sys",
        "sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
        "sys.stderr.reconfigure(encoding='utf-8', errors='replace')",
        "with open('_tmp_args.json', encoding='utf-8') as fh:",
        "    config = json.load(fh)",
        "from story_generator import generate_story",
        "result = generate_story(config)",
        "out_folder = 'output/' + result['folder']",
        "os.makedirs(out_folder, exist_ok=True)",
        "with open(out_folder + '/story.txt', 'w', encoding='utf-8') as fh:",
        "    fh.write('Title: ' + result['title'] + '\\n\\n')",
        "    fh.write('Config:\\n' + json.dumps(config, ensure_ascii=False, indent=2) + '\\n\\n')",
        "    fh.write(result['story'])",
        "print(json.dumps(result, ensure_ascii=False))",
      ]);
      return NextResponse.json({ success: true, ...JSON.parse(output) });
    }

    if (step === "image") {
      const { character, scenes, folder, environment, characterType } = body;
      writeArgs({ character, scenes, folder, environment, characterType });
      if (characterType === "common") {
        await run([
          "import json",
          "with open('_tmp_args.json', encoding='utf-8') as fh:",
          "    a = json.load(fh)",
          "from image_generator import generate_character_image",
          "generate_character_image(a['character'], 'output/' + a['folder'])",
          "print('ok')",
        ]);
        return NextResponse.json({ success: true, imagePaths: [`${folder}/character.png`] });
      } else {
        await run([
          "import json",
          "with open('_tmp_args.json', encoding='utf-8') as fh:",
          "    a = json.load(fh)",
          "from image_generator import generate_scene_images",
          "generate_scene_images(a['scenes'], a['character'], a.get('environment', 'fantasy'), 'output/' + a['folder'])",
          "print('ok')",
        ]);
        const imagePaths = (scenes || []).map((_: string, i: number) => `${folder}/scene_${i + 1}.png`);
        return NextResponse.json({ success: true, imagePaths });
      }
    }

    if (step === "audio") {
      const { story, folder, scenes } = body;
      writeArgs({ story, folder, scenes: scenes || [] });
      await run([
        "import json, sys, contextlib",
        "with open('_tmp_args.json', encoding='utf-8') as fh:",
        "    a = json.load(fh)",
        "with contextlib.redirect_stdout(sys.stderr):",
        "    from audio_generator import generate_scene_narrations",
        "    generate_scene_narrations(a.get('scenes') or [a['story']], 'output/' + a['folder'])",
        "print('ok')",
      ]);
      return NextResponse.json({ success: true, audioPath: `${folder}/narration.mp3` });
    }

    if (step === "video") {
      const { folder, imagePaths, sceneAudioPaths } = body;
      // imagePaths arrive as e.g. ["FolderName/scene_1.png"] — prepend output/ in Python
      // sceneAudioPaths arrive as e.g. ["FolderName/scene_1_narration.mp3"] — prepend output/ in Python
      writeArgs({
        folder,
        imagePaths: imagePaths || [`${folder}/character.png`],
        sceneAudioPaths: sceneAudioPaths || [],
      });
      await run([
        "import json, sys, contextlib",
        "sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
        "sys.stderr.reconfigure(encoding='utf-8', errors='replace')",
        "with open('_tmp_args.json', encoding='utf-8') as fh:",
        "    a = json.load(fh)",
        "from video_generator import generate_video",
        "img_paths  = ['output/' + p for p in a['imagePaths']]",
        "audio_paths = ['output/' + p for p in a['sceneAudioPaths']] if a['sceneAudioPaths'] else None",
        "generate_video(img_paths, audio_paths, 'output/' + a['folder'])",
        "print('ok')",
      ]);
      return NextResponse.json({ success: true, videoPath: `${folder}/story_video.mp4` });
    }

    if (step === "capcut") {
      const { folder, title, scenes, imagePaths, sceneAudioPaths, characters, language, environment } = body;
      writeArgs({ folder, title, scenes, imagePaths, sceneAudioPaths, characters: characters || [], language: language || "hindi", environment: environment || "" });
      const output = await run([
        "import json, sys",
        "from dotenv import load_dotenv",
        "load_dotenv()",
        "sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
        "sys.stderr.reconfigure(encoding='utf-8', errors='replace')",
        "with open('_tmp_args.json', encoding='utf-8') as fh:",
        "    a = json.load(fh)",
        "from capcut_exporter import export_capcut_package",
        "img_paths   = ['output/' + p for p in a['imagePaths']]",
        "audio_paths = ['output/' + p for p in a['sceneAudioPaths']] if a.get('sceneAudioPaths') else []",
        "result = export_capcut_package(",
        "    title=a['title'],",
        "    scenes=a['scenes'],",
        "    image_paths=img_paths,",
        "    audio_paths=audio_paths,",
        "    characters=a.get('characters', []),",
        "    output_folder='output/' + a['folder'],",
        "    language=a.get('language', 'hindi'),",
        "    environment=a.get('environment', ''),",
        ")",
        "print(json.dumps(result, ensure_ascii=False))",
      ]);
      return NextResponse.json({ success: true, ...JSON.parse(output) });
    }

    if (step === "dialog") {
      writeArgs(body.config || {});
      const output = await run([
        "import json, os, sys",
        "from dotenv import load_dotenv",
        "load_dotenv()",
        "sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
        "sys.stderr.reconfigure(encoding='utf-8', errors='replace')",
        "with open('_tmp_args.json', encoding='utf-8') as fh:",
        "    config = json.load(fh)",
        "from dialog_generator import generate_dialog",
        "result = generate_dialog(config)",
        "out_folder = 'output/' + result['folder']",
        "os.makedirs(out_folder, exist_ok=True)",
        "with open(out_folder + '/dialog.json', 'w', encoding='utf-8') as fh:",
        "    json.dump(result['raw'], fh, ensure_ascii=False, indent=2)",
        "print(json.dumps(result, ensure_ascii=False))",
      ]);
      return NextResponse.json({ success: true, ...JSON.parse(output) });
    }

    if (step === "falvideo") {
      const { folder, scenes, imagePaths, sceneAudioPaths, falModel } = body;
      writeArgs({ folder, scenes, imagePaths, sceneAudioPaths, falModel: falModel || null });
      await run([
        "import json, sys",
        "from dotenv import load_dotenv",
        "load_dotenv()",
        "sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
        "sys.stderr.reconfigure(encoding='utf-8', errors='replace')",
        "with open('_tmp_args.json', encoding='utf-8') as fh:",
        "    a = json.load(fh)",
        "from fal_video_generator import generate_fal_video, DEFAULT_MODEL",
        "model = a.get('falModel') or DEFAULT_MODEL",
        "img_paths   = ['output/' + p for p in a['imagePaths']]",
        "audio_paths = ['output/' + p for p in a['sceneAudioPaths']] if a.get('sceneAudioPaths') else []",
        "generate_fal_video(a['scenes'], img_paths, audio_paths, 'output/' + a['folder'], model)",
        "print('ok')",
      ]);
      return NextResponse.json({ success: true, videoPath: `${folder}/story_video.mp4` });
    }

    return NextResponse.json({ success: false, error: "Invalid step" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[PIPELINE ERROR]", step, message);
    try { if (existsSync(ARGS_FILE)) unlinkSync(ARGS_FILE); } catch {}
    return NextResponse.json({ success: false, error: message, step }, { status: 500 });
  }
}
