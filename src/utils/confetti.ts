// Lightweight zero-dependency canvas confetti burst
export function triggerCelebrationConfetti() {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = "9999";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = ["#c2a16b", "#792f3b", "#f7f0e7", "#ffdfa9", "#deb7bd", "#e99ba6", "#5f7f90"];
  const particleCount = Math.min(90, Math.floor(width / 12));
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    shape: "rect" | "circle";
  }> = [];

  for (let i = 0; i < particleCount; i++) {
    const fromLeft = i % 2 === 0;
    particles.push({
      x: fromLeft ? width * 0.2 + (Math.random() * width * 0.15) : width * 0.8 - (Math.random() * width * 0.15),
      y: height * 0.7 + Math.random() * (height * 0.2),
      vx: (Math.random() - 0.5) * 8 + (fromLeft ? 3 : -3),
      vy: -(Math.random() * 12 + 10),
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    });
  }

  const startTime = performance.now();
  const duration = 2800;

  function render(currentTime: number) {
    const elapsed = currentTime - startTime;
    if (elapsed > duration) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    ctx?.clearRect(0, 0, width, height);

    const progress = elapsed / duration;
    const fadeOut = progress > 0.65 ? 1 - (progress - 0.65) / 0.35 : 1;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.rotationSpeed;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = Math.max(0, p.opacity * fadeOut);
      ctx!.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      } else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
