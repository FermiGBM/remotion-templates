import {useCurrentFrame} from 'remotion';
import {palette, spring} from '../theme';

interface Props {
  delay: number; // frame offset for pop-in
  size?: number;
  kind?: 'shelter' | 'food' | 'water' | 'health' | 'play' | 'heart';
}

/**
 * A bold, minimal animated icon. Pops in with scale + slight rotation,
 * matching the reference motion language.
 */
export const Icon: React.FC<Props> = ({delay, size = 90, kind = 'shelter'}) => {
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    from: 0,
    to: 1,
    config: {damping: 18, stiffness: 160},
  });
  const scale = 0.6 + s * 0.4; // 0.6 -> 1.0
  const rotate = (1 - s) * -18; // settle from -18deg

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity: s,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {kind === 'shelter' && (
          <g>
            <polygon points="10,55 50,15 90,55" fill={palette.henRed} stroke={palette.brown} strokeWidth="3" />
            <rect x="20" y="55" width="60" height="35" rx="4" fill={palette.straw} stroke={palette.brown} strokeWidth="3" />
            <rect x="42" y="62" width="16" height="28" rx="6" fill={palette.brown} />
          </g>
        )}
        {kind === 'food' && (
          <g>
            <path d="M18,30 L42,30 Q50,55 40,78 L20,78 Q10,55 18,30 Z" fill={palette.henOrange} />
            <path d="M48,30 L72,30 Q80,62 66,80 L54,80 Q40,62 48,30 Z" fill={palette.straw} />
            <circle cx="30" cy="52" r="7" fill={palette.leaf} />
            <circle cx="60" cy="50" r="7" fill={palette.brown} />
          </g>
        )}
        {kind === 'water' && (
          <g>
            <path d="M50,10 Q 62,28 62,42 A12,12 0 0 1 38,42 Q38,28 50,10 Z" fill={palette.sky} stroke={palette.brown} strokeWidth="3" />
            <rect x="22" y="52" width="56" height="30" rx="8" fill={palette.white} stroke={palette.brown} strokeWidth="3" />
            <path d="M24,62 Q50,40 76,62" fill={palette.sky} />
          </g>
        )}
        {kind === 'health' && (
          <g>
            <rect x="30" y="18" width="40" height="30" rx="8" fill={palette.white} stroke={palette.brown} strokeWidth="3" />
            <rect x="42" y="10" width="6" height="12" fill={palette.white} stroke={palette.brown} strokeWidth="2" />
            <rect x="52" y="10" width="6" height="12" fill={palette.white} stroke={palette.brown} strokeWidth="2" />
            <rect x="22" y="42" width="56" height="40" rx="8" fill={palette.henRed} stroke={palette.brown} strokeWidth="3" />
            <circle cx="50" cy="62" r="10" fill={palette.white} />
          </g>
        )}
        {kind === 'play' && (
          <g>
            <circle cx="50" cy="50" r="26" fill={palette.leafAlt} stroke={palette.brown} strokeWidth="3" />
            <path d="M34,40 Q50,30 66,40 Q70,52 62,60 Q50,66 38,60 Q30,52 34,40 Z" fill={palette.leaf} />
            <circle cx="42" cy="30" r="6" fill={palette.henRed} />
          </g>
        )}
        {kind === 'heart' && (
          <path
            d="M50,85 C 20,65 18,38 32,28 C 42,21 50,28 50,36 C 50,28 58,21 68,28 C 82,38 80,65 50,85 Z"
            fill={palette.henRed}
          />
        )}
      </svg>
    </div>
  );
};