import { useEffect, useRef } from "react";
import { album, graduation, letters } from "../graduation";

import RsvpForm from "./RsvpForm";

export type Selection = { type: "letter" | "photo"; index: number } | { type: "invitation" | "rsvp" };

export default function KeepsakeDialog({ selection, onClose, onPhoto }: {
  selection: Selection;
  onClose: () => void;
  onPhoto: (index: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const letter = selection.type === "letter" ? letters[selection.index] : undefined;
  const photo = selection.type === "photo" ? album[selection.index] : undefined;

  return (
    <dialog ref={ref} className="keepsake-dialog" aria-labelledby="keepsake-title" onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article>
        <button type="button" className="keepsake-close" onClick={onClose} aria-label="Close" autoFocus>×</button>
        {selection.type === "rsvp" && <RsvpForm />}
        {letter && (
          <>
            <p className="keepsake-kicker">A LETTER FOR YOU</p>
            <h2 id="keepsake-title">{letter.title}</h2>
            <p>{letter.greeting}</p>
            {letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="keepsake-signature">{graduation.name}</p>
          </>
        )}
        {photo && selection.type === "photo" && (
          <>
            <img className="keepsake-image" src={photo.url} alt={photo.caption} />
            <h2 id="keepsake-title">{photo.caption}</h2>
            <div className="keepsake-actions">
              <button onClick={() => onPhoto((selection.index - 1 + album.length) % album.length)} aria-label="Previous photo">←</button>
              <span>{selection.index + 1} / {album.length}</span>
              <button onClick={() => onPhoto((selection.index + 1) % album.length)} aria-label="Next photo">→</button>
            </div>
          </>
        )}
        {selection.type === "invitation" && (
          <>
            <img className="keepsake-image" src={graduation.poster} alt="Thùy Dung’s graduation invitation" />
            <h2 id="keepsake-title">{graduation.name}</h2>
            <p>{graduation.date} · {graduation.time}</p>
            <p>{graduation.venue}<br />{graduation.address}</p>
            <p><a href={`tel:${graduation.phone}`}>Contact · {graduation.phone}</a></p>
          </>
        )}
      </article>
    </dialog>
  );
}
