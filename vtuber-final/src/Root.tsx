import "./index.css";
import { Composition } from "remotion";
import { VTuberRant } from "./VTuberRant";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VTuberRant"
        component={VTuberRant}
        durationInFrames={1860} // 62s @ 30fps
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};
