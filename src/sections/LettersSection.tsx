import { Float, Html, RoundedBox, Sparkles } from "@react-three/drei";
import { Shape } from "three";
import { letters } from "../graduation";
import { Stage, type Point } from "../components/3d-shapes/GraduationStage";

const envelopeLabels = ["Family", "Friends", "Teachers"];

const flap = new Shape().moveTo(-1.7, 0.95).lineTo(0, -0.22).lineTo(1.7, 0.95).closePath();

export default function LettersSection({ position, active, onOpen }: { position: Point; active: boolean; onOpen: (index: number) => void }) {
  return (
    <Stage position={position}>
      <Sparkles count={38} scale={[14, 6, 4]} size={3} color="#e3b578" />
      {letters.map(({ title, color }, index) => {
        const x = (index - 1) * 4.25;
        return (
          <group key={title} position={[x, 0, index === 1 ? 0.65 : 0]} rotation={[0, -x * 0.065, x * 0.022]}>
            <mesh position={[0, -2.1, -0.3]}>
              <cylinderGeometry args={[1.65, 1.8, 0.6, 48]} />
              <meshStandardMaterial color="#47252d" roughness={0.55} />
            </mesh>
            <mesh position={[0, -1.77, -0.3]}>
              <cylinderGeometry args={[1.66, 1.66, 0.06, 48]} />
              <meshStandardMaterial color="#cf9e68" metalness={0.5} />
            </mesh>
            {active && (
              <Html center position={[0, -1.24, 0.1]} style={{ pointerEvents: "none" }} zIndexRange={[4, 0]}>
                <span className="envelope-label" aria-hidden="true">{envelopeLabels[index]}</span>
              </Html>
            )}
            <Float speed={1.5 + index * 0.2} rotationIntensity={0.18} floatIntensity={0.35}>
              <group onClick={(event) => { event.stopPropagation(); onOpen(index); }}>
                <RoundedBox args={[3.5, 2.12, 0.23]} radius={0.08}>
                  <meshStandardMaterial color={color} roughness={0.6} />
                </RoundedBox>
                <mesh position={[0, 0, 0.12]}>
                  <shapeGeometry args={[flap]} />
                  <meshStandardMaterial color="#f1d6b7" side={2} />
                </mesh>
                <mesh position={[0, -0.17, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.23, 0.26, 0.12, 32]} />
                  <meshStandardMaterial color="#921c3c" roughness={0.4} />
                </mesh>
                <mesh position={[0, -0.17, 0.25]}>
                  <torusGeometry args={[0.125, 0.019, 8, 24]} />
                  <meshStandardMaterial color="#e0b878" metalness={0.35} />
                </mesh>
              </group>
            </Float>
          </group>
        );
      })}
    </Stage>
  );
}
