// src/FourMinuteCut.tsx
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  Audio,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FadeIn: React.FC<{ children: React.ReactNode; durationInFrames?: number }> = ({ children, durationInFrames = 45 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const StreamParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const COUNT = 46;

  const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rand = mulberry32(1337);

  const particles = Array.from({ length: COUNT }).map((_, i) => {
    const size = 3 + rand() * 5; // 3-8px pixel squares
    const speed = 0.008 + rand() * 0.02; // travel per frame
    const phase = rand();
    const alpha = 0.25 + rand() * 0.55;
    // Originate mid-left/lower area, stream toward the upper-right corner
    const x0 = -width * 0.05 + rand() * width * 0.4;
    const y0 = height * (0.45 + rand() * 0.55);
    const x1 = width * (0.72 + rand() * 0.3);
    const y1 = -height * 0.1 + rand() * height * 0.15;
    return { size, speed, phase, alpha, x0, y0, x1, y1 };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const progress = (frame * p.speed + p.phase) % 1;
        const x = p.x0 + (p.x1 - p.x0) * progress;
        const y = p.y0 + (p.y1 - p.y0) * progress;
        const fadeIn = Math.min(1, progress / 0.15);
        const fadeOut = Math.min(1, (1 - progress) / 0.2);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              backgroundColor: `rgba(140,225,255,${p.alpha * fadeIn * fadeOut})`,
              boxShadow: `0 0 6px rgba(100,200,255,0.8)`,
            }}
          />
        );
      })}
    </div>
  );
};

const DataStreams: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const STREAMS = 16;
  const DROPS_PER_STREAM = 4;

  const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const rand = mulberry32(90210);

  const streams = Array.from({ length: STREAMS }).map(() => {
    const side = rand();
    // Bias streams toward the left/right thirds so the central content stays clear
    const x =
      (side < 0.4 ? rand() * 0.3 : side < 0.7 ? 0.3 + rand() * 0.4 : 0.7 + rand() * 0.3) *
      width;
    const w = 3 + rand() * 3; // 3-6px stream width
    const speed = 1.2 + rand() * 1.6; // px/frame drift upward
    const hue = 190 + rand() * 24; // cyan -> blue tint
    const drops = Array.from({ length: DROPS_PER_STREAM }).map((_, d) => ({
      phase: d / DROPS_PER_STREAM + rand() * (1 / DROPS_PER_STREAM),
      len: 6 + rand() * 12, // drop height in px
      alpha: 0.55 + rand() * 0.4,
    }));
    return { x, w, speed, hue, drops };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
      {streams.map((s, i) =>
        s.drops.map((d, j) => {
          const travel = (frame * s.speed / height + d.phase) % 1;
          const y = height - travel * height; // moves upward, wraps to bottom
          return (
            <div
              key={`${i}-${j}`}
              style={{
                position: 'absolute',
                left: s.x,
                top: y,
                width: s.w,
                height: d.len,
                backgroundColor: `hsla(${s.hue},100%,75%,${d.alpha})`,
                boxShadow: `0 0 8px 2px hsla(${s.hue},100%,70%,0.85)`,
              }}
            />
          );
        })
      )}
    </div>
  );
};

const NeonTitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const DUR = 126; // 4.2s title hold @ 30fps (2.7s + 1.5s)
  const TITLE = 'Building Claude One';
  const BODY_STEPS = 6; // extruded 3D body layers
  const STEP = 5; // px between body layers
  const TOTAL_DEPTH = BODY_STEPS * STEP; // 30px extrusion depth

  // Start tilted 30deg counterclockwise, away from the user; slowly rotate
  // clockwise towards the user until it faces the viewer straight on.
  const rotateY = interpolate(frame, [0, DUR], [-30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, DUR], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const neonShadow = `0 2px 6px rgba(0,60,130,0.9),
    0 0 14px rgba(120,215,255,0.95),
    0 0 40px rgba(90,185,255,0.8),
    0 0 90px rgba(70,160,255,0.6)`;

  const frontGlow = `0 2px 6px rgba(0,60,130,0.9),
    0 0 14px rgba(120,215,255,0.9),
    0 0 32px rgba(90,185,255,0.65)`;

  const faceStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 108,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontFamily: 'monospace, sans-serif',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at 50% 38%, #0a1230 0%, #050912 55%, #02040c 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          perspective: 900,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            transform: `rotateY(${rotateY}deg) scale(${scale})`,
            transformStyle: 'preserve-3d',
            opacity,
            textAlign: 'center',
          }}
        >
          {/* Extruded 3D body (layers stepping back into the screen) */}
          {Array.from({ length: BODY_STEPS }).map((_, i) => {
            const z = -(i + 1) * STEP;
            const t = i / (BODY_STEPS - 1); // 0 (front depth) -> 1 (back)
            const r = Math.round(18 + (1 - t) * 12);
            const g = Math.round(70 + (1 - t) * 50);
            const b = Math.round(140 + (1 - t) * 40);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  transform: `translateZ(${z}px)`,
                }}
              >
                <h1
                  style={{
                    ...faceStyle,
                    color: `rgb(${r},${g},${b})`,
                    WebkitTextStroke: '1px rgba(20,90,160,0.6)',
                  }}
                >
                  {TITLE}
                </h1>
              </div>
            );
          })}

          {/* Dark back plate */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: -6,
              transform: `translateZ(${-TOTAL_DEPTH - 2}px)`,
            }}
          >
            <h1
              style={{
                ...faceStyle,
                color: 'rgba(6,14,28,0.95)',
                WebkitTextStroke: '1px rgba(10,60,120,0.4)',
              }}
            >
              {TITLE}
            </h1>
          </div>

          {/* Front neon face */}
          <h1
            style={{
              ...faceStyle,
              color: '#e6f7ff',
              textShadow: frontGlow,
              WebkitTextStroke: '1px rgba(0,210,255,0.85)',
            }}
          >
            {TITLE}
          </h1>

          {/* Subtitle on the front plane */}
          <p
            style={{
              margin: '28px 0 0 0',
              fontSize: 34,
              letterSpacing: '6px',
              color: '#8fd8ff',
              textTransform: 'uppercase',
              fontFamily: 'monospace, sans-serif',
              fontWeight: 500,
              textShadow: '0 0 12px rgba(0,180,255,0.8)',
            }}
          >
            A Creator Build Series
          </p>
        </div>
      </div>

      {/* Streaming light-blue pixel squares drifting toward the upper-right */}
      <StreamParticles />

      {/* Pixelated grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.06,
          backgroundImage:
            'linear-gradient(rgba(90,220,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(90,220,255,0.5) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          pointerEvents: 'none',
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,10,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// --- Main Composition ---
export const FourMinuteCut: React.FC<{ title: string }> = ({ title }) => {
  const FPS = 30;

  return (
    <AbsoluteFill style={{
  backgroundColor: '#000000'
}}>
      {/* ===============================================================
          PHASE 1: HOOK & INTRO (0:00 - 0:13.8) -> Frames 0 to 414
         =============================================================== */}
      <Sequence from={0} durationInFrames={414}>
        {/* Intro music: epic jungle drums, full during the hook video,
            then fading to 0% across the cut to black (frames 270-288) */}
        <Audio
          src={staticFile('epic_jungle_drums.mp3')}
          volume={(f) =>
            interpolate(
              f,
              [0, 120, 270, 284, 288],
              [0.27, 0.27, 0.27, 0.05, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
          }
        />
        {/* Cold open clip from original edit around [00:10:16] (9s of content) */}
        <FadeIn durationInFrames={45}>
          <Video
            src={staticFile('raw_edit.mp4')}
            startFrom={10 * 60 * FPS + 16 * FPS}
            endAt={10 * 60 * FPS + 25 * FPS}
            volume={1.0}
          />
        </FadeIn>
        {/* Black cut (580ms = 18 frames) then title card (4.2s = 126 frames) */}
        <Sequence from={288} durationInFrames={126}>
          <NeonTitleCard />
        </Sequence>
      </Sequence>

      {/* ===============================================================
          PHASE 2: ACT 1 - $20 vs $200 AI DILEMMA (0:13.8 - 1:19) -> Frames 414 to 2394
         =============================================================== */}
      <Sequence from={414} durationInFrames={1980}>
        {/* Clip from original edit around [00:01:00] */}
        <Video
          src={staticFile('raw_edit.mp4')}
          startFrom={1 * 60 * FPS}
          endAt={2 * 60 * FPS + 6 * FPS}
          volume={1.0}
          style={{ transform: 'scale(1.08)' }} // Slight dynamic push-in
        />
      </Sequence>

      {/* ===============================================================
          PHASE 3: ACT 2 - BUILDING WRITERSCOUT (1:19 - 3:06) -> Frames 2394 to 5934
         =============================================================== */}
      <Sequence from={2394} durationInFrames={3540}>
        {/* Screen capture demonstration around [00:13:00] zoomed in for clarity */}
        <Video
          src={staticFile('raw_edit.mp4')}
          startFrom={12 * 60 * FPS + 22 * FPS}
          endAt={14 * 60 * FPS + 20 * FPS}
          volume={1.0}
          style={{ transform: 'scale(1.35) translate(-50px, -30px)' }}
        />
      </Sequence>

      {/* ===============================================================
          PHASE 4: ACT 3 - THE SUPER-PROMPT TEST (3:06 - 4:04) -> Frames 5934 to 7734
         =============================================================== */}
      <Sequence from={5934} durationInFrames={1800}>
        {/* Voice prompting & hitting the submission button at [00:23:10] */}
        <Video
          src={staticFile('raw_edit.mp4')}
          startFrom={23 * 60 * FPS + 10 * FPS}
          endAt={24 * 60 * FPS + 10 * FPS}
          volume={1.0}
        />
      </Sequence>

      {/* ===============================================================
          PHASE 5: OUTRO & WRAP-UP (4:04 - 4:17) -> Frames 7734 to 8124
         =============================================================== */}
      <Sequence from={7734} durationInFrames={390}>
        {/* Outro A: opening statement (src 9:55 - 10:02) */}
        <Video
          src={staticFile('raw_edit.mp4')}
          startFrom={9 * 60 * FPS + 55 * FPS}
          endAt={10 * 60 * FPS + 2 * FPS}
          volume={1.0}
        />
        {/* Outro B: closing line (src 10:12 - 10:18); skips the repeated middle */}
        <Sequence from={210}>
          <Video
            src={staticFile('raw_edit.mp4')}
            startFrom={10 * 60 * FPS + 12 * FPS}
            endAt={10 * 60 * FPS + 18 * FPS}
            volume={1.0}
          />
        </Sequence>
      </Sequence>

      {/* Subtle data-stream accents layered on top of the video body */}
      <Sequence from={414} durationInFrames={7800}>
        <DataStreams />
      </Sequence>
    </AbsoluteFill>
  );
};
