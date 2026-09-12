import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  staticFile,
  interpolate,
  useCurrentFrame,
  Easing,
} from 'remotion';

const FPS = 30;

const fontCss = `
@font-face {
  font-family: 'Roboto Bold';
  src: url('${staticFile('fonts/Roboto-Bold.ttf')}') format('truetype');
  font-weight: 900;
}
`;

const INTRO_END = 60;
const BEFORE_START = INTRO_END;
const BEFORE_END = 420;
const TRANSITION_START = BEFORE_END;
const TRANSITION_END = 465;
const AFTER_VIDEO_START = TRANSITION_END;
const AFTER_VIDEO_END = 809;
const CTA_START = AFTER_VIDEO_END;
const TOTAL = 900;

interface CaptionProps {
  text: string;
  y?: number;
  size?: number;
  delay?: number;
  duration?: number;
}

const Caption: React.FC<CaptionProps> = ({
  text,
  y = 1480,
  size = 72,
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 8, delay + duration, delay + duration + 8], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [delay, delay + 10], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        width: 1080,
        textAlign: 'center',
        opacity,
        transform: `scale(${scale})`,
        fontFamily: "'Roboto Bold', 'Arial Black', Arial, sans-serif",
        fontSize: size,
        fontWeight: 900,
        color: '#ffffff',
        textShadow:
          '3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000,' +
          '0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000,' +
          '0 6px 12px rgba(0,0,0,0.6)',
        WebkitTextStroke: '2px #000',
        padding: '0 40px',
        boxSizing: 'border-box',
        zIndex: 10,
      }}
    >
      {text}
    </div>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const zoom = interpolate(frame, [0, 59], [1, 1.12], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
          transform: `scale(${zoom})`,
        }}
      >
        <Img
          src={staticFile('lethimcook.png')}
          style={{
            width: 820,
            height: 'auto',
            marginTop: -520,
            borderRadius: 28,
            boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
          }}
        />
        <Caption text={'POV: You let your barber cook 👨‍🍳'} y={1180} size={72} delay={12} duration={40} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

interface ClipZoomProps {
  src: string;
  fromScale: number;
  toScale: number;
  duration: number;
  offset?: number;
}

const ClipZoom: React.FC<ClipZoomProps> = ({ src, fromScale, toScale, duration, offset = 0 }) => {
  const frame = useCurrentFrame() - offset;
  const zoom = interpolate(frame, [0, duration], [fromScale, toScale], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Video
        src={staticFile(src)}
        style={{
          width: 1080,
          height: 1920,
          objectFit: 'cover',
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
};

const BeforeScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <ClipZoom src="media/before.mp4" fromScale={1} toScale={1.18} duration={360} />
      <Caption text={'The struggle was real 😭'} y={1500} delay={8} duration={330} />
    </AbsoluteFill>
  );
};

const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 45], [1.25, 1.6], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const flash = interpolate(frame, [0, 6, 30, 44], [0, 0.75, 0.25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Img
        src={staticFile('before_freeze.jpg')}
        style={{
          width: 1080,
          height: 1920,
          objectFit: 'cover',
          transform: `scale(${zoom})`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(255,255,255,${flash})` }} />
      <Caption text={'Then I found the right one…'} y={1380} size={64} delay={6} duration={34} />
    </AbsoluteFill>
  );
};

const AfterScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <ClipZoom src="media/after.mp4" fromScale={1.5} toScale={1.06} duration={344} />
      <Caption text={'Safe to say he locked in 🔒'} y={1480} delay={14} duration={300} />
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 90], [1.08, 1.16], {
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [72, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      <Img
        src={staticFile('after_freeze.jpg')}
        style={{
          width: 1080,
          height: 1920,
          objectFit: 'cover',
          transform: `scale(${zoom})`,
          opacity: fadeOut,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0,0,0,${(1 - fadeOut) * 0.6})`,
        }}
      />
      <Caption text={'DM to book your slot ✂️'} y={1520} size={76} delay={4} duration={78} />
    </AbsoluteFill>
  );
};

const Watermark: React.FC = () => {
  const items = Array.from({ length: 4 * 4 }, (_, i) => i);
  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -500,
          left: -400,
          width: 2000,
          height: 3000,
          display: 'flex',
          flexWrap: 'wrap',
          transform: 'rotate(-26deg)',
          transformOrigin: 'center center',
        }}
      >
        {items.map((i) => (
          <div
            key={i}
            style={{
              fontSize: 92,
              fontWeight: 900,
              fontFamily: "'Roboto Bold', 'Arial Black', Arial, sans-serif",
              color: 'rgba(255,255,255,0.18)',
              letterSpacing: 8,
              whiteSpace: 'nowrap',
              margin: '128px 56px',
            }}
          >
            HAZE STUDIOS
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const BarberReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Arial, sans-serif' }}>
      <style>{fontCss}</style>
      <Audio
        src={staticFile('audio/low_contrast.mp3')}
        startFrom={24}
        volume={(f) =>
          interpolate(f, [TOTAL - 12, TOTAL], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      <Sequence from={0} durationInFrames={INTRO_END}>
        <IntroScene />
      </Sequence>
      <Sequence from={BEFORE_START} durationInFrames={BEFORE_END - BEFORE_START}>
        <BeforeScene />
      </Sequence>
      <Sequence from={TRANSITION_START} durationInFrames={TRANSITION_END - TRANSITION_START}>
        <TransitionScene />
      </Sequence>
      <Sequence from={AFTER_VIDEO_START} durationInFrames={AFTER_VIDEO_END - AFTER_VIDEO_START}>
        <AfterScene />
      </Sequence>
      <Sequence from={CTA_START} durationInFrames={TOTAL - CTA_START}>
        <CTAScene />
      </Sequence>
      <Watermark />
    </AbsoluteFill>
  );
};