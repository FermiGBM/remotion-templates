import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Hen} from './Hen';
import {Icon} from './Icon';
import {TextStagger} from './TextStagger';
import {palette, spring} from '../theme';

/**
 * 88-112s Enrichment & Play. Free-range hen runs/explores with a
 * dotted path, four "play" concept icons, bold heading. Golden light begins.
 */
export const PlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = spring({frame, from: 0, to: 1, config: {damping: 20, stiffness: 130}});

  // Hen crosses the screen twice (bounce)
  const progress = (frame % 240) / 240; // 0..1, loops
  const henX = 200 + progress * 1500;
  const henY = 760 + Math.abs(Math.sin(progress * Math.PI * 6)) * 60; // hop along the way

  // Flap on each hop
  const flapFrame = Math.abs(Math.sin(frame / 10)) > 0.9 ? frame : -999;

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <TextStagger
        words={['Boredom', 'hurts.', 'Curiosity', 'heals.']}
        delays={[15, 45, 75, 105]}
        baseY={120}
        baseSize={64}
        color={palette.brown}
      />

      {/* Free-range dotted path */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <path d="M200,800 C 600,700 1000,860 1500,740" stroke={palette.straw} strokeWidth="6" strokeDasharray="14 14" fill="none" opacity="0.7" />
      </svg>

      {/* Running hen */}
      <Hen startFrame={0} endFrame={0} startX={henX} endX={henX} groundY={henY} scale={1.2} flapTimes={[flapFrame]} />

      {/* Meet/play icons along the path */}
      <div style={{position: 'absolute', left: 90, bottom: 60, display: 'flex', gap: 60}}>
        <Icon kind="play" delay={10} size={76} />
        <Icon kind="play" delay={40} size={76} />
      </div>
      <div style={{position: 'absolute', right: 90, bottom: 60, display: 'flex', gap: 60}}>
        <Icon kind="play" delay={70} size={76} />
        <Icon kind="play" delay={100} size={76} />
      </div>
    </AbsoluteFill>
  );
};