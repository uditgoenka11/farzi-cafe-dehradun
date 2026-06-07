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

  // ---------- Reservation form (no backend; opens mailto draft) ----------
  const form = document.querySelector('form.reservation');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const guests = data.get('guests') || '';
      const date = data.get('date') || '';
      const time = data.get('time') || '';
      const notes = data.get('notes') || '';
      const subject = encodeURIComponent('Reservation Request — ' + name);
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Guests: ' + guests + '\n' +
        'Date: ' + date + '\n' +
        'Time: ' + time + '\n\n' +
        'Notes: ' + notes
      );
      window.location.href = 'mailto:reservations.dehradun@farzicafe.com?subject=' + subject + '&body=' + body;
    });
  }
})();
