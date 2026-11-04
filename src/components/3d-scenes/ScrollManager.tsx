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

const verticalFit = [1.4, 1.78, 1.36, 1.28, 1, 1.1, 1];

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

  useFrame(({ camera }, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !width || !height) return;
    // Fit the scene between the overlays, and maintain a minimum horizontal view in portrait.
    const fit = Math.max(verticalFit[destination ?? currentSection] * Math.max(1, 620 / height), 1.26 * height / width);
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
    controls.enabled = false;
    setDestination(index);
    const camera = sectionPositions[index].clone().add(sectionOffsets[index]);
    const target = chapterFocus(sectionPositions[index], index);

    const move = (animate: boolean) =>
      controls.setLookAt(camera.x, camera.y, camera.z, target.x, target.y, target.z, animate);
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        move(!reducedMotion),
        new Promise<void>((resolve) => {
          timeout = setTimeout(() => { void move(false); resolve(); }, 1800);
        }),
      ]);
      setCurrentSection(index);
    } finally {
      clearTimeout(timeout);
      controls.enabled = true;
      isTransitioning.current = false;
      setDestination(null);
      setIsClickedNavButton(0);
    }
  }, [currentSection, reducedMotion, sectionOffsets, sectionPositions, setCurrentSection, setDestination, setIsClickedNavButton]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]") || event.repeat) return;
      if (event.key === "ArrowRight") void navigate(1);
      if (event.key === "ArrowLeft") void navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    if (isClickedNavButton) void navigate(isClickedNavButton);
  }, [isClickedNavButton, navigate]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.22}
      restThreshold={0.12}
      maxDistance={150}
      minDistance={5}
      maxPolarAngle={Math.PI / 1.5}
      minPolarAngle={Math.PI / 8}
      // Add rotation constraints for each section
      maxAzimuthAngle={Math.PI / 2} // Limit horizontal rotation
      minAzimuthAngle={-Math.PI / 2}
      // dampingFactor={0.1} // Smoother camera movement
      // draggingDampingFactor={0.1}
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
