import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Hen} from './Hen';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 0-8s Title / Intro. Barn + hills fade in, title staggers in,
 * hen walks in from left, flaps once, settles.
 */
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera push-in
  const scale = spring({
    frame,
    from: 0.92,
    to: 1,
    config: {damping: 22, stiffness: 150},
  });

  // Fade-in of the whole intro
  const fade = spring({frame, from: 0, to: 1, config: {damping: 20, stiffness: 130}});

  // Subtitle
  const subOpacity = spring({
    frame: Math.max(0, frame - 55),
    from: 0,
    to: 1,
    config: {damping: 20, stiffness: 140},
  });

  return (
    <>
      {/* Camera push-in wrapper */}
      <AbsoluteFill style={{transform: `scale(${(scale * fade).toFixed(4) || 0.92})`, opacity: fade}}>
        {/* Title word stagger */}
        <TextStagger
          words={['Happy', 'Hen,', 'Happy', 'Farm']}
          delays={[18, 30, 42, 54]}
          baseY={210}
          baseSize={72}
          color={palette.brown}
        />

        {/* Subtitle */}
        <div
          style={{
            position: 'absolute',
            top: 360,
            width: '100%',
            textAlign: 'center',
            fontSize: 34,
            color: palette.leaf,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 600,
            opacity: subOpacity,
          }}
        >
          A little care goes a long way
        </div>

        {/* Hen walks in from left, flaps twice, settles near bann */}
        <Hen
          startFrame={60}
          endFrame={175}
          startX={-160}
          endX={360}
          groundY={840}
          scale={1.3}
          flapTimes={[120, 150]}
        />
      </AbsoluteFill>
    </>
  );
};