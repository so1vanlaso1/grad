import SkyComet from "../components/SkyComet";
import {
  Environment,
  Stars,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useCallback, useState } from "react";
import Scene from "../components/3d-scenes/ScrollManager";
import { BottomBar } from "../components/BottomBar";
import { Euler, Vector3 } from "three";
import { useTheme } from "../context/theme-context";
import { twMerge } from "tailwind-merge";
import "../utils/preload-assets";
import KeepsakeDialog, { type Selection } from "../components/KeepsakeDialog";
import { album, graduation, letters } from "../graduation";
import TopBar from "../components/TopBar";
import useReducedMotion from "../utils/useReducedMotion";


const galleryRooms = ["Back Then", "Beneath the Trees", "Flowers and Graduation Gowns", "The Final Frame"];

const chapters = [
  ["01 / WELCOME", "My Graduation Day", "07.11.2026"],
  ["02 / MILESTONE", "A Journey to Remember", "I hope to see you on the big day"],
  ["03 / CAMPUS", "Western Sydney University", "where I studied "],
  ["04 / INVITATION", "Join Me on Graduation Day", graduation.date + " · " + graduation.time],
  ["05 / WITH LOVE", "Letters", "Tap an envelope to read the letters"],
  ["06 / PHOTO GALLERY", "Before Graduation", "Pre-graduation album"],
  ["07 / MESSAGE", "The Letter Box", "Leave a note for me"],
];

const sectionPositions = [
  new Vector3(0, 0, 90),
  new Vector3(60, 0, 60),
  new Vector3(120, 0, 30),
  new Vector3(160, 0, 0),
  new Vector3(213, 0, -30),
  new Vector3(266, 0, -62),
  new Vector3(319, 0, -94),
];

const sectionOffsets = [
  new Vector3(0, 20, 40),
  new Vector3(0, 3, 36),
  new Vector3(4, -2, 40),
  new Vector3(-4, 1, 34),
  new Vector3(0, 1, 30),
  new Vector3(0, 2.5, 32),
  new Vector3(3, 2.5, 24),
];
const initialCamera = {
  fov: 30,
  position: sectionPositions[0].clone().add(sectionOffsets[0]).toArray(),
  rotation: new Euler(-Math.atan2(sectionOffsets[0].y, sectionOffsets[0].z), 0, 0),
};

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isClickedNavButtons, setIsClickedNavButtons] = useState<-1 | 0 | 1>(0); // -1: Prev, 0: None, 1: Next
  const [selection, setSelection] = useState<Selection | null>(null);
  const [page, setPage] = useState(0);
  const lastPage = Math.ceil(album.length / 3) - 1;
  const openPhoto = (index: number) => {
    setPage(Math.floor(index / 3));
    setSelection({ type: "photo", index });
  };
  const openRsvp = () => setSelection({ type: "rsvp" });
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();

  const onClickPrevSection = useCallback(() => {
    setIsClickedNavButtons(-1);
  }, []);
  const onClickNextSection = useCallback(() => {
    setIsClickedNavButtons(1);
  }, []);

  const [chapter, title, subtitle] = chapters[currentSection];

  return (
    <div className={twMerge(`w-screen relative`, theme.background, "graduation-world")}>
      <div className="scene-skies" aria-hidden="true">
        {chapters.map(([name], index) => (
          <div key={name} className="scene-sky" data-scene={index}
            data-active={index === currentSection} />
        ))}
      </div>
      <Canvas dpr={[1, 1.5]} camera={initialCamera}>
          <Scene
            reducedMotion={reducedMotion}
            galleryPage={page}
            onOpenPhoto={openPhoto}
            onOpenLetter={(index) => setSelection({ type: "letter", index })}
            onOpenRsvp={openRsvp}
            onOpenInvitation={() => setSelection({ type: "invitation" })}
            setCurrentSection={setCurrentSection}
            currentSection={currentSection}
            isClickedNavButton={isClickedNavButtons}
            setIsClickedNavButton={setIsClickedNavButtons}
            sectionPositions={sectionPositions}
            sectionOffsets={sectionOffsets}
          />
        <Suspense fallback={null}>
          {theme.name === "dark" && (
            <Stars
              radius={300} // Radius of the inner sphere (default=100)
              depth={60} // Depth of area where stars should fit (default=50)
              count={5000} // Amount of stars (default=5000)
              factor={10} // Scale factor of the stars (default=4)
              saturation={0} // Saturation 0-1 (default=0)
              fade // Faded dots
              speed={1} // Rotation speed
            />
          )}
          <Environment files="/textures/venice_sunset_1k.hdr" />
        </Suspense>

        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1} />

        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <hemisphereLight intensity={0.2} color="#eaeaea" groundColor="blue" />

        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.85} intensity={0.27} radius={1} />
        </EffectComposer>
      </Canvas>
      {!reducedMotion && <SkyComet />}
      <header className="chapter-heading" aria-live="polite">
        <p>{chapter}</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </header>
      <div className="chapter-actions">
        {currentSection === 3 && (
          <button onClick={() => setSelection({ type: "invitation" })}>View invitation and address</button>
        )}
        {currentSection === 4 && letters.map(({ title }, index) => (
          <button key={title} onClick={() => setSelection({ type: "letter", index })}>{title}</button>
        ))}
        {currentSection === 5 && (
          <div className="gallery-guide" role="group" aria-label="Gallery navigation">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous gallery room">←</button>
            <button className="gallery-guide-label" onClick={() => openPhoto(page * 3)}>
              <span aria-live="polite">Room {String(page + 1).padStart(2, "0")} / {String(lastPage + 1).padStart(2, "0")}</span>
              <strong>{galleryRooms[page]}</strong>
              <span>View photos</span>
            </button>
            <button disabled={page === lastPage} onClick={() => setPage(page + 1)} aria-label="Next gallery room">→</button>
          </div>
        )}
        {currentSection === 6 && <button onClick={openRsvp}>Open the letter box</button>}
      </div>
      {selection && <KeepsakeDialog selection={selection} onClose={() => setSelection(null)} onPhoto={openPhoto} />}
      <BottomBar
        onPrev={onClickPrevSection}
        onNext={onClickNextSection}
        currentSection={currentSection}
        totalSections={chapters.length}
      />
      <TopBar />
    </div>
  );
}
