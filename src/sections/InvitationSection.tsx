import { Sparkles } from "@react-three/drei";
import GraduationCard from "../components/3d-shapes/GraduationCard";
import CherryBlossomPetals from "../components/3d-shapes/CherryBlossomPetal";
import { Sakura } from "../components/3d-models/Sakura";
import { Grass } from "../components/3d-models/Grass";
import { Tree } from "../components/3d-models/Tree";
import { PinkPudding } from "../components/3d-models/PinkPudding";
import { Koala } from "../components/3d-models/Koala";
import { GraduationCap } from "../components/3d-models/GraduationCap";
import { Stage, type Point } from "../components/3d-shapes/GraduationStage";

export default function InvitationSection({ position, onOpen }: { position: Point; onOpen: () => void }) {
  return (
    <Stage position={position}>
      <group onClick={(event) => { event.stopPropagation(); onOpen(); }}>
        <GraduationCard position={[0, 0, -2.5]} />
      </group>
      <CherryBlossomPetals count={55} />
      <Sparkles color="#ff99ec" size={8} scale={24} count={105} speed={0.5} />
      <Sakura position={[-9.2, -5, -5]} scale={[0.28, 0.35, 0.28]} />
      <Tree position={[-8, -5.3, -8]} scale={[0.07, 0.09, 0.07]} />
      <Tree position={[-9, -5.3, -7]} scale={[0.07, 0.08, 0.07]} />
      <Sakura position={[9.2, -5, -5]} scale={[0.28, 0.35, 0.28]} />
      <Tree position={[9.4, -5.3, -8]} scale={[0.07, 0.09, 0.07]} />
      <Tree position={[7.5, -5.3, -8]} scale={0.065} />
      <Grass position={[0, -5.45, -1.8]} scale={[26, 3, 18]} />
      <PinkPudding position={[-3.5, -4.5, 2]} scale={0.7} />
      <GraduationCap position={[-6.5, -1.5, 0]} scale={0.6} rotation={[0, -0.9, 0]} />
      <Koala position={[-6.5, -5, 0]} scale={0.4} rotation={[0, -0.9, 0]} />
    </Stage>
  );
}
