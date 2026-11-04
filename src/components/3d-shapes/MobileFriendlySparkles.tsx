import { Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  type ColorRepresentation,
  type ShaderMaterial,
} from "three";
import useMobileGraphics from "../../utils/useMobileGraphics";
import useReducedMotion from "../../utils/useReducedMotion";

type Point = [number, number, number];

interface Props {
  count?: number;
  size?: number;
  speed?: number;
  opacity?: number;
  color?: ColorRepresentation;
  scale?: number | Point;
  position?: Point;
}

// On mobile, use smooth points with a lower bound on their pixel size.
const vertexShader = `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uPointSize;
  uniform float uPixelRatio;

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.7 + aPhase) * 0.07;
    p.y += cos(uTime * 0.5 + aPhase) * 0.12;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(uPointSize * aSize * uPixelRatio, 3.0, 8.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float radius = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.22, 0.5, radius);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

// Deterministic placement: re-rendering must not reshuffle particles.
function random(index: number, salt: number) {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function MobileSparkles({
  count = 30,
  size = 4,
  speed = 0.3,
  opacity = 1,
  color = "#ffffff",
  scale = 10,
  position = [0, 0, 0],
}: Props) {
  const reducedMotion = useReducedMotion();
  const pixelRatio = useThree(({ gl }) => gl.getPixelRatio());
  const materialRef = useRef<ShaderMaterial>(null);
  const [sx, sy, sz] = typeof scale === "number" ? [scale, scale, scale] : scale;
  const mobileCount = Math.max(10, Math.round(count * 0.45));

  const geometry = useMemo(() => {
    const result = new BufferGeometry();
    const positions = new Float32Array(mobileCount * 3);
    const phases = new Float32Array(mobileCount);
    const sizes = new Float32Array(mobileCount);
    for (let i = 0; i < mobileCount; i++) {
      positions[i * 3] = (random(i, 1) - 0.5) * sx;
      positions[i * 3 + 1] = (random(i, 2) - 0.5) * sy;
      positions[i * 3 + 2] = (random(i, 3) - 0.5) * sz;
      phases[i] = random(i, 4) * Math.PI * 2;
      sizes[i] = 0.8 + random(i, 5) * 0.4;
    }
    result.setAttribute("position", new BufferAttribute(positions, 3));
    result.setAttribute("aPhase", new BufferAttribute(phases, 1));
    result.setAttribute("aSize", new BufferAttribute(sizes, 1));
    return result;
  }, [mobileCount, sx, sy, sz]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const tint = useMemo(() => new Color(color), [color]);
  const pointSize = Math.min(4.8, Math.max(2.8, size * 0.55));
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointSize: { value: pointSize },
    uPixelRatio: { value: pixelRatio },
    uColor: { value: tint },
    uOpacity: { value: Math.min(opacity, 0.65) },
  }), [pointSize, pixelRatio, tint, opacity]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime * speed;
    }
  });

  return (
    <points geometry={geometry} position={position} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/** Preserve the original Drei sparkles on desktop. */
export default function MobileFriendlySparkles(props: Props) {
  const mobile = useMobileGraphics();
  return mobile ? <MobileSparkles {...props} /> : <Sparkles {...props} />;
}
