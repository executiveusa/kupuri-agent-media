/* VozViva™ — GSAP animations + mobile nav */

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.hidden = isOpen;
    });

    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  /* ---------- GSAP ---------- */
  if (typeof gsap === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge',         { y: 16, opacity: 0, duration: 0.55 })
    .from('.hero-headline',      { y: 24, opacity: 0, duration: 0.65 }, '-=0.3')
    .from('.hero-subheadline',   { y: 18, opacity: 0, duration: 0.55 }, '-=0.4')
    .from('.hero-actions',       { y: 16, opacity: 0, duration: 0.5  }, '-=0.35')
    .from('.hero-trust',         { y: 12, opacity: 0, duration: 0.4  }, '-=0.3')
    .from('.command-card',       { y: 28, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .from('.phone-mockup',       { x: 20, opacity: 0, duration: 0.55 }, '-=0.4');

  /* Floating phone subtle bob */
  gsap.to('.phone-mockup', {
    y: -8,
    duration: 2.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 1,
  });

  /* Section reveal — reusable helper */
  function revealSection(selector, options = {}) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.from(els, {
      y: options.y ?? 30,
      opacity: 0,
      duration: options.duration ?? 0.6,
      stagger: options.stagger ?? 0.12,
      ease: options.ease ?? 'power2.out',
      scrollTrigger: {
        trigger: options.trigger ?? els[0].closest('section') ?? els[0],
        start: options.start ?? 'top 82%',
        once: true,
      },
    });
  }

  revealSection('.problem-item',   { stagger: 0.1 });
  revealSection('.step-card',      { stagger: 0.15 });
  revealSection('.example-card',   { stagger: 0.08, y: 20 });
  revealSection('.feature-item',   { stagger: 0.06, y: 18 });
  revealSection('.pricing-card',   { stagger: 0.14, y: 24 });
  revealSection('.suite-card',     { stagger: 0.12 });
  revealSection('.faq-item',       { stagger: 0.07, y: 14 });
  revealSection('.final-cta-heading', { stagger: 0, y: 20, duration: 0.7 });
  revealSection('.final-cta-actions', { stagger: 0.1, y: 14, duration: 0.55 });

  /* Section headings */
  document.querySelectorAll('.section-heading').forEach(el => {
    gsap.from(el, {
      y: 20,
      opacity: 0,
      duration: 0.65,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  /* CTA magnetic hover — desktop only */
  if (window.innerWidth >= 768) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

})();
