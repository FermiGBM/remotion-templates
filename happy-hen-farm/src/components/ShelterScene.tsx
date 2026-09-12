import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Hen} from './Hen';
import {Icon} from './Icon';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 22-42s Shelter & Safety. Small coop drawn, hen walks inside,
 * two text cards slide in, soft green particles float.
 */
export const ShelterScene: React.FC = () => {
  const frame = useCurrentFrame();

  const coopScale = spring({frame, from: 0.7, to: 1, config: {damping: 16, stiffness: 120}});

  // Text cards
  const card1 = spring({frame: Math.max(0, frame - 160), from: 0, to: 1, config: {damping: 20, stiffness: 140}});
  const card2 = spring({frame: Math.max(0, frame - 300), from: 0, to: 1, config: {damping: 20, stiffness: 140}});

  // Green particles
  const p1x = 120 + (frame % 80) * 3;
  const p2x = 1600 - (frame % 100) * 2;

  return (
    <AbsoluteFill>
      {/* Left text card */}
      {card1 > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 140,
            right: 0,
            transform: `translateX(${(1 - card1) * -60}px)`,
            opacity: card1,
          }}
        >
          <TextStagger
            words={['Clean,', 'dry,', 'draft-free', 'home']}
            delays={[0, 12, 24, 36]}
            baseY={140}
            baseSize={48}
            color={palette.brown}
            centerX={0.2}
          />
        </div>
      )}
      {card2 > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 250,
            right: 0,
            transform: `translateX(${(1 - card2) * -60}px)`,
            opacity: card2,
          }}
        >
          <TextStagger
            words={['Space', 'to', 'perch', '&', 'nest']}
            delays={[0, 12, 24, 36, 48]}
            baseY={250}
            baseSize={48}
            color={palette.straw}
            centerX={0.2}
          />
        </div>
      )}

      {/* Green particles */}
      <div style={{position: 'absolute', left: p1x, top: 300 + Math.sin(frame / 10) * 30, width: 14, height: 14, borderRadius: '50%', background: palette.leaf, opacity: 0.7}} />
      <div style={{position: 'absolute', left: p2x, top: 360 + Math.cos(frame / 12) * 30, width: 10, height: 10, borderRadius: '50%', background: palette.leafAlt, opacity: 0.8}} />

      {/* Coop on the right with a hen walking in */}
      <div style={{position: 'absolute', right: 180, bottom: 200, transform: `scale(${coopScale})`, transformOrigin: 'bottom'}}>
        <svg width="260" height="220" viewBox="0 0 260 220">
          <polygon points="20,90 130,10 240,90" fill={palette.brown} stroke={palette.brown} strokeWidth="3" />
          <rect x="30" y="90" width="200" height="130" rx="8" fill={palette.straw} stroke={palette.brown} strokeWidth="4" />
          <rect x="150" y="120" width="55" height="55" rx="10" fill={palette.brown} />
          <rect x="160" y="132" width="35" height="40" rx="6" fill={palette.straw} />
        </svg>
        {/* Hen entering */}
        <Hen
          startFrame={60}
          endFrame={210}
          startX={-180}
          endX={40}
          groundY={180}
          scale={0.9}
          flapTimes={[]}
        />
      </div>
      {/* Shelter icon for reinforcement — anchored near the coop, not the sky */}
      <div style={{position: 'absolute', right: 60, bottom: 160}}>
        <Icon kind="shelter" delay={120} size={80} />
      </div>
    </AbsoluteFill>
  );
};