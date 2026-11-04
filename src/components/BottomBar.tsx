import { ImArrowLeft2, ImArrowRight2 } from "react-icons/im";

interface BottomBarProps {
  onNext: () => void;
  onPrev: () => void;
  currentSection: number;
  totalSections: number;
}

export function BottomBar({ onNext, onPrev, currentSection, totalSections }: BottomBarProps) {
  return (
    <nav className="chapter-navigation" aria-label="Scene navigation">
      <button onClick={onPrev} disabled={currentSection === 0} aria-label="Previous scene">
        <ImArrowLeft2 />
      </button>
      <span>{String(currentSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}</span>
      <button onClick={onNext} disabled={currentSection === totalSections - 1} aria-label="Next scene">
        <ImArrowRight2 />
      </button>
    </nav>
  );
}
