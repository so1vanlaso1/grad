import GumText from "../components/3d-shapes/GumText";
import CherryBlossomPetals from "../components/3d-shapes/CherryBlossomPetal";
import CandyCluster from "../components/3d-shapes/Candy";
import CottonCandy from "../components/3d-shapes/CottonCandy";
import { Sparkles } from "@react-three/drei";
import { useMemo } from "react";
import { bubbleColors } from "../utils/color";
import JellyCandy from "../components/3d-shapes/JellyCandy";
import { Stage, type Point } from "../components/3d-shapes/GraduationStage";

export default function WelcomeSection({ position }: { position: Point }) {
  // Create a bunch of bubbles for decoration
  const bubbles = useMemo(() => {
    const arr = Array.from({ length: 30 }, () => {
      return {
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 1) * 10,
        ] as [number, number, number],
        color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        size: Math.random() * 0.3 + 0.1,
        wobbleSpeed: Math.random() * 0.5 + 0.8,
        opacity: Math.random() * 0.5 + 0.3,
      };
    });
    return arr.map((jelly, index) => (
      <JellyCandy
        key={index}
        position={jelly.position as [number, number, number]}
        color={jelly.color}
        size={jelly.size}
        wobbleSpeed={jelly.wobbleSpeed}
        opacity={jelly.opacity}
      />
    ));
  }, []);
  return (
    <Stage position={position}>
      {bubbles}
      <GumText position={[0, 2, 0]} size={1.35} text="07.11.2026" />
      <CherryBlossomPetals count={36} />
      <CandyCluster count={16} />
      <CottonCandy position={[-8.8, -1.5, -5]} scale={2.1} color="#ffccff" />
      <CottonCandy position={[8.8, -2.5, -5]} scale={2.1} color="#ffaadd" />
      <CottonCandy position={[-3.8, -6, -8]} scale={1.5} color="#ffccee" />
      <CottonCandy position={[4.7, -7, -6]} scale={1.7} color="#ffccff" />
      <CottonCandy position={[-5.2, 5.5, -7]} scale={1.5} color="#ffccee" />
      <CottonCandy position={[5.8, 5.6, -7]} scale={1.35} color="#ffaadd" />
      <CottonCandy position={[0, 7.8, -9]} scale={1.7} color="#ffbbee" />
      <Sparkles count={80} scale={20} size={8} speed={0.3} color="#ffffff" />
    </Stage>
  );
}
