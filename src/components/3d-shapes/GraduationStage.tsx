import { RoundedBox, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import type { ReactNode } from "react";

export type Point = [number, number, number];

export function Stage({ position, children }: { position: Point; children: ReactNode }) {
  const aspect = useThree(({ size }) => size.width / size.height);
  return <group position={position} scale={Math.min(1, aspect / 1.05)}>{children}</group>;
}

export function Block({ position, size, color }: { position: Point; size: Point; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

export function Photo({
  url, width, height, depth = 0.24,
}: { url: string; width: number; height: number; depth?: number }) {
  const texture = useTexture(url);
  texture.colorSpace = SRGBColorSpace;
  return (
    <>
      <RoundedBox args={[width + 0.34, height + 0.34, depth]} radius={0.06} smoothness={2}>
        <meshStandardMaterial color="#c09a64" metalness={0.45} roughness={0.34} />
      </RoundedBox>
      <mesh position={[0, 0, depth / 2 + 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </>
  );
}
