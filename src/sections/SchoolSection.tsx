import MobileFriendlySparkles from "../components/3d-shapes/MobileFriendlySparkles";

import SchoolCard from "../components/3d-shapes/SchoolCard";
import { Tree } from "../components/3d-models/Tree";
import { Sakura } from "../components/3d-models/Sakura";
import { Grass } from "../components/3d-models/Grass";
import WSUCampus from "../components/3d-shapes/WSUCampus";
import { RMIT3DText } from "../components/3d-shapes/RMIT3DText";
import { RMITConfetti } from "../components/3d-shapes/RMITConfetti";
import { Stage, type Point } from "../components/3d-shapes/GraduationStage";

export default function SchoolSection({ position, reducedMotion }: { position: Point; reducedMotion: boolean }) {
  return (
    <Stage position={position}>
      <spotLight position={[5, 5, 5]} angle={0.25} penumbra={1} intensity={1} color="#ffffff" />
      <SchoolCard position={[0, 0, 0]} reducedMotion={reducedMotion} />
      <RMIT3DText position={[0, 2.2, 0]} text="WSU" fontSize={1.5} />
      <RMITConfetti count={30} reducedMotion={reducedMotion} />
      <WSUCampus position={[2.2, -0.5, -8]} scale={0.58} reducedMotion={reducedMotion} />
      <Tree position={[-10.2, -6.5, -4]} scale={0.075} />
      <Tree position={[-7.8, -6.5, -8]} scale={[0.075, 0.1, 0.075]} />
      <Sakura position={[10.8, -6.5, -4]} scale={0.31} />
      <Grass position={[0, -6.65, -2.5]} scale={[29, 2.5, 17]} />

      <MobileFriendlySparkles count={65} scale={[8, 6, 1]} size={10} speed={0.3} color="#d956f3" position={[0, 0, 0.5]} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#d39afc" />
      <pointLight position={[-3, -3, 3]} intensity={0.8} color="#ffc1e3" />
    </Stage>
  );
}
