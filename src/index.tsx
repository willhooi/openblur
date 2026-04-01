import { registerRoot, Composition } from "remotion";
import { OpenBlurComposition } from "./components/Composition";
import { TerminalScreen } from "./components/TerminalScreen";
import { PlanningScreen } from "./components/PlanningScreen";
import { GenerationScreen } from "./components/GenerationScreen";
import { OutputScreen } from "./components/OutputScreen";
import { HeroScreen } from "./components/HeroScreen";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main video — duration controlled via --frames flag at render time */}
      <Composition
        id="OpenBlur"
        component={OpenBlurComposition}
        durationInFrames={1800}
        fps={30}
        width={1280}
        height={720}
      />
      {/* Individual screens for still/screenshot export */}
      <Composition id="Terminal" component={TerminalScreen} durationInFrames={120} fps={30} width={1920} height={1080} />
      <Composition id="Planning" component={PlanningScreen} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="Generation" component={GenerationScreen} durationInFrames={180} fps={30} width={1920} height={1080} />
      <Composition id="Output" component={OutputScreen} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="Hero" component={HeroScreen} durationInFrames={90} fps={30} width={1920} height={1080} />
    </>
  );
};

registerRoot(RemotionRoot);
