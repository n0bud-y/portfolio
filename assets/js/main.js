(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.querySelector('.site-loader');
  const nav = document.querySelector('.site-nav');

  if (loader && !reducedMotion && !sessionStorage.getItem('ayan-loader-seen')) {
    sessionStorage.setItem('ayan-loader-seen', 'true');
    window.setTimeout(() => {
      loader.style.transition = 'opacity .45s ease';
      loader.style.opacity = '0';
      window.setTimeout(() => loader.remove(), 500);
    }, 650);
  } else if (loader) {
    loader.remove();
  }

  const updateNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  if (reducedMotion || typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero .eyebrow, .hero h1, .hero-copy, .hero .btn-main, .hero .btn-quiet', {
    opacity: 0, y: 24, duration: .7, stagger: .08, ease: 'power2.out', delay: .15
  });

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.to(element, {
        opacity: 1, y: 0, duration: .75, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      });
    });
  } else {
    document.querySelectorAll('.reveal').forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('#mainNav');
      if (menu && menu.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
}());
