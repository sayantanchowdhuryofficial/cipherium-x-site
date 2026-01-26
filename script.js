const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let scrollY = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

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
    this.y += this.speed + scrollY * 0.00008 * this.depth;

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
  const density = Math.floor((canvas.width * canvas.height) / 5000);

  for (let i = 0; i < density; i++) {
    nodes.push(new Node(Math.random() * 2 + 0.3));
  }
}

function connect() {
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a; b < nodes.length; b++) {
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 100})`;
        ctx.lineWidth = 0.35;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach(n => {
    n.update();
    n.draw();
  });

  connect();
  requestAnimationFrame(animate);
}

init();
animate();

/* anime.js-style reveal */
const lines = document.querySelectorAll(".line");

window.addEventListener("scroll", () => {
  lines.forEach(line => {
    const rect = line.getBoundingClientRect();
    if (rect.top < innerHeight * 0.85) {
      line.style.opacity = 1;
      line.style.transform = "translateY(0)";
    }
  });
});
