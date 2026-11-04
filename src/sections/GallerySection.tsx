import { Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { album } from "../graduation";
import { Block, Photo, type Point } from "../components/3d-shapes/GraduationStage";

const wall = "#d5bb9e";
const walnut = "#492f2c";
const brass = "#ab7f47";
const font = "/fonts/CormorantInfant-Bold.ttf";

export default function GallerySection({ position, page, onOpen }: {
  position: Point;
  page: number;
  onOpen: (index: number) => void;
}) {
  const scale = useThree(({ size }) => Math.min(1, size.width / size.height / 1.05));
  const start = page * 3;
  const photos = album.slice(start, start + 3);

  return (
    <group position={position} scale={scale}>
      {/* An open-front room with its walls, floor and track in the same 3D space. */}
      <Block position={[0, -3.65, 0]} size={[16.8, 0.42, 10.5]} color={walnut} />
      <Block position={[0, 0.29, -5.05]} size={[16.8, 7.45, 0.35]} color={wall} />
      <Block position={[0, -3.24, -4.83]} size={[16.55, 0.32, 0.12]} color={walnut} />
      <Block position={[0, 3.8, -4.78]} size={[16.7, 0.34, 0.55]} color={walnut} />
      <Block position={[0, 3.34, -2.94]} size={[14.5, 0.09, 0.12]} color={walnut} />

      {[-1, 1].map((side) => (
        <group key={side}>
          <Block position={[side * 8.2, 0.28, -2.43]} size={[0.34, 7.45, 5.25]} color="#9f776b" />
          <Block position={[side * 8, -3.23, -2.43]} size={[0.09, 0.32, 5.25]} color={walnut} />
          <Block position={[side * 8.2, 3.79, -2.43]} size={[0.48, 0.36, 5.25]} color={walnut} />
        </group>
      ))}

      {Array.from({ length: 14 }, (_, index) => (
        <Block key={index} position={[(index - 6.5) * 1.18, -3.42, 0]}
          size={[1.16, 0.055, 10.45]} color={["#a78060", "#af8b69", "#b68f6c"][index % 3]} />
      ))}

      <Block position={[0, -2.98, 2.9]} size={[3.55, 0.28, 0.95]} color="#762e46" />
      {[-1.45, 1.45].map((x) => (
        <Block key={x} position={[x, -3.23, 2.9]} size={[0.16, 0.32, 0.72]} color={walnut} />
      ))}

      {photos.map(({ url, landscape }, index) => {
        const x = (index - (photos.length - 1) / 2) * 4.8;
        const width = landscape ? 3.8 : photos.length === 1 ? 3.05 : 2.42;
        const height = landscape ? width * 2 / 3 : width * 1.5;
        const labelY = 0.16 - height / 2 - 0.57;
        const number = String(start + index + 1).padStart(2, "0");

        return (
          <group key={url} position={[x, 0, 0]}>
            <group position={[0, 3.14, -2.94]} rotation={[0.65, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.17, 0.24, 0.43, 16]} />
                <meshStandardMaterial color={walnut} metalness={0.45} roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.225, 0]}>
                <cylinderGeometry args={[0.19, 0.19, 0.025, 16]} />
                <meshBasicMaterial color="#ffe7bb" />
              </mesh>
            </group>
            <pointLight position={[0, 2.7, -3.1]} color="#ffd7a7" intensity={13 * scale ** 2} distance={6 * scale} />

            <group position={[0, 0.16, -4.63]}
              onClick={(event) => { event.stopPropagation(); onOpen(start + index); }}>
              <Block position={[0.07, -0.09, -0.14]} size={[width + 0.63, height + 0.62, 0.11]} color="#8c6e5c" />
              <Block position={[0, 0, -0.06]} size={[width + 0.58, height + 0.58, 0.14]} color="#f5e2c5" />
              <Suspense fallback={<Block position={[0, 0, 0.04]} size={[width, height, 0.1]} color="#ad8975" />}>
                <Photo url={url} width={width} height={height} depth={0.12} />
              </Suspense>
            </group>

            <group position={[0, labelY, -4.82]}>
              <Block position={[0, 0, 0]} size={[0.62, 0.4, 0.06]} color={brass} />
              <Suspense fallback={null}>
                <Text position={[0, 0, 0.04]} font={font} fontSize={0.23} color="#24160e">{number}</Text>
              </Suspense>
            </group>
          </group>
        );
      })}
    </group>
  );
}
