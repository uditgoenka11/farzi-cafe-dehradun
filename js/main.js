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
  let lbPreviousFocus = null; // saved focus target for restore on close

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
    // ARIA: mark as a modal dialog
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image lightbox');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Save the element that had focus so we can restore it on close
    lbPreviousFocus = document.activeElement;
    // Move focus to the close button
    const closeBtn = lb.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.removeAttribute('role');
    lb.removeAttribute('aria-modal');
    lb.removeAttribute('aria-label');
    if (lbImg) lbImg.innerHTML = '';
    document.body.style.overflow = '';
    // Restore focus to the element that triggered the lightbox
    if (lbPreviousFocus && typeof lbPreviousFocus.focus === 'function') {
      lbPreviousFocus.focus();
    }
    lbPreviousFocus = null;
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
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowRight') { openLightbox(lbIndex + 1); return; }
      if (e.key === 'ArrowLeft')  { openLightbox(lbIndex - 1); return; }
      // Tab trap: cycle focus through close / prev / next buttons only
      if (e.key === 'Tab') {
        const focusable = Array.from(
          lb.querySelectorAll('.lightbox-close, .lightbox-prev, .lightbox-next')
        ).filter(el => !el.disabled);
        if (!focusable.length) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      }
    });
  }

  // ---------- Active nav link ----------
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // ---------- Footer year ----------
  document.querySelectorAll('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });

  // ---------- Past events: dim row + remove Reserve button ----------
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  document.querySelectorAll('.event-row[data-event-iso]').forEach((row) => {
    const iso = row.getAttribute('data-event-iso');
    if (!iso) return;
    const d = new Date(iso + 'T23:59:59');
    if (d < today0) row.classList.add('past');
  });

  // ---------- Reservation form → WhatsApp ----------
  const WA_NUMBER = '917617771124';

  function buildWaUrl(text) {
    return 'https://api.whatsapp.com/send/?phone=' + WA_NUMBER +
           '&text=' + encodeURIComponent(text) +
           '&type=phone_number&app_absent=0';
  }

  // ---------- GA4 conversion event tracking ----------
  // Fires whenever the user clicks anything that's a conversion intent:
  // WhatsApp links, tel: links, the Reserve CTA, or the form submit.
  // Safe to call even if gtag is not loaded — guarded by typeof check.
  function trackConversion(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
    } catch (_) { /* no-op */ }
  }

  // Delegate one click listener for the whole document — covers buttons
  // injected later (e.g. mobile-cta-bar) without needing per-page wiring.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a, button');
    if (!a) return;
    const href = (a.getAttribute('href') || '').toLowerCase();
    const text = (a.textContent || '').trim().slice(0, 60);
    const ctx  = a.closest('section')?.id || a.closest('section')?.className?.split(' ')[0] || 'page';
    if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) {
      trackConversion('whatsapp_click', { link_text: text, location: ctx });
    } else if (href.startsWith('tel:')) {
      trackConversion('phone_call_click', { link_text: text, phone: href.replace('tel:', ''), location: ctx });
    } else if (href.includes('#reserve') || /reserve/i.test(text)) {
      trackConversion('reserve_cta_click', { link_text: text, location: ctx });
    } else if (href.includes('menu.html')) {
      trackConversion('view_menu_click', { link_text: text, location: ctx });
    } else if (/get directions|directions/i.test(text)) {
      trackConversion('directions_click', { link_text: text, location: ctx });
    }
  }, { passive: true });

  const form = document.querySelector('form.reservation');
  if (form) {
    // Constrain date input: today .. today + 30 days. Set on load AND on focus
    // so users who keep the page open overnight still see the right window.
    const dateInput = form.querySelector('#date');
    const pad = (n) => String(n).padStart(2, '0');
    const fmtYmd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const setDateBounds = () => {
      if (!dateInput) return;
      const today = new Date();
      const max = new Date();
      max.setDate(today.getDate() + 30);
      const todayYmd = fmtYmd(today);
      dateInput.min = todayYmd;
      dateInput.max = fmtYmd(max);
      if (!dateInput.value || dateInput.value < todayYmd) dateInput.value = todayYmd;
    };
    setDateBounds();
    // Make the whole field surface open the calendar where supported.
    if (dateInput && typeof dateInput.showPicker === 'function') {
      dateInput.addEventListener('click', () => { try { dateInput.showPicker(); } catch (_) {} });
    }
    if (dateInput) dateInput.addEventListener('focus', setDateBounds);

    const formatBookingDate = (ymd) => {
      if (!ymd) return '';
      const [y, m, d] = ymd.split('-').map(Number);
      if (!y || !m || !d) return ymd;
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
      });
    };
    const formatBookingTime = (hhmm) => {
      if (!hhmm) return '';
      const [h, m] = hhmm.split(':').map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${pad(m)} ${ampm}`;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const guests = (data.get('guests') || '').toString().trim();
      const rawDate = (data.get('date') || '').toString().trim();
      const rawTime = (data.get('time') || '').toString().trim();
      const notes = (data.get('notes') || '').toString().trim();

      // Validate required fields before opening WhatsApp
      const required = [
        { value: name,    field: form.querySelector('[name="name"]') },
        { value: phone,   field: form.querySelector('[name="phone"]') },
        { value: guests,  field: form.querySelector('[name="guests"]') },
        { value: rawDate, field: form.querySelector('[name="date"]') },
        { value: rawTime, field: form.querySelector('[name="time"]') },
      ];
      const firstEmpty = required.find(r => !r.value);
      if (firstEmpty) {
        // Mark invalid and focus
        required.forEach(r => {
          if (r.field) r.field.removeAttribute('aria-invalid');
        });
        if (firstEmpty.field) {
          firstEmpty.field.setAttribute('aria-invalid', 'true');
          firstEmpty.field.focus();
        }
        return; // abort — do NOT open WhatsApp
      }
      // Clear any prior aria-invalid marks
      required.forEach(r => { if (r.field) r.field.removeAttribute('aria-invalid'); });

      const date = formatBookingDate(rawDate);
      const time = formatBookingTime(rawTime);

      const msg =
        'Hi Farzi Café Dehradun! I would like to book a table.\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Guests: ' + guests + '\n' +
        'Date: ' + date + '\n' +
        'Time: ' + time +
        (notes ? '\nOccasion / Notes: ' + notes : '');

      trackConversion('reservation_form_submit', {
        guests: guests, date: date, time: time, has_notes: notes ? 1 : 0,
      });
      window.open(buildWaUrl(msg), '_blank', 'noopener,noreferrer');
    });
  }

  // ---------- Event enquiry form → WhatsApp ----------
  const eventForm = document.querySelector('form.event-enquiry');
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(eventForm);
      const evName    = (d.get('name')    || '').toString().trim();
      const evPhone   = (d.get('phone')   || '').toString().trim();
      const evGuests  = (d.get('guests')  || '').toString().trim();
      const evDate    = (d.get('date')    || '').toString().trim();

      // Validate required fields before opening WhatsApp
      const evRequired = [
        { value: evName,   field: eventForm.querySelector('[name="name"]') },
        { value: evPhone,  field: eventForm.querySelector('[name="phone"]') },
        { value: evGuests, field: eventForm.querySelector('[name="guests"]') },
        { value: evDate,   field: eventForm.querySelector('[name="date"]') },
      ];
      const evFirstEmpty = evRequired.find(r => !r.value);
      if (evFirstEmpty) {
        evRequired.forEach(r => { if (r.field) r.field.removeAttribute('aria-invalid'); });
        if (evFirstEmpty.field) {
          evFirstEmpty.field.setAttribute('aria-invalid', 'true');
          evFirstEmpty.field.focus();
        }
        return; // abort — do NOT open WhatsApp
      }
      evRequired.forEach(r => { if (r.field) r.field.removeAttribute('aria-invalid'); });

      const msg =
        'Hi Farzi Café Dehradun! I would like to host an event with you.\n\n' +
        'Name: ' + evName + '\n' +
        'Phone: ' + evPhone + '\n' +
        'Occasion: ' + (d.get('occasion') || '') + '\n' +
        'Guests: ' + evGuests + '\n' +
        'Date: ' + evDate + '\n' +
        'Notes: ' + (d.get('notes') || '');
      window.open(buildWaUrl(msg), '_blank', 'noopener,noreferrer');
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

    // F-monogram flight: clone the static gold F, start it at screen center
    // at the same size the intro video filled, then transition to the nav
    // brand's exact bounding box. Real nav brand is hidden during transit
    // and revealed when the clone lands.
    const flyMonogramToNav = (onLanded) => {
      const navBrand = document.querySelector('.site-header .brand img');
      const introVideo = preloader.querySelector('.preloader-video');
      if (!navBrand || !introVideo) { onLanded(); return; }

      const targetRect = navBrand.getBoundingClientRect();
      const startRect  = introVideo.getBoundingClientRect();
      if (!targetRect.width || !startRect.width) { onLanded(); return; }

      const fly = document.createElement('img');
      fly.className = 'brand-fly';
      fly.src = navBrand.getAttribute('src');
      fly.alt = '';
      fly.setAttribute('aria-hidden', 'true');
      // Start the clone sized + positioned to match how it lived in the
      // intro video. If the nav brand is the F monogram (square), launch
      // from the wordmark's crest. If it's the wordmark itself (~2:1),
      // launch at almost the full wordmark size so there's no jarring jump
      // when the video element fades out.
      const videoSize = Math.min(startRect.width, startRect.height);
      const navAspect = (navBrand.naturalWidth || 1) / (navBrand.naturalHeight || 1);
      const isWordmark = navAspect > 1.5;
      const startWidth = isWordmark
        ? videoSize * 0.92
        : Math.min(220, videoSize * 0.36) * navAspect;
      const startHeight = startWidth / navAspect;
      const startLeft   = startRect.left + (startRect.width  - startWidth)  / 2;
      const startTop    = isWordmark
        ? startRect.top + (startRect.height - startHeight) / 2
        : startRect.top + videoSize * 0.30 - startHeight / 2;
      fly.style.left   = startLeft   + 'px';
      fly.style.top    = startTop    + 'px';
      fly.style.width  = startWidth  + 'px';
      fly.style.height = startHeight + 'px';
      document.body.appendChild(fly);

      // Hide the real nav brand while the clone is in transit
      navBrand.style.visibility = 'hidden';
      // Begin fading out the video + preloader background simultaneously
      preloader.classList.add('preloader--exiting');

      // Next frame: transition to the nav brand's exact position + size
      requestAnimationFrame(() => {
        fly.style.left   = targetRect.left   + 'px';
        fly.style.top    = targetRect.top    + 'px';
        fly.style.width  = targetRect.width  + 'px';
        fly.style.height = targetRect.height + 'px';
      });

      let landed = false;
      const land = () => {
        if (landed) return;
        landed = true;
        navBrand.style.visibility = '';
        fly.remove();
        onLanded();
      };
      fly.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'top' || e.propertyName === 'left') land();
      });
      // Safety net for landing
      setTimeout(land, 900);
    };

    if (preloaderSeen) {
      // Suppress video fetch on repeat visits — saves ~80KB every page load.
      const introVideoEl = preloader.querySelector('.preloader-video');
      if (introVideoEl) introVideoEl.preload = 'none';
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

        // When the intro + hero are both ready: launch the F flight, then dismiss.
        // Skip the flight if the safety net already dismissed us.
        Promise.all([introDone, heroReady]).then(() => {
          if (preloader.classList.contains('done')) return;
          flyMonogramToNav(dismiss);
        });

        // Safety net: never block longer than 1.3s — straight dismiss, no flight
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
    window.open(buildWaUrl(text || 'Hi Farzi Café Dehradun!'), '_blank', 'noopener,noreferrer');
  };
})();
