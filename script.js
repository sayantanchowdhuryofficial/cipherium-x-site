const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let scrollY = 0;
window.addEventListener("scroll", () => scrollY = window.scrollY);

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

const mouse = { x: null, y: null, radius: 180 };
window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

/* === ANTIMATTER NODES === */
class Node {
  constructor(depth) {
    this.depth = depth;
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speed = Math.random() * 0.3 + 0.1;
  }

  update() {
    this.y += this.speed + scrollY * 0.00004 * this.depth;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < mouse.radius) {
      this.x -= dx / 18;
      this.y -= dy / 18;
    }

    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.depth, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

let nodes = [];

function init() {
  nodes = [];
  const density = (canvas.width * canvas.height) / 5000;
  for (let i = 0; i < density; i++) {
    nodes.push(new Node(Math.random() * 1.6 + 0.4));
  }
}

function connect() {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 80})`;
        ctx.lineWidth = 0.35;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
}

/* === SCENE LOOP === */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes.forEach(n => { n.update(); n.draw(); });
  connect();
  requestAnimationFrame(animate);
}

init();
animate();

/* === MANIFESTO REVEAL (anime.js philosophy) === */
const lines = document.querySelectorAll(".line");

window.addEventListener("scroll", () => {
  lines.forEach((line, i) => {
    const rect = line.getBoundingClientRect();
    if (rect.top < innerHeight * 0.85) {
      line.style.transition = "all 0.8s cubic-bezier(.19,1,.22,1)";
      line.style.opacity = 1;
      line.style.transform = "translateY(0)";
    }
  });
});
