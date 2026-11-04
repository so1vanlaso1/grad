import { Physics } from "@react-three/cannon";
import { Sparkles } from "@react-three/drei";
import GraduationCard from "../components/3d-shapes/GraduationCard";
import CherryBlossomPetals from "../components/3d-shapes/CherryBlossomPetal";
import { Sakura } from "../components/3d-models/Sakura";
import { Grass } from "../components/3d-models/Grass";
import { Tree } from "../components/3d-models/Tree";
import { PinkPudding } from "../components/3d-models/PinkPudding";
import { Koala } from "../components/3d-models/Koala";
import { GraduationCap } from "../components/3d-models/GraduationCap";
import { useThree } from "@react-three/fiber";
import { Block, Stage, type Point } from "../components/3d-shapes/GraduationStage";

export default function InvitationSection({ position, onOpen }: { position: Point; onOpen: () => void }) {
  const portrait = useThree(({ size }) => size.width < size.height);
  return (
    <Stage position={position}>
        <group onClick={(event) => { event.stopPropagation(); onOpen(); }}>
          <GraduationCard position={[0, 0, -2.5]} />
        </group>
      <Physics gravity={[0, -0.2, 0]}>
        <CherryBlossomPetals count={portrait ? 20 : 100} />
      </Physics>
      <Sparkles color="#ff99ec" size={10} scale={50} count={portrait ? 40 : 200} speed={0.5} />
      {!portrait && <>
      <Sakura position={[-10, -5, -2]} scale={[0.5, 0.7, 0.5]} />
      <Tree position={[-8, -5.3, -6]} scale={[0.1, 0.13, 0.1]} />
      <Tree position={[-9, -5.3, -4]} scale={[0.1, 0.13, 0.1]} />
      <Sakura position={[10, -5, -2]} scale={[0.5, 0.7, 0.5]} />
      <Tree position={[10, -5.3, -6]} scale={[0.1, 0.13, 0.1]} />
      <Tree position={[7, -5.3, -6]} scale={[0.1, 0.1, 0.1]} />
      <Grass position={[6, -5.3, -12]} scale={[35, 5, 24]} />
      </>}
      {portrait && <Block position={[0, -5.4, -2]} size={[18, 0.3, 10]} color="#8d6a72" />}
      <PinkPudding position={[-3.5, -4.5, 2]} scale={0.7} />
      <GraduationCap position={[-6.5, -1.5, 0]} scale={0.6} rotation={[0, -0.9, 0]} />
      <Koala position={[-6.5, -5, 0]} scale={0.4} rotation={[0, -0.9, 0]} />
    </Stage>
  );
}
