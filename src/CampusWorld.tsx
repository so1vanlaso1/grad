import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AdditiveBlending, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, DoubleSide,
  DirectionalLight, Group, HemisphereLight, InstancedMesh, MeshStandardMaterial, Object3D, Shape, SRGBColorSpace, TextureLoader, Vector3,
} from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { photos } from "./invitation";
import Explore, { portraitPosition, stopSpacing } from "./explore";
import type { ComponentProps } from "react";

type Point = [number, number, number];
type WorldProps = ComponentProps<typeof Explore> & {
  opened: boolean;
  onFrame: (category: "memory" | "friends", index: number) => void;
  onPortrait: () => void;
  onInvitation: () => void;
  onDoor: () => void;
};
const ivory = "#e9d1aa";
const gold = "#c2a16b";
const burgundy = "#792f3b";
const ink = "#20283e";
const teal = "#497e9b";
const cube = new BoxGeometry(1, 1, 1);
const materials = new Map<string, MeshStandardMaterial>();
const sceneTitles = ["The Next Chapter", "Memory Lane", "The Turning Point", "Graduation Day", "Thank-You Garden", "The Open Horizon"];

function WorldTitle({ text, at, width, color }: { text: string; at: Point; width: number; color: string }) {
  const font = useLoader(FontLoader, import.meta.env.BASE_URL + "fonts/cormorant-scene.json");
  const { geometry, measure } = useMemo(() => {
    const geometry = new TextGeometry(text, {
      font, size: 1, depth: 0.095, curveSegments: 7, bevelEnabled: true,
      bevelSegments: 2, bevelThickness: 0.016, bevelSize: 0.012,
    });
    geometry.center();
    const measure = geometry.boundingBox!.max.x - geometry.boundingBox!.min.x;
    return { geometry, measure };
  }, [font, text]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return <mesh position={at} scale={width / measure} geometry={geometry}>
    <meshStandardMaterial color={color} metalness={0.16} roughness={0.55} />
  </mesh>;
}

function Dust({ dawn, reduced }: { dawn: boolean; reduced: boolean }) {
  const particles = useRef<Group>(null);
  const geometry = useMemo(() => {
    const vertices = new Float32Array(480);
    for (let i = 0; i < vertices.length; i += 3) {
      const angle = i * 2.39996;
      const radius = 2 + (i * 17 % 71) * 0.16;
      vertices.set([Math.cos(angle) * radius, -1.5 + (i * 31 % 67) * 0.16, Math.sin(angle) * radius], i);
    }
    return new BufferGeometry().setAttribute("position", new BufferAttribute(vertices, 3));
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    if (particles.current && !reduced) particles.current.rotation.y += delta * 0.035;
  });
  return <group ref={particles}><points geometry={geometry}>
    <pointsMaterial size={0.034} color={dawn ? "#fff0bf" : "#ecbd9f"} opacity={0.8} transparent depthWrite={false} />
  </points></group>;
}

function Block({ at, size, color, rotation, glow = 0 }: { at: Point; size: Point; color: string; rotation?: Point; glow?: number }) {
  const key = color + "/" + glow;
  let material = materials.get(key);
  if (!material) {
    material = new MeshStandardMaterial({ color, roughness: 0.66, emissive: color, emissiveIntensity: glow });
    materials.set(key, material);
  }
  return <mesh geometry={cube} material={material} position={at} scale={size} rotation={rotation} dispose={null} />;
}

function Keepsake({ at, rotation = [0, 0, 0], scale = 1, reduced, onOpen, children }: {
  at: Point; rotation?: Point; scale?: number; reduced: boolean; onOpen?: () => void; children: ReactNode;
}) {
  const object = useRef<Group>(null);
  const hovered = useRef(false);
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => () => { canvas.style.cursor = ""; }, [canvas]);
  useFrame(({ clock }, delta) => {
    if (!object.current) return;
    const time = clock.elapsedTime * 1.9 + at[0] * 1.4;
    const lift = hovered.current ? 0.17 : 0;
    const ease = reduced ? 1 : 1 - Math.exp(-10 * delta);
    const y = at[1] + lift + (reduced ? 0 : Math.sin(time) * 0.10);
    object.current.position.y += (y - object.current.position.y) * ease;
    object.current.rotation.z = rotation[2] + (reduced ? 0 : Math.cos(time * 0.8) * 0.047);
    const targetScale = scale * (hovered.current ? 1.12 : 1);
    object.current.scale.setScalar(object.current.scale.x + (targetScale - object.current.scale.x) * ease);
  });
  return <group ref={object} position={at} rotation={rotation} scale={scale}
    onPointerOver={onOpen ? (e) => { e.stopPropagation(); hovered.current = true; canvas.style.cursor = "pointer"; } : undefined}
    onPointerOut={onOpen ? () => { hovered.current = false; canvas.style.cursor = ""; } : undefined}
    onClick={onOpen ? (e) => { if (e.delta < 7) { e.stopPropagation(); hovered.current = false; onOpen(); } } : undefined}>
    {children}
  </group>;
}

