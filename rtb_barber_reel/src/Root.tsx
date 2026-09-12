import React from 'react';
import { Composition } from 'remotion';
import { BarberReel } from './BarberReel';

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  const DURATION_IN_FRAMES = 900;

  return (
    <>
      <Composition
        id="BarberReel"
        component={BarberReel}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};