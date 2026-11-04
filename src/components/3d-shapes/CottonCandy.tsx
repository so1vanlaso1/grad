import { Cloud, Clouds, Float } from "@react-three/drei";

interface CottonCandyProps {
  position?: [number, number, number];
  color?: string;
  scale?: number;
}
// Cotton Candy Cloud component
export default function CottonCandy({
  position = [0, 0, 0],
  color = "#ffaadd",
  scale = 1,
}: CottonCandyProps) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={position} scale={scale}>
        <Clouds texture="/textures/cloud.png" limit={10}>
          <Cloud
            segments={10}
            bounds={[1, 1, 1]}
            volume={6}
            color={color}
            opacity={0.8}
            fade={10}
            speed={0.1}
          />
        </Clouds>
      </group>
    </Float>
  );
}
