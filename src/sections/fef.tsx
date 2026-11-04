/**
 * Custom 3D Graduation Invitation Scene
 * Drop-in replacement for src/sections/InvitationSection.tsx
 * in https://github.com/Puppychan/graduation-invitation
 *
 * Uses existing Three / React Three Fiber / Drei dependencies only.
 * Scene concept and procedural mesh objects are original to this file.
 */
import { Float, RoundedBox, Sparkles, Text } from "@react-three/drei";
import { useMemo } from "react";

type Vec3 = [number, number, number];

// === EASY CUSTOMIZATION: edit these values ===
const CUSTOM = {
  graduate: "YOUR NAME",
  year: "CLASS OF 2026",
  school: "YOUR UNIVERSITY",
  subtitle: "A new chapter begins",
  main: "#152746",       // stage / midnight blue
  secondary: "#244f78",  // brighter blue
  accent: "#edc66e",     // gold
  paleGold: "#fff0c4",
  white: "#fff9f0",
  pink: "#ffb8d2",
};

function Stage() {
  return (
    <group>
      <mesh position={[0, -4.82, 0]} receiveShadow>
        <cylinderGeometry args={[7.8, 8.0, 0.72, 64]} />
        <meshStandardMaterial color={CUSTOM.main} roughness={0.4} metalness={0.22} />
      </mesh>
      <mesh position={[0, -4.42, 0]}>
        <cylinderGeometry args={[7.7, 7.7, 0.12, 64]} />
        <meshStandardMaterial color={CUSTOM.accent} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -4.31, 0]}>
        <cylinderGeometry args={[7.5, 7.5, 0.1, 64]} />
        <meshStandardMaterial color={CUSTOM.secondary} metalness={0.2} roughness={0.58} />
      </mesh>
      <mesh position={[0, -5.22, 6]}>
        <boxGeometry args={[4.2, 0.3, 1.6]} />
        <meshStandardMaterial color={CUSTOM.main} />
      </mesh>
      <mesh position={[0, -5.06, 6.75]}>
        <boxGeometry args={[4.3, 0.07, 0.12]} />
        <meshStandardMaterial color={CUSTOM.accent} metalness={0.75} roughness={0.25} />
      </mesh>
    </group>
  );
}

function GoldenArch() {
  return (
    <group>
      <mesh position={[0, -1.25, -0.7]}>
        <torusGeometry args={[5.3, 0.13, 12, 96, Math.PI]} />
        <meshStandardMaterial color={CUSTOM.accent} metalness={0.8} roughness={0.23} emissive={CUSTOM.accent} emissiveIntensity={0.15} />
      </mesh>
      {[-5.3, 5.3].map((x) => (
        <group key={x}>
          <mesh position={[x, -2.75, -0.7]}>
            <cylinderGeometry args={[0.13, 0.13, 3.0, 16]} />
            <meshStandardMaterial color={CUSTOM.accent} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[x, -4.1, -0.7]}>
            <cylinderGeometry args={[0.31, 0.36, 0.3, 24]} />
            <meshStandardMaterial color={CUSTOM.paleGold} metalness={0.6} roughness={0.3} />
          </mesh>
          <pointLight position={[x, -1.5, 0.5]} color={CUSTOM.accent} intensity={2.2} distance={7} />
        </group>
      ))}
      <mesh position={[0, -1.25, -1.25]}>
        <torusGeometry args={[5.05, 0.04, 8, 96, Math.PI]} />
        <meshStandardMaterial color={CUSTOM.paleGold} emissive={CUSTOM.accent} emissiveIntensity={0.28} />
      </mesh>
    </group>
  );
}

function Mortarboard() {
  return (
    <Float speed={1.5} floatIntensity={0.25} rotationIntensity={0.1}>
      <group position={[0, -1.9, 1.8]} rotation={[0.08, -0.28, 0.04]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.96, 0.85, 0.95, 16]} />
          <meshStandardMaterial color={CUSTOM.main} roughness={0.36} metalness={0.24} />
        </mesh>
        <mesh position={[0, 0.24, 0]} rotation={[0, Math.PI / 4, -0.08]}>
          <boxGeometry args={[3.2, 0.14, 3.2]} />
          <meshStandardMaterial color={CUSTOM.main} roughness={0.27} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color={CUSTOM.accent} metalness={0.75} roughness={0.2} />
        </mesh>
        <mesh position={[1.35, -0.22, 0.3]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.027, 0.027, 1.2, 8]} />
          <meshStandardMaterial color={CUSTOM.accent} />
        </mesh>
        <mesh position={[1.5, -0.85, 0.3]}>
          <coneGeometry args={[0.12, 0.5, 10]} />
          <meshStandardMaterial color={CUSTOM.accent} metalness={0.2} roughness={0.5} />
        </mesh>
        <pointLight position={[0, 2, 3]} color={CUSTOM.paleGold} intensity={1.5} distance={8} />
      </group>
    </Float>
  );
}

