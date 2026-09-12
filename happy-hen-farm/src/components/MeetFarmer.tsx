import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Farmer} from './Farmer';
import {Hen} from './Hen';
import {Icon} from './Icon';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 8-22s Meet the Farmer & Hen. Both idle-loop, four icons
 * (shelter/food/health/play) pop in staggered.
 */
export const MeetFarmer: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = spring({frame, from: 0, to: 1, config: {damping: 20, stiffness: 130}});

  const iconStart = 40;
  const iconGap = 12;

  return (
    <AbsoluteFill style={{opacity: fade}}>
      {/* Headline */}
      <TextStagger
        words={['One', 'farmer.', 'One', 'hen.', 'Everyday', 'kindness.']}
        delays={[15, 30, 45, 60, 75, 90]}
        baseY={120}
        baseSize={56}
        color={palette.brown}
      />

      {/* Farmer + Hen standing side by side */}
      <Farmer groundY={860} x={560} scale={1.2} />
      <Hen startFrame={0} endFrame={0} startX={790} endX={790} groundY={840} scale={1.1} flapTimes={[40, 70]} />

      {/* Four icons in a row along the bottom, clear of characters */}
      {(['shelter', 'food', 'health', 'play'] as const).map((k, i) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            top: 720,
            left: 100 + i * 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Icon kind={k} delay={iconStart + i * iconGap} size={96} />
          <div
            style={{
              fontSize: 22,
              color: palette.brown,
              textTransform: 'capitalize',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 600,
              opacity: spring({
                frame: Math.max(0, frame - (iconStart + i * iconGap + 6)),
                from: 0,
                to: 1,
                config: {damping: 20, stiffness: 140},
              }),
            }}
          >
            {k}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};