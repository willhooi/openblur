import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

const ACADEMY_VIDEO_URL = "https://example.com/your-output-video.mp4";

const STATS = [
  { label: "Composites", value: "3/3", icon: "✅" },
  { label: "I2V Clips", value: "3/3", icon: "✅" },
  { label: "Voice Over", value: "Steve SG", icon: "✅" },
  { label: "Music", value: "Cinematic AI", icon: "✅" },
  { label: "Subtitles", value: "Karaoke", icon: "✅" },
  { label: "Total time", value: "3m 47s", icon: "⏱️" },
  { label: "Output", value: "announcement.mp4", icon: "📁" },
];

function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - delay);
  const y = interpolate(elapsed, [0, 120], [-20, 750], { extrapolateRight: "clamp" });
  const rotation = elapsed * 4;
  const opacity = interpolate(elapsed, [80, 120], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  if (frame < delay) return null;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: y, width: 8, height: 8, backgroundColor: color, borderRadius: 2, transform: `rotate(${rotation}deg)`, opacity }} />
  );
}

export const OutputScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bannerScale = spring({ frame, fps, from: 0.5, to: 1, config: { damping: 12, stiffness: 100 } });
  const bannerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const confettiColors = ["#4ade80", "#facc15", "#8b5cf6", "#2dd4bf", "#f472b6", "#fb923c"];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1a", fontFamily: "system-ui, sans-serif" }}>
      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiParticle key={i} delay={5 + Math.floor(i * 1.5)} x={5 + (i * 37) % 90} color={confettiColors[i % confettiColors.length]} />
      ))}

      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", backgroundColor: "#161b2e", borderBottom: "1px solid #1e2540", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: 8, marginRight: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>
        <span style={{ fontSize: 22, marginRight: 8 }}>🦑</span>
        <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>OpenBlur Studio</span>
        <span style={{ color: "#4ade80", fontSize: 12, marginLeft: 12 }}>— Export Complete</span>
      </div>

      {/* Success banner */}
      <div style={{ margin: "16px 24px", padding: "12px 20px", backgroundColor: "#052e16", border: "1px solid #166534", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, opacity: bannerOpacity, transform: `scale(${bannerScale})`, position: "relative", zIndex: 10 }}>
        <span style={{ fontSize: 20 }}>✅</span>
        <span style={{ color: "#4ade80", fontSize: 15, fontWeight: 600 }}>Export Complete — announcement.mp4 (720×1280, 12s)</span>
      </div>

      <div style={{ display: "flex", flex: 1, padding: "0 24px", gap: 24, position: "relative", zIndex: 10 }}>
        {/* Video preview */}
        <div style={{ flex: 1 }}>
          <div style={{ backgroundColor: "#1a1a2e", borderRadius: 12, overflow: "hidden", border: "1px solid #30364d", aspectRatio: "9/16", maxHeight: 340, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {/* Play the actual output video */}
            <OffthreadVideo
              src={ACADEMY_VIDEO_URL}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              volume={0}
              startFrom={30}
            />
          </div>

          {/* Timeline scrubber */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#64748b", fontSize: 12 }}>0:00</span>
            <div style={{ flex: 1, height: 4, backgroundColor: "#1e2540", borderRadius: 2 }}>
              <div style={{ height: "100%", width: "100%", backgroundColor: "#4ade80", borderRadius: 2 }} />
            </div>
            <span style={{ color: "#4ade80", fontSize: 12 }}>0:12</span>
          </div>
        </div>

        {/* Stats panel */}
        <div style={{ width: 260 }}>
          <div style={{ backgroundColor: "#1e1e3a", borderRadius: 12, padding: 16, border: "1px solid #30364d" }}>
            <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Generation Stats</div>
            {STATS.map((stat, i) => {
              const statOpacity = interpolate(frame, [8 + i * 4, 14 + i * 4], [0, 1], { extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < STATS.length - 1 ? "1px solid #1e2540" : "none", opacity: statOpacity }}>
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>{stat.label}</span>
                  <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 500 }}>{stat.value} {stat.icon}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
