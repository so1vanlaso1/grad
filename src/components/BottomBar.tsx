import { ImArrowLeft2, ImArrowRight2 } from "react-icons/im";

interface BottomBarProps {
  onNext: () => void;
  onPrev: () => void;
  currentSection: number;
  totalSections: number;
  busy?: boolean;
}

export function BottomBar({ onNext, onPrev, currentSection, totalSections, busy = false }: BottomBarProps) {
  return (
    <nav className="chapter-navigation" aria-label="Scene navigation">
      <button onClick={onPrev} disabled={busy || currentSection === 0} aria-label="Previous scene">
        <ImArrowLeft2 />
      </button>
      <span>{String(currentSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}</span>
      <button onClick={onNext} disabled={busy || currentSection === totalSections - 1} aria-label="Next scene">
        <ImArrowRight2 />
      </button>
    </nav>
  );
}
