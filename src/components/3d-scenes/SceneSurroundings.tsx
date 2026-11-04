import { Sparkles } from "@react-three/drei";
import { Block, Stage, type Point } from "../3d-shapes/GraduationStage";

const brass = "#bd8957";

function Lantern({ position, color }: { position: Point; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.34, 0.42, 0.68, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.46} />
      </mesh>
      {[-0.37, 0.37].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 6]} />
          <meshStandardMaterial color={brass} metalness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function Ribbon({ position, radius, color, rotation }: {
  position: Point; radius: number; color: string; rotation: Point;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[radius, 0.035, 8, 100, Math.PI * 1.32]} />
      <meshBasicMaterial color={color} transparent opacity={0.66} depthWrite={false} />
    </mesh>
  );
}

function Plinth({ position, radius, color }: { position: Point; radius: number; color: string }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[radius, radius * 0.97, 0.28, 64]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.96, radius * 0.98, 64]} />
        <meshBasicMaterial color={brass} />
      </mesh>
    </group>
  );
}

export default function SceneSurroundings({ scene, position, active, reducedMotion }: {
  scene: number; position: Point; active: boolean; reducedMotion: boolean;
}) {
  const sides = [-1, 1];
  const accents = ["#ffe6ab", "#ffd4e5", "#ffd1ac", "#ffe0ac", "#f8cd8e", "#f7d7ab"];

  return (
    <Stage position={position}>
      {active && !reducedMotion && (
        <Sparkles count={scene === 5 ? 23 : 34} size={3.5} speed={0.24}
          position={[0, scene === 5 ? 0.5 : 1.4, scene === 5 ? -2 : -3]}
          scale={scene === 5 ? [14, 5, 3] : [19, 9, 7]} color={accents[scene]} />
      )}

      {scene === 0 && <>
        <Ribbon position={[0, 1.2, -8]} radius={8.4} color="#f7bd8a" rotation={[0.21, -0.23, -0.48]} />
        <Ribbon position={[0, 1.2, -8.2]} radius={8.85} color="#f9dec6" rotation={[0.21, -0.23, 0.47]} />
        {sides.map((side) => (
          <Lantern key={side} position={[side * 7.8, 1 + side * 2.5, -4]} color="#ffd2a0" />
        ))}
      </>}

      {scene === 1 && <>
        <Ribbon position={[0, -6.7, 7]} radius={5.6} color="#efc6ae" rotation={[-Math.PI / 2, 0, 0.75]} />
        <Plinth position={[0, -7.28, 7]} radius={6.9} color="#9e777a" />
        {sides.map((side) => (
          <group key={side} position={[side * 4.25, -7.12, 6.2]}>
            <Block position={[0, 0.35, 0]} size={[0.48, 0.7, 0.48]} color="#8d5d66" />
            <Lantern position={[0, 1.1, 0]} color="#ffc9cf" />
          </group>
        ))}
      </>}

      {scene === 2 && <>
        {[-1, 0, 1].map((step) => (
          <Block key={step} position={[0.5, -6.91 - step * 0.19, 4.75 + step * 0.63]}
            size={[6.4 + step * 0.35, 0.29, 0.74]} color="#bb9283" />
        ))}
        {sides.map((side) => (
          <Lantern key={side} position={[0.5 + side * 5.2, -5.9, 3]} color="#ffe0bd" />
        ))}
      </>}

      {scene === 3 && sides.map((side) => (
        <group key={side} position={[side * 6.6, -4.7, -1.3]}>
          <Block position={[0, -0.31, 0]} size={[0.84, 0.28, 0.84]} color="#73404c" />
          <Block position={[0, 0.19, 0]} size={[0.13, 0.76, 0.13]} color={brass} />
          <Lantern position={[0, 0.91, 0]} color="#ffd394" />
        </group>
      ))}

      {scene === 4 && <>
        <Block position={[0, -2.57, -0.4]} size={[14.4, 0.38, 5.6]} color="#633a46" />
        <Block position={[0, -2.39, 2.42]} size={[14.4, 0.045, 0.06]} color={brass} />
        <Block position={[0, 0.62, -3.15]} size={[14.4, 6.25, 0.18]} color="#512b43" />
        {Array.from({ length: 13 }, (_, i) => (
          <Block key={i} position={[(i - 6) * 1.09, 0.64, -3]} size={[0.24, 6.2, 0.19]}
            color={i % 2 ? "#60324c" : "#693952"} />
        ))}
        {sides.map((side) => (
          <Lantern key={side} position={[side * 5.9, 2.65, -2.4]} color="#ffd09a" />
        ))}
      </>}

      {scene === 5 && sides.map((side) => (
        <group key={side} position={[side * 7.1, -2.15, 3.5]}>
          <Block position={[0, -0.74, 0]} size={[0.72, 1.03, 0.72]} color="#664034" />
          <Lantern position={[0, 0.17, 0]} color="#ffe1af" />
        </group>
      ))}
    </Stage>
  );
}
