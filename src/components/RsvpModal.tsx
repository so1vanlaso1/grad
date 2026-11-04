import { useEffect, useRef, useState } from "react";
import { LuCheck, LuCopy, LuHeart, LuMapPin, LuMessageCircle, LuPhone, LuSend, LuShare2, LuSparkles, LuX } from "react-icons/lu";
import { event, getGoogleCalendarUrl } from "../invitation";
import { triggerCelebrationConfetti } from "../utils/confetti";

type RsvpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lang: "vi" | "en";
  guestName?: string;
  onToast: (msg: string) => void;
};

export function RsvpModal({ isOpen, onClose, lang, guestName, onToast }: RsvpModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"rsvp" | "logistics" | "invite">("rsvp");
  const [newGuestName, setNewGuestName] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [senderName, setSenderName] = useState(guestName || "");
  const [wishText, setWishText] = useState("");
  const [sentWish, setSentWish] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  function handleSendWish(e: React.FormEvent) {
    e.preventDefault();
    if (!wishText.trim()) return;

    try {
      const stored = JSON.parse(localStorage.getItem("thuy_dung_wishes") || "[]");
      stored.unshift({
        name: senderName.trim() || (lang === "vi" ? "Người thân / Bạn bè" : "A friend"),
        message: wishText.trim(),
        time: new Date().toISOString(),
      });
      localStorage.setItem("thuy_dung_wishes", JSON.stringify(stored.slice(0, 30)));
    } catch {
      // LocalStorage fallback
    }

    setSentWish(true);
    triggerCelebrationConfetti();
    onToast(lang === "vi" ? "Lời chúc đã được lưu! Cảm ơn bạn rất nhiều ♡" : "Your wish has been saved! Thank you so much ♡");
  }

  function handleCopyInviteLink() {
    const url = new URL(window.location.href);
    if (newGuestName.trim()) {
      url.searchParams.set("guest", newGuestName.trim());
    } else {
      url.searchParams.delete("guest");
    }

    navigator.clipboard.writeText(url.href).then(() => {
      setCopiedLink(true);
      onToast(lang === "vi" ? "Đã sao chép link mời cá nhân hóa!" : "Personalized invite link copied!");
      setTimeout(() => setCopiedLink(false), 2500);
    });
  }

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="rsvp-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rsvp-modal-content">
        <header className="rsvp-modal-header">
          <div className="rsvp-tabs">
            <button
              className={`rsvp-tab ${activeTab === "rsvp" ? "active" : ""}`}
              onClick={() => setActiveTab("rsvp")}
            >
              <LuHeart /> {lang === "vi" ? "Gửi Lời Chúc / RSVP" : "Send Wishes / RSVP"}
            </button>
            <button
              className={`rsvp-tab ${activeTab === "logistics" ? "active" : ""}`}
              onClick={() => setActiveTab("logistics")}
            >
              <LuMapPin /> {lang === "vi" ? "Chỉ Dẫn & Lưu Ý" : "Venue & Tips"}
            </button>
            <button
              className={`rsvp-tab ${activeTab === "invite" ? "active" : ""}`}
              onClick={() => setActiveTab("invite")}
            >
              <LuShare2 /> {lang === "vi" ? "Tạo Link Mời" : "Make Invite"}
            </button>
          </div>
          <button className="icon-button close-rsvp" aria-label="Close modal" onClick={onClose}>
            <LuX />
          </button>
        </header>

        {activeTab === "rsvp" && (
          <div className="rsvp-tab-body">
            <div className="rsvp-quick-connect">
              <p className="rsvp-subtitle">
                {lang === "vi"
                  ? "Sự hiện diện của bạn là niềm vinh hạnh lớn nhất của Thùy Dung!"
                  : "Your presence is Thùy Dung's greatest joy!"}
              </p>
              <div className="rsvp-contact-buttons">
                <a
                  href={`https://zalo.me/${event.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button primary rsvp-zalo-btn"
                >
                  <LuMessageCircle /> {lang === "vi" ? "Nhắn Zalo xác nhận (0985 763 939)" : "RSVP on Zalo"}
                </a>
                <a
                  href={`tel:+84${event.phone.slice(1)}`}
                  className="button outline"
                >
                  <LuPhone /> {lang === "vi" ? "Gọi điện trực tiếp" : "Direct Phone Call"}
                </a>
              </div>
            </div>

            <hr className="rsvp-divider" />

            <div className="rsvp-wish-section">
              <h3>
                <LuSparkles /> {lang === "vi" ? "Viết lời chúc mừng tới Thùy Dung" : "Leave a congratulatory message"}
              </h3>
              {sentWish ? (
                <div className="wish-sent-success">
                  <p className="wish-sent-title">
                    <LuCheck /> {lang === "vi" ? "Lời chúc đã gửi thành công!" : "Wish sent successfully!"}
                  </p>
                  <p className="wish-sent-desc">
                    {lang === "vi"
                      ? "Cảm ơn bạn đã gửi những lời chúc ấm áp cho ngày tốt nghiệp của Dung!"
                      : "Thank you for sending your warm wishes on Dung's graduation day!"}
                  </p>
                  <button className="text-button" onClick={() => setSentWish(false)}>
                    {lang === "vi" ? "Viết thêm lời chúc khác" : "Write another message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendWish} className="wish-form">
                  <div className="form-group">
                    <label htmlFor="sender-name">
                      {lang === "vi" ? "Tên của bạn:" : "Your name:"}
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      className="input-text"
                      placeholder={lang === "vi" ? "VD: Anh Nam, Bạn Trang, Cô Ba..." : "e.g. Sarah, Minh..."}
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="wish-text">
                      {lang === "vi" ? "Lời chúc mừng:" : "Your wish:"}
                    </label>
                    <textarea
                      id="wish-text"
                      rows={3}
                      className="input-textarea"
                      placeholder={
                        lang === "vi"
                          ? "Chúc mừng Tân Cử nhân Phạm Thùy Dung! Chúc em luôn tự tin, rực rỡ trên chặng đường sắp tới..."
                          : "Congratulations Thùy Dung! Wishing you all the best for your next adventure..."
                      }
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="button primary send-wish-btn">
                    <LuSend /> {lang === "vi" ? "Gửi Lời Chúc" : "Send Wishes"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === "logistics" && (
          <div className="rsvp-tab-body logistics-body">
            <div className="logistics-card">
              <h4>📅 {lang === "vi" ? "Thời gian đón khách & chụp ảnh" : "Arrival & Photography"}</h4>
              <p>
                <strong>09:15 – 09:45 AM</strong> (
                {lang === "vi"
                  ? "Khuyến khích đến sớm để chụp ảnh kỷ niệm cùng Thùy Dung tại sảnh & sân trường trước khi lễ bắt đầu lúc 10:00 AM"
                  : "Recommended to arrive early for photos at the hall lobby before ceremony starts at 10:00 AM"}
                ).
              </p>
            </div>

            <div className="logistics-card">
              <h4>📍 {lang === "vi" ? "Địa điểm & Hội trường" : "Venue & Hall"}</h4>
              <p>
                <strong>{lang === "vi" ? event.venueVi : event.venue}</strong>
                <br />
                {lang === "vi" ? event.addressVi : event.address}
              </p>
              <div className="logistics-links">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("UEH Campus A 59C Nguyen Dinh Chieu")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button outline small-btn"
                >
                  <LuMapPin /> Google Maps
                </a>
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="button outline small-btn"
                >
                  📅 Google Calendar
                </a>
              </div>
            </div>

            <div className="logistics-card">
              <h4>🛵 {lang === "vi" ? "Gửi xe máy & Ô tô" : "Parking instructions"}</h4>
              <p>
                {lang === "vi"
                  ? "Gửi xe máy tại hầm giữ xe UEH Campus A (cổng 59C Nguyễn Đình Chiểu hoặc cổng đường Pasteur). Xe ô tô có thể gửi tại các bãi lân cận hoặc dừng trả khách trước sảnh trường."
                  : "Motorbike parking is available in the UEH Campus A basement (entry at 59C Nguyen Dinh Chieu). Car parking available at nearby lots."}
              </p>
            </div>

            <div className="logistics-card">
              <h4>👗 {lang === "vi" ? "Trang phục gợi ý" : "Dress code"}</h4>
              <p>
                {lang === "vi"
                  ? "Trang phục lịch sự, trang nhã (Formal / Smart Casual / Tone màu tươi sáng, pastel)."
                  : "Smart casual or formal attire. Light or pastel tones recommended for photos."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "invite" && (
          <div className="rsvp-tab-body">
            <p className="rsvp-subtitle">
              {lang === "vi"
                ? "Tạo thiệp mời cá nhân hóa cho từng người thân, bạn bè:"
                : "Create a personalized invitation link with your guest's name:"}
            </p>
            <div className="invite-generator-box">
              <label htmlFor="guest-input">
                {lang === "vi" ? "Nhập tên khách mời:" : "Guest's name:"}
              </label>
              <div className="invite-input-row">
                <input
                  id="guest-input"
                  type="text"
                  className="input-text"
                  placeholder={lang === "vi" ? "VD: Bác Ba, Minh Thư, Gia đình anh Hưng..." : "e.g. Jessica, Uncle Bob..."}
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
              </div>

              <div className="preview-url-box">
                <span className="url-preview-text">
                  {window.location.origin + window.location.pathname}
                  {newGuestName.trim() ? `?guest=${encodeURIComponent(newGuestName.trim())}` : ""}
                </span>
              </div>

              <button
                type="button"
                className="button primary copy-invite-btn"
                onClick={handleCopyInviteLink}
              >
                {copiedLink ? <LuCheck /> : <LuCopy />}
                {copiedLink
                  ? (lang === "vi" ? "Đã sao chép link!" : "Copied!")
                  : (lang === "vi" ? "Sao Chép Link Mời" : "Copy Personalized Link")}
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

