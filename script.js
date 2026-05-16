/* ========================================
   FALODI MAKEOVER & BEAUTY ACADEMY
   Premium JavaScript – Interactions & Animations
======================================== */

// ── SCROLL PROGRESS BAR ──
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = percent + '%';
});

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const heroSection = document.getElementById('home');

function updateNavbar() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);

  // Hero-transparent mode
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  navbar.classList.toggle('hero-visible', heroBottom > 80 && !scrolled);
}

window.addEventListener('scroll', updateNavbar);
updateNavbar();

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translateY(7px)' : '';
  spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translateY(-7px)' : '';
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

// ── HERO SLIDESHOW ──
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);

// ── PARTICLES ──
const particleContainer = document.getElementById('particles');
const particleCount = 28;

for (let i = 0; i < particleCount; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${Math.random() * 100}%;
    animation-duration: ${Math.random() * 12 + 8}s;
    animation-delay: ${Math.random() * 10}s;
    opacity: ${Math.random() * 0.3 + 0.1};
  `;
  particleContainer.appendChild(p);
}

// ── REVEAL ANIMATIONS (Intersection Observer) ──
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ── ANIMATED COUNTERS ──
const counters = document.querySelectorAll('.sc-num');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current = Math.min(current + step, target);
          counter.textContent = Math.floor(current);
          if (current < target) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

// ── GALLERY LIGHTBOX ──
const galleryItems = document.querySelectorAll('.gm-item');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let currentLbIndex = 0;
let galleryImages = [];

galleryItems.forEach((item, i) => {
  const img = item.querySelector('img');
  const caption = item.querySelector('.gm-overlay span')?.textContent || '';
  galleryImages.push({ src: img.src, caption });

  item.addEventListener('click', () => {
    currentLbIndex = i;
    openLightbox(i);
  });
});

function openLightbox(index) {
  lbImg.src = galleryImages[index].src;
  lbCaption.textContent = galleryImages[index].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => {
  currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentLbIndex);
});

lbNext.addEventListener('click', () => {
  currentLbIndex = (currentLbIndex + 1) % galleryImages.length;
  openLightbox(currentLbIndex);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbPrev.click();
  if (e.key === 'ArrowRight') lbNext.click();
});

// ── GALLERY FILTERS ──
const filterBtns = document.querySelectorAll('.gf-btn');
const galleryGrid = document.getElementById('galleryGrid');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        item.style.display = 'block';
        item.style.opacity = '0';
        setTimeout(() => { item.style.opacity = '1'; }, 10);
      } else {
        item.style.display = 'none';
      }
    });
    // Update lightbox images
    galleryImages = [];
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gm-overlay span')?.textContent || '';
        galleryImages.push({ src: img.src, caption });
      }
    });
  });
});

// ── TESTIMONIALS SLIDER ──
const tsTrack = document.getElementById('tsTrack');
const tsCards = tsTrack.querySelectorAll('.ts-card');
const tsDots = document.getElementById('tsDots');
let tsCurrentIndex = 0;
let tsItemsVisible = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 1 : 3;
let tsAutoInterval;

// Create dots
const totalDots = Math.ceil(tsCards.length / tsItemsVisible);
for (let i = 0; i < totalDots; i++) {
  const dot = document.createElement('button');
  dot.className = 'ts-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToTs(i));
  tsDots.appendChild(dot);
}

function goToTs(index) {
  tsCurrentIndex = Math.max(0, Math.min(index, totalDots - 1));
  const cardWidth = tsCards[0].offsetWidth + 28;
  tsTrack.style.transform = `translateX(-${tsCurrentIndex * cardWidth * tsItemsVisible}px)`;
  tsDots.querySelectorAll('.ts-dot').forEach((d, i) => {
    d.classList.toggle('active', i === tsCurrentIndex);
  });
}

function startTsAuto() {
  tsAutoInterval = setInterval(() => {
    tsCurrentIndex = (tsCurrentIndex + 1) % totalDots;
    goToTs(tsCurrentIndex);
  }, 5000);
}

function stopTsAuto() { clearInterval(tsAutoInterval); }

startTsAuto();
tsTrack.addEventListener('mouseenter', stopTsAuto);
tsTrack.addEventListener('mouseleave', startTsAuto);

// Touch support for slider
let tsStartX = 0;
tsTrack.addEventListener('touchstart', e => { tsStartX = e.touches[0].clientX; });
tsTrack.addEventListener('touchend', e => {
  const diff = tsStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goToTs(Math.min(tsCurrentIndex + 1, totalDots - 1));
    else goToTs(Math.max(tsCurrentIndex - 1, 0));
  }
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Open clicked (unless it was already open)
    if (!isOpen) item.classList.add('open');
  });
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    let name = '';
    let phone = '';
    let service = '';

    inputs.forEach((inp, i) => {
      if (i === 0) name = inp.value;
      if (i === 1) phone = inp.value;
      if (i === 2) service = inp.value;
    });

    const msg = `Hello! I'd like to book an appointment.%0A%0AName: ${name}%0APhone: ${phone}%0AService: ${service}`;
    window.open(`https://wa.me/919982011999?text=${msg}`, '_blank');

    // Success feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Redirecting to WhatsApp...';
    btn.style.background = '#25D366';
    setTimeout(() => {
      btn.textContent = 'Send Inquiry →';
      btn.style.background = '';
    }, 3000);
  });
}

// ── SMOOTH SCROLL (for older browsers) ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── IMAGE TRANSITION (gm-item opacity) ──
document.querySelectorAll('.gm-item').forEach(item => {
  item.style.transition = 'opacity 0.4s ease';
});

// ── RESIZE HANDLER ──
window.addEventListener('resize', () => {
  const prev = tsItemsVisible;
  tsItemsVisible = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 1 : 3;
  if (prev !== tsItemsVisible) {
    tsCurrentIndex = 0;
    goToTs(0);
  }
});

// ── CONSOLE BRAND ──
console.log(
  '%c✨ Falodi Makeover & Beauty Academy ✨\n%cKota\'s Premier Luxury Beauty Destination',
  'color: #C9A84C; font-size: 18px; font-weight: bold; font-family: Georgia, serif;',
  'color: #8B6E5A; font-size: 12px;'
);
