const { execSync } = require('child_process');
const path = require('path');
const settings = require('../config/settings.json');

const VOICE_MAP = {
  hindi: 'hi-IN-SwaraNeural',
  english: 'en-US-JennyNeural',
  hinglish: 'hi-IN-SwaraNeural'
};

function generateNarration(story) {
  const voice = VOICE_MAP[settings.language] || VOICE_MAP.hindi;
  const narrationText = story.scenes.map(s => s.narration).join(' ... ');
  const outPath = path.join('audio', 'narration.mp3');

  console.log(`[voice] Generating narration (${voice})...`);

  // Uses edge-tts from ai-story-pipeline venv
  const python = `D:/MyData/Projects/AI/ai-story-pipeline/venv/Scripts/python.exe`;
  const script = `
import asyncio, edge_tts
async def speak():
    c = edge_tts.Communicate("""${narrationText.replace(/"/g, "'")}""", voice="${voice}")
    await c.save(r"${outPath.replace(/\\/g, '/')}")
asyncio.run(speak())
`.trim();

  const tmpScript = path.join('audio', '_tmp_voice.py');
  require('fs').writeFileSync(tmpScript, script);
  try {
    execSync(`"${python}" "${tmpScript}"`, { stdio: 'inherit' });
  } finally {
    require('fs').unlinkSync(tmpScript);
  }

  console.log(`[voice] Saved: ${outPath}`);
  return outPath;
}

module.exports = { generateNarration };
