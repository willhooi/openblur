/**
 * AI background music generation via Replicate MusicGen (Meta).
 * Generates royalty-free background music from text prompts.
 *
 * Requires: REPLICATE_API_TOKEN environment variable
 */

const MUSICGEN_VERSION =
  "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb";

export async function generateMusic(
  prompt: string,
  durationSec: number
): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not set");

  const duration = Math.min(30, Math.max(5, durationSec));

  // Submit prediction
  const submitRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: MUSICGEN_VERSION,
      input: { prompt, duration, model_version: "stereo-large" },
    }),
  });

  if (!submitRes.ok) throw new Error(`MusicGen submit failed: ${submitRes.status}`);
  const { id } = await submitRes.json();

  // Poll for completion
  const start = Date.now();
  while (Date.now() - start < 180_000) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const p = await poll.json();
    if (p.status === "succeeded") return p.output;
    if (p.status === "failed") throw new Error(`MusicGen failed: ${p.error}`);
  }

  throw new Error("MusicGen timed out");
}
