/**
 * Karaoke subtitle generator — builds ASS format with \kf sweep animation.
 * Supports both estimated timing (from duration) and real word timestamps.
 */

interface WordTimestamp {
  word: string;
  startSec: number;
  endSec: number;
}

function toTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
}

/**
 * Build karaoke ASS from real word-level timestamps (ElevenLabs/Whisper).
 * Words are grouped into chunks of 5 for readability.
 */
export function buildKaraokeFromTimestamps(words: WordTimestamp[]): string {
  const assLines: string[] = [];
  const chunkSize = 5;

  for (let ci = 0; ci < words.length; ci += chunkSize) {
    const chunk = words.slice(ci, Math.min(ci + chunkSize, words.length));
    const gStart = toTime(chunk[0].startSec);
    const gEnd = toTime(chunk[chunk.length - 1].endSec + 0.1);
    const karaokeText = chunk
      .map((w) => {
        const durationCs = Math.max(1, Math.round((w.endSec - w.startSec) * 100));
        return `{\\kf${durationCs}}${w.word}`;
      })
      .join(" ");
    assLines.push(`Dialogue: 0,${gStart},${gEnd},Default,,0,0,0,,${karaokeText}`);
  }

  return wrapASS(assLines);
}

/**
 * Build karaoke ASS from estimated timing (evenly distributed across duration).
 * Use when word-level timestamps are not available.
 */
export function buildKaraokeFromDuration(text: string, totalDurSec: number): string {
  const words = text.split(/\s+/);
  const timePerWord = totalDurSec / words.length;

  const assLines: string[] = [];
  const chunkSize = 5;

  for (let ci = 0; ci < words.length; ci += chunkSize) {
    const chunk = words.slice(ci, Math.min(ci + chunkSize, words.length));
    const gStart = toTime(ci * timePerWord + 0.3);
    const gEnd = toTime((ci + chunk.length) * timePerWord + 0.3);
    const karaokeText = chunk
      .map(() => {
        const durationCs = Math.max(1, Math.round(timePerWord * 100));
        return `{\\kf${durationCs}}`;
      })
      .map((prefix, i) => `${prefix}${chunk[i]}`)
      .join(" ");
    assLines.push(`Dialogue: 0,${gStart},${gEnd},Default,,0,0,0,,${karaokeText}`);
  }

  return wrapASS(assLines);
}

function wrapASS(dialogueLines: string[]): string {
  return `[Script Info]
Title: OpenBlur Subtitles
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans CJK SC,38,&H00FFBF2D,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,0,2,20,20,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${dialogueLines.join("\n")}
`;
}
