import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  LuArrowDownRight, LuArrowLeft, LuArrowRight, LuArrowUpRight, LuCalendarDays,
  LuBookOpen, LuCrosshair, LuImage, LuMapPin, LuPhone, LuShare2, LuX, LuZoomIn, LuZoomOut,
} from "react-icons/lu";
import { chapters, downloadCalendar, event, photos } from "./invitation";
import type { GraduationPhoto } from "./invitation";
import type { ChapterTransition } from "./explore";
import "./App.css";

const CampusWorld = lazy(() => import("./CampusWorld"));
const motionQuery = "(prefers-reduced-motion: reduce)";
const maps = "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("UEH Campus A, " + event.address);
const speech = "https://www.youtube.com/watch?v=OBG50aoUwlI";

function Photo({ photo, large = false }: { photo: GraduationPhoto; large?: boolean }) {
  const src = large ? photo.src : photo.thumbnail || photo.src;
  return src ? <img src={import.meta.env.BASE_URL + src} alt={photo.alt} loading="lazy" /> : (
    <span className="photo-placeholder">
      <LuImage aria-hidden="true" />
      <span>Photo coming soon</span>
    </span>
  );
}

function Gallery({ items, index, select, close }: {
  items: GraduationPhoto[]; index: number; select: (index: number) => void; close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photo = items[index];
  const move = (direction: number) => select((index + direction + items.length) % items.length);
  useEffect(() => { dialog.current?.showModal(); }, []);

  return (
    <dialog ref={dialog} className="gallery" aria-labelledby="photo-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      onKeyDown={(e) => {
        if (items.length < 2) return;
        if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      }}>
      <div className="gallery-inner">
        <button className="icon-button close" aria-label="Close gallery" onClick={close}><LuX /></button>
        <div className="gallery-image" onTouchStart={(e) => {
          touchStart.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
        }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || items.length < 2) return;
          const dx = e.changedTouches[0].clientX - start.x;
          const dy = e.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
        }}><Photo photo={photo} large /></div>
        <div className="gallery-caption">
          {items.length > 1 && <button className="icon-button" aria-label="Previous photo" onClick={() => move(-1)}><LuArrowLeft /></button>}
          <div><h2 id="photo-title">{photo.title}</h2><p>{photo.caption || (index + 1) + " / " + items.length}</p></div>
          {items.length > 1 && <button className="icon-button" aria-label="Next photo" onClick={() => move(1)}><LuArrowRight /></button>}
        </div>
        {items.length > 1 && <div className="gallery-thumbnails" aria-label="Choose photo">
          {items.map((item, photoIndex) => <button key={item.id} aria-label={item.title}
            aria-pressed={photoIndex === index} onClick={() => select(photoIndex)}><Photo photo={item} /></button>)}
        </div>}
      </div>
    </dialog>
  );
}

class WorldBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Still({ chapter, dawn }: { chapter: number; dawn: boolean }) {
  return (
    <svg className="stage-still" viewBox="0 0 620 500" fill="none" aria-hidden="true">
      <circle cx="310" cy="236" r="178" opacity=".23" />
      <circle cx="310" cy="236" r="147" opacity=".35" />
      <path d="M50 379h520M140 399h340M218 419h184M310 46v30M295 61h30M98 219h20m-10-10v20m399-42h20m-10-10v20" opacity=".55" />
      {chapter === 2 ? (
        <path d={dawn ? "M260 363V232a50 50 0 0 1 100 0v131M260 363l-45-41V222l45 10m100 131 45-41V222l-45 10M285 363l25-72 25 72" : "M245 363V232a65 65 0 0 1 130 0v131M262 363V232a48 48 0 0 1 96 0v131m-48-180v180"} />
      ) : chapter === 1 || chapter === 4 ? (
        <path d="M179 278v-97h81v97zm91 44V203h80v119zm90-44v-97h81v97zM179 259l40-38 41 38m10 44 40-49 40 49m10-44 40-38 41 38M215 344q95-33 190 0" />
      ) : chapter === 5 ? (
        <path d="M132 364h356M207 364a103 103 0 0 1 206 0M275 379l24-57m46 57-24-57m-45-129 34-17 34 17-34 17zm15 8v17q19 10 38 0v-17" />
      ) : (
        <path d="M165 362h290m-273 0V211l98-30v181m0-156 154-21v177m-252-33h252m-252-39h252m-252-39h252m-225-48v126m36-137v137m68-126v126m40-132v132m40-138v138m-130 33v-26h78v26M160 374h300M394 187v119h22V187" />
      )}
    </svg>
  );
}

