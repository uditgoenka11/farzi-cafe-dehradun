/* Farzi Café Dehradun — UI scripts (nav, lightbox, filter, reveal) */

(function () {
  'use strict';

  // ---------- Nav: scrolled state + mobile toggle ----------
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('in'));
  }

  // ---------- Gallery filter ----------
  const filterBtns = document.querySelectorAll('.gallery-filter button');
  const items = document.querySelectorAll('.gallery-grid .gallery-item');
  if (filterBtns.length && items.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        items.forEach(it => {
          const show = cat === 'all' || it.dataset.cat === cat;
          it.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ---------- Gallery keyboard activation (Enter/Space) ----------
  document.querySelectorAll('.gallery-item[role="button"]').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  // ---------- Lightbox ----------
  const lb = document.querySelector('.lightbox');
  const lbImg = lb ? lb.querySelector('.lightbox-media') : null;
  let lbItems = [];
  let lbIndex = 0;

  function openLightbox(idx) {
    if (!lb || !lbItems.length) return;
    lbIndex = (idx + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    const src = item.dataset.full || item.querySelector('img').src;
    const isVideo = item.dataset.type === 'video';
    if (lbImg) {
      lbImg.innerHTML = isVideo
        ? '<video src="' + src + '" controls autoplay playsinline></video>'
        : '<img src="' + src + '" alt="' + (item.querySelector('img')?.alt || '') + '" />';
    }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    if (lbImg) lbImg.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (lb) {
    lbItems = Array.from(document.querySelectorAll('[data-lightbox]'));
    lbItems.forEach((el, i) => {
      el.addEventListener('click', (ev) => { ev.preventDefault(); openLightbox(i); });
    });
    lb.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-prev')?.addEventListener('click', () => openLightbox(lbIndex - 1));
    lb.querySelector('.lightbox-next')?.addEventListener('click', () => openLightbox(lbIndex + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
      if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    });
  }

  // ---------- Active nav link ----------
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
    if (path === '' && href === 'index.html') a.classList.add('active');
  });

  // ---------- Footer year ----------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Reservation form → WhatsApp ----------
  const WA_NUMBER = '917617771124';

  function buildWaUrl(text) {
    return 'https://api.whatsapp.com/send/?phone=' + WA_NUMBER +
           '&text=' + encodeURIComponent(text) +
           '&type=phone_number&app_absent=0';
  }

  const form = document.querySelector('form.reservation');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const guests = (data.get('guests') || '').toString().trim();
      const date = (data.get('date') || '').toString().trim();
      const time = (data.get('time') || '').toString().trim();
      const notes = (data.get('notes') || '').toString().trim();

      const msg =
        'Hi Farzi Café Dehradun! I would like to book a table.\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Guests: ' + guests + '\n' +
        'Date: ' + date + '\n' +
        'Time: ' + time +
        (notes ? '\nOccasion / Notes: ' + notes : '');

      window.open(buildWaUrl(msg), '_blank');
    });
  }

  // ---------- Event enquiry form → WhatsApp ----------
  const eventForm = document.querySelector('form.event-enquiry');
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(eventForm);
      const msg =
        'Hi Farzi Café Dehradun! I would like to host an event with you.\n\n' +
        'Name: ' + (d.get('name') || '') + '\n' +
        'Phone: ' + (d.get('phone') || '') + '\n' +
        'Occasion: ' + (d.get('occasion') || '') + '\n' +
        'Guests: ' + (d.get('guests') || '') + '\n' +
        'Date: ' + (d.get('date') || '') + '\n' +
        'Notes: ' + (d.get('notes') || '');
      window.open(buildWaUrl(msg), '_blank');
    });
  }

  // ---------- FAB + sticky bar: reveal after past-hero scroll ----------
  const fab = document.querySelector('.fab-whatsapp');
  const bar = document.querySelector('.mobile-cta-bar');
  function onScrollReveal() {
    const past = window.scrollY > Math.max(120, window.innerHeight * 0.55);
    if (fab) fab.classList.toggle('in', past);
    if (bar) bar.classList.toggle('in', past);
  }
  window.addEventListener('scroll', onScrollReveal, { passive: true });
  onScrollReveal();

  // ---------- Reduced-motion preference ----------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Preloader dismiss ----------
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    let preloaderSeen = false;
    try {
      preloaderSeen = !!sessionStorage.getItem('farzi-preloader-seen');
    } catch (_) { /* private browsing */ }

    const markSeen = () => { try { sessionStorage.setItem('farzi-preloader-seen', '1'); } catch (_) {} };
    const dismiss = () => { preloader.classList.add('done'); markSeen(); };

    if (preloaderSeen) {
      preloader.classList.add('skip');
    } else if (prefersReducedMotion) {
      // Reduced motion: show static F monogram + bar, dismiss after load
      window.addEventListener('load', () => setTimeout(dismiss, 400));
    } else {
      // First-visit cinematic: hold preloader until BOTH the intro has played
      // AND the hero video has buffered enough to start, capped by a safety net.
      const introVideo = preloader.querySelector('.preloader-video');
      if (introVideo) {
        preloader.classList.add('preloader--intro');

        const introDone = new Promise((res) => {
          introVideo.addEventListener('ended', res, { once: true });
          introVideo.addEventListener('error', res, { once: true });
        });

        const heroVideo = document.querySelector('.hero video');
        const heroReady = heroVideo
          ? (heroVideo.readyState >= 3
              ? Promise.resolve()
              : new Promise((res) => {
                  heroVideo.addEventListener('canplay',   res, { once: true });
                  heroVideo.addEventListener('loadeddata', res, { once: true });
                  heroVideo.addEventListener('error',     res, { once: true });
                }))
          : Promise.resolve();

        Promise.all([introDone, heroReady]).then(dismiss);

        // Safety net: never block longer than 1.3s
        setTimeout(dismiss, 1300);

        const playP = introVideo.play();
        if (playP && typeof playP.catch === 'function') playP.catch(dismiss);
      } else {
        window.addEventListener('load', () => setTimeout(dismiss, 400));
      }
    }
  }

  // ---------- Hero parallax on scroll ----------
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    let raf = false;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroEl.style.setProperty('--parallax', (y * 0.35) + 'px');
        }
        raf = false;
      });
    }, { passive: true });
  }

  // ---------- Hero golden particles (CSS-only via inline) ----------
  const particles = document.getElementById('heroParticles');
  if (particles) {
    const count = 14;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      // Spread across viewport horizontally; vary delay + duration
      p.style.left = (Math.random() * 100) + '%';
      p.style.animationDuration = (12 + Math.random() * 10) + 's';
      p.style.animationDelay = (Math.random() * 12) + 's';
      const size = 2 + Math.random() * 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      frag.appendChild(p);
    }
    particles.appendChild(frag);
  }

  // ---------- Page transition curtain on nav clicks ----------
  const curtain = document.querySelector('.page-curtain');
  if (curtain) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      // Only intercept internal HTML page nav (skip hash, mailto, tel, wa.me, external)
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http') ||
        a.target === '_blank' ||
        a.hasAttribute('download')
      ) return;
      if (!href.endsWith('.html') && href !== '/') return;
      a.addEventListener('click', (e) => {
        // Bug fix 2: let modifier-clicks open new tabs / trigger browser defaults
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        // Bug fix 4: skip curtain animation when user prefers reduced motion
        if (prefersReducedMotion) {
          window.location.href = href;
          return;
        }
        curtain.classList.add('up');
        // Just long enough for the curtain to visibly start — with
        // prefetch/prerender below, the next page is usually already loaded
        setTimeout(() => { window.location.href = href; }, 90);
      });
    });

    // Bug fix 1: clear the curtain when page is restored from bfcache
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        curtain.classList.remove('up');
        // Also ensure preloader stays hidden on bfcache restores
        if (preloader) preloader.classList.add('skip');
      }
    });
  }

  // ---------- Instant navigation: prerender / prefetch internal pages ----------
  // Chromium: Speculation Rules prerender on hover. Others: <link rel=prefetch>.
  const isInternalPage = (a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http') ||
        a.target === '_blank' || a.hasAttribute('download')) return null;
    return (href.endsWith('.html') || href === '/') ? href : null;
  };
  if (window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    const rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
      prerender: [{ where: { selector_matches: 'a[href$=".html"]' }, eagerness: 'moderate' }]
    });
    document.head.appendChild(rules);
  } else {
    const prefetched = new Set();
    const prefetch = (a) => {
      const href = isInternalPage(a);
      if (!href || prefetched.has(href)) return;
      prefetched.add(href);
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = href;
      document.head.appendChild(l);
    };
    document.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('pointerenter', () => prefetch(a), { passive: true });
      a.addEventListener('touchstart', () => prefetch(a), { passive: true });
    });
  }

  // ---------- Expose WA helper for inline use ----------
  window.farziWa = function (text) {
    window.open(buildWaUrl(text || 'Hi Farzi Café Dehradun!'), '_blank');
  };
})();
