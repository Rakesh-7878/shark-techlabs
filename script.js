const canvas = document.getElementById('ocean');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration
const particleCount = 100;
const connectionDistance = 120;
const particleSpeed = 0.5;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight; // Full viewport height for hero section
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * particleSpeed;
        this.vy = (Math.random() - 0.5) * particleSpeed;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(100, 200, 255, 0.4)'; // Dimmer blue
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    resize();
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                // Opacity based on distance
                const opacity = 1 - dist / connectionDistance;
                ctx.strokeStyle = `rgba(100, 200, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    // Re-initialize particles to avoid them getting stuck outside
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
});

// Start
init();

// Force scroll to top on reload
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}


// ================= MODAL LOGIC =================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});

// Info Modal Specific Logic
document.addEventListener('DOMContentLoaded', () => {
    const infoIcon = document.querySelector('.info-icon');
    const infoModal = document.getElementById('info-modal');
    const modalClose = infoModal?.querySelector('.modal-close');

    if (infoIcon && infoModal) {
        infoIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal('info-modal');
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            closeModal('info-modal');
        });
    }
});

// ================= AUTH LOGIC =================
const googleLoginBtn = document.getElementById('google-login');
const userDisplay = document.getElementById('user-display');
const userEmailText = document.getElementById('user-email-text');
const formOverlay = document.getElementById('form-overlay');
const submitBtn = document.getElementById('submit-btn');

// ================= MOBILE NAV TOGGLE =================
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

if (mobileNavToggle && mobileNavOverlay) {
    mobileNavToggle.addEventListener('click', () => {
        const isOpen = mobileNavOverlay.classList.toggle('active');
        mobileNavToggle.classList.toggle('active');

        // Prevent body scrolling when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    const mobileLinks = mobileNavOverlay.querySelectorAll('a, button');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavOverlay.classList.remove('active');
            mobileNavToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        // Simulate Login
        googleLoginBtn.style.display = 'none';

        userDisplay.classList.add('flex'); // Add flex class to show
        userEmailText.textContent = 'user@example.com';

        formOverlay.classList.add('hidden');
        submitBtn.disabled = false;
    });
}

