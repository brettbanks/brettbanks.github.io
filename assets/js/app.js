/* ===========================
   Brett Banks — Site Interactions
   Minimal, accessible, dependency-free
   =========================== */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

/* Sticky header */
const header = document.querySelector('.header');
const onScrollShadow = () => {
  if (window.scrollY > 8) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
};
document.addEventListener('scroll', onScrollShadow);
onScrollShadow();

/* Mobile nav */
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
  navList.querySelectorAll('a.nav__link').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) closeMenu();
  });
}

/* Scrollspy */
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav__link')];
const setActiveLink = () => {
  const fromTop = window.scrollY + 90;
  let current = sections[0]?.id || '';
  for (const sec of sections) if (sec.offsetTop <= fromTop) current = sec.id;
  navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`));
};
document.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

/* Reveal */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* Counters */
const counters = document.querySelectorAll('.count');
if (counters.length) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      const duration = REDUCED ? 0 : 1000;
      const start = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        const eased = p < 0.5 ? 2*p*p : -1 + (4 - 2*p)*p;
        el.textContent = String(Math.round(target * eased));
        if (p < 1 && duration) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => co.observe(c));
}

/* Gentle hero badge parallax */
const heroImg = document.querySelector('.hero__badge-img');
let ticking = false;
document.addEventListener('scroll', () => {
  if (REDUCED || !heroImg) return;
  if (!ticking) {
    requestAnimationFrame(() => {
      const offset = Math.min(16, window.scrollY * 0.04);
      heroImg.style.transform = `translateY(${offset}px)`;
      ticking = false;
    });
    ticking = true;
  }
});

/* ---------- FORCE BACKGROUNDS FROM DATA ATTRS ---------- */
window.addEventListener('DOMContentLoaded', () => {
  // Hero background
  const hero = document.querySelector('.hero--image');
  const heroSrc = hero?.getAttribute('data-hero');
  if (hero && heroSrc) hero.style.backgroundImage = `url('${heroSrc}')`;

  // Project banners
  document.querySelectorAll('.card__banner').forEach(b => {
    const src = b.getAttribute('data-banner');
    if (src) b.style.backgroundImage = `url('${src}')`;
  });
});