function App() {
  const [chapter, setChapter] = useState(0);
  const [opened, setOpened] = useState(false);
  const [lite, setLite] = useState(() => matchMedia(motionQuery).matches);
  const [reduced, setReduced] = useState(() => matchMedia(motionQuery).matches);
  const [graphicsFailed, setGraphicsFailed] = useState(false);
  const onGraphicsFailure = useCallback(() => setGraphicsFailed(true), []);
  const [gallery, setGallery] = useState<{ items: GraduationPhoto[]; index: number } | null>(null);
  const [notice, setNotice] = useState("");
  const [roaming, setRoaming] = useState(false);
  const [details, setDetails] = useState(false);
  const [recenter, setRecenter] = useState(0);
  const [travel, setTravel] = useState<ChapterTransition>(null);
  const pendingChapter = useRef<{ next: number; read: boolean } | null>(null);
  const readOnArrival = useRef(false);
  const zoomStep = useRef(0);
  const readButton = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const story = useRef<HTMLElement>(null);
  const plaque = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement>(null);
  const worldActive = !lite && !graphicsFailed;
  const guest = new URLSearchParams(location.search).get("guest")?.trim().slice(0, 60);
  const active = chapters[chapter];
  const scenePrompt = [
    "A little world, a lifetime of memories. Your invitation is waiting.",
    "Four frames for the years that brought me here. Tap a frame to explore.",
    opened ? "A new beginning is waiting on the other side." : "Every ending holds a beginning. Open the door to find yours.",
    "7 November 2026 · 10 AM · UEH Campus A",
    "For the people who made the journey feel like home.",
    "Thank you for being part of my story. See you at graduation.",
  ][chapter];
  const dawn = chapter >= 3 || (chapter === 2 && opened);
  const still = <Still chapter={chapter} dawn={dawn} />;

  useEffect(() => {
    const preference = matchMedia(motionQuery);
    const sync = () => setReduced(preference.matches);
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const showChapter = useCallback((next: number, read: boolean) => {
    setChapter(next);
    setRecenter((request) => request + 1);
    setRoaming(false);
    setDetails(worldActive && read);
    if (!worldActive) requestAnimationFrame(() => {
      title.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, [worldActive]);

  useEffect(() => {
    if (!travel) return;
    if (!worldActive || reduced) {
      const pending = pendingChapter.current;
      pendingChapter.current = null;
      showChapter(pending?.next ?? chapter, pending?.read ?? readOnArrival.current);
      setTravel(null);
      return;
    }

    const timer = window.setTimeout(() => {
      const pending = pendingChapter.current;
      if (travel === "leaving" && pending) {
        pendingChapter.current = null;
        readOnArrival.current = pending.read;
        showChapter(pending.next, false);
        setTravel("arriving");
      } else if (pending && pending.next !== chapter) {
        setTravel("leaving");
      } else {
        pendingChapter.current = null;
        setTravel(null);
        setDetails(pending?.read ?? readOnArrival.current);
      }
    }, travel === "leaving" ? 270 : 510);
    return () => window.clearTimeout(timer);
  }, [chapter, reduced, showChapter, travel, worldActive]);

  function go(next: number, read = false) {
    if (next < 0 || next >= chapters.length) return;
    if (worldActive) story.current?.focus({ preventScroll: true });
    if (travel) {
      pendingChapter.current = { next, read };
      return;
    }
    if (worldActive && !reduced && next !== chapter) {
      pendingChapter.current = { next, read };
      setDetails(false);
      setTravel("leaving");
    } else {
      showChapter(next, read);
    }
  }

  function showPhotos(items: GraduationPhoto[], index: number, source: HTMLElement | null) {
    opener.current = source;
    setGallery({ items, index });
  }

  function openWorldFrame(category: "memory" | "friends", index: number) {
    showPhotos(photos.filter((photo) => photo.category === category), index, readButton.current);
  }

  function openPortrait() {
    showPhotos([photos[0]], 0, document.activeElement === portrait.current ? portrait.current : readButton.current);
  }

  useEffect(() => {
    if (details) title.current?.focus({ preventScroll: true });
  }, [details, chapter]);

  function closeDetails() {
    setDetails(false);
    readButton.current?.focus({ preventScroll: true });
  }

  async function share() {
    const url = new URL(location.href);
    url.searchParams.delete("guest");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Thùy Dung · Graduation 2026", url: url.href });
      } else {
        await navigator.clipboard.writeText(url.href);
        setNotice("Invitation link copied.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setNotice("Copy the invitation link from your address bar.");
      }
    }
  }

  function photoGrid(category: "memory" | "friends") {
    const items = photos.filter((photo) => photo.category === category);
    return <div className="photo-grid">{items.map((photo, index) => (
      <button className="photo-button" key={photo.id} onClick={(e) => showPhotos(items, index, e.currentTarget)}>
        <Photo photo={photo} /><span>{photo.title}</span>
      </button>
    ))}</div>;
  }

  const nextButton = (label: string) => <button className="button primary" onClick={() => go(chapter + 1)}>{label}<LuArrowRight /></button>;

  return (
    <div className={["invitation", dawn ? "dawn" : "", worldActive ? "world-mode" : ""].join(" ")} onKeyDown={(e) => {
      if (gallery || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (details && e.key === "Escape") { closeDetails(); return; }
      if (!worldActive && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        go(chapter + (e.key === "ArrowRight" ? 1 : -1));
      }
    }}>
      <header className="masthead">
        <button className="wordmark" onClick={() => go(0)} aria-label="Thùy Dung, return to welcome">
          <span className="monogram" aria-hidden="true">TD</span>
          <span><strong>Thùy Dung</strong><small>GRADUATION · 2026</small></span>
        </button>
        <div className="header-note">AN INVITATION IN SIX CHAPTERS</div>
        <div className="header-actions">
          <button className="mode" aria-pressed={lite || graphicsFailed} disabled={graphicsFailed} onClick={() => setLite(!lite)}>
            <span className="mode-dot" />{lite || graphicsFailed ? "Lite view" : "3D view"}
          </button>
          <button className="button outline ceremony-link" onClick={() => go(3, worldActive)}>Ceremony Info <LuArrowUpRight /></button>
        </div>
      </header>

      <main id="invitation" ref={story} tabIndex={-1} aria-busy={Boolean(travel)} className={"story chapter-" + active.id}>
        {worldActive && <div className="world-stage" aria-hidden="true" style={{ pointerEvents: travel || gallery ? "none" : "auto" }}>
          <WorldBoundary fallback={null} onFailure={onGraphicsFailure}>
            <Suspense fallback={<div className="world-loading">Opening the campus…</div>}>
              <CampusWorld chapter={chapter} dawn={dawn} opened={opened} reduced={reduced} onFailure={onGraphicsFailure}
                recenter={recenter} zoomStep={zoomStep} paused={Boolean(gallery) || Boolean(travel)} travel={travel}
                onRoam={setRoaming}
                plaque={plaque} portrait={portrait} onFrame={openWorldFrame} onPortrait={openPortrait}
                onInvitation={() => go(1)} onDoor={() => {
                  if (opened) go(3);
                  else { go(2, true); setOpened(true); }
                }} />
            </Suspense>
          </WorldBoundary>
        </div>}
        <section ref={plaque} id="chapter-details" className={"story-copy" + (details && worldActive ? " details-open" : "") + (roaming ? " while-roaming" : "")} aria-labelledby="chapter-title">
          {details && worldActive && <button className="icon-button close-details" aria-label="Close chapter details" onClick={closeDetails}><LuX /></button>}
          <p className="eyebrow"><span />{dawn ? "ACT II · THE COOL NEWS" : "ACT I · THE SCARY NEWS"}</p>
          {chapter === 0 && <>
            <h1 id="chapter-title" ref={title} tabIndex={-1}>The Next<br /><em>Chapter.</em></h1>
            <div className="graduate">Thùy Dung <span aria-hidden="true">✦</span> <small>CLASS OF 2026</small></div>
            <p className="letter"><strong>Dear {guest || "friend"},</strong><br />Every ending has a beginning. Before I step into mine, there’s one moment I’d love to share with you.</p>
            <div className="actions">{nextButton("Open Invitation")}<button className="text-button" onClick={() => go(3, worldActive)}>Skip to ceremony <LuArrowDownRight /></button></div>
            {worldActive && details && <button className="text-button" onClick={(e) => showPhotos([photos[0]], 0, e.currentTarget)}>Open portrait <LuImage /></button>}
          </>}
          {chapter === 1 && <>
            <h1 id="chapter-title" ref={title} tabIndex={-1}>Memory <em>Lane.</em></h1>
            <p className="letter">Somewhere between assignments, deadlines, and ordinary days, these years became memories I will always carry. Here are a few portraits from this milestone.</p>
            {photoGrid("memory")}
            <div className="actions">{nextButton("To the Turning Point")}</div>
          </>}
          {chapter === 2 && <>
            <h1 id="chapter-title" ref={title} tabIndex={-1}>The Turning <em>Point.</em></h1>
            <blockquote key={String(opened)} className="turning-quote" aria-live="polite">
              <p>{opened ? "But the cool news is, you’re on your own now." : "The scary news is, you’re on your own now."}</p>
              <cite><a href={speech} target="_blank" rel="noreferrer">Taylor Swift · NYU commencement, 2022 <LuArrowUpRight /></a></cite>
            </blockquote>
            <p className="letter">It’s frightening to leave what you know behind. It’s also exciting to discover who you can become.</p>
            <div className="actions">
              {opened ? nextButton("To the Ceremony") : <button className="button primary" onClick={() => setOpened(true)}>Open the Door <LuArrowRight /></button>}
            </div>
          </>}
          {chapter === 3 && <>
            <h1 id="chapter-title" ref={title} tabIndex={-1}>Graduation <em>Day.</em></h1>
            <div className="event-card">
              <div className="event-brand">
                <div><strong>{event.name}</strong><span>{event.university}</span></div>
                <img src={import.meta.env.BASE_URL + "assets/wsu-logo.png"} alt="" loading="lazy" />
              </div>
              <p className="event-date"><time dateTime={event.start}>{event.date} · {event.time}</time><small>Vietnam time (UTC+7)</small></p>
              <p className="event-location"><strong>{event.venue}</strong><br />{event.address}</p>
              <a className="event-phone" href={"tel:+84" + event.phone.slice(1)}><LuPhone /> {event.phone}</a>
            </div>
            <div className="actions event-actions">
              <a className="button primary" href={maps} target="_blank" rel="noreferrer"><LuMapPin /> Directions</a>
              <button className="button outline" onClick={downloadCalendar}><LuCalendarDays /> Add to Calendar</button>
              <button className="icon-button" aria-label="Share invitation" onClick={share}><LuShare2 /></button>
            </div>
            {worldActive && details && <button className="text-button" onClick={(e) => showPhotos([photos[0]], 0, e.currentTarget)}>Open portrait <LuImage /></button>}
          </>}
          {chapter === 4 && <>
            <h1 id="chapter-title" ref={title} tabIndex={-1}>Thank-You <em>Garden.</em></h1>
            <p className="letter">The next chapter may be mine to write, but I didn’t reach this moment alone. These portraits celebrate the day and everyone who helped me get here.</p>
            {photoGrid("friends")}
            <div className="actions">{nextButton("To the Open Horizon")}</div>
          </>}
          {chapter === 5 && <>
            <h1 id="chapter-title" ref={title} tabIndex={-1}>The Open <em>Horizon.</em></h1>
            <p className="letter">I don’t know exactly where the road leads. But I am ready to find out.</p>
            <p className="signature">With love, <em>Thùy Dung</em></p>
            <div className="actions">
              <button className="button primary" onClick={() => go(3, worldActive)}>View Invitation <LuArrowUpRight /></button>
              <button className="button outline" onClick={share}><LuShare2 /> Share</button>
              <button className="text-button" onClick={() => go(1)}>Back to memories</button>
            </div>
          </>}
        </section>

        {worldActive && !details && !travel && <div className="scene-prompt" key={chapter}>
          <span className="scene-kicker">{String(chapter + 1).padStart(2, "0")} / {active.label}</span>
          <p>{scenePrompt}</p>
          <button className="text-button" onClick={() => {
            if (chapter === 0) go(1);
            else if (chapter === 2 && !opened) setOpened(true);
            else if (chapter === 3 || chapter === 5) go(3, true);
            else go(chapter + 1);
          }}>{chapter === 0 ? "Begin the journey" : chapter === 2 && !opened ? "Open the door" : chapter === 3 || chapter === 5 ? "Your ceremony invitation" : "Continue the story"}<LuArrowRight /></button>
        </div>}

        {worldActive && <div className="explore-controls">
          <div className="explore-menu">
            <p className="desktop-gestures">Drag to spin · Scroll to zoom</p>
            <p className="touch-gestures">Drag to spin · Pinch to zoom</p>
            <div className="explore-buttons">
              <button ref={readButton} className="button outline" aria-expanded={details} aria-controls="chapter-details"
                onClick={() => details ? closeDetails() : setDetails(true)}><LuBookOpen /> Chapter details</button>
              <button className="icon-button" aria-label="Recenter camera" title="Recenter camera" onClick={() => go(chapter)}><LuCrosshair /></button>
            </div>
          </div>
          <div className="zoom-controls" role="group" aria-label="Zoom camera">
            <button className="icon-button" aria-label="Zoom in" onClick={() => { zoomStep.current++; }}><LuZoomIn /></button>
            <button className="icon-button" aria-label="Zoom out" onClick={() => { zoomStep.current--; }}><LuZoomOut /></button>
          </div>
        </div>}

        {worldActive && travel && <div key={travel} className={"chapter-transition " + travel} aria-hidden="true"><div><span>✦</span><small>THE NEXT CHAPTER</small></div></div>}

        {worldActive && (chapter === 0 || chapter === 3) &&
          <button ref={portrait} className="portrait world-portrait" aria-label="Open graduation portrait frame"
            onClick={openPortrait}>
            <Photo photo={photos[0]} /><span className="portrait-label">01 / PORTRAIT <LuArrowUpRight /></span>
          </button>}

        {!worldActive && <figure className="stage">
          <div className="stage-viewport" aria-hidden="true">
            {still}
          </div>
          <div className="stage-guide" aria-hidden="true"><span>✦</span><span>THÙY DUNG / 2026</span></div>
          {(chapter === 0 || chapter === 3) && <button className="portrait" aria-label="Open graduation portrait frame" onClick={(e) => showPhotos([photos[0]], 0, e.currentTarget)}>
            <Photo photo={photos[0]} /><span className="portrait-label">01 / PORTRAIT <LuArrowUpRight /></span>
          </button>}
          <figcaption><span>FIG. {String(chapter + 1).padStart(2, "0")}</span>{active.description}</figcaption>
        </figure>}
      </main>

      <footer className="chapter-footer">
        <div className="chapter-caption"><span>THE JOURNEY</span><span>{String(chapter + 1).padStart(2, "0")} <i>/</i> 06</span></div>
        <nav aria-label="Chapters" className="chapter-nav">
          {chapters.map((item, index) => <button key={item.id} aria-label={item.name} aria-current={index === chapter ? "step" : undefined} onClick={() => go(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span><span>{item.name}</span>
          </button>)}
        </nav>
        <div className="chapter-arrows">
          <button className="icon-button" aria-label="Previous chapter" disabled={chapter === 0} onClick={() => go(chapter - 1)}><LuArrowLeft /></button>
          <button className="icon-button" aria-label="Next chapter" disabled={chapter === chapters.length - 1} onClick={() => go(chapter + 1)}><LuArrowRight /></button>
        </div>
      </footer>
      <div className="toast" role="status">{notice}</div>
      <span className="sr-only" role="status">Chapter {chapter + 1} of 6. {active.name}</span>
      {gallery && <Gallery {...gallery} select={(index) => setGallery({ ...gallery, index })} close={() => {
        setGallery(null);
        requestAnimationFrame(() => opener.current?.focus());
      }} />}
    </div>
  );
}

export default App;
