/**
 * Language → Azure TTS voice map
 * Used by ai-story-ui (Python backend) and ai-youtube-bot (voice-generator.js)
 * Single source of truth for all voice settings.
 */
export const VOICE_MAP: Record<string, string> = {
  hindi:    "hi-IN-SwaraNeural",
  hinglish: "hi-IN-MadhurNeural",
  english:  "en-US-AriaNeural",
  tamil:    "ta-IN-PallaviNeural",
  telugu:   "te-IN-ShrutiNeural",
  marathi:  "mr-IN-AarohiNeural",
  bengali:  "bn-IN-TanishaaNeural",
};

/**
 * Returns the Azure TTS voice name for a given language.
 * Falls back to Hindi (hi-IN-SwaraNeural) if not found.
 */
export function getVoice(language: string): string {
  return VOICE_MAP[language.toLowerCase()] ?? VOICE_MAP["hindi"];
}
