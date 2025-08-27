/* ===========================
   Brett Banks — Site Interactions
   Minimal, accessible, dependency-free
   =========================== */

// Respect user motion preference
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Smooth in-page anchor scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    // Move focus for a11y
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

/* ---------- Sticky header shadow ---------- */
const header = document.querySelector('.header');
const onScrollShadow = () => {
  if (window.scrollY > 8) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
};
document.addEventListener('scroll', onScrollShadow);
onScrollShadow();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.querySelector('.nav__toggle');
const navList = document.getElementById('site-nav');

if (navToggle && navList) {
  const closeMenu = () => {
    navList.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    navToggle.focus();
  };
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', open);
  });
  // Close on link click or Escape
  navList.querySelectorAll('a.nav__link').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) closeMenu();
  });
}

/* ---------- Scrollspy (active nav link) ---------- */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav__link')];
const setActiveLink = () => {
  const fromTop = window.scrollY + 90;
  let current = sections[0]?.id || '';
  for (const sec of sections) {
    if (sec.offsetTop <= fromTop) current = sec.id;
  }
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('is-active', active);
  });
};
document.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll('.count');
if (counters.length) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      if (!Number.isFinite(target)) return;
      const duration = REDUCED ? 0 : 1000; // ms
      const start = performance.now();
      const startVal = 0;

      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        // easeInOutQuad
        const eased = p < 0.5 ? 2*p*p : -1 + (4 - 2*p)*p;
        const val = Math.round(startVal + (target - startVal) * eased);
        el.textContent = String(val);
        if (p < 1 && duration) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => co.observe(c));
}

/* ---------- Gentle hero image parallax ---------- */
const heroImg = document.querySelector('.hero__badge-img');
let ticking = false;
const parallax = () => {
  if (REDUCED || !heroImg) return;
  const y = window.scrollY;
  const offset = Math.min(16, y * 0.04); // max 16px
  heroImg.style.transform = `translateY(${offset}px)`;
};
document.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { parallax(); ticking = false; });
    ticking = true;
  }
});

/* ---------- Preload heavy background for smoother hero ---------- */
(() => {
  const hero = document.querySelector('.hero--image');
  if (!hero) return;
  const url = getComputedStyle(hero).backgroundImage
    .replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  if (!url || url === 'none') return;
  const img = new Image();
  img.src = url;
  // Add a class when ready to fade in—CSS can use .hero--image.ready if desired
  img.onload = () => hero.classList.add('ready');
})();
