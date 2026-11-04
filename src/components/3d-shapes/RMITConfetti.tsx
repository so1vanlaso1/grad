import emblem from "../../assets/western-sydney-emblem.svg";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, Euler, Group, Vector3 } from "three";
import { GraduationCap } from "../3d-models/GraduationCap";
import useMobileGraphics from "../../utils/useMobileGraphics";

const defaultColors = ["#d39afc", "#ffc1e3", "#ffffff", "#2e2e87"];

interface RMITConfettiProps {
  reducedMotion?: boolean;
  count?: number;
  colors?: string[];
}

export function RMITConfetti({
  count = 100,
  reducedMotion = false,
  colors = defaultColors,
}: RMITConfettiProps) {
  const groupRef = useRef<Group>(null);
  const mobileGraphics = useMobileGraphics();
  const particleCount = mobileGraphics ? Math.min(count, 18) : count;

  // Load graduation hat model (adjust path)
  const logoTexture = useTexture(emblem);

  const { renderedParticles, particles } = useMemo(() => {
    const items = [];
    for (let i = 0; i < particleCount; i++) {
      const type = Math.random(); // 0 - 1
      // 0 - 0.1: hat, 0.1 - 0.66: logo, 0.66 - 1: confetti
      const typeString = mobileGraphics ? "confetti" : type < 0.1 ? "hat" : type < 0.66 ? "logo" : "confetti";
      items.push({
        type: typeString,
        position: new Vector3(
          (Math.random() - 0.5) * 30,
          Math.random() * 20 + 10,
          (Math.random() - 0.5) * 30
        ),
        rotation: new Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale:
          mobileGraphics
            ? Math.random() * 0.19 + 0.37
            : typeString === "hat"
              ? Math.random() * 0.1 + 0.01
              : Math.random() * 0.18 + 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.1 + 0.02,
      });
    }
    const renderedParticles = items.map((p, i) => {
      switch (p.type) {
        case "hat":
          return (
            <GraduationCap
              key={i}
              scale={p.scale}
              position={p.position}
              rotation={p.rotation}
            />
          );
        case "logo":
          return (
            <mesh
              key={i}
              position={p.position}
              rotation={p.rotation}
              scale={p.scale}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={logoTexture}
                transparent
                depthWrite={false}
                alphaTest={0.05}
                side={DoubleSide}
              />
            </mesh>
          );
        case "confetti":
        default:
          return (
            <mesh
              key={i}
              position={p.position}
              rotation={p.rotation}
              scale={p.scale}
            >
              <planeGeometry args={[0.35, 0.8]} />
              {mobileGraphics
                ? <meshBasicMaterial color={p.color} side={DoubleSide} transparent opacity={0.8} depthWrite={false} />
                : <meshStandardMaterial color={p.color} side={DoubleSide} />}
            </mesh>
          );
      }
    });
    return { renderedParticles, particles: items };
  }, [particleCount, mobileGraphics, colors, logoTexture]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const step = Math.min(delta, 0.05) * 60;
    groupRef.current?.children.forEach((child, i) => {
      const p = particles[i];
      p.position.y -= p.speed * step;
      if (p.position.y < -10) p.position.y = 20;

      // Slight swaying motion
      p.position.x += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01 * step;
      p.position.z += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.01 * step;

      p.rotation.x += 0.01 * step;
      p.rotation.y += 0.01 * step;

      child.position.copy(p.position);
      child.rotation.copy(p.rotation);
    });
  });

  return <group ref={groupRef}>{renderedParticles}</group>;
}
