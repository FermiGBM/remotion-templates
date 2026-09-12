import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  interpolate,
  Easing,
  useCurrentFrame,
} from 'remotion';

// ============================================================
// RDC Loses It 😂  —  TikTok-style meme shortform
// Vertical 1080x1920 @ 30fps. Source is 16:9 1920x1080, letterboxed,
// big bold white ALL-CAPS captions w/ black outline, centered,
// overlapping lower third of the video (classic TikTok meme style).
// ============================================================

export const RDC_TOTAL_FRAMES = 6300; // 210s * 30

const VW = 1080;
const VH = 1920;
const VIDEO_W = 1080;
const VIDEO_H = 608; // 1080 * (9/16)
const HEADER_H = 300; // top meme caption bar
const VIDEO_TOP = HEADER_H; // video starts right under header

const HEADER_BG = '#0d0d12';
const ACCENT = '#ff2d55';
const GOLD = '#ffd54a';
const WHITE = '#ffffff';
const FONT = "'Roboto Bold', 'Arial Black', sans-serif";

const HEADER_TEXT = 'RDC LOSES IT';

// ---------------- captions ----------------
// start/end = seconds into clip. ALL-CAPS TikTok style, short punchy lines.
interface Cap {
  s: number;
  e: number;
  t: string;
}
const CAPS: Cap[] = [
  {s: 0.3, e: 3.5, t: 'GOD DAMMIT\u2026'},
  {s: 3.6, e: 8.0, t: "SO Y'ALL REALLY BULLIED THIS MAN TONIGHT"},
  {s: 8.0, e: 11.0, t: "I'M GONNA HEAD OUT"},
  {s: 11.0, e: 14.0, t: 'CHECK IN WITH ME TOMORROW AT 3 PM'},
  {s: 14.0, e: 17.5, t: "YOU KNOW WHAT HAPPENS IF YOU AIN'T THERE"},
  {s: 26.0, e: 30.5, t: 'OH GOSH BRO'},
  {s: 30.5, e: 35.0, t: "Y'ALL PLEASE RUN THIS WHOLE BACK ROAD"},
  {s: 35.0, e: 39.0, t: "I'M NOT GONNA LIE, I FORGOT YOU WERE HERE"},
  {s: 39.0, e: 43.0, t: 'PLEASE BRO'},
  {s: 50.7, e: 54.0, t: 'I CAN\u2019T BELIEVE THIS SH*T'},
  {s: 54.0, e: 58.5, t: 'I DON\u2019T KNOW THE F*CK OUT OF YOU'},
  {s: 61.5, e: 65.5, t: "Y'ALL HELD ME DOWN"},
  {s: 65.5, e: 69.0, t: 'NO, I WAS SECOND PLACE'},
  {s: 69.0, e: 73.0, t: 'YOU HELD THE F*CK OUT OF JAIL'},
  {s: 76.5, e: 80.0, t: 'SOMEBODY ELSE DID THAT SH*T TOO'},
  {s: 86.0, e: 90.0, t: 'YOU HIT ME AND EVERYBODY PASSED ME'},
  {s: 90.0, e: 94.5, t: 'BOUGHT OUR BEANS TO DONATE $5'},
  {s: 94.5, e: 99.5, t: 'TIP AFTER TIP, YOU STILL ENDED UP IN THE BACK'},
  {s: 99.5, e: 103.0, t: 'I JUST HAD TO ACCEPT IT'},
  {s: 103.5, e: 107.5, t: "Y'ALL SAT THERE AND WATCHED WHAT HAPPENED"},
  {s: 112.0, e: 116.0, t: 'THAT\u2019S MY MAMA! RUN IT BACK!'},
  {s: 116.0, e: 119.5, t: 'PLEASE DON\u2019T EMBARRASS OUR FAMILY'},
  {s: 119.5, e: 124.0, t: 'BRO, PLEASE, BRO'},
  {s: 124.0, e: 128.0, t: "IT'S UP, BRO. WE LOST."},
];

