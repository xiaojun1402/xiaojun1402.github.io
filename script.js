/* ═══════════════════════════════════════════════════════════
   THEME TOGGLE — persists across page loads via localStorage
═══════════════════════════════════════════════════════════ */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const beevaLogo   = document.getElementById('beeva-logo');
const tcardBeeva  = document.getElementById('tcard-beeva-logo');

// Apply saved theme on load (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
setIcon(savedTheme);
setBeevaLogo(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIcon(next);
    setBeevaLogo(next);
});

function setIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function setBeevaLogo(theme) {
    const src = theme === 'dark' ? 'assets/logos/beeva-dark.png' : 'assets/logos/beeva-light.png';
    if (beevaLogo)   beevaLogo.src   = src;
    if (tcardBeeva)  tcardBeeva.src  = src;
}

/* ═══════════════════════════════════════════════════════════
   HAMBURGER — mobile nav toggle
═══════════════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/* ═══════════════════════════════════════════════════════════
   TYPING ANIMATION — cycling job titles
═══════════════════════════════════════════════════════════ */
const roles = [
    'AI Engineer',
    'ML Researcher',
    'Deep Learning Practitioner',
    'AI Singapore Apprentice',
    'Data Scientist',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typed-text');

function type() {
    if (!typedEl) return;
    const current = roles[roleIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === current.length) {
        delay = 1800;           // pause at full word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        roleIndex   = (roleIndex + 1) % roles.length;
        delay = 350;            // pause before typing next
    }

    setTimeout(type, delay);
}

type();

/* ═══════════════════════════════════════════════════════════
   SKILLS CAROUSEL — two rows, opposite directions
═══════════════════════════════════════════════════════════ */
const row1 = [
    { name: 'PyTorch',           icon: 'fas fa-fire' },
    { name: 'TensorFlow',        icon: 'fas fa-brain' },
    { name: 'Scikit-learn',      icon: 'fas fa-cogs' },
    { name: 'Python',            icon: 'fab fa-python' },
    { name: 'SQL',               icon: 'fas fa-database' },
    { name: 'Docker',            icon: 'fab fa-docker' },
    { name: 'MLflow',            icon: 'fas fa-flask' },
    { name: 'PySpark',           icon: 'fas fa-bolt' },
    { name: 'Google Cloud Run',  icon: 'fab fa-google' },
    { name: 'Airflow',           icon: 'fas fa-wind' },
    { name: 'CI/CD',             icon: 'fas fa-infinity' },
    { name: 'DVC',               icon: 'fas fa-code-branch' },
];

const row2 = [
    { name: 'LLMs',                    icon: 'fas fa-robot' },
    { name: 'RAG',                     icon: 'fas fa-magnifying-glass' },
    { name: 'Reinforcement Learning',  icon: 'fas fa-gamepad' },
    { name: 'Computer Vision',         icon: 'fas fa-eye' },
    { name: 'Time Series',             icon: 'fas fa-chart-line' },
    { name: 'Deep Learning',           icon: 'fas fa-network-wired' },
    { name: 'Optuna',                  icon: 'fas fa-sliders' },
    { name: 'Tableau',                 icon: 'fas fa-chart-bar' },
    { name: 'Power BI',                icon: 'fas fa-chart-pie' },
    { name: 'R',                       icon: 'fab fa-r-project' },
    { name: 'Matplotlib',              icon: 'fas fa-palette' },
    { name: 'PBPK Modelling',          icon: 'fas fa-microscope' },
];

function buildTrack(trackId, skills) {
    const track = document.getElementById(trackId);
    if (!track) return;
    // Duplicate items to create a seamless infinite loop
    const items = [...skills, ...skills];
    items.forEach(({ name, icon }) => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.innerHTML = `<i class="${icon}" aria-hidden="true"></i>${name}`;
        track.appendChild(span);
    });
}

buildTrack('track1', row1);
buildTrack('track2', row2);

/* ═══════════════════════════════════════════════════════════
   TIMELINE — line draw + card scroll-in + read more
═══════════════════════════════════════════════════════════ */
const timelineLine  = document.getElementById('timelineLine');
const expSection    = document.getElementById('experience');
const timelineItems = document.querySelectorAll('.timeline-item');

// Draw the timeline line progressively as the user scrolls through the section
function drawTimelineLine() {
    if (!timelineLine || !expSection) return;
    const rect     = expSection.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
        (window.innerHeight - rect.top) / (expSection.offsetHeight + window.innerHeight * 0.4)
    ));
    timelineLine.style.height = (progress * 100) + '%';
}

window.addEventListener('scroll', drawTimelineLine, { passive: true });
drawTimelineLine();

// Fade-in + slide-up each card as it enters the viewport
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, { rootMargin: '-60px 0px' });

timelineItems.forEach(item => cardObserver.observe(item));

// Read More / Show Less toggle
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const bullets = btn.previousElementSibling; // .tcard-bullets
        const isOpen  = btn.classList.contains('open');

        if (isOpen) {
            bullets.style.maxHeight = '0';
            btn.classList.remove('open');
            btn.innerHTML = 'Read more <i class="fas fa-chevron-down"></i>';
            btn.setAttribute('aria-expanded', 'false');
        } else {
            bullets.style.maxHeight = bullets.scrollHeight + 'px';
            btn.classList.add('open');
            btn.innerHTML = 'Show less <i class="fas fa-chevron-up"></i>';
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

/* ═══════════════════════════════════════════════════════════
   VANILLA TILT — 3D effect on project cards
═══════════════════════════════════════════════════════════ */
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max:        10,
        speed:      400,
        glare:      true,
        'max-glare': 0.10,
        scale:      1.03,
    });
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR — hide on scroll down, show on scroll up
═══════════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const currentY = window.scrollY;

    // Shadow
    navbar.style.boxShadow = currentY > 24 ? '0 4px 24px rgba(0,0,0,0.25)' : 'none';

    // Hide/show (only after scrolling past 80px)
    if (currentY > lastScrollY && currentY > 80) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    lastScrollY = currentY;
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL — fade + slide up on enter
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        } else {
            entry.target.classList.remove('revealed');
        }
    });
}, {
    rootMargin: '-60px 0px',
    threshold: 0.1,
});

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   SCROLL SPY — highlight active nav link
═══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, {
    rootMargin: '-45% 0px -50% 0px',
});

sections.forEach(section => spyObserver.observe(section));

/* ═══════════════════════════════════════════════════════════
   CURSOR GLOW — soft ambient light following the mouse
═══════════════════════════════════════════════════════════ */
const cursorGlow = document.getElementById('cursor-glow');
let glowActive = false;

document.addEventListener('mousemove', (e) => {
    html.style.setProperty('--cursor-x', e.clientX + 'px');
    html.style.setProperty('--cursor-y', e.clientY + 'px');
    if (!glowActive) {
        cursorGlow.style.opacity = '1';
        glowActive = true;
    }
}, { passive: true });

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    glowActive = false;
});
