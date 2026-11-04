import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import WelcomeSection from "../../sections/WelcomeSection";
import SubtitleSection from "../../sections/SubtitleSection";
import SchoolSection from "../../sections/SchoolSection";
import InvitationSection from "../../sections/InvitationSection";
import LettersSection from "../../sections/LettersSection";
import GallerySection from "../../sections/GallerySection";
import LetterBoxSection from "../../sections/LetterBoxSection";
import SceneSurroundings from "./SceneSurroundings";
import CanvasLoader from "./CanvasLoader";

interface SceneProps {
  setCurrentSection: (section: number) => void;
  currentSection: number;
  isClickedNavButton: -1 | 0 | 1;
  setIsClickedNavButton: (value: -1 | 0 | 1) => void;
  sectionPositions: THREE.Vector3[];
  sectionOffsets: THREE.Vector3[];
}

const verticalFit = [1.08, 1.78, 1.5, 1.28, 1, 1.1, 1];

function chapterFocus(position: THREE.Vector3, index: number) {
  return index === 1 ? position.clone().add(new THREE.Vector3(0, -1.8, 0)) : position;
}

function CustomCameraControls({
  setCurrentSection,
  currentSection,
  isClickedNavButton,
  setIsClickedNavButton,
  sectionPositions,
  sectionOffsets,
  destination,
  setDestination,
  reducedMotion,
}: SceneProps & {
  destination: number | null;
  setDestination: (index: number | null) => void;
  reducedMotion: boolean;
}) {
  const controlsRef = useRef<CameraControls | null>(null);
  const isTransitioning = useRef(false);
  const initialSection = useRef(currentSection);
  const { width, height } = useThree(({ size }) => size);
  const gl = useThree(({ gl }) => gl);

  useFrame(({ camera }, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !width || !height) return;
    // Fit the scene between the overlays, and maintain a minimum horizontal view in portrait.
    const fit = Math.max(verticalFit[destination ?? currentSection] * Math.max(1, 620 / height), 1.18 * height / width);
    const fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(Math.PI / 12) * fit));
    if (Math.abs(camera.fov - fov) < 0.01) return;
    camera.fov = reducedMotion ? fov : THREE.MathUtils.damp(camera.fov, fov, 12, delta);
    camera.updateProjectionMatrix();
  });

  useEffect(() => { initialSection.current = currentSection; }, [currentSection]);

  useEffect(() => {
    const index = initialSection.current;
    const camera = sectionPositions[index].clone().add(sectionOffsets[index]);
    const target = chapterFocus(sectionPositions[index], index);
    void controlsRef.current?.setLookAt(camera.x, camera.y, camera.z, target.x, target.y, target.z, false);
  }, [sectionOffsets, sectionPositions]);

  const navigate = useCallback(async (direction: -1 | 1) => {
    const controls = controlsRef.current;
    const index = currentSection + direction;
    if (!controls || isTransitioning.current || index < 0 || index >= sectionPositions.length) return;

    isTransitioning.current = true;
    controls.cancel();
    // Keep the frame update alive; disconnect input only during the flight.
    controls.disconnect();
    setDestination(index);
    const camera = sectionPositions[index].clone().add(sectionOffsets[index]);
    const target = chapterFocus(sectionPositions[index], index);

    const move = (animate: boolean) =>
      controls.setLookAt(camera.x, camera.y, camera.z, target.x, target.y, target.z, animate);
    try {
      await move(!reducedMotion);
      setCurrentSection(index);
    } finally {
      controls.connect(gl.domElement);
      isTransitioning.current = false;
      setDestination(null);
      setIsClickedNavButton(0);
    }
  }, [currentSection, gl, reducedMotion, sectionOffsets, sectionPositions, setCurrentSection, setDestination, setIsClickedNavButton]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]") || event.repeat || isTransitioning.current) return;
      const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (direction && currentSection + direction >= 0 && currentSection + direction < sectionPositions.length) {
        event.preventDefault();
        setIsClickedNavButton(direction);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentSection, sectionPositions.length, setIsClickedNavButton]);

  useEffect(() => {
    if (isClickedNavButton) void navigate(isClickedNavButton);
  }, [isClickedNavButton, navigate]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.32}
      restThreshold={0.12}
      // Allow guests to explore details without restricting zoom to a narrow band.
      // Keep a minimum distance so the camera cannot pass through the stage.
      maxDistance={sectionOffsets[destination ?? currentSection].length() * 2.15}
      minDistance={sectionOffsets[destination ?? currentSection].length() * 0.43}
      // Wider orbit, while preventing upside-down and rear-of-stage views.
      maxPolarAngle={Math.PI * 0.69}
      minPolarAngle={Math.PI * 0.2}
      maxAzimuthAngle={Math.PI * 0.44}
      minAzimuthAngle={-Math.PI * 0.44}
      dollySpeed={1.15}
      truckSpeed={1.1}
    />
  );
}

interface WorldProps extends SceneProps {
  reducedMotion: boolean;
  galleryPage: number;
  onOpenPhoto: (index: number) => void;
  onOpenLetter: (index: number) => void;
  onOpenInvitation: () => void;
  onOpenRsvp: () => void;
}

export default function Scene({
  reducedMotion,
  galleryPage,
  onOpenPhoto,
  onOpenLetter,
  onOpenInvitation,
  onOpenRsvp,
  setCurrentSection,
  currentSection,
  isClickedNavButton,
  setIsClickedNavButton,
  sectionPositions,
  sectionOffsets,
}: WorldProps) {
  const [destination, setDestination] = useState<number | null>(null);
  const positions = sectionPositions.map((position) => position.toArray());
  const sections = [
    <WelcomeSection position={positions[0]} />,
    <SubtitleSection position={positions[1]} />,
    <SchoolSection position={positions[2]} reducedMotion={reducedMotion} />,
    <InvitationSection position={positions[3]} onOpen={() => { if (currentSection === 3) onOpenInvitation(); }} />,
    <LettersSection position={positions[4]} active={currentSection === 4} onOpen={(index) => { if (currentSection === 4) onOpenLetter(index); }} />,
    <GallerySection position={positions[5]} page={galleryPage} onOpen={(index) => { if (currentSection === 5) onOpenPhoto(index); }} />,
    <LetterBoxSection position={positions[6]} active={currentSection === 6} reducedMotion={reducedMotion} onOpen={onOpenRsvp} />,
  ];
  return (
    <>
      <CustomCameraControls
        setCurrentSection={setCurrentSection}
        currentSection={currentSection}
        isClickedNavButton={isClickedNavButton}
        setIsClickedNavButton={setIsClickedNavButton}
        sectionOffsets={sectionOffsets}
        sectionPositions={sectionPositions}
        destination={destination}
        setDestination={setDestination}
        reducedMotion={reducedMotion}
      />

      {sections.map((section, index) => Math.abs(index - currentSection) <= 1 && (
        <group key={index} visible={index === currentSection || index === destination}>
          <Suspense fallback={index === currentSection ? <CanvasLoader /> : null}>
            {index < 6 && <SceneSurroundings scene={index} position={positions[index]}
              active={index === currentSection} reducedMotion={reducedMotion} />}
            {section}
          </Suspense>
        </group>
      ))}
    </>
  );
}
