import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {palette} from '../theme';

/**
 * Layered parallax background: soft sky gradient + rolling hills +
 * subtle barn silhouette that moves at slightly different speeds.
 * frame is the global video frame so parallax flows across the whole piece.
 */
export const Background: React.FC<{frame?: number}> = ({frame = 0}) => {
  // Slow parallax offsets — different layers move at different speeds
  const hills = interpolate(frame, [0, 4500], [0, 40], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });
  const barn = interpolate(frame, [0, 4500], [0, -25], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });
  const clouds = interpolate(frame, [0, 4500], [0, 80], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill style={{background: palette.cream, overflow: 'hidden'}}>
      {/* Sky gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, #FDF6E3 0%, #FDF0D0 45%, #F4D35E 100%)',
        }}
      />

      {/* Clouds layer (parallax slowest) */}
      <div
        style={{
          position: 'absolute',
          width: '120%',
          height: '100%',
          top: 0,
          left: -100 - clouds,
          opacity: 0.6,
        }}
      >
        <Cloud x={200} y={180} scale={1.4} />
        <Cloud x={980} y={90} scale={1.1} />
        <Cloud x={1500} y={260} scale={1.6} />
      </div>

      {/* Hills layer (mid speed) */}
      <div
        style={{
          position: 'absolute',
          width: '110%',
          height: 500,
          bottom: -60,
          left: -40 - hills,
        }}
      >
        <svg viewBox="0 0 2000 500" width="100%" height="100%" preserveAspectRatio="none">
          {/* Back hill */}
          <ellipse cx="400" cy="320" rx="700" ry="260" fill={palette.leafAlt} opacity="0.55" />
          {/* Front-left hill */}
          <ellipse cx="250" cy="420" rx="900" ry="300" fill={palette.leaf} opacity="0.6" />
          {/* Front-right hill */}
          <ellipse cx="1600" cy="430" rx="850" ry="300" fill={palette.leaf} opacity="0.45" />
        </svg>
      </div>

      {/* Barn silhouette layer (parallax fastest) */}
      <div
        style={{
          position: 'absolute',
          right: 100 + barn,
          bottom: 0,
          opacity: 0.9,
        }}
      >
        <Barn />
      </div>
    </AbsoluteFill>
  );
};

const Cloud: React.FC<{x: number; y: number; scale: number}> = ({x, y, scale}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${scale})`,
      opacity: 0.9,
    }}
  >
    <svg width="220" height="120" viewBox="0 0 220 120">
      <g fill={palette.white}>
        <ellipse cx="70" cy="80" rx="60" ry="38" />
        <ellipse cx="140" cy="70" rx="70" ry="45" />
        <ellipse cx="110" cy="55" rx="50" ry="38" />
      </g>
    </svg>
  </div>
);

const Barn: React.FC = () => (
  <svg width="420" height="330" viewBox="0 0 420 330">
    {/* Body */}
    <rect x="40" y="130" width="340" height="200" fill={palette.henRed} />
    {/* Stripes */}
    <rect x="40" y="130" width="340" height="26" fill={palette.white} opacity="0.18" />
    <rect x="40" y="182" width="340" height="26" fill={palette.brown} opacity="0.18" />
    <rect x="40" y="234" width="340" height="26" fill={palette.brown} opacity="0.18" />
    {/* Roof */}
    <polygon points="210,30 40,130 380,130" fill={palette.brown} />
    <polygon points="210,30 40,130 210,80" fill={palette.straw} />
    {/* Door */}
    <rect x="180" y="210" width="60" height="120" rx="16" fill={palette.straw} />
    <rect x="188" y="218" width="44" height="112" rx="10" fill={palette.brown} />
    <circle cx="222" cy="272" r="5" fill="#F4D35E" />
  </svg>
);