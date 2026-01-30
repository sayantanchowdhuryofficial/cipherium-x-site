const canvas = document.getElementById("infinity");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

/* Infinity math */
const dots = [];
const DOT_COUNT = 420;
const R = Math.min(w, h) * 0.25;

for (let i = 0; i < DOT_COUNT; i++) {
  const t = (Math.PI * 2 / DOT_COUNT) * i;
  dots.push({ t });
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "white";

  dots.forEach(d => {
    const x = R * Math.sin(d.t);
    const y = R * Math.sin(d.t) * Math.cos(d.t);

    const cx = w / 2 + x * 2;
    const cy = h / 2 + y * 2;

    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let pop = 0;
    if (dist < 80) {
      pop = (80 - dist) * 0.08; // 5–7px pop
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 1.6 + pop, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();
