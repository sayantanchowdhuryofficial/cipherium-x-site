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

/* -------- PARAMETERS -------- */
const DOTS = 20000;              // "billions" illusion
const R = Math.min(w, h) * 0.26;
const THICKNESS = 38;
let rotation = 0;

/* Dot cloud */
const points = [];

for (let i = 0; i < DOTS; i++) {
  const t = Math.random() * Math.PI * 2;
  const wOffset = (Math.random() - 0.5) * THICKNESS;

  points.push({ t, wOffset });
}

/* Lemniscate base */
function infinity(t) {
  const x = Math.sin(t);
  const y = Math.sin(t) * Math.cos(t);
  return { x, y };
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  rotation += 0.0015; // slow art rotation

  for (const p of points) {
    const base = infinity(p.t + rotation);

    // Fake 3D twist
    const twist = Math.cos(p.t * 2 + rotation) * p.wOffset;

    const x = w / 2 + base.x * R * 2 + Math.cos(p.t) * twist;
    const y = h / 2 + base.y * R * 2 + Math.sin(p.t) * twist;

    // Depth shading
    const depth = (Math.cos(p.t + rotation) + 1) / 2;

    // Mouse bulge (radius only)
    const dx = mouse.x - x;
    const dy = mouse.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let bulge = 0;
    if (dist < 90) bulge = (90 - dist) * 0.04;

    const radius = 0.6 + depth * 1.6 + bulge;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${0.15 + depth * 0.85})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();
