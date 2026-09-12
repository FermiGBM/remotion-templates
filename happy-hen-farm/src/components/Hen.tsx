import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {palette, spring} from '../theme';

interface WalkProps {
  startFrame: number;
  endFrame: number;
  startX: number; // px offset from its own anchored position
  endX: number;
  groundY: number; // vertical position (top of body)
  scale?: number;
  flapTimes?: number[]; // frames at which to do a wing flap
}

/**
 * A flat cartoon hen (round body, bright comb, friendly eye).
 * Supports walking across screen + wing flaps + idle bob.
 */
export const Hen: React.FC<WalkProps> = ({
  startFrame,
  endFrame,
  startX,
  endX,
  groundY,
  scale = 1,
  flapTimes = [],
}) => {
  const frame = useCurrentFrame();

  // Horizontal walk progress (ease in-out). If startX===endX, stay put.
  const x =
    startX === endX
      ? startX
      : interpolate(frame, [startFrame, endFrame], [startX, endX], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.ease),
        });

  // Gentle idle bob (always on)
  const bob = Math.sin(frame / 6) * 3;

  // Wing flap: animate -60deg off from 0 whenever a flapTime is reached.
  // Multiple flaps overlap: pick the most recently triggered one.
  const active = flapTimes.filter((t) => frame >= t).sort((a, b) => b - a)[0];
  const wing = (flapStart: number) => {
    const local = Math.max(0, frame - flapStart);
    const s = spring({
      frame: local,
      from: 0,
      to: 1,
      config: {damping: 10, stiffness: 200},
    });
    return interpolate(s, [0, 1], [0, -60]); // degrees
  };
  // Which direction: alternate per trigger index
  const flapIdx = active !== undefined ? flapTimes.indexOf(active) : 0;
  const dir = flapIdx % 2 === 0 ? 1 : -1;
  const wingAngle =
    active !== undefined ? wing(active) * dir : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: groundY + bob,
        width: 160 * scale,
        height: 140 * scale,
        transform: `translate(-50%, -100%)`,
        zIndex: 5,
      }}
    >
      <svg
        viewBox="0 0 160 140"
        width={160 * scale}
        height={140 * scale}
        style={{overflow: 'visible'}}
      >
        {/* Body */}
        <ellipse cx="80" cy="95" rx="58" ry="42" fill={palette.white} stroke={palette.brown} strokeWidth="3" />
        {/* Tail feathers */}
        <path d="M14,80 Q -8,60 6,40 Q 20,55 18,78 Z" fill={palette.brown} />
        {/* Wing (flaps) */}
        <ellipse
          cx="70"
          cy="92"
          rx="30"
          ry="22"
          fill={palette.henOrange}
          stroke={palette.brown}
          strokeWidth="3"
          style={{transformOrigin: '70px 92px'}}
          transform={`rotate(${wingAngle} 70 92)`}
        />
        {/* Legs */}
        <line x1="62" y1="132" x2="58" y2="150" stroke={palette.henOrange} strokeWidth="4" />
        <line x1="98" y1="132" x2="102" y2="150" stroke={palette.henOrange} strokeWidth="4" />
        {/* Neck + head */}
        <path d="M96,78 C 104,60 108,50 116,42" fill="none" stroke={palette.white} strokeWidth="18" />
        <circle cx="122" cy="34" r="20" fill={palette.white} stroke={palette.brown} strokeWidth="3" />
        {/* Comb */}
        <path d="M110,16 L114,2 L120,14 L126,0 L132,16 L138,6 L140,20 Z" fill={palette.henRed} />
        {/* Beak */}
        <polygon points="140,32 156,36 140,42" fill={palette.henOrange} />
        {/* Eye */}
        <circle cx="126" cy="32" r="3" fill="#333" />
      </svg>
    </div>
  );
};