function Plinth({ warm = false }: { warm?: boolean }) {
  return <>
    <mesh position={[0, -0.34, 0]}>
      <cylinderGeometry args={[5.45, 5.15, 0.54, 72]} />
      <meshStandardMaterial color={warm ? "#7d5344" : "#343a54"} />
    </mesh>
    <mesh position={[0, -0.07, 0]}>
      <cylinderGeometry args={[5.47, 5.47, 0.055, 72]} />
      <meshStandardMaterial color={gold} />
    </mesh>
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[5.34, 5.47, 0.14, 72]} />
      <meshStandardMaterial color={warm ? "#b3825d" : "#505472"} />
    </mesh>
    <mesh position={[0, 0.077, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[4.97, 5.01, 72]} /><meshBasicMaterial color={warm ? "#ffdfb1" : "#ad95b4"} />
    </mesh>
  </>;
}

function Facade() {
  return <group>
    <Block at={[-1.53, 1.92, 0]} size={[3.15, 3.69, 1.95]} color={ink} />
    <Block at={[1.63, 1.64, -0.19]} size={[3.15, 3.14, 1.58]} color="#514754" />
    {Array.from({ length: 4 }, (_, floor) => (
      <group key={floor} position={[0, 0.58 + floor * 0.82, 0]}>
        {Array.from({ length: 5 }, (_, bay) => (
          <group key={bay} position={[-2.77 + bay * 0.62, 0, 1]}>
            <Block at={[0, 0, 0]} size={[0.55, 0.67, 0.075]} color={(bay + floor) % 4 === 0 ? "#f6c283" : teal} glow={(bay + floor) % 4 === 0 ? 0.57 : 0.1} />
            <Block at={[-0.12, 0.15, 0.046]} size={[0.19, 0.025, 0.02]} color="#bed6d4" glow={0.2} />
            <Block at={[0.286, 0.06, 0.065]} size={[0.045, 0.8, 0.05]} color="#24344b" />
            {bay % 2 === 0 && floor > 0 && <Block at={[0.215, 0.06, 0.11]} size={[0.075, 0.76, 0.19]} color="#ab4557" />}
          </group>
        ))}
        <Block at={[-1.53, -0.39, 0.99]} size={[3.15, 0.06, 0.1]} color="#93a3af" />
        <Block at={[1.63, -0.4, 0.79]} size={[3.17, 0.14, 0.77]} color={ivory} />
        <Block at={[1.63, -0.3, 1.17]} size={[3.13, 0.07, 0.075]} color="#a43a48" />
        <Block at={[1.63, -0.33, 0.94]} size={[2.9, 0.025, 0.07]} color="#ffce84" glow={0.85} />
        <Block at={[1.63, -0.04, 1.18]} size={[3.13, 0.032, 0.039]} color="#d4ad81" />
        {[-0.02, 0.38, 0.77].map((z) => <Block key={z} at={[-3.115, 0, z]} size={[0.05, 0.67, 0.3]} color={teal} />)}
        {[0.15, 1.59, 3.06].map((x) => <Block key={x} at={[x, 0, 0.99]} size={[0.17, 0.79, 0.17]} color="#d9c7ae" />)}
      </group>
    ))}
    <Block at={[-1.53, 3.79, 0]} size={[3.28, 0.14, 2.08]} color={ivory} />
    <Block at={[1.63, 3.3, -0.16]} size={[3.27, 0.17, 2.0]} color={ivory} />
    <Block at={[2.81, 2.08, 1.31]} size={[0.46, 2.26, 0.12]} color="#952b43" />
    <Block at={[2.81, 3.26, 1.31]} size={[0.61, 0.045, 0.14]} color={gold} />
    <WorldTitle text="WSU" at={[2.81, 2.75, 1.385]} width={0.32} color="#ffe4af" />
    <WorldTitle text="2026" at={[2.81, 2.45, 1.385]} width={0.29} color="#ffe4af" />
    <Block at={[2.81, 2.12, 1.38]} size={[0.26, 0.015, 0.01]} color={ivory} />
    <Block at={[2.81, 1.07, 1.38]} size={[0.24, 0.11, 0.01]} color={ivory} />
    <Block at={[0.21, 0.75, 1.35]} size={[2.4, 0.09, 0.99]} color="#3b3b4a" />
    <Block at={[0.21, 0.36, 1.01]} size={[1.3, 0.56, 0.1]} color="#262a38" />
    <Block at={[0.21, 0.68, 1.68]} size={[2.15, 0.035, 0.07]} color="#ffe2a4" glow={0.8} />
    {Array.from({ length: 4 }, (_, step) => (
      <Block key={step} at={[0.21, 0.12 + step * 0.075, 1.93 - step * 0.18]} size={[2.7, 0.12, 0.21]} color={ivory} />
    ))}
  </group>;
}

