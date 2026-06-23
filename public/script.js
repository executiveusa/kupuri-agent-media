/* VozViva — script.js
   Mobile nav + GSAP animations + video lazy-load
   ------------------------------------------------
   DEMO VIDEOS: Add generated video URLs to the DEMO_VIDEOS object below.
   Run: npx agent-media-cli video create ... to generate with the CLI.
*/

// ---- VIDEO CONFIGURATION ----
// Replace these with real URLs from agent-media once generated.
// Leave empty string ("") to show the CSS placeholder instead.
const DEMO_VIDEOS = {
  hero:       "",   // Hero phone — e.g. a general VozViva intro video
  spa:        "",   // Demo 1: Spa promotion in Spanish
  restaurant: "",   // Demo 2: Restaurant menu in Spanish
  realestate: "",   // Demo 3: Real estate walkthrough in Spanish
};

(function () {
  'use strict';

  /* ---- Inject video sources ---- */
  document.querySelectorAll('[data-demo]').forEach(function (el) {
    var key = el.getAttribute('data-demo');
    var src = DEMO_VIDEOS[key];
    if (src) {
      el.src = src;
      el.classList.add('has-src');
      // Hide the sibling placeholder
      var placeholder = el.nextElementSibling;
      if (placeholder && placeholder.classList.contains('phone-placeholder') ||
          placeholder && placeholder.classList.contains('demo-placeholder')) {
        placeholder.style.display = 'none';
      }
      // Lazy load — pause until in viewport
      el.pause();
    }
  });

  /* ---- Intersection observer for video autoplay ---- */
  if ('IntersectionObserver' in window) {
    var videoObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(function () {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('video.has-src').forEach(function (vid) {
      videoObs.observe(vid);
    });
  }

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.hidden = isOpen;
    });

    mobileNav.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      }
    });
  }

  /* ---- Smooth demo video hover play ---- */
  document.querySelectorAll('.demo-phone').forEach(function (phone) {
    var vid = phone.querySelector('video');
    if (!vid || !vid.src) return;
    phone.addEventListener('mouseenter', function () { vid.play().catch(function(){}); });
    phone.addEventListener('mouseleave', function () { vid.pause(); vid.currentTime = 0; });
  });

  /* ---- GSAP ---- */
  if (typeof gsap === 'undefined') return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-headline',  { y: 28, opacity: 0, duration: 0.6 }, 0.1)
    .from('.hero-sub',       { y: 20, opacity: 0, duration: 0.5 }, 0.25)
    .from('.hero-actions',   { y: 16, opacity: 0, duration: 0.45}, 0.38)
    .from('.hero-note',      { y: 12, opacity: 0, duration: 0.4 }, 0.48)
    .from('.phone-frame',    { y: 32, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.15)
    .from('.hero-platform-labels', { opacity: 0, duration: 0.4 }, 0.7);

  /* Phone subtle float */
  gsap.to('.phone-frame', {
    y: -10,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 0.8,
  });

  /* Quality bar */
  gsap.from('.quality-item', {
    opacity: 0,
    y: 12,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.quality-bar', start: 'top 90%', once: true },
  });

  /* Demo cards */
  gsap.from('.demo-card', {
    opacity: 0,
    y: 28,
    stagger: 0.14,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.demos-grid', start: 'top 82%', once: true },
  });

  /* Steps */
  gsap.from('.step', {
    opacity: 0,
    y: 24,
    stagger: 0.18,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.steps-track', start: 'top 80%', once: true },
  });

  /* For-grid items */
  gsap.from('.for-item', {
    opacity: 0,
    y: 14,
    stagger: 0.04,
    duration: 0.45,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.for-grid', start: 'top 82%', once: true },
  });

  /* Pricing cards */
  gsap.from('.plan-card', {
    opacity: 0,
    y: 28,
    stagger: 0.13,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 82%', once: true },
  });

  /* FAQ items */
  gsap.from('.faq-item', {
    opacity: 0,
    y: 14,
    stagger: 0.07,
    duration: 0.45,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.faq-list', start: 'top 85%', once: true },
  });

  /* Section headings */
  document.querySelectorAll('.section-heading').forEach(function (el) {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* CTA section */
  gsap.from('.cta-heading', {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-section', start: 'top 82%', once: true },
  });
  gsap.from('.cta-actions .btn', {
    opacity: 0,
    y: 14,
    stagger: 0.1,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-actions', start: 'top 85%', once: true },
  });

  /* Primary CTA magnetic hover — desktop only */
  if (window.innerWidth >= 900) {
    document.querySelectorAll('.btn-primary, .btn-cta').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
        var dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
        gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

})();
