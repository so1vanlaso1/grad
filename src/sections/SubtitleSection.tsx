import { Physics } from "@react-three/cannon";
import GumText from "../components/3d-shapes/GumText";
import CherryBlossomPetals from "../components/3d-shapes/CherryBlossomPetal";
import CottonCandy from "../components/3d-shapes/CottonCandy";
import { Sparkles } from "@react-three/drei";
import { Sakura } from "../components/3d-models/Sakura";
import { WoodenBench } from "../components/3d-models/WoodenBench";
import { Koala } from "../components/3d-models/Koala";

// Welcome Section
export default function SubtitleSection({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <spotLight
        position={[-2, -7, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
      />

      <Physics gravity={[0, -0.2, 0]}>
        {/* Main 3D Text */}
        <GumText
          position={[4, -3, 0]}
          // rotation={[-Math.PI / 4, -0.3, -Math.PI / 2.5]} // [-1.25, 0, 1.57]
          size={0.7}
          text="GRADUATION"
          color="pink"
        />
        {/* Cherry blossom petals */}
        <CherryBlossomPetals count={50} />

        {/* Cotton candy clouds */}
        {/* Smaller clouds behind the tree, within the camera frame. */}
        <CottonCandy position={[4.2, 1.9, -9]} color="#ffaadd" scale={0.8} />
        <CottonCandy position={[6.1, 3.3, -12]} color="#ffbbee" scale={0.7} />

        <Sakura position={[-6, -7, 10]} scale={[-0.5, 0.6, 0.6]} />
        <WoodenBench position={[-2, -7, 10]} scale={[1.5, 1.5, -1.5]} />
        <Koala position={[-2, -5.7, 10]} scale={0.2} rotation={[0, -0.9, 0]} />
      </Physics>
      <pointLight position={[-2, -7, 10]} intensity={2} color="#efa8a8" />

      {/* Sparkles for magical effect */}
      <Sparkles count={200} scale={50} size={10} speed={0.3} color="#ffffff" />
    </group>
  );
}
