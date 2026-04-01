# Contributing to OpenBlur

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/willhooi/openblur.git
cd openblur
npm install
npx remotion studio src/index.tsx
```

## Project Structure

```
src/
  index.tsx              — Remotion entry point (composition registry)
  components/
    Composition.tsx      — Main video with 5-screen transitions
    TerminalScreen.tsx   — CLI spawn animation
    PlanningScreen.tsx   — Storyboard UI
    GenerationScreen.tsx — I2V rendering progress
    OutputScreen.tsx     — Export complete view
    HeroScreen.tsx       — Brand reveal

examples/
    tts-with-timestamps.ts   — ElevenLabs word-sync TTS
    karaoke-subtitles.ts     — ASS subtitle generator
    music-gen.ts             — Replicate MusicGen
    ffmpeg-mix.sh            — Audio mixing reference
```

## Adding a New Screen

1. Create a new component in `src/components/`
2. Use `useCurrentFrame()` and `interpolate()` for animations
3. Register it in `src/index.tsx` as a new `<Composition>`
4. The main `Composition.tsx` auto-distributes screens across the video duration

## Guidelines

- Keep text rendering in React/CSS (no AI image generation for UI elements)
- Use `interpolate()` for smooth animations, `spring()` for physics-based motion
- Test with `npx remotion studio` before submitting

## Reporting Issues

Open an issue on GitHub. Include your Remotion version and Node version.
