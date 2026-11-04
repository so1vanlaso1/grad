import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import type { Texture } from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D silhouette;
  uniform float phase;
  uniform float strength;
  varying vec2 vUv;

  void main() {
    float alpha = texture2D(silhouette, vUv).a;
    float diagonal = vUv.x + vUv.y * 0.32;
    float glint = 1.0 - smoothstep(0.0, 0.14, abs(diagonal - phase));
    gl_FragColor = vec4(1.0, 0.90, 0.81, glint * alpha * strength);
  }
`;

export default function SchoolSheen({ texture, size, strength, reducedMotion }: {
  texture: Texture;
  size: [number, number];
  strength: number;
  reducedMotion: boolean;
}) {
  const uniforms = useMemo(() => ({
    silhouette: { value: texture },
    phase: { value: -0.2 },
    strength: { value: strength },
  }), [texture, strength]);

  useFrame(({ clock }) => {
    if (!reducedMotion) {
      uniforms.phase.value = -0.2 + Math.min((clock.elapsedTime % 9) / 3.2, 1) * 1.75;
    }
  });

  if (reducedMotion) return null;

  return (
    <mesh position={[0, 0, 0.012]} renderOrder={1}>
      <planeGeometry args={size} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader}
        fragmentShader={fragmentShader} transparent depthWrite={false} />
    </mesh>
  );
}
