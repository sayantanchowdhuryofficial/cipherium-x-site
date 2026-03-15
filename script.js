// Interactive glow orb following mouse
const orb = document.getElementById('glow-orb');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let orbX = mouseX;
let orbY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateOrb() {
    // Smooth follow interpolation
    orbX += (mouseX - orbX) * 0.05;
    orbY += (mouseY - orbY) * 0.05;
    if (orb) {
        orb.style.transform = `translate(${orbX - 200}px, ${orbY - 200}px)`;
    }
    requestAnimationFrame(animateOrb);
}
animateOrb();

// Advanced Cyber-Particles Animation
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const particleCount = Math.min(window.innerWidth / 5, 150);

const colors = ['#8a2be2', '#00ffff', '#dddddd', '#4facfe'];

function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = []; // Re-initialize to avoid crowding
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

window.addEventListener("resize", resize);

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 1.0;
        this.vy = (Math.random() - 0.5) * 1.0;
        this.size = Math.random() * 2 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = Math.random() * Math.PI * 2;
        this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Repel from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
        }

        this.life += 0.02;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.baseAlpha + Math.sin(this.life) * 0.2;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

resize();

function drawLines() {
    if (!ctx) return;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                
                // Use gradient for lines based on connecting particles
                const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                gradient.addColorStop(0, p1.color);
                gradient.addColorStop(1, p2.color);
                
                ctx.strokeStyle = gradient;
                // Calculate opacity based on distance
                ctx.globalAlpha = 0.2 * (1 - dist / 120);
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function animate() {
    if (!ctx) return;
    // Dark trail effect for smooth motion blur
    ctx.fillStyle = "rgba(3, 0, 20, 0.2)";
    ctx.fillRect(0, 0, width, height);

    for (let p of particles) {
        p.update();
        p.draw();
    }
    
    drawLines();
    requestAnimationFrame(animate);
}

animate();

// =========================================================================
// AUTHENTICATION MODAL LOGIC
// =========================================================================
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');

const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

// Open Modal Functions
function openLoginModal() {
    authModal.classList.remove('hidden');
    showLoginForm();
}

function openSignupModal() {
    authModal.classList.remove('hidden');
    showSignupForm();
}

// Close Modal Function
function hideModal() {
    authModal.classList.add('hidden');
}

// Toggle Form Functions
function showLoginForm() {
    signupForm.classList.remove('active-form');
    loginForm.classList.add('active-form');
    modalTitle.textContent = "Welcome Back";
    modalSubtitle.textContent = "Log in to your CipheriumX account";
}

function showSignupForm() {
    loginForm.classList.remove('active-form');
    signupForm.classList.add('active-form');
    modalTitle.textContent = "Initialize Access";
    modalSubtitle.textContent = "Create your CipheriumX account";
}

// Event Listeners
loginBtn.addEventListener('click', openLoginModal);
signupBtn.addEventListener('click', openSignupModal);
closeModal.addEventListener('click', hideModal);

switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Close modal when clicking completely outside the modal content
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        hideModal();
    }
});
