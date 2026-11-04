import { Float, RoundedBox, useTexture } from "@react-three/drei";
import { DoubleSide, SRGBColorSpace } from "three";
import SchoolSheen from "./SchoolSheen";
import emblem from "../../assets/western-sydney-emblem.svg";


interface SchoolCardProps {
  position: [number, number, number];
  reducedMotion: boolean;
}
export default function SchoolCard({ position, reducedMotion }: SchoolCardProps) {
  const texture = useTexture(emblem);
  texture.colorSpace = SRGBColorSpace;
  return (
    <group position={position}>
      {/* Use a Float from drei to add a cute floating motion */}
      <Float speed={1.5} rotationIntensity={reducedMotion ? 0 : 0.2} floatIntensity={reducedMotion ? 0 : 0.6}>
        {/* Main jelly card as a rounded box */}
        <RoundedBox
          radius={0.25}
          position={[0, 0, 0]}
          args={[5, 3, 0.01]}
          smoothness={1}
        >
          <meshPhysicalMaterial
            attach="material"
            transparent={true}
            opacity={0.8}
            color="#ffbb90"
            emissive="#d39afc"
            emissiveIntensity={0.1}
            roughness={0.1}
            thickness={0.5}
            side={DoubleSide}
          />
        </RoundedBox>

        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[3.25, 2.6]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
          <SchoolSheen texture={texture} size={[3.25, 2.6]} strength={0.24} reducedMotion={reducedMotion} />
        </mesh>
      </Float>
    </group>
  );
}


