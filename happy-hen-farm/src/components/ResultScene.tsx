import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Farmer} from './Farmer';
import {Hen} from './Hen';
import {Icon} from './Icon';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 112-135s The Happy Result. Wide shot: glossy hen + proud farmer,
 * soft glow + floating hearts/leaves, three benefit cards cascade in,
 * big headline scales up. Golden-hour light.
 */
export const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = spring({frame, from: 0, to: 1, config: {damping: 20, stiffness: 130}});

  // Golden glow
  const glow = 1 + Math.sin(frame / 24) * 0.06;

  // Three benefit cards cascade
  const benefits = ['Stronger immune system', 'Better egg quality', 'Longer, more joyful life'];
  const card = (i: number) => {
    const s = spring({frame: Math.max(0, frame - (60 + i * 40)), from: 0, to: 1, config: {damping: 18, stiffness: 150}});
    return {opacity: s, transform: `translateY(${(1 - s) * 50}px) scale(${0.8 + s * 0.2})`};
  };

  // Floating hearts/leaves
  const floaters = Array.from({length: 5}).map((_, i) => ({
    left: 300 + i * 300,
    top: 300 + Math.sin(frame / 20 + i) * 50,
    delay: i * 10,
  }));

  return (
    <AbsoluteFill style={{opacity: fade}}>
      {/* Big headline */}
      <TextStagger
        words={['A', 'cared-for', 'hen', 'is', 'a', 'happy', 'hen']}
        delays={[20, 40, 60, 90, 110, 130, 150]}
        baseY={110}
        baseSize={60}
        color={palette.brown}
      />

      {/* Farmer + glossy hen — moved higher so benefit cards sit below them */}
      <Farmer groundY={640} x={700} scale={1.15} />
      {/* "Glossy": brighter highlight via slight scale */}
      <div style={{transform: 'scale(1.1)', transformOrigin: 'bottom'}}>
        <Hen startFrame={0} endFrame={0} startX={1010} endX={1010} groundY={600} scale={1.1} flapTimes={[90, 140]} />
      </div>

      {/* Soft golden glow overlay */}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${glow})`, opacity: 0.35, background: 'radial-gradient(circle, rgba(244,211,94,0.7) 0%, rgba(244,211,94,0) 60%)'}} />

      {/* Floating hearts/leaves */}
      {floaters.map((f, i) => (
        <div key={i} style={{position: 'absolute', left: f.left, top: f.top, opacity: 0.8 * spring({frame: Math.max(0, frame - f.delay), from: 0, to: 1, config: {damping: 20, stiffness: 130}}), fontSize: 34}}>
          {i % 2 === 0 ? '❤️' : '🍃'}
        </div>
      ))}

      {/* Three benefit cards */}
      <div style={{position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', padding: '0 60px'}}>
        {benefits.map((b, i) => (
          <div
            key={b}
            style={{
              ...card(i),
              background: palette.white,
              border: `3px solid ${palette.straw}`,
              borderRadius: 18,
              padding: '20px 28px',
              fontSize: 30,
              color: palette.brown,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            }}
          >
            {b}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};