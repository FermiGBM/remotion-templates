// src/Root.tsx
import React from 'react';
import { Composition } from 'remotion';
import { FourMinuteCut } from './FourMinuteCut';

export const RemotionRoot: React.FC = () => {
  // 4 minutes 24.8s @ 30fps = 8124 frames (outro ends here; was 8460 leaving black tail)
  const FPS = 30;
  const DURATION_IN_FRAMES = (270.8) * FPS;

  return (
    <>
      <Composition
        id="WriterScout-4MinCut"
        component={FourMinuteCut}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Testing Codex vs. Claude for Automated App Building',
        }}
      />
    </>
  );
};
