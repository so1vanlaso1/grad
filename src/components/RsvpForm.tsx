import { useRef, useState, type FormEvent } from "react";

export default function RsvpForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const sending = useRef(false);

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const response = await fetch("https://140-245-38-247.sslip.io/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
        signal: AbortSignal.timeout(22000),
      });
      if (response.status !== 201 || (await response.json()).ok !== true) {
        throw new Error("RSVP was not confirmed");
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  }

  return (
    <>
      <p className="keepsake-kicker">THE LETTER BOX</p>
      <h2 id="keepsake-title">Will you join me?</h2>
      {status === "sent" ? (
        <p role="status">Your reply was saved. Thank you!</p>
      ) : (
        <form className="rsvp-form" onSubmit={sendReply} aria-busy={status === "sending"}>
          <fieldset aria-labelledby="keepsake-title">
            <label><input type="radio" name="attendance" value="yes" required /> Yes, I’ll be there!</label>
            <label><input type="radio" name="attendance" value="no" /> Sorry, I can’t make it.</label>
          </fieldset>
          <label htmlFor="rsvp-note">A little note for me? <small>(optional)</small></label>
          <textarea id="rsvp-note" name="note" rows={3} maxLength={500} />
          <label htmlFor="rsvp-name">Your name</label>
          <input id="rsvp-name" name="name" autoComplete="name" required pattern={".*\\S.*"} maxLength={80} />
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>
          {status === "error" && (
            <p role="alert">We couldn’t confirm your reply. Your entries are still here. Please try again.</p>
          )}
        </form>
      )}
    </>
  );
}
