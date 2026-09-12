import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

// ============================================================
// Building Claude One — Episode 1 sample cut
// "I doubled my AI budget with this one simple move!"
// 1920x1080 @ 60fps. Assembled from source chunks.
// Now in TRUE narrative (dialogue) order, interleaved with
// B-roll reaction shots, with varied creative transitions.
// ============================================================

export const TOTAL_FRAMES = 11780; // caps at full segment sum (~196s); raised from 130s

const VW = 1920;
const VH = 1080;
const HEADER_H = 120;
const HEADER_BG = '#0d0d12';
const ACCENT = '#e84d4d';
const GOLD = '#ffb800';
const WHITE = '#ffffff';
const FONT = "'Arial Black', 'Arial Bold', sans-serif";
const BODY_FONT = "'Arial', sans-serif";

const HEADER_TEXT = 'BUILDING CLAUDE ONE';
const HEADER_SUB = 'EP 1 · I DOUBLED MY AI BUDGET';

type Seg = {
  clip: number;
  srcIn: number; // seconds into source clip
  dur: number; // seconds to show
  // subtle transition style coming IN (kept restrained for cleaner cuts)
  transition?: 'zoom' | 'wipe' | 'circle' | 'slide' | 'fade';
};

// Narrative order follows the creator's actual spoken thread:
// 1. premise (superior AI) -> 2. first prompt -> 3. all-in access ->
// 4. why I came to you -> 5. naming the project -> 6. real work (secrets) ->
// 7. the actual project (data/ratings) -> 8. results -> outro
// B-roll reaction shots (clip06-10) interleaved as cutaways.
// Total runtime targets ~130s (>= 2 min).
const SEGS: Seg[] = [
  // HOOK — cold open on the premise
  {clip: 1, srcIn: 4.0, dur: 9.0, transition: 'zoom'},
  {clip: 1, srcIn: 13.0, dur: 4.6, transition: 'wipe'},
  {clip: 8, srcIn: 0, dur: 2.6, transition: 'circle'},
  // FIRST PROMPT — the money moment
  {clip: 12, srcIn: 40.0, dur: 16.0, transition: 'wipe'},
  {clip: 12, srcIn: 56.0, dur: 11.0, transition: 'zoom'},
  {clip: 12, srcIn: 70.0, dur: 12.5, transition: 'slide'},
  // FULL ACCESS
  {clip: 2, srcIn: 2.0, dur: 11.0, transition: 'zoom'},
  {clip: 2, srcIn: 13.0, dur: 9.0, transition: 'wipe'},
  // WHY I CAME TO YOU
  {clip: 4, srcIn: 5.0, dur: 10.0, transition: 'slide'},
  {clip: 4, srcIn: 15.0, dur: 8.5, transition: 'circle'},
  // NAMING THE PROJECT
  {clip: 3, srcIn: 6.0, dur: 11.0, transition: 'zoom'},
  // REAL WORK — secrets/env/gitignore
  {clip: 13, srcIn: 2.0, dur: 16.0, transition: 'circle'},
  {clip: 13, srcIn: 18.0, dur: 14.0, transition: 'wipe'},
  // THE ACTUAL PROJECT — data & ratings
  {clip: 11, srcIn: 1.0, dur: 18.0, transition: 'wipe'},
  {clip: 11, srcIn: 20.0, dur: 12.0, transition: 'zoom'},
  {clip: 11, srcIn: 33.0, dur: 10.0, transition: 'slide'},
  {clip: 6, srcIn: 0, dur: 2.8, transition: 'circle'},
  // RESULTS — building & storing
  {clip: 5, srcIn: 0, dur: 7.0, transition: 'slide'},
  {clip: 7, srcIn: 0, dur: 2.8, transition: 'zoom'},
  // OUTRO / tease next episode
  {clip: 10, srcIn: 0, dur: 8.5, transition: 'wipe'},
];

const FPS = 60;

function buildTimeline(): {seg: Seg; startFrame: number; endFrame: number}[] {
  let t = 0;
  const out: {seg: Seg; startFrame: number; endFrame: number}[] = [];
  for (const seg of SEGS) {
    const dur = Math.round(seg.dur * FPS);
    out.push({seg, startFrame: t, endFrame: t + dur});
    t += dur;
  }
  return out;
}
const TIMELINE = buildTimeline();

