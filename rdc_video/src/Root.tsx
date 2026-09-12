import React from 'react';
import {Composition} from 'remotion';
import {RDCShort, RDC_TOTAL_FRAMES} from './RDCShort';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RDCShort"
      component={RDCShort}
      durationInFrames={RDC_TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};