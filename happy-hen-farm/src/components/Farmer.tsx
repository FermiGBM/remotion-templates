import {useCurrentFrame, spring, interpolate} from 'remotion';
import {palette} from '../theme';

interface Props {
  groundY: number; // vertical position of feet
  x: number; // horizontal center
  scale?: number;
  waveStart?: number; // frame at which waving begins (idle otherwise)
}

/**
 * A friendly farmer in overalls + straw hat. Subtle idle sway;
 * optional wave animation when waveStart is provided.
 */
export const Farmer: React.FC<Props> = ({
  groundY,
  x,
  scale = 1,
  waveStart,
}) => {
  const frame = useCurrentFrame();

  // Gentle idle sway
  const sway = Math.sin(frame / 14) * 1.5;

  // Wave: rotate forearm up-down if waveStart set
  const waveAngle = interpolate(frame, [0, 20], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const forearm = waveStart !== undefined ? interpolate(
    Math.sin((frame - waveStart) / 5),
    [-1, 1],
    [waveStart !== undefined ? 60 : 40, waveStart !== undefined ? -10 : 45]
  ) : 45;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: groundY,
        width: 130 * scale,
        height: 230 * scale,
        transform: `translate(-50%, -100%) rotate(${sway}deg)`,
        zIndex: 4,
      }}
    >
      <svg
        viewBox="0 0 130 230"
        width={130 * scale}
        height={230 * scale}
        style={{overflow: 'visible'}}
      >
        {/* Legs */}
        <line x1="52" y1="210" x2="46" y2="230" stroke={palette.brown} strokeWidth="7" />
        <line x1="78" y1="210" x2="84" y2="230" stroke={palette.brown} strokeWidth="7" />
        {/* Body / overalls */}
        <rect x="40" y="120" width="50" height="92" rx="14" fill={palette.straw} stroke={palette.brown} strokeWidth="3" />
        {/* Overalls straps */}
        <line x1="50" y1="120" x2="50" y2="96" stroke={palette.leaf} strokeWidth="6" />
        <line x1="80" y1="120" x2="80" y2="96" stroke={palette.leaf} strokeWidth="6" />
        <line x1="46" y1="150" x2="84" y2="150" stroke={palette.leaf} strokeWidth="6" />
        {/* Left arm (idle at side) */}
        <line x1="40" y1="140" x2="24" y2="180" stroke={palette.henOrange} strokeWidth="8" strokeLinecap="round" />
        {/* Right arm waving */}
        <g style={{transformOrigin: '90px 140px', transform: `rotate(${waveStart !== undefined ? waveAngle : 0}deg)`}}>
          <line x1="90" y1="140" x2="110" y2="108" stroke={palette.henOrange} strokeWidth="8" strokeLinecap="round" />
          {/* Forearm that waves */}
          <g style={{transformOrigin: '110px 108px', transform: `rotate(${forearm}deg)`}}>
            <line x1="110" y1="108" x2="120" y2="72" stroke={palette.henOrange} strokeWidth="8" strokeLinecap="round" />
          </g>
        </g>
        {/* Head */}
        <circle cx="65" cy="76" r="28" fill="#F6C9A0" stroke={palette.brown} strokeWidth="3" />
        {/* Straw hat */}
        <ellipse cx="65" cy="58" rx="44" ry="12" fill={palette.straw} stroke={palette.brown} strokeWidth="3" />
        <rect x="45" y="30" width="40" height="28" rx="10" fill={palette.straw} stroke={palette.brown} strokeWidth="3" />
        {/* Face */}
        <circle cx="74" cy="76" r="2.5" fill="#333" />
        <path d="M70,84 Q 74,88 78,84" stroke="#333" strokeWidth="2" fill="none" />
        <circle cx="56" cy="78" r="4" fill={palette.henRed} opacity="0.6" />
      </svg>
    </div>
  );
};