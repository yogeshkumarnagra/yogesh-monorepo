const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function buildFinalVideo(videoPaths, audioPath, subtitlesPath, outPath = 'final/final-short.mp4') {
  console.log('[ffmpeg] Merging videos, audio, subtitles...');

  // Create concat list
  const concatFile = path.join('final', '_concat.txt');
  const concatContent = videoPaths.map(p => `file '../${p.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatFile, concatContent);

  const hasSubs = subtitlesPath && fs.existsSync(subtitlesPath);
  const subsFilter = hasSubs ? `,subtitles='${subtitlesPath.replace(/\\/g, '/')}'` : '';

  const cmd = [
    'ffmpeg -y',
    `-f concat -safe 0 -i "${concatFile}"`,
    `-i "${audioPath}"`,
    `-vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:-1:-1${subsFilter}"`,
    `-c:v libx264 -c:a aac -shortest`,
    `"${outPath}"`
  ].join(' ');

  execSync(cmd, { stdio: 'inherit' });
  fs.unlinkSync(concatFile);

  console.log(`[ffmpeg] Final video saved: ${outPath}`);
  return outPath;
}

module.exports = { buildFinalVideo };
