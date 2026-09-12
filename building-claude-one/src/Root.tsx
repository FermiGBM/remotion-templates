import React from 'react';
import {Composition} from 'remotion';
import {BuildingClaudeOne, SAMPLE_DURATION_FRAMES} from './BuildingClaudeOne';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BuildingClaudeOne"
      component={BuildingClaudeOne}
      durationInFrames={SAMPLE_DURATION_FRAMES}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};