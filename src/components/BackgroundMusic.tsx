import { useEffect, useRef, useState } from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import song from "../../Dr. Dog Where'd All The Time Go.mp3";

const START_SECONDS = 4;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optedOut = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const start = () => {
      if (!optedOut.current && audio.paused) void audio.play().catch(() => {});
    };
    const startOnInteraction = (event: Event) => {
      if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
      start();
    };

    start();
    document.addEventListener("pointerdown", startOnInteraction);
    document.addEventListener("keydown", startOnInteraction);
    return () => {
      document.removeEventListener("pointerdown", startOnInteraction);
      document.removeEventListener("keydown", startOnInteraction);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      optedOut.current = true;
      audio.pause();
    } else {
      optedOut.current = false;
      void audio.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={song} preload="auto"
        onLoadedMetadata={(event) => { event.currentTarget.currentTime = START_SECONDS; }}
        onEnded={(event) => {
          event.currentTarget.currentTime = START_SECONDS;
          void event.currentTarget.play().catch(() => {});
        }}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <button ref={buttonRef} type="button" className="music-toggle" onClick={toggle}
        aria-label={playing ? "Mute background music" : "Play background music"}
        title={playing ? "Mute background music" : "Play background music"}>
        {playing ? <IoVolumeHighOutline aria-hidden="true" /> : <IoVolumeMuteOutline aria-hidden="true" />}
      </button>
    </>
  );
}
