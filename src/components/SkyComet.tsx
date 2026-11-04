import { useEffect, useRef } from "react";

export default function SkyComet() {
  const comet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = comet.current;
    if (!element) return;

    let timer: ReturnType<typeof setTimeout>;
    let flight: Animation | undefined;

    function schedule(delay: number) {
      timer = setTimeout(() => {
        if (!document.hidden && element) {
          const start = 13 + Math.random() * 13;
          const drop = 10 + Math.random() * 8;
          const angle = Math.atan2(innerHeight * drop / 100, innerWidth * 1.32) * 180 / Math.PI;
          flight = element.animate([
            { transform: `translate(-24vw, ${start}vh) rotate(${angle}deg)`, opacity: 0 },
            { opacity: 1, offset: 0.24 },
            { opacity: 0.85, offset: 0.62 },
            { transform: `translate(108vw, ${start + drop}vh) rotate(${angle}deg)`, opacity: 0 },
          ], { duration: 2200, easing: "linear" });
        }
        schedule(18000 + Math.random() * 23000);
      }, delay);
    }

    schedule(4000 + Math.random() * 5000);
    return () => {
      clearTimeout(timer);
      flight?.cancel();
    };
  }, []);

  return (
    <div className="comet-sky" aria-hidden="true">
      <div className="sky-comet" ref={comet} />
    </div>
  );
}
