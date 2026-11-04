import { useState, type FormEvent } from "react";
import { graduation } from "../graduation";

export default function RsvpForm() {
  const [message, setMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const recipient = "+84" + graduation.phone.slice(1);

  function prepareReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();
    setMessage([
      "Hi Dung!",
      "Graduation RSVP: " + data.get("attendance"),
      "From: " + name,
      ...(note ? ["", note] : []),
    ].join("\n"));
    setCopyStatus("");
  }

  async function copyReply() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("Reply copied.");
    } catch {
      setCopyStatus("Select and copy the reply from the box above.");
    }
  }

  return (
    <>
      <p className="keepsake-kicker">THE LETTER BOX</p>
      <h2 id="keepsake-title">Will you join me?</h2>
      <form className="rsvp-form" onSubmit={prepareReply} onChange={() => { setMessage(""); setCopyStatus(""); }}>
        <fieldset aria-labelledby="keepsake-title">
          <label><input type="radio" name="attendance" value="Yes, I’ll be there!" required /> Yes, I’ll be there!</label>
          <label><input type="radio" name="attendance" value="Sorry, I can’t make it." /> Sorry, I can’t make it.</label>
        </fieldset>
        <label htmlFor="rsvp-note">A little note for me? <small>(optional)</small></label>
        <textarea id="rsvp-note" name="note" rows={3} maxLength={500} />
        <label htmlFor="rsvp-name">Your name</label>
        <input id="rsvp-name" name="name" autoComplete="name" required pattern={".*\\S.*"} maxLength={80} />
        <button type="submit">Prepare my reply</button>
      </form>
      {message && (
        <div className="rsvp-form rsvp-reply">
          <label htmlFor="rsvp-message">Your reply is ready to send by text.</label>
          <textarea id="rsvp-message" value={message} readOnly rows={4} />
          <div className="keepsake-actions">
            <a href={`sms:${recipient}?body=${encodeURIComponent(message)}`}>Open text message</a>
            <button type="button" onClick={copyReply}>Copy reply</button>
          </div>
          <span role="status">{copyStatus}</span>
        </div>
      )}
    </>
  );
}
