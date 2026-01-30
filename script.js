const canvas = document.getElementById("infinity");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
addEventListener("resize", resize);
resize();

const mouse = { x: -9999, y: -9999 };
addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* Halftone infinity surface */
const T_STEPS = 220;   // along the curve
const W_STEPS = 22;    // ribbon thickness
const R = Math.min(w, h) * 0.26;

function draw() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < T_STEPS; i++) {
    const t = (Math.PI * 2 / T_STEPS) * i;

    // Core infinity curve (lemniscate-like)
    const cx = Math.sin(t);
    const cy = Math.sin(t) * Math.cos(t);

    // Fake depth (front/back of ribbon)
    const depth = Math.cos(t);
    const depthNorm = (depth + 1) / 2;

    for (let j = -W_STEPS; j <= W_STEPS; j++) {
      const widthFactor = 1 - Math.abs(j) / W_STEPS;

      const x = w / 2 + cx * R * 2;
      const y = h / 2 + cy * R * 2 + j * 2;

      // Mouse bulge (radius only)
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let bulge = 0;
      if (dist < 80) bulge = (80 - dist) * 0.05;

      const radius =
        0.6 +
        widthFactor * 1.6 +
        depthNorm * 1.4 +
        bulge;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.15 + depthNorm * 0.85})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

draw();
