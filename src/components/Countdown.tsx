import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
  lang?: "vi" | "en";
};

export function Countdown({ targetDate, lang = "vi" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeLeft(dateStr: string) {
    const difference = +new Date(dateStr) - +new Date();
    if (difference <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  if (timeLeft.total <= 0) {
    return (
      <div className="countdown-live-badge" role="status">
        <span className="live-pulse" />
        <span>{lang === "vi" ? "Đang diễn ra hôm nay! Chúc mừng tốt nghiệp!" : "Happening today! Happy Graduation!"}</span>
      </div>
    );
  }

  const labels = lang === "vi"
    ? { days: "NGÀY", hours: "GIỜ", mins: "PHÚT", secs: "GIÂY" }
    : { days: "DAYS", hours: "HOURS", mins: "MINS", secs: "SECS" };

  return (
    <div className="countdown-wrapper" aria-label={lang === "vi" ? "Thời gian đếm ngược đến lễ tốt nghiệp" : "Countdown to graduation"}>
      <div className="countdown-unit">
        <span className="countdown-number">{String(timeLeft.days).padStart(2, "0")}</span>
        <span className="countdown-label">{labels.days}</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <span className="countdown-number">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="countdown-label">{labels.hours}</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <span className="countdown-number">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="countdown-label">{labels.mins}</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-unit">
        <span className="countdown-number">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="countdown-label">{labels.secs}</span>
      </div>
    </div>
  );
}

