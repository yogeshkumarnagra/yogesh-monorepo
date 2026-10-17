const fs = require('fs');
const path = require('path');
const settings = require('../config/settings.json');

async function generateStory(storyId = 'story-001') {
  const prompt = settings.language === 'hindi'
    ? `Ek chhoti si ${settings.story.scenes} scene wali fantasy kahani likho Guddu aur uske kutte Whiskey ke baare mein. Hindi mein likho. Sirf JSON do, koi extra text nahi: { "title": "", "description": "", "tags": [], "scenes": [{ "id": 1, "narration": "", "imagePrompt": "" }] }`
    : `Write a short ${settings.story.scenes}-scene fantasy story about Guddu and his dog Whiskey. Return ONLY JSON, no extra text: { "title": "", "description": "", "tags": [], "scenes": [{ "id": 1, "narration": "", "imagePrompt": "" }] }`;

  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama3:latest', prompt, stream: false })
  });

  const data = await response.json();
  const jsonMatch = data.response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse story JSON from LLM response');

  const story = JSON.parse(jsonMatch[0]);
  story.id = storyId;
  story.createdAt = new Date().toISOString();

  const outPath = path.join('stories', `${storyId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(story, null, 2));
  console.log(`[story] Saved: ${outPath}`);
  return story;
}

module.exports = { generateStory };
