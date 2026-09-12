import {AbsoluteFill, Sequence} from 'remotion';
import {Background} from './components/Background';
import {TitleCard} from './components/TitleCard';
import {MeetFarmer} from './components/MeetFarmer';
import {ShelterScene} from './components/ShelterScene';
import {FoodWaterScene} from './components/FoodWaterScene';
import {HealthScene} from './components/HealthScene';
import {PlayScene} from './components/PlayScene';
import {ResultScene} from './components/ResultScene';
import {Outro} from './components/Outro';
import {sceneFrames} from './theme';

export const HenStormVideo: React.FC = () => {
  const {title, meet, shelter, food, health, play, result, outro} = sceneFrames;

  return (
    <AbsoluteFill style={{background: '#FDF6E3'}}>
      {/* Global background layer (parallax flows across entire video) */}
      <Background />

      {/* Scene sequences — exact frame offsets from theme.ts */}
      <Sequence from={title.start} durationInFrames={title.duration}>
        <TitleCard />
      </Sequence>

      <Sequence from={meet.start} durationInFrames={meet.duration + 10}>
        <MeetFarmer />
      </Sequence>

      <Sequence from={shelter.start} durationInFrames={shelter.duration + 10}>
        <ShelterScene />
      </Sequence>

      <Sequence from={food.start} durationInFrames={food.duration + 10}>
        <FoodWaterScene />
      </Sequence>

      <Sequence from={health.start} durationInFrames={health.duration + 10}>
        <HealthScene />
      </Sequence>

      <Sequence from={play.start} durationInFrames={play.duration + 10}>
        <PlayScene />
      </Sequence>

      <Sequence from={result.start} durationInFrames={result.duration + 10}>
        <ResultScene />
      </Sequence>

      <Sequence from={outro.start} durationInFrames={outro.duration}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};