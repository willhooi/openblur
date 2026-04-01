/**
 * ElevenLabs TTS with word-level timestamps.
 * Returns audio + character-level alignment for karaoke subtitle sync.
 *
 * Requires: ELEVENLABS_API_KEY environment variable
 */

interface WordTimestamp {
  word: string;
  startSec: number;
  endSec: number;
}

export async function generateVoiceOver(
  text: string,
  voiceId: string
): Promise<{ audioBuffer: Buffer; words: WordTimestamp[] }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set");

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.8,
          style: 0.7,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
  const data = await res.json();

  // Decode audio
  const audioBuffer = Buffer.from(data.audio_base64, "base64");

  // Reconstruct words from character-level alignment
  const words: WordTimestamp[] = [];
  const { characters, character_start_times_seconds, character_end_times_seconds } =
    data.alignment;

  let currentWord = "";
  let wordStart = 0;

  for (let i = 0; i < characters.length; i++) {
    const ch = characters[i];
    if (ch === " " || i === characters.length - 1) {
      if (i === characters.length - 1 && ch !== " ") currentWord += ch;
      if (currentWord.trim()) {
        words.push({
          word: currentWord.trim(),
          startSec: wordStart,
          endSec:
            character_end_times_seconds[ch === " " ? i - 1 : i],
        });
      }
      currentWord = "";
      if (i + 1 < characters.length)
        wordStart = character_start_times_seconds[i + 1] || 0;
    } else {
      if (currentWord === "") wordStart = character_start_times_seconds[i] || 0;
      currentWord += ch;
    }
  }

  return { audioBuffer, words };
}
