import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const AlpacaLogoAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 78,
      mass: 0.85,
    },
  });

  const backgroundGlow = interpolate(frame, [0, 42, 120], [0, 1, 0.72], clamp);
  const logoOpacity = interpolate(frame, [8, 30], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoScale = interpolate(intro, [0, 1], [0.9, 1], clamp);
  const logoY = interpolate(intro, [0, 1], [28, 0], clamp);
  const revealWidth = interpolate(frame, [8, 46], [0, 100], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const sweepX = interpolate(frame, [34, 76], [-360, 360], clamp);
  const sweepOpacity = interpolate(frame, [30, 42, 66, 82], [0, 0.55, 0.35, 0], clamp);
  const ringScale = interpolate(frame, [0, 70], [0.86, 1.08], clamp);
  const ringOpacity = interpolate(frame, [0, 20, 72, 120], [0, 0.34, 0.13, 0], clamp);
  const holdBreath = Math.sin((frame / fps) * Math.PI * 0.8) * 4;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 42%, rgba(200,149,108,0.22) 0%, rgba(28,25,23,0.98) 42%, #0f0d0c 100%)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.18)",
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 820,
          height: 420,
          borderRadius: "50%",
          filter: "blur(58px)",
          opacity: backgroundGlow,
          background:
            "linear-gradient(90deg, rgba(200,149,108,0.2), rgba(255,255,255,0.16), rgba(200,149,108,0.12))",
          transform: `translateY(${72 + holdBreath}px)`,
        }}
      />

      <div
        style={{
          position: "relative",
          width: 680,
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `translateY(${logoY + holdBreath}px) scale(${logoScale})`,
          clipPath: `inset(0 ${100 - revealWidth}% 0 0)`,
        }}
      >
        <Img
          src={staticFile("assets/logo-white.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 28px 42px rgba(0,0,0,0.42))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          width: 108,
          height: 360,
          opacity: sweepOpacity,
          transform: `translateX(${sweepX}px) rotate(18deg)`,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          filter: "blur(7px)",
          mixBlendMode: "screen",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 238,
          width: 180,
          height: 1,
          opacity: interpolate(frame, [46, 64, 100], [0, 0.7, 0.35], clamp),
          transform: `scaleX(${interpolate(frame, [44, 70], [0.2, 1], clamp)})`,
          background:
            "linear-gradient(90deg, transparent, rgba(200,149,108,0.9), transparent)",
        }}
      />
    </AbsoluteFill>
  );
};
