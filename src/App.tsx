import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  LuArrowDownRight, LuArrowLeft, LuArrowRight, LuArrowUpRight, LuCalendarDays,
  LuBookOpen, LuCrosshair, LuHeart, LuImage, LuImages, LuLanguages, LuMapPin, LuMessageCircle,
  LuMusic, LuPhone, LuShare2, LuSparkles, LuX, LuZoomIn, LuZoomOut,
} from "react-icons/lu";
import { chapters, downloadCalendar, event, getGoogleCalendarUrl, photos } from "./invitation";
import type { GraduationPhoto } from "./invitation";
import type { ChapterTransition } from "./explore";
import { Countdown } from "./components/Countdown";
import { RsvpModal } from "./components/RsvpModal";
import { triggerCelebrationConfetti } from "./utils/confetti";
import { soundtrack } from "./utils/soundtrack";
import "./App.css";

const CampusWorld = lazy(() => import("./CampusWorld"));
const motionQuery = "(prefers-reduced-motion: reduce)";
const maps = "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("UEH Campus A 59C Nguyen Dinh Chieu " + event.address);
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

function Gallery({ items, index, select, close, lang = "vi" }: {
  items: GraduationPhoto[]; index: number; select: (index: number) => void; close: () => void; lang?: "vi" | "en";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photo = items[index];
  const move = (direction: number) => select((index + direction + items.length) % items.length);
  useEffect(() => { dialog.current?.showModal(); }, []);

  const title = (lang === "vi" && photo.titleVi) ? photo.titleVi : photo.title;
  const caption = (lang === "vi" && photo.captionVi) ? photo.captionVi : photo.caption;

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
          <div>
            <h2 id="photo-title">{title}</h2>
            <p>{caption || (index + 1) + " / " + items.length}</p>
          </div>
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
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
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

  const scenePrompts = {
    vi: [
      "Một thế giới nhỏ, trọn vẹn yêu thương. Thư mời tốt nghiệp đang chờ bạn.",
      "Lưu giữ những năm tháng rực rỡ dưới mái trường. Nhấn vào ảnh để khám phá.",
      opened ? "Một khởi đầu rực rỡ đang đợi bạn ở phía bên kia cánh cửa." : "Mỗi kết thúc đều mở ra khởi đầu mới. Hãy mở cánh cửa để đón bình minh.",
      "07 Tháng 11, 2026 · 10:00 Sáng · UEH Cơ sở A",
      "Tri ân sâu sắc tới gia đình, thầy cô và những người bạn luôn ở bên.",
      "Cảm ơn bạn đã là một phần thanh xuân của Dung. Hẹn gặp bạn tại buổi lễ!",
    ],
    en: [
      "A little world, a lifetime of memories. Your invitation is waiting.",
      "Four frames for the years that brought me here. Tap a frame to explore.",
      opened ? "A new beginning is waiting on the other side." : "Every ending holds a beginning. Open the door to find yours.",
      "7 November 2026 · 10 AM · UEH Campus A",
      "For the people who made the journey feel like home.",
      "Thank you for being part of my story. See you at graduation.",
    ],
  };

  const scenePrompt = scenePrompts[lang][chapter];
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

    if (next === 3) {
      triggerCelebrationConfetti();
    }

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

  function toggleMusic() {
    const isPlaying = soundtrack.toggle();
    setMusicPlaying(isPlaying);
    setNotice(isPlaying
      ? (lang === "vi" ? "Đã bật nhạc nền piano ♫" : "Ambient soundtrack playing ♫")
      : (lang === "vi" ? "Đã tắt nhạc nền" : "Soundtrack paused"));
  }

  function handleOpenDoor() {
    setOpened(true);
    triggerCelebrationConfetti();
  }

  function showPhotos(items: GraduationPhoto[], index: number, source: HTMLElement | null) {
    opener.current = source;
    setGallery({ items, index });
  }

  function openWorldFrame(category: "memory" | "friends", index: number) {
    showPhotos(photos.filter((photo) => photo.category === category), index, readButton.current);
  }

  function openPortrait() {
    const portraitPhotos = photos.filter((p) => p.category === "portrait");
    showPhotos(portraitPhotos, 0, document.activeElement === portrait.current ? portrait.current : readButton.current);
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
        await navigator.share({
          title: lang === "vi" ? `${event.fullName} · Lễ Tốt Nghiệp 2026` : `${event.fullName} · Graduation 2026`,
          text: lang === "vi" ? `Thư mời tham dự Lễ Tốt Nghiệp của ${event.fullName} vào Thứ Bảy, 07/11/2026` : `Graduation Invitation for ${event.fullName}`,
          url: url.href,
        });
      } else {
        await navigator.clipboard.writeText(url.href);
        setNotice(lang === "vi" ? "Đã sao chép liên kết thư mời!" : "Invitation link copied to clipboard!");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setNotice(lang === "vi" ? "Vui lòng sao chép link từ thanh địa chỉ trình duyệt." : "Copy the invitation link from your address bar.");
      }
    }
  }

  function photoGrid(category: "memory" | "friends") {
    const items = photos.filter((photo) => photo.category === category);
    return (
      <div className="photo-grid">
        {items.map((photo, index) => (
          <button className="photo-button" key={photo.id} onClick={(e) => showPhotos(items, index, e.currentTarget)}>
            <Photo photo={photo} />
            <span>{(lang === "vi" && photo.titleVi) ? photo.titleVi : photo.title}</span>
          </button>
        ))}
      </div>
    );
  }

  const nextButton = (label: string) => (
    <button className="button primary" onClick={() => go(chapter + 1)}>
      {label} <LuArrowRight />
    </button>
  );

  return (
    <div className={["invitation", dawn ? "dawn" : "", worldActive ? "world-mode" : ""].join(" ")} onKeyDown={(e) => {
      if (gallery || rsvpOpen || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (details && e.key === "Escape") { closeDetails(); return; }
      if (!worldActive && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        go(chapter + (e.key === "ArrowRight" ? 1 : -1));
      }
    }}>
      <header className="masthead">
        <button className="wordmark" onClick={() => go(0)} aria-label="Phạm Thùy Dung, return to welcome">
          <span className="monogram" aria-hidden="true">PTD</span>
          <span>
            <strong>{event.fullName}</strong>
            <small>{lang === "vi" ? "LỄ TỐT NGHIỆP · 2026" : "GRADUATION · 2026"}</small>
          </span>
        </button>
        <div className="header-note">
          {lang === "vi" ? "THƯ MỜI LỄ TỐT NGHIỆP TRONG KHÔNG GIAN 3D" : "AN INVITATION IN SIX CHAPTERS"}
        </div>
        <div className="header-actions">
          <button
            className="mode lang-pill"
            aria-label="Toggle language between Vietnamese and English"
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
          >
            <LuLanguages /> <strong>{lang === "vi" ? "VI" : "EN"}</strong>
          </button>
          <button
            className={`mode music-pill ${musicPlaying ? "playing" : ""}`}
            aria-label={musicPlaying ? "Mute music" : "Play music"}
            onClick={toggleMusic}
            title={lang === "vi" ? "Bật/Tắt nhạc nền" : "Toggle ambient music"}
          >
            <LuMusic />
            <span className="music-label">{musicPlaying ? "♫" : (lang === "vi" ? "Nhạc" : "Music")}</span>
          </button>
          <button
            className="mode"
            aria-pressed={lite || graphicsFailed}
            disabled={graphicsFailed}
            onClick={() => setLite(!lite)}
          >
            <span className="mode-dot" />
            {lite || graphicsFailed ? (lang === "vi" ? "Bản nhẹ" : "Lite view") : (lang === "vi" ? "Không gian 3D" : "3D view")}
          </button>
          <button
            className="button outline ceremony-link"
            onClick={() => go(3, worldActive)}
          >
            {lang === "vi" ? "Lễ Tốt Nghiệp" : "Ceremony"} <LuArrowUpRight />
          </button>
        </div>
      </header>

      <main id="invitation" ref={story} tabIndex={-1} aria-busy={Boolean(travel)} className={"story chapter-" + active.id}>
        {worldActive && (
          <div className="world-stage" aria-hidden="true" style={{ pointerEvents: travel || gallery || rsvpOpen ? "none" : "auto" }}>
            <WorldBoundary fallback={null} onFailure={onGraphicsFailure}>
              <Suspense fallback={<div className="world-loading">{lang === "vi" ? "Đang mở không gian trường…" : "Opening the campus…"}</div>}>
                <CampusWorld
                  chapter={chapter} dawn={dawn} opened={opened} reduced={reduced} onFailure={onGraphicsFailure}
                  recenter={recenter} zoomStep={zoomStep} paused={Boolean(gallery) || Boolean(travel) || rsvpOpen} travel={travel}
                  onRoam={setRoaming}
                  plaque={plaque} portrait={portrait} onFrame={openWorldFrame} onPortrait={openPortrait}
                  onInvitation={() => go(1)}
                  onDoor={() => {
                    if (opened) go(3);
                    else { go(2, true); handleOpenDoor(); }
                  }}
                />
              </Suspense>
            </WorldBoundary>
          </div>
        )}

        <section
          ref={plaque}
          id="chapter-details"
          className={"story-copy" + (details && worldActive ? " details-open" : "") + (roaming ? " while-roaming" : "")}
          aria-labelledby="chapter-title"
        >
          {details && worldActive && (
            <button className="icon-button close-details" aria-label="Close chapter details" onClick={closeDetails}>
              <LuX />
            </button>
          )}

          <p className="eyebrow">
            <span />
            {dawn
              ? (lang === "vi" ? "HỒI II · ĐIỀU TUYỆT VỜI" : "ACT II · THE COOL NEWS")
              : (lang === "vi" ? "HỒI I · ĐIỀU ĐÁNG SỢ" : "ACT I · THE SCARY NEWS")}
          </p>

          {chapter === 0 && (
            <>
              <h1 id="chapter-title" ref={title} tabIndex={-1}>
                {lang === "vi" ? <>Chương<br /><em>Mới.</em></> : <>The Next<br /><em>Chapter.</em></>}
              </h1>
              <div className="graduate">
                {event.fullName} <span aria-hidden="true">✦</span> <small>{lang === "vi" ? event.degreeVi.toUpperCase() : event.degree.toUpperCase()}</small>
              </div>
              <p className="university-sub">
                {lang === "vi" ? event.universityVi : event.university} · {lang === "vi" ? "Khóa 2026" : "Class of 2026"}
              </p>
              <p className="letter">
                {lang === "vi" ? (
                  <>
                    <strong>Thân gửi {guest || "bạn bè & người thân thương"},</strong>
                    <br />
                    Mỗi kết thúc đều là một khởi đầu mới. Trước khi bước tiếp vào chặng đường tương lai, mình muốn chia sẻ khoảnh khắc thiêng liêng này cùng bạn.
                  </>
                ) : (
                  <>
                    <strong>Dear {guest || "friend"},</strong>
                    <br />
                    Every ending has a beginning. Before I step into mine, there’s one moment I’d love to share with you.
                  </>
                )}
              </p>
              <div className="actions">
                {nextButton(lang === "vi" ? "Mở Thư Mời" : "Open Invitation")}
                <button className="button outline" onClick={() => setRsvpOpen(true)}>
                  <LuHeart /> {lang === "vi" ? "Gửi Lời Chúc / RSVP" : "Send Wishes / RSVP"}
                </button>
                <button className="text-button" onClick={() => go(3, worldActive)}>
                  {lang === "vi" ? "Xem buổi lễ" : "Skip to ceremony"} <LuArrowDownRight />
                </button>
                <button className="text-button" onClick={() => showPhotos(photos, 0, null)}>
                  <LuImages /> {lang === "vi" ? "Bộ ảnh cử nhân (10)" : "View all photos (10)"}
                </button>
              </div>
              {worldActive && details && (
                <button className="text-button" onClick={openPortrait}>
                  {lang === "vi" ? "Xem chân dung tốt nghiệp" : "Open portrait"} <LuImage />
                </button>
              )}
            </>
          )}

          {chapter === 1 && (
            <>
              <h1 id="chapter-title" ref={title} tabIndex={-1}>
                {lang === "vi" ? <>Con Đường <em>Kỷ Niệm.</em></> : <>Memory <em>Lane.</em></>}
              </h1>
              <p className="letter">
                {lang === "vi"
                  ? "Giữa những bài tập, kỳ thi và những ngày bình dị, năm tháng đại học đã trở thành những kỷ niệm mình sẽ mãi mang theo. Dưới đây là những bức ảnh ghi lại dấu ấn đặc biệt này."
                  : "Somewhere between assignments, deadlines, and ordinary days, these years became memories I will always carry. Here are a few portraits from this milestone."}
              </p>
              {photoGrid("memory")}
              <div className="actions">
                {nextButton(lang === "vi" ? "Đến Bước Ngoặt" : "To the Turning Point")}
                <button className="text-button" onClick={() => showPhotos(photos, 0, null)}>
                  <LuImages /> {lang === "vi" ? "Xem toàn bộ 10 ảnh" : "Browse all 10 photos"}
                </button>
              </div>
            </>
          )}

          {chapter === 2 && (
            <>
              <h1 id="chapter-title" ref={title} tabIndex={-1}>
                {lang === "vi" ? <>Bước <em>Ngoặt.</em></> : <>The Turning <em>Point.</em></>}
              </h1>
              <blockquote key={String(opened)} className="turning-quote" aria-live="polite">
                <p>
                  {opened
                    ? (lang === "vi" ? "“Nhưng điều tuyệt vời là, từ giờ bạn sẽ tự bước đi một mình.”" : "“But the cool news is, you’re on your own now.”")
                    : (lang === "vi" ? "“Điều đáng sợ là, từ giờ bạn sẽ tự bước đi một mình.”" : "“The scary news is, you’re on your own now.”")}
                </p>
                <cite>
                  <a href={speech} target="_blank" rel="noreferrer">
                    Taylor Swift · NYU Commencement, 2022 <LuArrowUpRight />
                  </a>
                </cite>
              </blockquote>
              <p className="letter">
                {lang === "vi"
                  ? "Thật đáng sợ khi phải rời xa những điều thân thuộc. Nhưng cũng thật háo hức khi được khám phá bản thân có thể chạm tới những đâu."
                  : "It’s frightening to leave what you know behind. It’s also exciting to discover who you can become."}
              </p>
              <div className="actions">
                {opened ? (
                  nextButton(lang === "vi" ? "Đến Lễ Tốt Nghiệp" : "To the Ceremony")
                ) : (
                  <button className="button primary" onClick={handleOpenDoor}>
                    <LuSparkles /> {lang === "vi" ? "Mở Cánh Cửa Bình Minh" : "Open the Door"} <LuArrowRight />
                  </button>
                )}
              </div>
            </>
          )}

          {chapter === 3 && (
            <>
              <h1 id="chapter-title" ref={title} tabIndex={-1}>
                {lang === "vi" ? <>Ngày <em>Tốt Nghiệp.</em></> : <>Graduation <em>Day.</em></>}
              </h1>

              {/* Live countdown to Saturday morning */}
              <Countdown targetDate={event.start} lang={lang} />

              <div className="event-card">
                <div className="event-brand">
                  <div>
                    <strong>{event.fullName}</strong>
                    <span>{lang === "vi" ? event.degreeVi : event.degree} · {event.university}</span>
                  </div>
                  <img src={import.meta.env.BASE_URL + "assets/wsu-logo.png"} alt="WSU" loading="lazy" />
                </div>
                <p className="event-date">
                  <time dateTime={event.start}>
                    {lang === "vi" ? event.dateVi : event.date} · {lang === "vi" ? event.timeVi : event.time}
                  </time>
                  <small>{lang === "vi" ? "Giờ Việt Nam (UTC+7)" : "Vietnam time (UTC+7)"}</small>
                </p>
                <p className="event-location">
                  <strong>{lang === "vi" ? event.venueVi : event.venue}</strong>
                  <br />
                  {lang === "vi" ? event.addressVi : event.address}
                </p>
                <div className="event-contact-pills">
                  <a className="event-phone" href={"tel:+84" + event.phone.slice(1)}>
                    <LuPhone /> {event.phone}
                  </a>
                  <a className="event-zalo-pill" href={"https://zalo.me/" + event.phone} target="_blank" rel="noreferrer">
                    <LuMessageCircle /> {lang === "vi" ? "Nhắn Zalo" : "Zalo"}
                  </a>
                </div>
              </div>

              <div className="actions event-actions">
                <a className="button primary" href={maps} target="_blank" rel="noreferrer">
                  <LuMapPin /> {lang === "vi" ? "Chỉ Đường" : "Directions"}
                </a>
                <a className="button outline" href={getGoogleCalendarUrl()} target="_blank" rel="noreferrer" title="Add to Google Calendar">
                  <LuCalendarDays /> Google Calendar
                </a>
                <button className="button outline" onClick={downloadCalendar} title="Download .ICS file">
                  <LuCalendarDays /> .ICS
                </button>
                <button className="button outline rsvp-highlight-btn" onClick={() => setRsvpOpen(true)}>
                  <LuHeart /> {lang === "vi" ? "Gửi Lời Chúc / Lưu Ý" : "RSVP & Tips"}
                </button>
                <button className="icon-button" aria-label={lang === "vi" ? "Chia sẻ thiệp mời" : "Share invitation"} onClick={share}>
                  <LuShare2 />
                </button>
              </div>

              {worldActive && details && (
                <button className="text-button" onClick={openPortrait}>
                  {lang === "vi" ? "Xem chân dung cử nhân" : "Open portrait"} <LuImage />
                </button>
              )}
            </>
          )}

          {chapter === 4 && (
            <>
              <h1 id="chapter-title" ref={title} tabIndex={-1}>
                {lang === "vi" ? <>Khu Vườn <em>Tri Ân.</em></> : <>Thank-You <em>Garden.</em></>}
              </h1>
              <p className="letter">
                {lang === "vi"
                  ? "Chương tiếp theo có thể do mình tự viết, nhưng để chạm đến khoảnh khắc này, mình chưa bao giờ đơn độc. Những bức ảnh này xin được dành tặng gia đình, thầy cô và bạn bè đã luôn đồng hành cùng Dung."
                  : "The next chapter may be mine to write, but I didn’t reach this moment alone. These portraits celebrate the day and everyone who helped me get here."}
              </p>
              {photoGrid("friends")}
              <div className="actions">
                {nextButton(lang === "vi" ? "Đến Chân Trời Phía Trước" : "To the Open Horizon")}
                <button className="button outline" onClick={() => setRsvpOpen(true)}>
                  <LuHeart /> {lang === "vi" ? "Gửi Lời Chúc" : "Send Wishes"}
                </button>
              </div>
            </>
          )}

          {chapter === 5 && (
            <>
              <h1 id="chapter-title" ref={title} tabIndex={-1}>
                {lang === "vi" ? <>Chân Trời <em>Mới.</em></> : <>The Open <em>Horizon.</em></>}
              </h1>
              <p className="letter">
                {lang === "vi"
                  ? "Mình chưa biết con đường phía trước sẽ dẫn đến đâu. Nhưng mình đã sẵn sàng bước tiếp."
                  : "I don’t know exactly where the road leads. But I am ready to find out."}
              </p>
              <p className="signature">
                {lang === "vi" ? "Thương mến," : "With love,"} <br />
                <em>{event.fullName}</em>
              </p>
              <div className="actions">
                <button className="button primary" onClick={() => go(3, worldActive)}>
                  {lang === "vi" ? "Xem Lại Thư Mời" : "View Invitation"} <LuArrowUpRight />
                </button>
                <button className="button outline" onClick={() => setRsvpOpen(true)}>
                  <LuHeart /> {lang === "vi" ? "Gửi Lời Chúc / RSVP" : "Send Wishes / RSVP"}
                </button>
                <button className="button outline" onClick={share}>
                  <LuShare2 /> {lang === "vi" ? "Chia Sẻ" : "Share"}
                </button>
                <button className="text-button" onClick={() => go(1)}>
                  {lang === "vi" ? "Xem lại kỷ niệm" : "Back to memories"}
                </button>
              </div>
            </>
          )}
        </section>

        {worldActive && !details && !travel && (
          <div className="scene-prompt" key={chapter}>
            <span className="scene-kicker">
              {String(chapter + 1).padStart(2, "0")} / {lang === "vi" ? active.labelVi : active.label}
            </span>
            <p>{scenePrompt}</p>
            <button
              className="text-button"
              onClick={() => {
                if (chapter === 0) go(1);
                else if (chapter === 2 && !opened) handleOpenDoor();
                else if (chapter === 3 || chapter === 5) go(3, true);
                else go(chapter + 1);
              }}
            >
              {chapter === 0
                ? (lang === "vi" ? "Bắt đầu hành trình" : "Begin the journey")
                : chapter === 2 && !opened
                ? (lang === "vi" ? "Mở cánh cửa" : "Open the door")
                : chapter === 3 || chapter === 5
                ? (lang === "vi" ? "Xem thư mời tốt nghiệp" : "Your ceremony invitation")
                : (lang === "vi" ? "Tiếp tục câu chuyện" : "Continue the story")}
              <LuArrowRight />
            </button>
          </div>
        )}

        {worldActive && (
          <div className="explore-controls">
            <div className="explore-menu">
              <p className="desktop-gestures">
                {lang === "vi" ? "Kéo chuột để xoay 360° · Cuộn để thu phóng" : "Drag to spin · Scroll to zoom"}
              </p>
              <p className="touch-gestures">
                {lang === "vi" ? "Vuốt để xoay · Dùng 2 ngón tay thu phóng" : "Drag to spin · Pinch to zoom"}
              </p>
              <div className="explore-buttons">
                <button
                  ref={readButton}
                  className="button outline"
                  aria-expanded={details}
                  aria-controls="chapter-details"
                  onClick={() => details ? closeDetails() : setDetails(true)}
                >
                  <LuBookOpen /> {lang === "vi" ? "Chi tiết chương" : "Chapter details"}
                </button>
                <button
                  className="icon-button"
                  aria-label="Recenter camera"
                  title={lang === "vi" ? "Đặt lại góc nhìn camera" : "Recenter camera"}
                  onClick={() => go(chapter)}
                >
                  <LuCrosshair />
                </button>
              </div>
            </div>
            <div className="zoom-controls" role="group" aria-label="Zoom camera">
              <button className="icon-button" aria-label="Zoom in" onClick={() => { zoomStep.current++; }}>
                <LuZoomIn />
              </button>
              <button className="icon-button" aria-label="Zoom out" onClick={() => { zoomStep.current--; }}>
                <LuZoomOut />
              </button>
            </div>
          </div>
        )}

        {worldActive && travel && (
          <div key={travel} className={"chapter-transition " + travel} aria-hidden="true">
            <div>
              <span>✦</span>
              <small>{lang === "vi" ? "CHƯƠNG TIẾP THEO" : "THE NEXT CHAPTER"}</small>
            </div>
          </div>
        )}

        {worldActive && (chapter === 0 || chapter === 3) && (
          <button
            ref={portrait}
            className="portrait world-portrait"
            aria-label="Open graduation portrait frame"
            onClick={openPortrait}
          >
            <Photo photo={photos[0]} />
            <span className="portrait-label">01 / PORTRAIT <LuArrowUpRight /></span>
          </button>
        )}

        {!worldActive && (
          <figure className="stage">
            <div className="stage-viewport" aria-hidden="true">
              {still}
            </div>
            <div className="stage-guide" aria-hidden="true">
              <span>✦</span>
              <span>{event.fullName.toUpperCase()} / 2026</span>
            </div>
            {(chapter === 0 || chapter === 3) && (
              <button
                className="portrait"
                aria-label="Open graduation portrait frame"
                onClick={openPortrait}
              >
                <Photo photo={photos[0]} />
                <span className="portrait-label">01 / PORTRAIT <LuArrowUpRight /></span>
              </button>
            )}
            <figcaption>
              <span>FIG. {String(chapter + 1).padStart(2, "0")}</span>
              {lang === "vi" ? active.descriptionVi : active.description}
            </figcaption>
          </figure>
        )}
      </main>

      <footer className="chapter-footer">
        <div className="chapter-caption">
          <span>{lang === "vi" ? "HÀNH TRÌNH" : "THE JOURNEY"}</span>
          <span>{String(chapter + 1).padStart(2, "0")} <i>/</i> 06</span>
        </div>
        <nav aria-label="Chapters" className="chapter-nav">
          {chapters.map((item, index) => (
            <button
              key={item.id}
              aria-label={lang === "vi" ? item.nameVi : item.name}
              aria-current={index === chapter ? "step" : undefined}
              onClick={() => go(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{lang === "vi" ? item.nameVi : item.name}</span>
            </button>
          ))}
        </nav>
        <div className="chapter-arrows">
          <button
            className="icon-button"
            aria-label="Previous chapter"
            disabled={chapter === 0}
            onClick={() => go(chapter - 1)}
          >
            <LuArrowLeft />
          </button>
          <button
            className="icon-button"
            aria-label="Next chapter"
            disabled={chapter === chapters.length - 1}
            onClick={() => go(chapter + 1)}
          >
            <LuArrowRight />
          </button>
        </div>
      </footer>

      <div className="toast" role="status">{notice}</div>
      <span className="sr-only" role="status">
        Chapter {chapter + 1} of 6. {active.name}
      </span>

      {gallery && (
        <Gallery
          {...gallery}
          lang={lang}
          select={(index) => setGallery({ ...gallery, index })}
          close={() => {
            setGallery(null);
            requestAnimationFrame(() => opener.current?.focus());
          }}
        />
      )}

      <RsvpModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        lang={lang}
        guestName={guest}
        onToast={(msg) => setNotice(msg)}
      />
    </div>
  );
}

export default App;