function Cap({ at, reduced, scale = 1 }: { at: Point; reduced: boolean; scale?: number }) {
  const cap = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!cap.current) return;
    cap.current.position.y = at[1] + (reduced ? 0 : Math.sin(clock.elapsedTime * 1.25) * 0.16);
    cap.current.rotation.y = 0.32 + (reduced ? 0 : Math.sin(clock.elapsedTime * 0.55) * 0.26);
  });
  return <group ref={cap} position={at} scale={scale} rotation={[0.1, 0.32, -0.14]}>
    <mesh position={[0, -0.16, 0]}>
      <cylinderGeometry args={[0.5, 0.55, 0.35, 32]} />
      <meshStandardMaterial color={ink} />
    </mesh>
    <Block at={[0, 0.08, 0]} size={[1.48, 0.13, 1.48]} color="#29324b" rotation={[0, Math.PI / 4, 0]} />
    <Block at={[0.3, 0.16, 0.25]} size={[0.91, 0.035, 0.04]} color={gold} rotation={[0, -0.63, 0]} />
    <Block at={[0.66, -0.04, 0.52]} size={[0.055, 0.38, 0.06]} color={gold} />
    <Block at={[0.66, -0.24, 0.52]} size={[0.1, 0.12, 0.085]} color="#e7b476" />
  </group>;
}

