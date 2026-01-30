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

/* -------- ART PARAMETERS -------- */
const DOTS = 18000; // higher density
const R = Math.min(w, h) * 0.28;
const THICKNESS = 60;
let rotation = 0;

/* Weighted random (more natural spread) */
function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* Dot cloud */
const points = [];

for (let i = 0; i < DOTS; i++) {
  const t = Math.random() * Math.PI * 2;

  // Bias toward center like real halftone
  const spread = gaussianRandom() * THICKNESS * 0.35;

  points.push({ t, spread });
}

/* Infinity curve */
function infinity(t) {
  return {
    x: Math.sin(t),
    y: Math.sin(t) * Math.cos(t)
  };
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  rotation += 0.0012;

  for (const p of points) {
    const base = infinity(p.t + rotation);

    const twist = Math.cos(p.t * 2 + rotation) * p.spread;

    const x = w / 2 + base.x * R * 2 + Math.cos(p.t) * twist;
    const y = h / 2 + base.y * R * 2 + Math.sin(p.t) * twist;

    const depth = (Math.cos(p.t + rotation) + 1) / 2;

    const dx = mouse.x - x;
    const dy = mouse.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let bulge = 0;
    if (dist < 100) bulge = (100 - dist) * 0.035;

    const radius =
      0.4 +
      depth * 1.8 +
      bulge;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${0.12 + depth * 0.88})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();
