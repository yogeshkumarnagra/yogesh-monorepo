const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PYTHON = 'D:/MyData/Projects/AI/ai-story-pipeline/venv/Scripts/python.exe';
const PIPELINE_DIR = 'D:/MyData/Projects/AI/ai-story-pipeline';

async function uploadToYouTube(videoPath, title, description, tags = []) {
  const absVideoPath = path.resolve(videoPath).replace(/\\/g, '/');

  const script = `
import sys
sys.path.insert(0, r'${PIPELINE_DIR}')
import os
os.chdir(r'${PIPELINE_DIR}')
from youtube_uploader import upload_to_youtube
video_id = upload_to_youtube(r'${absVideoPath}', """${title.replace(/"/g, "'")}""", """${description.replace(/"/g, "'")}""")
print('VIDEO_ID:' + video_id)
`.trim();

  const tmpScript = path.join('uploads', '_tmp_upload.py');
  fs.mkdirSync('uploads', { recursive: true });
  fs.writeFileSync(tmpScript, script);

  let videoId = null;
  try {
    const output = execSync(`"${PYTHON}" "${tmpScript}"`, { stdio: ['inherit', 'pipe', 'inherit'] }).toString();
    const match = output.match(/VIDEO_ID:(.+)/);
    if (match) videoId = match[1].trim();
  } finally {
    fs.unlinkSync(tmpScript);
  }

  const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'URL not captured';
  console.log(`[youtube] Uploaded! URL: ${videoUrl}`);

  const logPath = path.join('uploads', 'upload-log.json');
  const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
  log.push({ title, videoUrl, uploadedAt: new Date().toISOString(), videoPath });
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

  return videoUrl;
}

module.exports = { uploadToYouTube };