function Letter({ reduced, onOpen }: { reduced: boolean; onOpen: () => void }) {
  const star = useMemo(() => {
    const shape = new Shape();
    for (let point = 0; point < 8; point++) {
      const angle = point * Math.PI / 4;
      const radius = point % 2 === 0 ? 0.124 : 0.043;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (point === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);
  return <Keepsake at={[-0.83, 1.28, 2.28]} rotation={[-0.12, 0.12, -0.11]} reduced={reduced} onOpen={onOpen}>
    <Block at={[0, 0, 0]} size={[2.6, 1.62, 0.15]} color="#f0d8ad" />
    <Block at={[0, 0, 0.08]} size={[2.45, 1.47, 0.03]} color="#e4c295" />
    <Block at={[-0.63, 0.31, 0.106]} size={[1.47, 0.035, 0.03]} color="#b48c68" rotation={[0, 0, -0.53]} />
    <Block at={[0.63, 0.31, 0.106]} size={[1.47, 0.035, 0.03]} color="#b48c68" rotation={[0, 0, 0.53]} />
    <mesh position={[0, -0.075, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.22, 0.24, 0.1, 18]} />
      <meshStandardMaterial color={burgundy} />
    </mesh>
    <mesh position={[0, -0.075, 0.218]} rotation={[0, 0, 0.14]}>
      <shapeGeometry args={[star]} /><meshBasicMaterial color="#ffd29c" />
    </mesh>
  </Keepsake>;
}

function Tree({ at, rose = false, scale = 1 }: { at: Point; rose?: boolean; scale?: number }) {
  return <group position={at} scale={scale}>
    <Block at={[0, 0.64, 0]} size={[0.15, 1.2, 0.16]} color="#745148" />
    <mesh position={[0, 1.36, 0]} scale={[0.77, 1, 0.73]}>
      <icosahedronGeometry args={[0.82, 1]} />
      <meshStandardMaterial color={rose ? "#b77482" : "#52685d"} flatShading />
    </mesh>
    <mesh position={[-0.37, 1.14, 0.22]}>
      <icosahedronGeometry args={[0.54, 0]} />
      <meshStandardMaterial color={rose ? "#d39b9f" : "#75846a"} flatShading />
    </mesh>
  </group>;
}

function Path({ warm = false }: { warm?: boolean }) {
  return <group>
    {Array.from({ length: 11 }, (_, i) => (
      <Block key={i} at={[0, 0.1, 4 - i * 0.72]} size={[1.6, 0.065, 0.61]} color={warm ? "#ddbb8e" : "#8c8293"} />
    ))}
  </group>;
}

function Halo({ at, size, color }: { at: Point; size: number; color: string }) {
  const texture = useMemo(() => {
    const image = document.createElement("canvas");
    image.width = image.height = 64;
    const ctx = image.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "#ffffffc0");
    gradient.addColorStop(0.24, "#ffffff48");
    gradient.addColorStop(1, "#ffffff00");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new CanvasTexture(image);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite position={at} scale={[size, size, 1]}>
    <spriteMaterial map={texture} color={color} transparent blending={AdditiveBlending} depthWrite={false} />
  </sprite>;
}

function Orrery({ reduced, warm }: { reduced: boolean; warm: boolean }) {
  const orbit = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (orbit.current && !reduced) orbit.current.rotation.z = clock.elapsedTime * 0.32;
  });
  const accent = warm ? "#ffc879" : "#e9b9e7";
  return <group position={[0.65, 2.75, -1.96]} rotation={[0.16, -0.15, -0.17]} scale={[1, 0.8, 1]}>
    {[2.43, 2.72].map((radius) => <mesh key={radius}>
      <torusGeometry args={[radius, 0.025, 6, 72]} />
      <meshBasicMaterial color={accent} transparent opacity={0.78} />
    </mesh>)}
    <group ref={orbit}>
      {[0, 1.95, 4.14].map((angle, index) => (
        <group key={angle} position={[Math.cos(angle) * 2.72, Math.sin(angle) * 2.72, 0]}>
          <mesh rotation={[0, 0.2, 0.25]}><octahedronGeometry args={[index === 0 ? 0.18 : 0.105]} /><meshBasicMaterial color={accent} /></mesh>
          {index === 0 && <Halo at={[0, 0, 0]} size={1.4} color={accent} />}
        </group>
      ))}
    </group>
  </group>;
}

function Ribbon({ reduced, warm }: { reduced: boolean; warm: boolean }) {
  const ornament = useRef<Group>(null);
  const paths = useMemo(() => [-1, 1].map((side) => new CatmullRomCurve3([
    new Vector3(side * 3.65, 0.45, 1.82),
    new Vector3(side * 4.02, 1.12, 0.76),
    new Vector3(side * 3.75, 2.20, -0.58),
    new Vector3(side * 3.06, 2.85, -1.72),
    new Vector3(side * 2.62, 2.74, -2.45),
  ])), []);
  useFrame(({ clock }) => {
    if (ornament.current) ornament.current.rotation.z = reduced ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.05;
  });
  return <group ref={ornament}>
    {paths.map((path, index) => <group key={index}>
      <mesh><tubeGeometry args={[path, 32, 0.047, 5, false]} /><meshBasicMaterial color={warm ? "#ffd496" : "#db92c1"} transparent opacity={0.78} /></mesh>
      <Halo at={[index === 0 ? -2.62 : 2.62, 2.74, -2.45]} size={1.55} color={warm ? "#ffba77" : "#ef90cb"} />
    </group>)}
  </group>;
}

function Lantern({ at, warm }: { at: Point; warm: boolean }) {
  return <group position={at}>
    <Block at={[0, 0.34, 0]} size={[0.07, 0.69, 0.07]} color={gold} />
    <Block at={[0, 0.64, 0]} size={[0.24, 0.065, 0.24]} color="#6c455a" />
    <Block at={[0, 0.79, 0]} size={[0.18, 0.24, 0.18]} color={warm ? "#ffe3a3" : "#edbae1"} glow={1.4} />
    <mesh position={[0, 0.98, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.2, 0.2, 4]} /><meshStandardMaterial color={burgundy} />
    </mesh>
  </group>;
}

function Flowers({ reduced, narrow }: { reduced: boolean; narrow: boolean }) {
  const petals = useRef<InstancedMesh>(null);
  const centers = useRef<InstancedMesh>(null);
  const floating = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const count = narrow ? 20 : 38;
  const pollen = narrow ? 15 : 27;
  useFrame(({ clock }) => {
    if (!petals.current || !centers.current || !floating.current) return;
    const time = reduced ? 0 : clock.elapsedTime;
    for (let index = 0; index < count; index++) {
      const angle = index * 2.39996;
      const radius = 2.85 + (index * 11 % 19) * 0.093;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.18 + (index % 4) * 0.07;
      const sway = Math.sin(time * 1.8 + angle) * 0.06;
      for (let petal = 0; petal < 5; petal++) {
        const spin = petal * Math.PI * 0.4 + time * 0.2;
        dummy.position.set(x + sway + Math.cos(spin) * 0.11, y, z + Math.sin(spin) * 0.11);
        dummy.rotation.set(0.15, -spin, 0);
        dummy.scale.set(0.13, 0.047, 0.089);
        dummy.updateMatrix();
        petals.current.setMatrixAt(index * 5 + petal, dummy.matrix);
      }
      dummy.position.set(x + sway, y + 0.025, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(0.074);
      dummy.updateMatrix();
      centers.current.setMatrixAt(index, dummy.matrix);
    }
    for (let index = 0; index < pollen; index++) {
      const angle = index * 2.39996 + time * 0.27;
      const radius = 1.2 + (index * 7 % 13) * 0.24;
      dummy.position.set(Math.cos(angle) * radius, 0.35 + (index * 0.32 + time * 0.38) % 4, Math.sin(angle) * radius);
      dummy.rotation.set(time * 0.8 + index, angle, 0.8);
      dummy.scale.set(0.11, 0.034, 0.06);
      dummy.updateMatrix();
      floating.current.setMatrixAt(index, dummy.matrix);
    }
    petals.current.instanceMatrix.needsUpdate = centers.current.instanceMatrix.needsUpdate = floating.current.instanceMatrix.needsUpdate = true;
  });
  return <>
    <instancedMesh key={count} ref={petals} args={[undefined, undefined, count * 5]} frustumCulled={false}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ef91a7" emissive="#8f2d55" emissiveIntensity={0.22} /></instancedMesh>
    <instancedMesh key={"centers" + count} ref={centers} args={[undefined, undefined, count]} frustumCulled={false}><icosahedronGeometry args={[1, 0]} /><meshBasicMaterial color="#ffd888" /></instancedMesh>
    <instancedMesh key={pollen} ref={floating} args={[undefined, undefined, pollen]} frustumCulled={false}><icosahedronGeometry args={[1, 0]} /><meshBasicMaterial color="#ffc2cb" /></instancedMesh>
  </>;
}

function FrameImage({ src, width, height }: { src: string; width: number; height: number }) {
  const image = useLoader(TextureLoader, import.meta.env.BASE_URL + src);
  image.colorSpace = SRGBColorSpace;
  const scale = Math.min(width / image.image.width, height / image.image.height);
  return <mesh position={[0, 0, 0.104]}>
    <planeGeometry args={[image.image.width * scale, image.image.height * scale]} />
    <meshBasicMaterial map={image} toneMapped={false} />
  </mesh>;
}

function FrameMat({ src, width, height, color, label = false }: {
  src?: string; width: number; height: number; color: string; label?: boolean;
}) {
  return <>
    <Block at={[0, 0, 0.065]} size={[width, height, 0.045]} color={color} />
    {src ? <Suspense fallback={null}><FrameImage src={src} width={width} height={height} /></Suspense> : <>
      <Block at={[0, label ? 0.2 : 0, 0.096]} size={[0.34, 0.034, 0.014]} color="#dbb5a2" />
      <Block at={[0, label ? 0.2 : 0, 0.096]} size={[0.034, 0.34, 0.014]} color="#dbb5a2" />
      {label && <WorldTitle at={[0, -0.19, 0.104]} text="Photo coming soon" width={width * 0.8} color="#f7f0e7" />}
    </>}
  </>;
}

function Frames({ garden = false, reduced, onFrame }: { garden?: boolean; reduced: boolean; onFrame: (index: number) => void }) {
  const frames = photos.filter((photo) => photo.category === (garden ? "friends" : "memory"));
  return <>
    <Path warm={garden} />
    <Festoon garden={garden} />
    {!garden && <group position={[-2.8, 0.17, 3.1]} rotation={[0, -0.3, 0]}>
      {[burgundy, teal, ivory].map((color, index) => <group key={color} position={[index * 0.05, index * 0.21, 0]} rotation={[0, index * 0.16, 0]}>
        <Block at={[0, 0, 0]} size={[1.15, 0.2, 0.76]} color={color} />
        <Block at={[0.025, 0, 0.025]} size={[1.13, 0.13, 0.74]} color="#e5d3ba" />
        <Block at={[-0.54, 0, 0]} size={[0.06, 0.2, 0.76]} color={color} />
      </group>)}
    </group>}
    {([[-2.55, 0, 1.82], [2.68, 0, 1.05], [-1.37, 0, -0.93], [1.32, 0, -2.05]] as Point[]).map((at, i) => (
      <group key={i} position={at}>
        <Block at={[0, 0.55, 0]} size={[0.08, 1.03, 0.12]} color={gold} />
        <Keepsake at={[0, 1.91, 0]} rotation={[0, i % 2 === 0 ? 0.29 : -0.26, 0]} reduced={reduced} onOpen={() => onFrame(i)}>
          <Block at={[0, 0, 0]} size={[0.95, 1.55, 0.11]} color={ivory} />
          <group position={[0, 0.09, 0]}><FrameMat src={frames[i]?.thumbnail || frames[i]?.src} width={0.75} height={1.12} color={garden ? "#b58b8a" : "#665d79"} /></group>
          <WorldTitle text={frames[i].title} at={[0, -0.64, 0.072]} width={0.88} color={burgundy} />
        </Keepsake>
      </group>
    ))}
    <Tree at={[-3.46, 0, -2.1]} rose={garden} scale={1.22} />
    <Tree at={[3.22, 0, -1.75]} rose={garden} />
    <Tree at={[3.5, 0, 1.63]} rose={garden} scale={0.7} />
    <Tree at={[-3.63, 0, 0.8]} rose={garden} scale={0.72} />
    {garden ? <group position={[0, 0, -3.15]}>
      <Block at={[0, 0.57, 0]} size={[2.08, 0.13, 0.54]} color={burgundy} />
      <Block at={[0, 0.91, -0.21]} size={[2.08, 0.25, 0.11]} color={burgundy} />
      {[-0.83, 0.83].map((x) => <Block key={x} at={[x, 0.29, 0]} size={[0.13, 0.55, 0.37]} color={gold} />)}
    </group> : [-1, 1].map((side) => <group key={side} position={[side * 1.07, 0, 2.7]}>
      <Block at={[0, 0.73, 0]} size={[0.075, 1.4, 0.075]} color={gold} />
      <mesh position={[0, 1.53, 0]}><sphereGeometry args={[0.16, 12, 8]} /><meshBasicMaterial color="#ffd798" /></mesh>
    </group>)}
  </>;
}

function Festoon({ garden }: { garden: boolean }) {
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(-3.6, 3.35, -1.9), new Vector3(-1.8, 2.9, -2.7),
    new Vector3(0, 2.7, -3), new Vector3(1.8, 2.9, -2.7), new Vector3(3.6, 3.35, -1.9),
  ]), []);
  return <group>
    {[-3.6, 3.6].map((x) => <Block key={x} at={[x, 1.7, -1.9]} size={[0.06, 3.4, 0.06]} color={gold} />)}
    <mesh><tubeGeometry args={[curve, 32, 0.017, 5, false]} /><meshStandardMaterial color={gold} /></mesh>
    {Array.from({ length: 13 }, (_, i) => {
      const point = curve.getPoint(i / 12);
      return <group key={i} position={point}>
        <Block at={[0, -0.09, 0]} size={[0.015, 0.18, 0.015]} color={gold} />
        <mesh position={[0, -0.2, 0]}><sphereGeometry args={[0.075, 8, 6]} /><meshBasicMaterial color={garden ? "#fff0bd" : "#ffcf99"} /></mesh>
      </group>;
    })}
  </group>;
}

