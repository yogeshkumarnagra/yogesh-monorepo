const fs = require('fs');
const path = require('path');
const settings = require('../config/settings.json');

// Calls the ai-story-pipeline Python image generator via HTTP or directly
// Requires: ai-story-pipeline venv active with diffusers installed
async function generateSceneImages(scenes) {
  const imagePaths = [];

  for (const scene of scenes) {
    const outPath = path.join('images', `scene-${String(scene.id).padStart(2, '0')}.png`);
    console.log(`[image] Generating scene ${scene.id}: ${scene.imagePrompt}`);

    // Call Stable Diffusion via ai-story-pipeline HTTP endpoint or Python child process
    const { execSync } = require('child_process');
    const script = `
import sys
sys.path.insert(0, r'D:/MyData/Projects/AI/ai-story-pipeline')
from image_generator import generate_character_image
generate_character_image("""${scene.imagePrompt}""", r'${outPath.replace(/\\/g, '/')}')
print('done')
`.trim();

    const tmpScript = path.join('images', `_tmp_scene${scene.id}.py`);
    fs.writeFileSync(tmpScript, script);

    try {
      execSync(`D:/MyData/Projects/AI/ai-story-pipeline/venv/Scripts/python.exe "${tmpScript}"`, {
        stdio: 'inherit',
        timeout: 600000  // 10 min for CPU
      });
      imagePaths.push(outPath);
    } finally {
      fs.unlinkSync(tmpScript);
    }
  }

  // Save scene prompts output
  const promptsPath = path.join('prompts', 'scene-prompts.json');
  fs.writeFileSync(promptsPath, JSON.stringify(scenes, null, 2));
  console.log(`[image] Prompts saved: ${promptsPath}`);

  return imagePaths;
}

module.exports = { generateSceneImages };
