import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

const SHOTS = [
  { title: "Discovery Hook", time: "0:00–0:04", desc: "3 talents in dramatic setting, cinematic reveal", status: "done" as const },
  { title: "The Experience", time: "0:04–0:08", desc: "Cinematic push-in, golden light, confident poses", status: "active" as const },
  { title: "The CTA", time: "0:08–0:12", desc: "VO narration + website callout, dramatic close", status: "queued" as const },
];

const AGENTS = [
  { name: "Sotong Planner", icon: "🦑", status: "done" as const },
  { name: "Compositor Agent", icon: "🎨", status: "active" as const },
  { name: "Director Agent", icon: "📋", status: "queued" as const },
  { name: "Editor Agent", icon: "✂️", status: "idle" as const },
];

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = { active: "#4ade80", queued: "#facc15", idle: "#6b7280", done: "#4ade80" };
  return (
    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: colors[status] || "#6b7280", boxShadow: status === "active" ? `0 0 8px ${colors[status]}` : "none" }} />
  );
}

function ShotCard({ shot, index, frame }: { shot: (typeof SHOTS)[0]; index: number; frame: number }) {
  const entryDelay = 10 + index * 10;
  const scale = interpolate(frame, [entryDelay, entryDelay + 10], [0.85, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [entryDelay, entryDelay + 8], [0, 1], { extrapolateRight: "clamp" });
  const isActive = shot.status === "active";
  const progressWidth = isActive ? interpolate(frame, [30, 120], [15, 82], { extrapolateRight: "clamp" }) : shot.status === "done" ? 100 : 0;

  const badges: Record<string, { label: string; color: string }> = {
    done: { label: "✅ Planned", color: "#166534" },
    active: { label: "🎨 Compositing...", color: "#854d0e" },
    queued: { label: "⏳ Queued", color: "#374151" },
  };
  const badge = badges[shot.status];

  const thumbColors = ["#1e3a5f", "#3b1f5e", "#5f3a1e"];

  return (
    <div style={{ flex: 1, backgroundColor: "#1e1e3a", borderRadius: 12, padding: 16, opacity, transform: `scale(${scale})`, border: isActive ? "1px solid #8b5cf680" : "1px solid #30364d", boxShadow: isActive ? "0 0 20px #8b5cf620" : "none" }}>
      <div style={{ height: 90, borderRadius: 8, background: `linear-gradient(135deg, ${thumbColors[index]}80, ${thumbColors[index]}30)`, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative", overflow: "hidden" }}>
        {shot.status === "done" ? "🎓" : shot.status === "active" ? "⚡" : "🎬"}
        {isActive && (
          <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: `${progressWidth}%`, backgroundColor: "#8b5cf6", borderRadius: 2 }} />
        )}
      </div>
      <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Shot {index + 1}: {shot.title}</div>
      <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>{shot.desc}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#94a3b8", fontSize: 11 }}>{shot.time}</span>
        <span style={{ padding: "2px 8px", borderRadius: 6, backgroundColor: badge.color, color: "#e2e8f0", fontSize: 10, fontWeight: 500 }}>{badge.label}</span>
      </div>
    </div>
  );
}

export const PlanningScreen: React.FC = () => {
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
        <span style={{ color: "#64748b", fontSize: 12, marginLeft: 12 }}>— AIMedia Academy Announcement</span>
      </div>

      <div style={{ display: "flex", flex: 1, opacity: fadeIn }}>
        {/* Sidebar */}
        <div style={{ width: 220, backgroundColor: "#131325", borderRight: "1px solid #1e2540", padding: "16px 12px" }}>
          <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pipeline Agents</div>
          {AGENTS.map((agent, i) => {
            const agentOpacity = interpolate(frame, [5 + i * 4, 10 + i * 4], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, marginBottom: 4, opacity: agentOpacity, backgroundColor: agent.status === "active" ? "#1e293b" : "transparent" }}>
                <span style={{ fontSize: 16 }}>{agent.icon}</span>
                <span style={{ color: "#cbd5e1", fontSize: 13, flex: 1 }}>{agent.name}</span>
                <StatusDot status={agent.status} />
              </div>
            );
          })}

          {/* Brief summary */}
          <div style={{ marginTop: 20, padding: 12, backgroundColor: "#1e1e3a", borderRadius: 8, border: "1px solid #30364d" }}>
            <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Brief</div>
            <div style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.5 }}>
              Launch announcement video. 12s cinematic, 3 talents, dramatic VO narration with AI music.
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 24 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
            Storyboard — 3 shots × 4s = 12s
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {SHOTS.map((shot, i) => (
              <ShotCard key={i} shot={shot} index={i} frame={frame} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={{ padding: "10px 24px", backgroundColor: "#161b2e", borderTop: "1px solid #1e2540", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#facc15" }} />
        <span style={{ color: "#94a3b8", fontSize: 13 }}>Compositor Agent — generating startframe for Shot 2...</span>
        <div style={{ flex: 1, height: 4, backgroundColor: "#1e2540", borderRadius: 2, marginLeft: 12 }}>
          <div style={{ height: "100%", width: `${interpolate(frame, [20, 120], [10, 65], { extrapolateRight: "clamp" })}%`, backgroundColor: "#8b5cf6", borderRadius: 2 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