function Diploma({ reduced }: { reduced: boolean }) {
  return <Keepsake at={[1.65, 1.5, 2.3]} rotation={[0, 0, -0.35]} reduced={reduced}>
    <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.2, 0.2, 1.7, 24]} /><meshStandardMaterial color="#f7e6c8" roughness={0.8} /></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.207, 0.045, 8, 24]} /><meshStandardMaterial color={burgundy} /></mesh>
    <Block at={[-0.07, -0.32, 0.12]} size={[0.13, 0.48, 0.04]} color={burgundy} rotation={[0, 0, -0.18]} />
    <Block at={[0.12, -0.28, 0.1]} size={[0.13, 0.43, 0.04]} color={burgundy} rotation={[0, 0, 0.32]} />
  </Keepsake>;
}

function Arrival({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    if (!group.current) return;
    const remaining = reduced ? 0 : Math.exp(-7 * elapsed.current);
    group.current.position.y = -0.65 * remaining;
    group.current.rotation.y = -0.16 * remaining;
    group.current.scale.setScalar(1 - 0.08 * remaining);
  });
  return <group ref={group}>{children}</group>;
}

function PortraitFrame({ at, narrow, reduced, onOpen }: { at: Point; narrow: boolean; reduced: boolean; onOpen: () => void }) {
  return <Keepsake at={at} scale={narrow ? 0.61 : 0.93} rotation={[-0.08, -0.13, -0.11]} reduced={reduced} onOpen={onOpen}>
    <Block at={[0, 0, 0]} size={[1.8, 2.14, 0.12]} color="#f1d5b1" />
    <group position={[0, 0.13, 0]}><FrameMat src={photos[0].thumbnail || photos[0].src} width={1.1} height={1.63} color="#a77489" label /></group>
    <Block at={[0, -0.86, 0.07]} size={[0.65, 0.029, 0.012]} color="#966c72" />
  </Keepsake>;
}

