import { Float, useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";
import school from "../../../school.png";
import SchoolSheen from "./SchoolSheen";
import type { Point } from "./GraduationStage";

export default function WSUCampus({ position, scale = 1, reducedMotion }: { position: Point; scale?: number; reducedMotion: boolean }) {
  const texture = useTexture(school);
  texture.colorSpace = SRGBColorSpace;

  const size: [number, number] = [24 * 1672 / 941, 24];

  return (
    <group position={position} scale={scale}>
      <Float speed={0.5} rotationIntensity={reducedMotion ? 0 : 0.14} floatIntensity={reducedMotion ? 0 : 0.28}>
        <mesh position={[0, 3.6, -3]}>
          <planeGeometry args={size} />
          <meshStandardMaterial
            map={texture}
            color="#cab8b9"
            transparent
            alphaTest={0.04}
            opacity={0.92}
            roughness={1}
            metalness={0}
          />
          <SchoolSheen texture={texture} size={size} strength={0.13} reducedMotion={reducedMotion} />
        </mesh>
      </Float>
    </group>
  );
}