function Diploma({ position, rotation = [0, 0, 0] }: {position: Vec3; rotation?: Vec3}) {
  return (
    <Float speed={1.1} floatIntensity={0.22} rotationIntensity={0.12}>
      <group position={position} rotation={rotation}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 2.4, 32]} />
          <meshStandardMaterial color={CUSTOM.white} roughness={0.75} />
        </mesh>
        {[-0.75, 0.75].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.33, 0.06, 8, 24]} />
            <meshStandardMaterial color={CUSTOM.accent} metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.01, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.34, 0.13, 8, 24]} />
          <meshStandardMaterial color={CUSTOM.pink} roughness={0.55} />
        </mesh>
      </group>
    </Float>
  );
}

function Balloon({ position, color }: { position: Vec3; color: string }) {
  return (
    <Float speed={1.3} floatIntensity={0.25} rotationIntensity={0.08}>
      <group position={position}>
        <mesh scale={[0.72, 0.92, 0.68]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial color={color} metalness={0.24} roughness={0.23} clearcoat={0.7} />
        </mesh>
        <mesh position={[0, -0.94, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.15, 0.29, 9]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -2.02, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 1.95, 6]} />
          <meshStandardMaterial color={CUSTOM.paleGold} />
        </mesh>
      </group>
    </Float>
  );
}

function BookStack({ position }: { position: Vec3 }) {
  return (
    <group position={position} rotation={[0, -0.15, -0.07]}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, i * 0.34, 0]}>
          <RoundedBox args={[2.0 - i * 0.1, 0.33, 1.3]} radius={0.055} smoothness={4}>
            <meshStandardMaterial color={[CUSTOM.pink, CUSTOM.white, CUSTOM.secondary][i]} roughness={0.6} />
          </RoundedBox>
          <mesh position={[-0.9 + i * 0.05, 0, 0]}>
            <boxGeometry args={[0.055, 0.25, 1.25]} />
            <meshStandardMaterial color={CUSTOM.accent} metalness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingDecorations() {
  const pieces = useMemo(() => {
    const pseudo = (n: number) => {
      const v = Math.sin(n * 127.1 + 13.7) * 43758.5453;
      return v - Math.floor(v);
    };
    return Array.from({ length: 34 }, (_, i) => ({
      position: [
        (pseudo(i * 4 + 1) - 0.5) * 17,
        (pseudo(i * 4 + 2) - 0.5) * 12,
        -3 + pseudo(i * 4 + 3) * 5,
      ] as Vec3,
      size: 0.07 + pseudo(i * 7 + 1) * 0.18,
      rotation: [pseudo(i * 3 + 5), pseudo(i * 3 + 6), pseudo(i * 3 + 7)] as Vec3,
      color: [CUSTOM.accent, CUSTOM.white, CUSTOM.pink, "#93c3ed"][i % 4],
    }));
  }, []);

  return (
    <group>
      {pieces.map((p, i) => (
        <Float key={i} speed={0.6 + (i % 4) * 0.2} floatIntensity={0.2} rotationIntensity={0.4}>
          <mesh position={p.position} rotation={p.rotation}>
            <octahedronGeometry args={[p.size, 0]} />
            <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.35} flatShading />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Existing ScrollManager already renders InvitationSection as the fourth scene.
export default function InvitationSection({ position = [0, 0, 0] }: { position?: Vec3 }) {
  return (
    <group position={position}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[-4, 8, 8]} intensity={2.1} color={CUSTOM.paleGold} />
      <pointLight position={[0, 1, -2]} intensity={2.0} color={CUSTOM.secondary} distance={18} />
      <Stage />
      <GoldenArch />
      <BookStack position={[-4.5, -4.1, 2.5]} />
      <Diploma position={[4.25, -3.22, 2.1]} rotation={[0.2, -0.2, -0.24]} />
      <Mortarboard />
      <Balloon position={[-6.75, 0.5, 0]} color={CUSTOM.pink} />
      <Balloon position={[-7.65, -0.1, -0.7]} color={CUSTOM.paleGold} />
      <Balloon position={[6.8, 0.1, 0]} color={CUSTOM.accent} />
      <Balloon position={[7.8, -0.55, -0.6]} color="#a3c8e5" />
      <FloatingDecorations />
      <Sparkles count={115} scale={[18, 13, 8]} position={[0, 0, 0]} size={3.5} speed={0.32} color={CUSTOM.paleGold} />
      <group rotation={[0, -0.17, 0]}>
        <Text position={[0, 2.76, 1.4]} fontSize={0.58} color={CUSTOM.accent} letterSpacing={0.1} anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor={CUSTOM.main}>
          {CUSTOM.year}
        </Text>
        <Text position={[0, 1.65, 1.45]} fontSize={1.05} maxWidth={9.7} color={CUSTOM.white} anchorX="center" anchorY="middle" outlineWidth={0.018} outlineColor={CUSTOM.main}>
          {CUSTOM.graduate}
        </Text>
        <Text position={[0, 0.77, 1.45]} fontSize={0.34} color={CUSTOM.paleGold} letterSpacing={0.04} anchorX="center">
          {CUSTOM.school}
        </Text>
        <Text position={[0, -3.1, 4.0]} fontSize={0.32} color={CUSTOM.white} anchorX="center" maxWidth={11}>
          {CUSTOM.subtitle}
        </Text>
      </group>
    </group>
  );
}
