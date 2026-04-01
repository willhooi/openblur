import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TerminalScreen } from "./TerminalScreen";
import { PlanningScreen } from "./PlanningScreen";
import { GenerationScreen } from "./GenerationScreen";
import { OutputScreen } from "./OutputScreen";
import { HeroScreen } from "./HeroScreen";

// Dynamic screen timing: 5 screens distributed across total duration
// with longer crossfade overlap (30 frames = 1s at 30fps)
const FADE = 30;
const SCREEN_COUNT = 5;

function getScreenRanges(totalFrames: number) {
  // Each screen gets an equal slice, with FADE-frame overlaps
  const sliceDuration = (totalFrames + FADE * (SCREEN_COUNT - 1)) / SCREEN_COUNT;
  return Array.from({ length: SCREEN_COUNT }, (_, i) => ({
    start: Math.round(i * (sliceDuration - FADE)),
    end: Math.round(i * (sliceDuration - FADE) + sliceDuration),
  }));
}

function ScreenLayer({
  children,
  start,
  end,
  frame,
}: {
  children: React.ReactNode;
  start: number;
  end: number;
  frame: number;
}) {
  if (frame < start || frame > end) return null;

  const fadeIn = interpolate(
    frame,
    [start, start + FADE],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    frame,
    [end - FADE, end],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <Sequence from={start} durationInFrames={end - start}>
        {children}
      </Sequence>
    </AbsoluteFill>
  );
}

export const OpenBlurComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const screens = getScreenRanges(durationInFrames);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1a" }}>
      <ScreenLayer start={screens[0].start} end={screens[0].end} frame={frame}>
        <TerminalScreen />
      </ScreenLayer>
      <ScreenLayer start={screens[1].start} end={screens[1].end} frame={frame}>
        <PlanningScreen />
      </ScreenLayer>
      <ScreenLayer start={screens[2].start} end={screens[2].end} frame={frame}>
        <GenerationScreen />
      </ScreenLayer>
      <ScreenLayer start={screens[3].start} end={screens[3].end} frame={frame}>
        <OutputScreen />
      </ScreenLayer>
      <ScreenLayer start={screens[4].start} end={screens[4].end} frame={frame}>
        <HeroScreen />
      </ScreenLayer>
    </AbsoluteFill>
  );
};
