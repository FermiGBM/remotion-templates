import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Farmer} from './Farmer';
import {Hen} from './Hen';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 135-150s Outro / CTA. Zoom out to whole farm, farmer & hen wave,
 * closing lines, logo placeholder, soft fade. Holds with idle anim.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // Zoom out: scale from 1.15 -> 1.0
  const zoom = spring({frame, from: 1.15, to: 1, config: {damping: 20, stiffness: 120}});

  // Closing lines stagger
  const line1 = spring({frame: Math.max(0, frame - 30), from: 0, to: 1, config: {damping: 20, stiffness: 140}});
  const line2 = spring({frame: Math.max(0, frame - 120), from: 0, to: 1, config: {damping: 20, stiffness: 140}});

  // Gentle idle: farmer waves, hen breathes (bob via existing sway)

  return (
    <AbsoluteFill>
      {/* Zoom-out wrapper */}
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Farmer groundY={860} x={760} scale={1.3} waveStart={frame} />
        <Hen startFrame={0} endFrame={0} startX={1000} endX={1000} groundY={830} scale={1.3} flapTimes={[60, 120]} />
      </AbsoluteFill>

      {/* Closing texts */}
      <TextStagger
        words={['Small', 'daily', 'acts', 'of', 'care', 'create', 'big', 'happiness.']}
        delays={[30, 48, 66, 84, 102, 120, 138, 156]}
        baseY={200}
        baseSize={54}
        color={palette.brown}
      />
      <div
        style={{
          position: 'absolute',
          top: 330,
          width: '100%',
          textAlign: 'center',
          fontSize: 40,
          color: palette.henRed,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          opacity: line2,
          transform: `scale(${0.9 + line2 * 0.1})`,
        }}
      >
        Treat them well.
      </div>

      {/* Logo placeholder + CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          opacity: line2,
        }}
      >
        <div style={{width: 70, height: 70, borderRadius: 16, background: palette.henOrange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, boxShadow: '0 4px 14px rgba(0,0,0,0.1)'}}>
          🐔
        </div>
        <div style={{fontSize: 30, color: palette.brown, fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700}}>
          Happy Hen Farm
        </div>
      </div>
    </AbsoluteFill>
  );
};