// ---------------- zoom keyframes ----------------
interface Zoom {
  at: number;
  s: number;
  x: number;
  y: number;
}
const ZOOMS: Zoom[] = [
  {at: 0.0, s: 1.0, x: 0.5, y: 0.5},
  {at: 25.0, s: 1.3, x: 0.24, y: 0.72},
  {at: 51.0, s: 1.45, x: 0.22, y: 0.75},
  {at: 81.0, s: 1.25, x: 0.26, y: 0.7},
  {at: 103.0, s: 1.4, x: 0.23, y: 0.74},
  {at: 116.0, s: 1.5, x: 0.21, y: 0.76},
  {at: 124.0, s: 1.3, x: 0.25, y: 0.72},
  {at: 130.0, s: 1.0, x: 0.5, y: 0.5},
];

function zoomAt(t: number) {
  const kf = [...ZOOMS].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < kf.length; k++) if (t >= kf[k].at) i = k;
  const a = kf[i];
  const b = kf[i + 1] ?? a;
  const dur = b.at - a.at || 1;
  const local = Math.min(Math.max((t - a.at) / dur, 0), 1);
  const ease = Easing.inOut(Easing.cubic)(local);
  const scale = a.s + (b.s - a.s) * ease;
  const fx = a.x + (b.x - a.x) * ease;
  const fy = a.y + (b.y - a.y) * ease;
  const tx = (0.5 - fx) * 100;
  const ty = (0.5 - fy) * 100;
  return {scale, tx, ty};
}

// ---------------- Header ----------------
const HeaderBar: React.FC<{frame: number}> = ({frame}) => {
  const opacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(frame, [0, 22], [-20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: VW,
        height: HEADER_H,
        background: HEADER_BG,
        opacity,
        transform: `translateY(${slide}px)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT}}>
        <span
          style={{
            color: WHITE,
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
          }}
        >
          {HEADER_TEXT}
        </span>
        <span style={{fontSize: 80}}>😂</span>
      </div>
      <div
        style={{
          marginTop: 18,
          width: 420,
          height: 10,
          borderRadius: 5,
          background: `linear-gradient(90deg, ${ACCENT}, ${GOLD})`,
          transform: `scaleX(${interpolate(frame, [10, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
        }}
      />
    </div>
  );
};

// ---------------- TikTok caption ----------------
// Big bold ALL-CAPS white text with a heavy black outline, centered,
// sitting in the lower third of the video. Pop animation on change.
const CaptionSingle: React.FC<{cap: Cap}> = ({cap}) => {
  const frame = useCurrentFrame();
  // pop-in (relative to Sequence start)
  const pop = interpolate(frame, [0, 4], [0.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.6)),
  });
  const fade = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40, // inside video area lower third
        left: 0,
        width: VIDEO_W,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 6,
        opacity: fade,
        transform: `scale(${pop})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 52,
          lineHeight: 1.15,
          color: WHITE,
          textAlign: 'center',
          maxWidth: 980,
          padding: '0 30px',
          // classic TikTok outline: layered shadows ≈ stroke
          textShadow:
            '3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000,' +
            '0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000,' +
            '0 6px 12px rgba(0,0,0,0.6)',
          WebkitTextStroke: '2px #000',
          letterSpacing: 1,
        }}
      >
        {cap.t}
      </div>
    </div>
  );
};

// Shows whichever caption is active at composition time
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cap = CAPS.find((c) => t >= c.s && t < c.e);
  if (!cap) return null;
  return <CaptionSingle cap={cap} />;
};

// ---------------- Video + zoom ----------------
const ZoomedVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const {scale, tx, ty} = zoomAt(t);
  return (
    <div
      style={{
        position: 'absolute',
        top: VIDEO_TOP,
        left: 0,
        width: VIDEO_W,
        height: VIDEO_H,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <OffthreadVideo
          src={staticFile('video/rdc_clip.mp4')}
          style={{width: '100%', height: '100%', objectFit: 'fill'}}
        />
      </div>
      {/* captions layered on top of video, inside same container so they sit at bottom of video */}
      <Captions />
    </div>
  );
};

// font-face for Roboto Bold
const fontCss = `
@font-face {
  font-family: 'Roboto Bold';
  src: url('${staticFile('fonts/Roboto-Bold.ttf')}') format('truetype');
  font-weight: 900;
}
`;

// ---------------- Main ----------------
export const RDCShort: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: HEADER_BG}}>
      <style>{fontCss}</style>
      <HeaderBar frame={frame} />
      <ZoomedVideo />
    </AbsoluteFill>
  );
};

export default RDCShort;