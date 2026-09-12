import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Hen} from './Hen';
import {Icon} from './Icon';
import {palette, spring} from '../theme';

/**
 * 42-65s Food & Water. Farmer pours feed + water (liquid fill anim),
 * hen pecks happily with wing-flap hops. Kinetic headline.
 */
export const FoodWaterScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = spring({frame, from: 0, to: 1, config: {damping: 20, stiffness: 130}});

  // Trough + water bowl liquid fill
  const feedFill = interpolate(frame, [30, 160], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const waterFill = interpolate(frame, [80, 220], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Hop on peck: small bounce (repeats)
  const hop = Math.abs(Math.sin(frame / 8)) * -18;

  return (
    <AbsoluteFill style={{opacity: fade}}>
      {/* Kinetic headline */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          textAlign: 'center',
          fontSize: 46,
          color: palette.brown,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
        }}
      >
        {'Balanced diet + fresh water = '.split(' ').map((w, i) => {
          const s = spring({frame: Math.max(0, frame - (i * 6 + 10)), from: 0, to: 1, config: {damping: 20, stiffness: 150}});
          return (
            <span key={i} style={{display: 'inline-block', opacity: s, transform: `scale(${s})`, marginRight: 8}}>
              {w}
            </span>
          );
        })}
      </div>

      {/* Food trough (left) */}
      <div style={{position: 'absolute', left: 260, top: 380}}>
        <div style={{position: 'relative', width: 220, height: 90}}>
          <svg viewBox="0 0 220 90" width="220" height="90">
            <path d="M10,20 L210,20 L190,80 L30,80 Z" fill={palette.straw} stroke={palette.brown} strokeWidth="3" />
            {/* Feed fill */}
            <rect x="20" y={80 - feedFill * 0.5} width="180" height={feedFill * 0.5} fill={palette.henOrange} rx="4" />
            <circle cx="60" cy="50" r="7" fill={palette.leaf} />
            <circle cx="120" cy="55" r="7" fill={palette.brown} />
          </svg>
        </div>
        <div style={{textAlign: 'center', fontSize: 24, color: palette.leaf, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif"}}>Feed</div>
      </div>

      {/* Water bowl (right) */}
      <div style={{position: 'absolute', right: 260, top: 380}}>
        <div style={{position: 'relative', width: 220, height: 90}}>
          <svg viewBox="0 0 220 90" width="220" height="90">
            <rect x="20" y="20" width="180" height="60" rx="20" fill={palette.white} stroke={palette.brown} strokeWidth="3" />
            <rect x="26" y={70 - waterFill * 0.45} width="168" height={waterFill * 0.45 - 8} fill={palette.sky} rx="6" />
          </svg>
        </div>
        <div style={{textAlign: 'center', fontSize: 24, color: palette.sky, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif"}}>Water</div>
      </div>

      {/* Hen pecking between them with hops */}
      <Hen
        startFrame={0}
        endFrame={0}
        startX={940}
        endX={940}
        groundY={700 + hop}
        scale={1.4}
        flapTimes={[90, 130, 170]}
      />

      {/* Icons reinforcing key nutrients */}
      <div style={{position: 'absolute', left: 60, bottom: 40, display: 'flex', gap: 40}}>
        <Icon kind="food" delay={50} size={72} />
        <Icon kind="water" delay={110} size={72} />
      </div>
    </AbsoluteFill>
  );
};