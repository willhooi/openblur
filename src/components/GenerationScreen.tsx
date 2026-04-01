import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";

// Replace with your own thumbnail URL or use staticFile() for local assets
const THUMB_URL = "https://placehold.co/400x225/1e3a5f/4ade80?text=Shot+1";

const CLIPS = [
  { label: "Shot 1 — Discovery Hook", status: "done" as const, duration: "4.0s" },
  { label: "Shot 2 — The Experience", status: "active" as const, duration: "4.0s" },
  { label: "Shot 3 — The CTA", status: "queued" as const, duration: "4.0s" },
];

function ClipCard({ clip, index, frame }: { clip: (typeof CLIPS)[0]; index: number; frame: number }) {
  const entryDelay = 8 + index * 12;
  const opacity = interpolate(frame, [entryDelay, entryDelay + 8], [0, 1], { extrapolateRight: "clamp" });
  const isActive = clip.status === "active";

  const progressWidth = isActive ? interpolate(frame, [30, 150], [5, 88], { extrapolateRight: "clamp" }) : clip.status === "done" ? 100 : 0;

  const statusColors: Record<string, string> = { done: "#166534", active: "#1e3a5f", queued: "#1e1e3a" };
  const statusLabels: Record<string, string> = { done: "✅ Rendered", active: "🔄 Seedance I2V...", queued: "⏳ Waiting" };

  return (
    <div style={{ display: "flex", gap: 12, padding: 12, backgroundColor: "#1e1e3a", borderRadius: 10, border: isActive ? "1px solid #3b82f680" : "1px solid #30364d", opacity, marginBottom: 10 }}>
      {/* Thumbnail */}
      <div style={{ width: 120, height: 68, borderRadius: 6, overflow: "hidden", backgroundColor: "#0f0f2a", flexShrink: 0, position: "relative" }}>
        {clip.status === "done" && (
          <Img src={THUMB_URL} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        {isActive && (
          <>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1e3a5f60, #3b1f5e60)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #3b82f6", borderTopColor: "transparent", transform: `rotate(${frame * 6}deg)` }} />
            </div>
          </>
        )}
        {clip.status === "queued" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: 22 }}>📋</div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{clip.label}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ color: "#64748b", fontSize: 11 }}>Duration: {clip.duration}</span>
          <span style={{ padding: "2px 8px", borderRadius: 6, backgroundColor: statusColors[clip.status], color: "#e2e8f0", fontSize: 10 }}>{statusLabels[clip.status]}</span>
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, backgroundColor: "#30364d", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progressWidth}%`, backgroundColor: isActive ? "#3b82f6" : clip.status === "done" ? "#4ade80" : "#30364d", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

export const GenerationScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f1a", fontFamily: "system-ui, sans-serif" }}>
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", backgroundColor: "#161b2e", borderBottom: "1px solid #1e2540" }}>
        <div style={{ display: "flex", gap: 8, marginRight: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
        </div>
        <span style={{ fontSize: 22, marginRight: 8 }}>🦑</span>
        <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>OpenBlur Studio</span>
        <span style={{ color: "#64748b", fontSize: 12, marginLeft: 12 }}>— Director Agent Active</span>
      </div>

      <div style={{ display: "flex", flex: 1, opacity: fadeIn }}>
        {/* Left: Clip generation queue */}
        <div style={{ flex: 1, padding: 24 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
            I2V Generation — BytePlus Seedance 1.5 Pro
          </div>
          {CLIPS.map((clip, i) => (
            <ClipCard key={i} clip={clip} index={i} frame={frame} />
          ))}

          {/* Live log */}
          <div style={{ marginTop: 16, padding: 12, backgroundColor: "#0d1117", borderRadius: 8, border: "1px solid #30363d", fontFamily: "monospace", fontSize: 11, lineHeight: 1.8 }}>
            <div style={{ color: "#64748b" }}>// Generation log</div>
            {frame > 20 && <div style={{ color: "#4ade80" }}>[12:04:31] Shot 1 composite → Seedance I2V → done (42s)</div>}
            {frame > 50 && <div style={{ color: "#facc15" }}>[12:05:13] Shot 2 composite → Seedance I2V → rendering...</div>}
            {frame > 80 && <div style={{ color: "#64748b" }}>[12:05:13] Poll 48s: processing</div>}
            {frame > 110 && <div style={{ color: "#64748b" }}>[12:05:21] Poll 56s: processing</div>}
          </div>
        </div>

        {/* Right: Stats panel */}
        <div style={{ width: 260, padding: "24px 24px 24px 0" }}>
          <div style={{ backgroundColor: "#1e1e3a", borderRadius: 12, padding: 16, border: "1px solid #30364d", marginBottom: 16 }}>
            <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Provider</div>
            <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>BytePlus Seedance 1.5 Pro</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>Resolution: 720p • Ratio: 9:16</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Mode: I2V (silent) • 4s per clip</div>
          </div>

          <div style={{ backgroundColor: "#1e1e3a", borderRadius: 12, padding: 16, border: "1px solid #30364d" }}>
            <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Audio Pipeline</div>
            {[
              { label: "Voice Over", value: "Steve SG Male", icon: "🎙️", done: frame > 40 },
              { label: "Music", value: "Cinematic Trailer", icon: "🎵", done: frame > 90 },
              { label: "Subtitles", value: "Karaoke ASS", icon: "📝", done: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 2 ? "1px solid #30364d" : "none" }}>
                <span style={{ color: "#94a3b8", fontSize: 12 }}>{item.icon} {item.label}</span>
                <span style={{ color: item.done ? "#4ade80" : "#64748b", fontSize: 11 }}>{item.done ? "✅" : "⏳"} {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "10px 24px", backgroundColor: "#161b2e", borderTop: "1px solid #1e2540", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#3b82f6" }} />
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Director Agent — I2V clip 2/3 rendering via Seedance...</span>
        <div style={{ flex: 1, height: 4, backgroundColor: "#1e2540", borderRadius: 2, marginLeft: 12 }}>
          <div style={{ height: "100%", width: `${interpolate(frame, [0, 150], [33, 66], { extrapolateRight: "clamp" })}%`, backgroundColor: "#3b82f6", borderRadius: 2 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
