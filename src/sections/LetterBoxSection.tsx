import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import { Block, Stage, type Point } from "../components/3d-shapes/GraduationStage";

export default function LetterBoxSection({ position, active, reducedMotion, onOpen }: {
  position: Point;
  active: boolean;
  reducedMotion: boolean;
  onOpen: () => void;
}) {
  return (
    <Stage position={position}>
      <Block position={[0, -2.6, 0]} size={[10.8, 0.32, 6.4]} color="#613647" />
      <Block position={[0, -2.41, 0]} size={[10.5, 0.09, 6.1]} color="#b38361" />
      <Block position={[0, -1.84, 0]} size={[2.3, 1.08, 1.8]} color="#774459" />
      <pointLight position={[0, 3, 4]} color="#ffcf9f" intensity={24} distance={10} />
      {active && !reducedMotion && (
        <Sparkles count={36} position={[0, 1, -0.5]} scale={[9, 5, 4]} size={3.4} speed={0.24} color="#ffe4af" />
      )}
      <group onClick={active ? (event) => { event.stopPropagation(); onOpen(); } : undefined}>
        <RoundedBox args={[4.7, 3.35, 2.65]} radius={0.27} smoothness={3} position={[0, 0.38, 0]}>
          <meshStandardMaterial color="#92304c" roughness={0.38} metalness={0.14} />
        </RoundedBox>
        <RoundedBox args={[4.85, 0.25, 2.76]} radius={0.11} position={[0, 1.91, 0]}>
          <meshStandardMaterial color="#ba8955" metalness={0.45} roughness={0.34} />
        </RoundedBox>
        <Block position={[0, 1.17, 1.34]} size={[2.85, 0.34, 0.07]} color="#dfad73" />
        <Block position={[0, 1.17, 1.39]} size={[2.52, 0.15, 0.06]} color="#2c1625" />
        <Block position={[0, -0.36, 1.34]} size={[1.66, 0.93, 0.08]} color="#d8a872" />
        <Block position={[0, -0.36, 1.39]} size={[1.51, 0.8, 0.05]} color="#f6e2bd" />
        {[-1, 1].map(side => (
          <group key={side} position={[side * 0.32, -0.21, 1.43]} rotation={[0, 0, side * 0.42]}>
            <Block position={[0, 0, 0]} size={[0.73, 0.035, 0.025]} color="#955369" />
          </group>
        ))}
        <Float enabled={active && !reducedMotion} speed={1.2} floatIntensity={0.36} rotationIntensity={0.25}>
          <group position={[0, 2.85, 0]} rotation={[0.13, -0.12, -0.2]}>
            <Block position={[0, 0, 0]} size={[1.83, 1.08, 0.1]} color="#f8dfb5" />
            {[-1, 1].map(side => (
              <group key={side} position={[side * 0.43, 0.15, 0.06]} rotation={[0, 0, side * 0.53]}>
                <Block position={[0, 0, 0]} size={[1, 0.045, 0.025]} color="#b9856f" />
              </group>
            ))}
            <mesh position={[0, -0.11, 0.08]}>
              <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
              <meshStandardMaterial color="#9e294d" />
            </mesh>
          </group>
        </Float>
      </group>
    </Stage>
  );
}
