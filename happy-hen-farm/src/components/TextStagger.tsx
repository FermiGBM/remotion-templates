import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {spring} from '../theme';

interface Props {
  words: string[];
  delays: number[]; // frame offsets per word
  baseY: number;
  baseSize: number;
  color: string;
  centerX?: number; // 0..1 fraction of screen width, default 0.5
}

/**
 * Reusable staggered word entrance with spring scale + opacity.
 */
export const TextStagger: React.FC<Props> = ({
  words,
  delays,
  baseY,
  baseSize,
  color,
  centerX = 0.5,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: baseY,
          left: `${centerX * 100}%`,
          transform: 'translateX(-50%)',
          fontSize: baseSize,
          color,
          textAlign: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          lineHeight: 1.15,
          whiteSpace: 'pre-wrap',
        }}
      >
        {words.map((w, i) => {
          const start = delays[i] ?? i * 6;
          const opacity = spring({
            frame: Math.max(0, frame - start),
            from: 0,
            to: 1,
            config: {damping: 20, stiffness: 140},
          });
          const scale = spring({
            frame: Math.max(0, frame - start),
            from: 0.8,
            to: 1,
            config: {damping: 22, stiffness: 150},
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity,
                transform: `scale(${scale})`,
                marginRight: 8,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};