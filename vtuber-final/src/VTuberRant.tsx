import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";

/**
 * Vox-style paper-collage VTuber talking-head for a humorous YouTube-policy rant.
 * Character cutouts float gently and swap expression based on dialogue beats.
 * Lightly animated starfield + occasional B-roll inserts.
 */

const FPS = 30;

// Dialogue-timed expression timeline (seconds from clip start)
// Clip starts ~5:25 of original (AI push + watch-hours doubling + weed-out rant)
const EXPRESSION_TIMELINE: { at: number; expr: string }[] = [
  { at: 0, expr: "confident" },
  { at: 4, expr: "thought" },
  { at: 9, expr: "annoy" },
  { at: 14, expr: "shock" },
  { at: 20, expr: "fatigue" },
  { at: 26, expr: "sneaky" },
  { at: 32, expr: "triumph" },
  { at: 38, expr: "curiosity" },
  { at: 44, expr: "annoy" },
  { at: 50, expr: "happiness" },
  { at: 56, expr: "confident" },
];

const getExpression = (timeSec: number): string => {
  let current = EXPRESSION_TIMELINE[0].expr;
  for (const beat of EXPRESSION_TIMELINE) {
    if (timeSec >= beat.at) current = beat.expr;
    else break;
  }
  return current;
};

// Soft float motion for the cutout
const useFloat = (frame: number) => {
  const y = Math.sin(frame / 28) * 10 + Math.sin(frame / 47) * 5;
  const x = Math.sin(frame / 39) * 6;
  const rot = Math.sin(frame / 55) * 1.8;
  return { x, y, rot };
};

const Starfield: React.FC = () => {
  const frame = useCurrentFrame();
  // Simple drifting particles via CSS + a few absolute dots
  const stars = Array.from({ length: 40 }, (_, i) => {
    const seed = i * 9973;
    const x = (seed % 1000) / 10;
    const y = ((seed * 7) % 1000) / 10;
    const size = 1 + (seed % 3);
    const speed = 0.15 + (seed % 5) * 0.05;
    const driftY = (y + frame * speed) % 110 - 5;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${driftY}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: i % 4 === 0 ? "#aaddff" : "#ffffff",
          opacity: 0.4 + (seed % 6) * 0.1,
        }}
      />
    );
  });

  // Slow parallax planets (simple circles)
  const planet1 = {
    x: 15 + Math.sin(frame / 180) * 3,
    y: 25 + Math.cos(frame / 220) * 2,
  };
  const planet2 = {
    x: 78 + Math.cos(frame / 250) * 2,
    y: 65 + Math.sin(frame / 190) * 3,
  };

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 40% 30%, #1a0a2e 0%, #0a0515 60%, #000000 100%)",
        overflow: "hidden",
      }}
    >
      {stars}
      {/* soft planet blobs */}
      <div
        style={{
          position: "absolute",
          left: `${planet1.x}%`,
          top: `${planet1.y}%`,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, #5a3a2a 0%, #2a1a12 70%, transparent 100%)",
          opacity: 0.55,
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${planet2.x}%`,
          top: `${planet2.y}%`,
          width: 55,
          height: 55,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 30%, #3a4a5a 0%, #1a2030 70%, transparent 100%)",
          opacity: 0.45,
        }}
      />
      {/* subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const CharacterCutout: React.FC<{ expr: string }> = ({ expr }) => {
  const frame = useCurrentFrame();
  const { x, y, rot } = useFloat(frame);

  // Gentle scale pulse on expression change (approx)
  const scale = interpolate(
    frame % 90,
    [0, 8, 20],
    [1, 1.04, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  const src = staticFile(`chars/${expr}.png`);

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        bottom: 20,
        width: 520,
        height: 440,
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))",
      }}
    >
      {/* paper edge / collage feel */}
      <div
        style={{
          position: "absolute",
          inset: -6,
          borderRadius: 18,
          background: "rgba(255,255,255,0.08)",
          transform: "rotate(-1.2deg)",
        }}
      />
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: 14,
        }}
      />
    </div>
  );
};

const BRollOverlay: React.FC<{ src: string; opacity?: number }> = ({
  src,
  opacity = 0.85,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity,
      }}
    >
      <Video
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        muted
      />
      {/* cinematic letterbox + soft grade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const VTuberRant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;
  const expr = getExpression(timeSec);

  // B-roll windows (frame ranges) – brief cinematic inserts
  // 1) drawing/animation struggle ~12-18s
  // 2) YouTube / policy ~28-34s
  // 3) AI mention ~42-48s
  const showDrawing = frame >= 12 * FPS && frame < 18 * FPS;
  const showYoutube = frame >= 28 * FPS && frame < 34 * FPS;
  const showAI = frame >= 42 * FPS && frame < 48 * FPS;

  // Crossfade opacity for B-roll
  const brollOpacity = (start: number, end: number) => {
    const fade = 12;
    if (frame < start || frame >= end) return 0;
    if (frame < start + fade)
      return interpolate(frame, [start, start + fade], [0, 0.9]);
    if (frame > end - fade)
      return interpolate(frame, [end - fade, end], [0.9, 0]);
    return 0.9;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Starfield />

      {/* Main character layer (always present, dims under B-roll) */}
      <AbsoluteFill
        style={{
          opacity: showDrawing || showYoutube || showAI ? 0.25 : 1,
        }}
      >
        <CharacterCutout expr={expr} />
      </AbsoluteFill>

      {/* B-roll sequences */}
      {showDrawing && (
        <Sequence from={12 * FPS} durationInFrames={6 * FPS}>
          <BRollOverlay
            src="broll/drawing.mp4"
            opacity={brollOpacity(12 * FPS, 18 * FPS)}
          />
        </Sequence>
      )}
      {showYoutube && (
        <Sequence from={28 * FPS} durationInFrames={6 * FPS}>
          <BRollOverlay
            src="broll/youtube_sub.mp4"
            opacity={brollOpacity(28 * FPS, 34 * FPS)}
          />
        </Sequence>
      )}
      {showAI && (
        <Sequence from={42 * FPS} durationInFrames={6 * FPS}>
          <BRollOverlay
            src="broll/ai_network.mp4"
            opacity={brollOpacity(42 * FPS, 48 * FPS)}
          />
        </Sequence>
      )}

      {/* Subtle bottom title card */}
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: 22,
          padding: "8px 16px",
          background: "rgba(10,5,20,0.65)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#e8e0ff",
          fontFamily: "system-ui, sans-serif",
          fontSize: 15,
          letterSpacing: 0.3,
          opacity: 0.85,
        }}
      >
        Cartoon Galaxy Rant · YouTube Policy vs Animators
      </div>

      {/* Audio */}
      <Audio src={staticFile("audio/clip.mp3")} />
    </AbsoluteFill>
  );
};
