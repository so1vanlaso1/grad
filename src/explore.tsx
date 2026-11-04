import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import { Color, MOUSE, TOUCH, Vector3 } from "three";
import type { Fog } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const stopSpacing = 23;
export type ChapterTransition = "leaving" | "arriving" | null;

type ExploreProps = {
  chapter: number;
  dawn: boolean;
  reduced: boolean;
  recenter: number;
  paused: boolean;
  travel: ChapterTransition;
  zoomStep: RefObject<number>;
  onRoam: (roaming: boolean) => void;
  onFailure: () => void;
  plaque: RefObject<HTMLElement | null>;
  portrait: RefObject<HTMLButtonElement | null>;
};

export function portraitPosition(width: number, height: number): [number, number, number] {
  const aspect = width / height;
  return width <= 760 ? [Math.min(2.2, aspect * 3.55), 2.42, 1.65] : [Math.min(5.65, 1.15 + aspect * 3.1), 1.84, 3.05];
}

export default function Explore({
  chapter, dawn, reduced, recenter, paused, travel, zoomStep, onRoam, onFailure, plaque, portrait,
}: ExploreProps) {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControls(camera), [camera]);
  const userGesture = useRef(false);
  const applyingCamera = useRef(false);
  const roaming = useRef(false);
  const previousRequest = useRef(-1);
  const previousTravel = useRef<ChapterTransition>(null);
  const travelTime = useRef(0);
  const vectors = useMemo(() => ({
    view: new Vector3(), focus: new Vector3(), projected: new Vector3(), offset: new Vector3(), departure: new Vector3(),
  }), []);
  const fog = useRef<Fog>(null);
  const light = useMemo(() => new Color(), []);
  const startRoaming = useCallback(() => {
    if (roaming.current) return;
    roaming.current = true;
    onRoam(true);
  }, [onRoam]);

  useEffect(() => {
    const canvas = gl.domElement;
    controls.connect(canvas);
    controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE };
    controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 38;
    controls.minPolarAngle = 0.22;
    controls.maxPolarAngle = Math.PI * 0.57;
    controls.dampingFactor = 0.13;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.8;

    const start = () => { userGesture.current = true; };
    const end = () => { userGesture.current = false; };
    const changed = () => {
      if (userGesture.current && !applyingCamera.current) startRoaming();
    };
    const lose = () => { if (canvas.isConnected) onFailure(); };
    controls.addEventListener("start", start);
    controls.addEventListener("end", end);
    controls.addEventListener("change", changed);
    canvas.addEventListener("webglcontextlost", lose);
    return () => {
      controls.removeEventListener("start", start);
      controls.removeEventListener("end", end);
      controls.removeEventListener("change", changed);
      controls.dispose();
      canvas.removeEventListener("webglcontextlost", lose);
    };
  }, [controls, gl, onFailure, startRoaming]);

  useEffect(() => { controls.enabled = !paused; }, [controls, paused]);

  useFrame(({ size }, delta) => {
    const { view, focus, projected, offset, departure } = vectors;
    const narrow = size.width <= 760;
    const distance = narrow ? Math.max(13.8, 6.8 * size.height / size.width) : Math.max(14.7, 15.8 * size.height / size.width);
    const reset = previousRequest.current !== recenter;
    const ease = reduced || reset ? 1 : 1 - Math.exp(-4.3 * delta);
    const z = -chapter * stopSpacing;
    applyingCamera.current = true;
    if (previousTravel.current !== travel) {
      previousTravel.current = travel;
      travelTime.current = 0;
      departure.subVectors(camera.position, controls.target);
    }
    travelTime.current += delta;
    if (reset) {
      previousRequest.current = recenter;
      roaming.current = false;
      controls.enableDamping = false;
      controls.update();
    }
    if (travel === "leaving") {
      const progress = Math.min(1, travelTime.current / 0.27);
      camera.position.copy(controls.target).addScaledVector(departure, 1 - 0.19 * progress);
    } else if (!roaming.current) {
      const openDoor = chapter === 2 && dawn;
      const approach = travel === "arriving" ? 3.1 * Math.exp(-10 * travelTime.current) : 0;
      view.set(narrow || openDoor ? 0.22 : 0.95, openDoor ? 3.6 : 4.55, z + distance + approach - (openDoor ? 0.75 : 0));
      focus.set(0, narrow ? 2.25 : 2.45, z);
      camera.position.lerp(view, ease);
      controls.target.lerp(focus, ease);
    }
    if (!travel && zoomStep.current !== 0) {
      startRoaming();
      offset.subVectors(camera.position, controls.target);
      offset.setLength(Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * Math.pow(0.83, zoomStep.current))));
      camera.position.copy(controls.target).add(offset);
      zoomStep.current = 0;
    }
    controls.enableDamping = roaming.current && !reduced && !paused;
    controls.update();
    applyingCamera.current = false;
    camera.updateMatrixWorld();
    if (fog.current) fog.current.color.lerp(light.set(dawn ? "#e9b689" : "#25243d"), ease);

    function anchor(element: HTMLElement | null, x: number, y: number, depth: number, scale: number, angle: number) {
      if (!element) return;
      if (roaming.current || travel) { element.style.setProperty("--world-visibility", "hidden"); return; }
      projected.set(x, y, z + depth).project(camera);
      const left = (projected.x * 0.5 + 0.5) * size.width;
      const top = (0.5 - projected.y * 0.5) * size.height;
      element.style.setProperty("--world-anchor", "translate3d(" + left + "px," + top + "px,0) translate(-50%,-50%) scale(" + scale + ") perspective(900px) rotateY(" + angle + "deg)");
      element.style.setProperty("--world-visibility", "visible");
    }
    const plaqueScale = narrow ? 1 : Math.min(1, 0.86 + (size.width - 760) / 1800, size.height / 755);
    const plaqueX = -Math.min(4.83, size.width / size.height * 2.9);
    anchor(plaque.current, plaqueX, 1.3, 2.75, plaqueScale, 5);
    const [portraitX, portraitY, portraitDepth] = portraitPosition(size.width, size.height);
    anchor(portrait.current, portraitX, portraitY, portraitDepth, narrow ? 0.73 : plaqueScale, -7);
  });

  return <fog ref={fog} attach="fog" args={["#25243d", 22, 57]} />;
}
