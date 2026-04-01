<p align="center">
  <img src="docs/hero.jpg" alt="OpenBlur" width="720" />
</p>

<h1 align="center">OpenBlur</h1>

<p align="center">
  The world's first open-source AI squid agent for influencer video production.
</p>

<p align="center">
  <a href="#features">Features</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#examples">Examples</a> &middot;
  <a href="docs/EVOLUTION.md">Evolution Case Study</a>
</p>

---

## What is OpenBlur?

OpenBlur is an AI agent that creates influencer-style videos from a single text brief. You spawn the **Sotong Agent**, give it a brief, and it handles everything — storyboarding, composite generation, video rendering, voiceover, music, and subtitle burning.

Built with [Remotion](https://remotion.dev) for pixel-perfect programmatic video, with an agentic pipeline that orchestrates multiple AI providers.

## Features

- **Auto Storyboard** — AI plans shots, timing, and transitions from a text brief
- **Composite Generation** — Multi-reference image compositing via Gemini
- **Image-to-Video** — Animated clips from static composites (pluggable I2V providers)
- **AI Voiceover** — Natural narration with word-level timestamp sync
- **AI Music** — Background music generated from mood/genre prompts
- **Karaoke Subtitles** — Word-synced ASS subtitles with customizable styles
- **Remotion Rendering** — Pixel-perfect React-to-video with CSS animations
- **Multi-provider Fallback** — Graceful degradation across AI providers

## Quick Start

```bash
# Clone
git clone https://github.com/willhooi/openblur.git
cd openblur

# Install
npm install

# Preview in browser
npx remotion studio src/index.tsx

# Render video
npx remotion render src/index.tsx OpenBlur output.mp4
```

## Architecture

```
Brief (text)
  │
  ├─ 🦑 Sotong Planner Agent
  │    └─ Shot planning, template selection, VO script
  │
  ├─ 🎨 Compositor Agent
  │    └─ Gemini / Nano Banana 2 composite generation
  │
  ├─ 📋 Director Agent
  │    └─ I2V clip generation (pluggable provider)
  │
  ├─ 🎙️ Audio Pipeline
  │    ├─ ElevenLabs TTS (word-level timestamps)
  │    └─ MusicGen background music
  │
  └─ ✂️ Editor Agent
       ├─ Remotion React composition
       ├─ ASS karaoke subtitle generation
       └─ FFmpeg audio mixing + export
```

## Screenshots

<p align="center">
  <img src="screenshots/terminal.png" alt="Terminal" width="400" />
  <img src="screenshots/planning.png" alt="Planning" width="400" />
</p>
<p align="center">
  <img src="screenshots/generation.png" alt="Generation" width="400" />
  <img src="screenshots/output.png" alt="Output" width="400" />
</p>

## Remotion Compositions

The `src/compositions/` directory contains the React components that render each screen of the video:

| Composition | Description |
|---|---|
| `TerminalScreen` | CLI spawn animation with typing effect, progress bars |
| `PlanningScreen` | Storyboard UI with shot cards, agent status sidebar |
| `GenerationScreen` | I2V rendering progress with clip queue and stats |
| `OutputScreen` | Export complete view with embedded video preview |
| `HeroScreen` | Brand reveal with mascot |

All screens use CSS animations — no AI image generation, so text is always pixel-perfect.

## Examples

### Render a still screenshot
```bash
npx remotion still src/index.tsx Terminal screenshot.png --frame 80
npx remotion still src/index.tsx Planning screenshot.png --frame 100
```

### Render the full video
```bash
npx remotion render src/index.tsx OpenBlur demo.mp4 --codec h264 --crf 18
```

### Custom duration
The composition adapts to any frame count:
```bash
# 20 second video
npx remotion render src/index.tsx OpenBlur demo.mp4 --frames 0-599

# 45 second video
npx remotion render src/index.tsx OpenBlur demo.mp4 --frames 0-1349
```

## Audio Pipeline (Reference)

The `examples/` directory contains reference implementations for:
- **TTS with timestamps** — ElevenLabs `with-timestamps` endpoint for word-synced subtitles
- **Music generation** — Replicate MusicGen integration
- **Karaoke subtitle builder** — ASS format with `\kf` sweep animation
- **FFmpeg audio mixing** — VO + music + subtitle burn in a single pass

## Tech Stack

- [Remotion](https://remotion.dev) — React-based programmatic video
- [ElevenLabs](https://elevenlabs.io) — TTS with word-level alignment
- [Replicate MusicGen](https://replicate.com) — AI background music
- [FFmpeg](https://ffmpeg.org) — Audio mixing + subtitle burning
- TypeScript / React

## License

MIT

---

<p align="center">
  <br/>
  <strong>⚠️ Disclaimer</strong><br/>
  This is an April Fools 2026 project. A lousy attempt at a prank, but hey — the code is real and it actually works.<br/>
  No sotongs were harmed in the making of this repo. 🦑
</p>
