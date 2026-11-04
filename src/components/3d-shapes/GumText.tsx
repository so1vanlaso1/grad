import { Center, Float, Text3D, useTexture } from "@react-three/drei";

interface GumTextProps {
  position: [number, number, number];
  size?: number;
  text: string;
  rotation?: [number, number, number];
  color?: string;
}

export default function GumText({
  position,
  text,
  rotation = [0, 0, 0],
  size = 3,
  color = "mistyrose",
}: GumTextProps) {
  const matcapTexture = useTexture("/textures/CB5E3B_FABC7A_EF965E_F4A46C.png");

  return (
    <Center position={position} rotation={rotation}>
      <Float speed={1}>
        <Text3D
          size={size}
          font={"/fonts/gt.json"}
          curveSegments={12}
          bevelEnabled
          bevelSize={0.08}
          bevelThickness={0.03}
          height={0.42}
          lineHeight={0.9}
          letterSpacing={0.3}
        >
          {text}
          <meshMatcapMaterial color={color} matcap={matcapTexture} />
        </Text3D>
      </Float>
    </Center>
  );
}
