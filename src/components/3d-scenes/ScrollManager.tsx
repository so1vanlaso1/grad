import { CameraControls } from "@react-three/drei";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import WelcomeSection from "../../sections/WelcomeSection";
import SubtitleSection from "../../sections/SubtitleSection";
import SchoolSection from "../../sections/SchoolSection";
import InvitationSection from "../../sections/InvitationSection";
import LettersSection from "../../sections/LettersSection";
import GallerySection from "../../sections/GallerySection";
import LetterBoxSection from "../../sections/LetterBoxSection";
import SceneSurroundings from "./SceneSurroundings";

interface SceneProps {
  setCurrentSection: (section: number) => void;
  currentSection: number;
  isClickedNavButton: -1 | 0 | 1;
  setIsClickedNavButton: (value: -1 | 0 | 1) => void;
  sectionPositions: THREE.Vector3[];
  sectionOffsets: THREE.Vector3[];
}

export function CustomCameraControls({
  setCurrentSection,
  currentSection,
  isClickedNavButton,
  setIsClickedNavButton,
  sectionPositions,
  sectionOffsets,
}: SceneProps) {
  const controlsRef = useRef<CameraControls | null>(null);
  const isTransitioning = useRef(false);
  const initialSection = useRef(currentSection);

  useEffect(() => {
    const target = sectionPositions[initialSection.current];
    const camera = target.clone().add(sectionOffsets[initialSection.current]);
    void controlsRef.current?.setLookAt(camera.x, camera.y, camera.z, target.x, target.y, target.z, false);
  }, [sectionOffsets, sectionPositions]);

  const navigate = useCallback(async (direction: -1 | 1) => {
    const controls = controlsRef.current;
    const index = currentSection + direction;
    if (!controls || isTransitioning.current || index < 0 || index >= sectionPositions.length) return;

    isTransitioning.current = true;
    const target = sectionPositions[index];
    const camera = target.clone().add(sectionOffsets[index]);

    const move = (animate: boolean) =>
      controls.setLookAt(camera.x, camera.y, camera.z, target.x, target.y, target.z, animate);
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        move(true),
        new Promise<void>((resolve) => {
          timeout = setTimeout(() => { void move(false); resolve(); }, 1800);
        }),
      ]);
      setCurrentSection(index);
    } finally {
      clearTimeout(timeout);
      isTransitioning.current = false;
      setIsClickedNavButton(0);
    }
  }, [currentSection, sectionOffsets, sectionPositions, setCurrentSection, setIsClickedNavButton]);

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
  // console.log("Rendering Scene", sectionOffsets[0], sectionOffsets[0].z, sectionOffsets[0].z + sectionOffsets[0].z);
  return (
    <>
      <CustomCameraControls
        setCurrentSection={setCurrentSection}
        currentSection={currentSection}
        isClickedNavButton={isClickedNavButton}
        setIsClickedNavButton={setIsClickedNavButton}
        sectionOffsets={sectionOffsets}
        sectionPositions={sectionPositions}
      />

      {sectionPositions.slice(0, 6).map((position, index) => (
        <SceneSurroundings key={index} scene={index} position={position.toArray()}
          active={index === currentSection} reducedMotion={reducedMotion} />
      ))}

      {/* Welcome Section (visible from far) */}
      <WelcomeSection
        position={sectionPositions[0].toArray() as [number, number, number]}
      />

      {/* Subtitle Section (visible when zooming in) */}
      <SubtitleSection
        position={sectionPositions[1].toArray() as [number, number, number]}
      />

      {/* Graduation Invitation (visible when zooming in more) */}
      <SchoolSection
        reducedMotion={reducedMotion}
        position={sectionPositions[2].toArray() as [number, number, number]}
      />

      <InvitationSection
        onOpen={() => { if (currentSection === 3) onOpenInvitation(); }}
        position={sectionPositions[3].toArray() as [number, number, number]}
      />
      <LettersSection position={sectionPositions[4].toArray()} active={currentSection === 4} onOpen={(index) => { if (currentSection === 4) onOpenLetter(index); }} />
      <GallerySection position={sectionPositions[5].toArray()} page={galleryPage} onOpen={(index) => { if (currentSection === 5) onOpenPhoto(index); }} />
      <LetterBoxSection position={sectionPositions[6].toArray()} active={currentSection === 6}
        reducedMotion={reducedMotion} onOpen={onOpenRsvp} />
    </>
  );
}