function Door({ open, reduced, onOpen }: { open: boolean; reduced: boolean; onOpen?: () => void }) {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!left.current || !right.current) return;
    const target = open ? 1.4 : 0;
    const angle = reduced ? target : left.current.rotation.y + (target - left.current.rotation.y) * (1 - Math.exp(-2.8 * delta));
    left.current.rotation.y = angle;
    right.current.rotation.y = -angle;
  });

  return <>
    <Path warm={open} />
    <group position={[0, 0.12, -0.35]}
      onClick={onOpen ? (e) => { if (e.delta < 7) { e.stopPropagation(); onOpen(); } } : undefined}>
      <mesh position={[0, 2.45, 0]}>
        <torusGeometry args={[1.15, 0.19, 12, 40, Math.PI]} />
        <meshStandardMaterial color={gold} />
      </mesh>
      <mesh position={[0, 2.45, 0.17]}>
        <torusGeometry args={[1.18, 0.033, 7, 42, Math.PI]} />
        <meshBasicMaterial color={open ? "#fff5b7" : "#e6a9b9"} />
      </mesh>
      <mesh position={[0, 3.65, 0.18]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.25]} /><meshStandardMaterial color="#e6a2b3" emissive="#b1567c" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 2.45, -0.12]}>
        <circleGeometry args={[1.08, 32, 0, Math.PI]} />
        <meshBasicMaterial color={open ? "#ffd9a3" : "#483349"} />
      </mesh>
      {[-1, 1].map((side) => <group key={side}>
        <Block at={[1.15 * side, 1.25, 0]} size={[0.38, 2.5, 0.39]} color={gold} />
        <Block at={[1.15 * side, 1.28, 0.21]} size={[0.05, 2.18, 0.04]} color="#ffe5b5" glow={open ? 1 : 0.16} />
        <Lantern at={[side * 1.86, 0.06, 0.27]} warm={open} />
        <Block at={[1.15 * side, 0.16, 0]} size={[0.58, 0.33, 0.57]} color={ivory} />
        <group ref={side < 0 ? left : right} position={[side * 1.06, 0, -0.02]}>
          <Block at={[-side * 0.51, 1.23, 0]} size={[1.025, 2.45, 0.095]} color={burgundy} />
          <Block at={[-side * 0.51, 1.22, 0.054]} size={[0.82, 2.18, 0.024]} color="#895164" />
          <Block at={[-side * 0.89, 1.22, 0.09]} size={[0.09, 0.13, 0.08]} color={gold} />
        </group>
      </group>)}
    </group>
    {open && <>
      <mesh position={[0, 1.48, -1.05]}>
        <planeGeometry args={[2.15, 2.6]} />
        <meshBasicMaterial color="#ffd9a3" side={DoubleSide} />
      </mesh>
      <Halo at={[0, 2.03, -1.12]} size={5.3} color="#ffb95c" />
      <Halo at={[0, 1.1, 1.06]} size={3.7} color="#ffe89a" />
    </>}
    <Tree at={[-3.1, 0, -1.62]} rose scale={0.9} />
    <Tree at={[2.95, 0, -1.62]} scale={0.86} />
  </>;
}

