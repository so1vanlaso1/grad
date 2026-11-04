import { Physics } from "@react-three/cannon";
import { Sparkles } from "@react-three/drei";
import SchoolCard from "../components/3d-shapes/SchoolCard";
import { Tree } from "../components/3d-models/Tree";
import { Sakura } from "../components/3d-models/Sakura";
import { Grass } from "../components/3d-models/Grass";
import WSUCampus from "../components/3d-shapes/WSUCampus";
import { RMIT3DText } from "../components/3d-shapes/RMIT3DText";
import { RMITConfetti } from "../components/3d-shapes/RMITConfetti";
import type { Point } from "../components/3d-shapes/GraduationStage";

export default function SchoolSection({ position, reducedMotion }: { position: Point; reducedMotion: boolean }) {
  return (
    <group position={position}>
      <spotLight position={[5, 5, 5]} angle={0.25} penumbra={1} intensity={1} color="#ffffff" />
      <SchoolCard position={[0, 0, 0]} reducedMotion={reducedMotion} />
      <RMIT3DText position={[0, 2.2, 0]} text="WSU" fontSize={1.5} />
      

      <Physics gravity={[0, -0.5, 0]}>
        <RMITConfetti count={150} />
        <WSUCampus position={[5, 0, -6]} scale={0.7} reducedMotion={reducedMotion} />
        <Tree position={[-15, -6, -3]} scale={0.1} />
        <Tree position={[-10, -6, -8]} scale={[0.1, 0.15, 0.1]} />
        <Sakura position={[15, -6, -3]} scale={0.5} />
      </Physics>
      <Grass position={[5, -7, -10]} scale={[30, 9, 17]} />

      <Sparkles count={100} scale={[8, 6, 1]} size={10} speed={0.3} color="#d956f3" position={[0, 0, 0.5]} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#d39afc" />
      <pointLight position={[-3, -3, 3]} intensity={0.8} color="#ffc1e3" />
    </group>
  );
}
