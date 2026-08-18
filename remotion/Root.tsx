import { Composition } from "remotion";
import { AlpacaLogoAnimation } from "./alpaca-logo-animation";

export const RemotionRoot = () => {
  return (
    <Composition
      id="AlpacaLogo"
      component={AlpacaLogoAnimation}
      durationInFrames={120}
      fps={30}
      width={1080}
      height={1080}
    />
  );
};