function Horizon({ reduced }: { reduced: boolean }) {
  return <>
    <Path warm />
    <mesh position={[0, 1.57, -3.46]}>
      <sphereGeometry args={[1.48, 36, 24]} />
      <meshBasicMaterial color="#ffe3b5" />
    </mesh>
    <Halo at={[0, 1.57, -3.58]} size={7.5} color="#ffd28c" />
    <Orrery reduced={reduced} warm />
    <Cap at={[0, 2.14, 0.18]} reduced={reduced} scale={1.15} />
    <Tree at={[-3.2, 0, -0.92]} rose scale={0.88} />
    <Tree at={[3.15, 0, 0.16]} rose scale={0.72} />
    <Tree at={[2.67, 0, -2.43]} scale={0.65} />
  </>;
}

function Lighting({ dawn, reduced }: { dawn: boolean; reduced: boolean }) {
  const sky = useRef<HemisphereLight>(null);
  const key = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);
  const color = useMemo(() => new Color(), []);
  useFrame((_, delta) => {
    const ease = reduced ? 1 : 1 - Math.exp(-3.4 * delta);
    if (sky.current) sky.current.color.lerp(color.set(dawn ? "#fff3d9" : "#dbd3ff"), ease);
    if (key.current) key.current.color.lerp(color.set(dawn ? "#ffd2a2" : "#ffdeb7"), ease);
    if (rim.current) rim.current.color.lerp(color.set(dawn ? "#fa8f91" : "#87a4ff"), ease);
  });
  return <>
    <hemisphereLight ref={sky} args={["#dbd3ff", "#987b9c", 1.85]} />
    <directionalLight ref={key} position={[5, 9, 8]} intensity={2.05} />
    <directionalLight ref={rim} position={[-9, 4, -5]} intensity={0.55} />
  </>;
}

