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

/* Infinity ribbon */
const layers = 9;           // thickness
const dotsPerLayer = 140;   // density
const baseRadius = Math.min(w, h) * 0.28;

function draw() {
  ctx.clearRect(0, 0, w, h);

  for (let l = 0; l < layers; l++) {
    const offset = (l - layers / 2) * 2;

    for (let i = 0; i < dotsPerLayer; i++) {
      const t = (Math.PI * 2 / dotsPerLayer) * i;

      const x = Math.sin(t);
      const y = Math.sin(t) * Math.cos(t);

      const cx = w / 2 + x * baseRadius * 2;
      const cy = h / 2 + y * baseRadius * 2 + offset;

      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let pop = 0;
      if (dist < 90) pop = (90 - dist) * 0.07;

      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(cx, cy, 1.2 + pop, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
}

draw();
