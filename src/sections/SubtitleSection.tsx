import GumText from "../components/3d-shapes/GumText";
import CherryBlossomPetals from "../components/3d-shapes/CherryBlossomPetal";
import CottonCandy from "../components/3d-shapes/CottonCandy";
import { Sparkles } from "@react-three/drei";
import { Sakura } from "../components/3d-models/Sakura";
import { WoodenBench } from "../components/3d-models/WoodenBench";
import { Koala } from "../components/3d-models/Koala";
import { Stage } from "../components/3d-shapes/GraduationStage";

export default function SubtitleSection({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <Stage position={position}>
      <spotLight
        position={[-2, -7, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />

      <GumText position={[3.3, 2.5, 10.5]} size={0.68} text="GRADUATION?" color="pink" />
      <CherryBlossomPetals count={36} />
      <CottonCandy position={[4.2, 1.9, -9]} color="#ffaadd" scale={0.8} />
      <CottonCandy position={[6.1, 3.3, -12]} color="#ffbbee" scale={0.7} />

      <Sakura position={[-5.5, -7, 7.2]} scale={[-0.29, 0.37, 0.37]} />
      <WoodenBench position={[-2, -7, 10]} scale={[1.5, 1.5, -1.5]} />
      <Koala position={[-2, -5.7, 10]} scale={0.2} rotation={[0, -0.9, 0]} />
      <pointLight position={[-2, -7, 10]} intensity={2} color="#efa8a8" />

      {/* Sparkles for magical effect */}
      <Sparkles count={95} scale={24} size={7} speed={0.3} color="#ffffff" />
    </Stage>
  );
}