function Route(props: WorldProps & { onReady: (value: boolean) => void }) {
  const { chapter, dawn, opened, reduced, onFrame, onPortrait, onInvitation, onDoor, onReady } = props;
  const { width, height } = useThree((state) => state.size);
  const narrow = width <= 760;
  const short = height < 520;
  const titleWidth = narrow ? Math.min(5.6, Math.max(4.35, width / height * 9.1)) : short ? 9 : 11.25;
  const index = chapter;
  useEffect(() => { onReady(true); }, [onReady]);
  return <>
      <Lighting dawn={dawn} reduced={reduced} />
        <group key={index} position={[0, 0, -index * stopSpacing]}>
          <WorldTitle text={sceneTitles[index]} at={[0, narrow ? 5.45 : short ? 5.52 : 5.82, 0]} width={titleWidth} color={index < 3 && !(index === 2 && opened) ? "#f3d4bc" : "#792f3b"} />
          {index === 0 && <WorldTitle text="Thùy Dung" at={[0, narrow ? 4.61 : 4.55, 0.04]} width={narrow || short ? 2.45 : 3.48} color="#deb7bd" />}
          {(index === 0 || index === 3) && <PortraitFrame at={portraitPosition(width, height)} narrow={narrow} reduced={reduced} onOpen={onPortrait} />}
          <Dust dawn={dawn} reduced={reduced} />
          <group position={narrow ? [0, 1.38, -0.1] : [1.41, 0.29, 0.14]} scale={narrow ? Math.min(0.64, width / 790) : 0.86} rotation={[0, -0.17, 0]}>
            <Arrival reduced={reduced}>
            <Plinth warm={index >= 3 || (index === 2 && opened)} />
            {(index === 0 || index === 3) && <>
              <Orrery reduced={reduced} warm={index === 3} />
              <Ribbon reduced={reduced} warm={index === 3} />
              <group position={[-0.4, 0, -1.25]}><Facade /></group>
              <Tree at={[-3.56, 0, 0.22]} rose scale={0.9} />
              <Tree at={[3.5, 0, -0.24]} scale={0.88} />
              <Lantern at={[-1.6, 0.07, 3.25]} warm={index === 3} />
              <Lantern at={[1.83, 0.07, 3.25]} warm={index === 3} />
              {index === 0 ? <Letter reduced={reduced} onOpen={onInvitation} /> : <><Path warm /><Diploma reduced={reduced} /></>}
              <Cap at={index === 0 ? [0.24, 4.25, 0.42] : [-1.5, 3.9, 1.4]} reduced={reduced} scale={0.82} />
            </>}
            {index === 1 && <Frames reduced={reduced} onFrame={(photo) => onFrame("memory", photo)} />}
            {index === 2 && <Door open={opened} reduced={reduced} onOpen={onDoor} />}
            {index === 4 && <><Flowers reduced={reduced} narrow={narrow} /><Frames garden reduced={reduced} onFrame={(photo) => onFrame("friends", photo)} /></>}
            {index === 5 && <Horizon reduced={reduced} />}
            </Arrival>
          </group>
        </group>
  </>;
}

export default function CampusWorld(props: WorldProps) {
  const [supported, setSupported] = useState(false);
  const [ready, setReady] = useState(false);
  const checked = useRef(false);
  const { onFailure } = props;
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    // Three needs WebGL 2. Detect unavailable graphics before Fiber configures its renderer.
    const context = document.createElement("canvas").getContext("webgl2", { powerPreference: "low-power" });
    if (!context) {
      onFailure();
      return;
    }
    context.getExtension("WEBGL_lose_context")?.loseContext();
    setSupported(true);
  }, [onFailure]);

  if (!supported) return <div className="world-loading">Opening the campus…</div>;
  return <>
    <Canvas dpr={[1, 1.45]} camera={{ position: [0.95, 4.55, 14.7], fov: 43, near: 0.1, far: 95 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <Explore {...props} />
      <Suspense fallback={null}><Route {...props} onReady={setReady} /></Suspense>
    </Canvas>
    {!ready && <div className="world-loading">Opening the campus…</div>}
  </>;
}