let MAX_END = 0;
for (const it of TIMELINE) MAX_END = Math.max(MAX_END, it.endFrame);
export const SAMPLE_DURATION_FRAMES = Math.min(TOTAL_FRAMES, MAX_END);

function Header() {
  return (
    <AbsoluteFill
      style={{
        height: HEADER_H,
        backgroundColor: HEADER_BG,
        justifyContent: 'center',
        paddingLeft: 60,
        paddingRight: 60,
        zIndex: 100,
      }}
    >
      <div
        style={{
          color: WHITE,
          fontFamily: FONT,
          fontSize: 52,
          letterSpacing: 2,
          fontWeight: 800,
        }}
      >
        {HEADER_TEXT}
        <span style={{color: ACCENT}}> █</span>
      </div>
      <div
        style={{
          color: GOLD,
          fontFamily: BODY_FONT,
          fontSize: 24,
          letterSpacing: 1,
          marginTop: 4,
          fontWeight: 700,
        }}
      >
        {HEADER_SUB}
      </div>
    </AbsoluteFill>
  );
}

// Restrained transition effect applied to the video layer of the current segment
function TransitionEffect({
  transition,
  frame,
  dur,
  children,
}: {
  transition?: Seg['transition'];
  frame: number;
  dur: number;
  children: React.ReactNode;
}) {
  const t = transition ?? 'fade';
  const P = 8; // short, restrained transition period in frames
  const fIn = Math.min(frame, P);
  const fOut = Math.max(0, dur - frame);
  const fOutC = Math.min(Math.max(dur - frame, 0), P);

  // ---- zoom: punch-in from 1.25 -> 1.0 on enter
  let style: React.CSSProperties = {};
  if (t === 'zoom') {
    const s = interpolate(fIn, [0, P], [1.22, 1.0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    style = {transform: `scale(${s})`};
  }
  // Wipe and circle transitions intentionally fall back to the transparent fade below;
  // hard masks were removed because they made cuts feel busy.
  /*
  // ---- wipe: clip-path sliding black bar reveals from left
  if (t === 'wipe') {
    const pct = interpolate(fIn, [0, P], [0, 100], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    style = {clipPath: `inset(0 ${100 - pct}% 0 0)`};
  }
  // ---- circle: expanding radial reveal
  if (t === 'circle') {
    const r = interpolate(fIn, [0, P], [0, 2200], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    style = {clipPath: `circle(${r}px at 50% 50%)`};
  }
  */
  // ---- slide: translate from right
  if (t === 'slide') {
    const x = interpolate(fIn, [0, P], [120, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    style = {transform: `translateX(${x}px)`};
  }

  // exit fade-out on every segment (keeps cuts smooth)
  const opacity = interpolate(fOutC, [0, P], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity, ...style}}>
      {children}
    </AbsoluteFill>
  );
}

function SegmentSequenceLayer({
  item,
}: {
  item: {seg: Seg; startFrame: number; endFrame: number};
}) {
  const frame = useCurrentFrame();
  const dur = item.endFrame - item.startFrame;
  const {seg} = item;

  const srcStartFrame = Math.floor((seg.srcIn ?? 0) * FPS);
  const srcEndFrame = Math.floor(((seg.srcIn ?? 0) + seg.dur) * FPS);

  return (
    <TransitionEffect transition={seg.transition} frame={frame} dur={dur}>
      <OffthreadVideo
        src={staticFile(`clips/clip${String(seg.clip).padStart(2, '0')}.mov`)}
        style={{width: '100%', height: '100%', objectFit: 'contain'}}
        muted={false}
        startFrom={srcStartFrame}
        endAt={srcEndFrame}
      />
    </TransitionEffect>
  );
}

export const BuildingClaudeOne: React.FC = () => {
  const videoTop = HEADER_H;
  const videoH = VH - HEADER_H;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{top: videoTop, height: videoH}}>
        {TIMELINE.map((item, i) => {
          const dur = Math.max(1, item.endFrame - item.startFrame);
          return (
            <Sequence key={i} from={item.startFrame} durationInFrames={dur}>
              <SegmentSequenceLayer item={item} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Header />
    </AbsoluteFill>
  );
};