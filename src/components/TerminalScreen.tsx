import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

const LINES = [
  { text: "$ openblur spawn --mode influencer-video --agent sotong-v2", color: "#2dd4bf", delay: 0 },
  { text: "", color: "", delay: 5 },
  { text: "    ___                   ____  _            ", color: "#8b5cf6", delay: 8 },
  { text: "   / _ \\ _ __   ___ _ __ | __ )| |_   _ _ __ ", color: "#8b5cf6", delay: 9 },
  { text: "  | | | | '_ \\ / _ \\ '_ \\|  _ \\| | | | | '__|", color: "#8b5cf6", delay: 10 },
  { text: "  | |_| | |_) |  __/ | | | |_) | | |_| | |   ", color: "#8b5cf6", delay: 11 },
  { text: "   \\___/| .__/ \\___|_| |_|____/|_|\\__,_|_|   ", color: "#8b5cf6", delay: 12 },
  { text: "        |_|                                    ", color: "#8b5cf6", delay: 13 },
  { text: "", color: "", delay: 16 },
  { text: "🦑 Sotong Agent v2.1.0 activated", color: "#facc15", delay: 18 },
  { text: "", color: "", delay: 20 },
  { text: "[INFO] Loading brief: \"Launch Announcement — Cinematic 12s\"", color: "#4ade80", delay: 24 },
  { text: "[INFO] Talent pool: 3 published talents loaded", color: "#4ade80", delay: 34 },
  { text: "[INFO] Template: cinematic-announcement (12s, 3 shots)", color: "#4ade80", delay: 44 },
  { text: "[INFO] VO voice: Steve SG (male, dramatic)", color: "#4ade80", delay: 54 },
  { text: "[INFO] Music: AI-generated cinematic trailer", color: "#4ade80", delay: 64 },
  { text: "", color: "", delay: 70 },
  { text: "[READY] Handing off to Planner Agent...", color: "#2dd4bf", delay: 75 },
];

function ProgressBar({ frame, startFrame }: { frame: number; startFrame: number }) {
  const elapsed = Math.max(0, frame - startFrame);
  const progress = Math.min(1, elapsed / 50);
  const filled = Math.round(progress * 20);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  const pct = Math.round(progress * 100);
  if (frame < startFrame) return null;
  return (
    <div style={{ color: "#2dd4bf", fontFamily: "monospace", fontSize: 16 }}>
      [{bar}] {pct}% Initializing pipeline...
    </div>
  );
}

export const TerminalScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1117",
        fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
        fontSize: 16,
        lineHeight: 1.6,
      }}
    >
      {/* macOS title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <span style={{ color: "#8b949e", fontSize: 13, marginLeft: 12, fontFamily: "system-ui" }}>
          openblur — zsh — 120×40
        </span>
      </div>

      <div style={{ padding: "20px 24px", opacity }}>
        {LINES.map((line, i) => {
          if (frame < line.delay) return null;
          const lineOpacity = interpolate(frame, [line.delay, line.delay + 3], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ color: line.color || "#c9d1d9", opacity: lineOpacity, whiteSpace: "pre" }}>
              {line.text}
            </div>
          );
        })}
        <ProgressBar frame={frame} startFrame={82} />
        {/* Blinking cursor */}
        {frame > 90 && (
          <span style={{ color: "#2dd4bf", opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0 }}>█</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
