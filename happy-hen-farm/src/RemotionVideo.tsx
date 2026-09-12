import {Composition} from 'remotion';
import {HenStormVideo} from './HenStormVideo';

export const RemotionVideo = () => {
  return (
    <Composition
      id="HappyHenFarm"
      component={HenStormVideo}
      durationInFrames={4500}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};