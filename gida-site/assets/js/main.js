document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* Scroll reveal */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Animated counters */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    const format = (val, suffix) => Math.round(val).toLocaleString() + suffix;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased, suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animate(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = parseFloat(el.dataset.count).toLocaleString() + (el.dataset.suffix || ''); });
  }

  /* Header background on scroll */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 1px 0 rgba(20,36,32,.08)' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
