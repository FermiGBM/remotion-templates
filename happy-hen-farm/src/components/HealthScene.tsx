import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Icon} from './Icon';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 65-88s Health & Hygiene. Heart icon pulses green, dust-bath
 * particles, three icon chips. Soft heading.
 */
export const HealthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = spring({frame, from: 0, to: 1, config: {damping: 20, stiffness: 130}});

  // Pulsing green heart
  const pulse = 1 + Math.sin(frame / 10) * 0.12;

  // Dust-bath particles
  const dust: React.CSSProperties[] = Array.from({length: 6}).map((_, i) => ({
    position: 'absolute' as const,
    left: 700 + (i * 90) % 400,
    top: 600 - Math.abs(Math.sin(frame / 20 + i)) * 60,
    width: 10 + (i % 3) * 4,
    height: 10 + (i % 3) * 4,
    borderRadius: '50%',
    background: palette.straw,
    opacity: 0.7 - (i % 3) * 0.15,
  }));

  const chip = (delay: number) => ({
    opacity: spring({frame: Math.max(0, frame - delay), from: 0, to: 1, config: {damping: 20, stiffness: 140}}),
    transform: `translateY(${(1 - spring({frame: Math.max(0, frame - delay), from: 0, to: 1, config: {damping: 20, stiffness: 140}})) * 24}px)`,
  });

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <TextStagger
        words={['Healthy', 'hens', 'live', 'longer', 'and', 'lay', 'happier.']}
        delays={[15, 30, 45, 60, 75, 90, 105]}
        baseY={120}
        baseSize={54}
        color={palette.brown}
      />

      {/* Pulsing heart */}
      <div style={{position: 'absolute', top: 260, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
        <Icon kind="heart" delay={10} size={120} />
      </div>

      {/* Dust-bath particles */}
      {dust.map((d, i) => <div key={i} style={d} />)}

      {/* Three health icon chips */}
      <div style={{position: 'absolute', bottom: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 90}}>
        <div style={chip(20)}><Icon kind="health" delay={20} size={84} /></div>
        <div style={chip(50)}><Icon kind="health" delay={50} size={84} /></div>
        <div style={chip(80)}><Icon kind="health" delay={80} size={84} /></div>
      </div>
    </AbsoluteFill>
  );
};