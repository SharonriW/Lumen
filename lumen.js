/* ============================================================
   LUMEN — Global Interactions
   Custom cursor · Scroll reveal · Progress bar · Nav · FAQ
   ============================================================ */

/* ── Language toggle (global, runs before DOM ready) ─────── */
window.toggleLang = function () {
  const isZh = document.body.classList.toggle('lang-zh');
  document.querySelectorAll('.lang-toggle').forEach(b => {
    b.textContent = isZh ? 'EN' : '中文';
  });
  localStorage.setItem('lumen-lang', isZh ? 'zh' : 'en');
};
// Restore saved language immediately to avoid flash
(function () {
  if (localStorage.getItem('lumen-lang') === 'zh') {
    document.documentElement.classList.add('lang-zh-pending');
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── Restore language preference ──────────────────────── */
  if (localStorage.getItem('lumen-lang') === 'zh') {
    document.body.classList.add('lang-zh');
    document.documentElement.classList.remove('lang-zh-pending');
    document.querySelectorAll('.lang-toggle').forEach(b => b.textContent = 'EN');
  }

  /* ── Custom cursor ──────────────────────────────────────── */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  const interactables = 'a, button, .pillar, .value-card, .timeline-step, .faq-question, input, textarea, select';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ── Scroll progress bar ─────────────────────────────────── */
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  /* ── Nav hide / show on scroll ───────────────────────────── */
  const nav = document.querySelector('.nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    // Progress
    const pct = (y / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
    // Nav hide
    if (y > 120) {
      nav.classList.toggle('nav--hidden', y > lastY);
    } else {
      nav.classList.remove('nav--hidden');
    }
    lastY = y;
  }, { passive: true });

  /* ── Scroll reveal (IntersectionObserver) ────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── FAQ smooth accordion ────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── Marquee duplicate content ───────────────────────────── */
  document.querySelectorAll('.marquee-inner').forEach(el => {
    el.innerHTML += el.innerHTML; // seamless loop
  });

  /* ── Stagger children of [data-stagger] groups ───────────── */
  document.querySelectorAll('[data-stagger]').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = (i * 0.12) + 's';
    });
  });

  /* ── Subtle parallax on hero bg ──────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }

});
