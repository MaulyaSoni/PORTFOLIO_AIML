// ──────────────────────────────
// Initialize Lucide Icons
// ──────────────────────────────
lucide.createIcons();
// ──────────────────────────────
// EmailJS configuration
// Values sourced from .env — inlined here since this is a static site.
// ──────────────────────────────
const EMAILJS_SERVICE_ID  = 'template_tnbzg2g';
const EMAILJS_TEMPLATE_ID = 'template_tnbzg2g';
const EMAILJS_PUBLIC_KEY  = '3UzmkdDZsSX6bfcAY';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ──────────────────────────────
// Loading Animation
// ──────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                initAnimations();
            }, 500);
        } else {
            width += 2;
            loaderBar.style.width = width + '%';
        }
    }, 20);
});

// ──────────────────────────────
// Custom Cursor
// ──────────────────────────────
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top  = `${posY}px`;

    cursorOutline.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 500, fill: 'forwards' }
    );
});

document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
});

// ──────────────────────────────
// Three.js Neural Network Background
// ──────────────────────────────
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(0.05, 16, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 });
const nodes    = [];
const lines    = [];

for (let i = 0; i < 50; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    scene.add(mesh);
    nodes.push(mesh);
}

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.2 });
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 2) {
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                nodes[i].position,
                nodes[j].position
            ]);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            lines.push({ line, nodeA: nodes[i], nodeB: nodes[j] });
        }
    }
}

camera.position.z = 5;

function animateThree() {
    requestAnimationFrame(animateThree);

    nodes.forEach((node, i) => {
        node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });

    lines.forEach(({ line, nodeA, nodeB }) => {
        const positions = line.geometry.attributes.position.array;
        positions[0] = nodeA.position.x;
        positions[1] = nodeA.position.y;
        positions[2] = nodeA.position.z;
        positions[3] = nodeB.position.x;
        positions[4] = nodeB.position.y;
        positions[5] = nodeB.position.z;
        line.geometry.attributes.position.needsUpdate = true;
    });

    scene.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animateThree();

// ──────────────────────────────
// Particles.js Configuration
// ──────────────────────────────
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#8b5cf6' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#8b5cf6',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    }
});

// ──────────────────────────────
// Binary / Matrix Rain
// ──────────────────────────────
function createBinaryRain() {
    const container = document.getElementById('binary-rain');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    setInterval(() => {
        const drop = document.createElement('div');
        drop.className = 'binary-rain';
        drop.textContent = chars[Math.floor(Math.random() * chars.length)];
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
        drop.style.opacity = Math.random() * 0.3;
        container.appendChild(drop);
        setTimeout(() => drop.remove(), 5000);
    }, 100);
}
createBinaryRain();

// ──────────────────────────────
// GSAP Scroll Animations
// ──────────────────────────────
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-up reveal for all .reveal elements
    gsap.utils.toArray('.reveal').forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Animated skill bars
    gsap.utils.toArray('.skill-bar').forEach(bar => {
        const width = bar.getAttribute('data-width');
        gsap.to(bar, {
            width: width,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%'
            }
        });
    });
}

// ──────────────────────────────
// Project Filtering
// ──────────────────────────────
function filterProjects(category) {
    const items   = document.querySelectorAll('.project-item');
    const buttons = document.querySelectorAll('.tab-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (
            btn.textContent.toLowerCase().includes(category) ||
            (category === 'all' && btn.textContent.trim() === 'All')
        ) {
            btn.classList.add('active');
        }
    });

    items.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, delay: index * 0.1 });
        } else {
            gsap.to(item, {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                onComplete: () => { item.style.display = 'none'; }
            });
        }
    });
}

// ──────────────────────────────
// EmailJS Contact Form
// Service ID and public key are loaded from environment variables.
// The template ID has been temporarily removed per request;
// add it back once you have a template configured.
// ──────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn          = this.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span class="animate-spin">⟳</span> Sending...';
    btn.disabled  = true;

    const templateParams = {
        from_name: this.querySelector('[name="from_name"]').value,
        reply_to:  this.querySelector('[name="reply_to"]').value,
        message:   this.querySelector('[name="message"]').value,
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            const successMsg = document.getElementById('success-message');
            successMsg.classList.remove('hidden');
            this.reset();
            btn.innerHTML = originalHTML;
            btn.disabled  = false;
            setTimeout(() => successMsg.classList.add('hidden'), 5000);
        })
        .catch((error) => {
            const reason = error && (error.text || error.message || JSON.stringify(error));
            console.error('EmailJS error — status:', error && error.status, '| text:', reason);
            alert('Failed to send message. Please try again later.');
            btn.innerHTML = originalHTML;
            btn.disabled  = false;
        });
});

// ──────────────────────────────
// Mobile Menu Toggle
// ──────────────────────────────
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// ──────────────────────────────
// Smooth Scroll with Page Transition
// ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        const transition = document.getElementById('page-transition');
        gsap.to(transition, {
            scaleY: 1,
            duration: 0.3,
            onComplete: () => {
                target.scrollIntoView({ behavior: 'auto' });
                gsap.to(transition, { scaleY: 0, duration: 0.3, delay: 0.1 });
            }
        });
    });
});

// ──────────────────────────────
// Navbar Shadow on Scroll
// ──────────────────────────────
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.pageYOffset > 100) {
        navbar.classList.add('shadow-lg', 'shadow-violet-500/10');
    } else {
        navbar.classList.remove('shadow-lg', 'shadow-violet-500/10');
    }
});

// ──────────────────────────────
// Resize Handler (Three.js camera + renderer)
// ──────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ──────────────────────────────
// Hero Typing Effect
// ──────────────────────────────
const heroText      = "Building intelligent systems & scalable web applications";
const typingElement = document.getElementById('typing-text');
let charIndex       = 0;

function typeText() {
    if (charIndex < heroText.length) {
        typingElement.textContent = heroText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeText, 50);
    }
}

setTimeout(typeText, 1000);
