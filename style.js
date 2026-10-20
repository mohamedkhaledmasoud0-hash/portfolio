/* Version: 1.1.15 — Last update: 2026-10-16 */
/* ═══════════════════════════════════════════════════════════════
   Mohamed Khaled — Portfolio
   🛡️ Security-hardened — Trusted Types ready
   🔐 Contact data loaded from server API (never exposed in HTML)
   📦 CSS is now in style.css (separate file)
═══════════════════════════════════════════════════════════════ */

(function initApp() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     ⚙️ CONFIG
  ═══════════════════════════════════════════════════════════ */

  /* Certificate images for the marquee — real certs only */
  const CERT_GALLERY_IMAGES = [
    {
      src:   'images/ejpt.jpg',
      title: 'eJPT — Junior Penetration Tester',
      sub:   'INE Security · 2026'
    },
    {
      src:   'images/cs50.jpg',
      title: 'CS50 — Introduction to Computer Science',
      sub:   'Harvard / edX · Online Course'
    },
    {
      src:   'images/NTI.jpg',
      title: 'NTI — Penetration Testing & Application Security',
      sub:   'National Telecommunication Institute · 2026'
    }
  ];

  /* API endpoints (relative paths) */
  const API = {
    info:    './api/info.php',
    contact: './api/contact.php',
  };

  /* ═══════════════════════════════════════════════════════════
     🛡️ UTILITIES
  ═══════════════════════════════════════════════════════════ */
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (const k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    return node;
  }

  /* 🛡️ Safe URL validator */
  function safeUrl(url) {
    const s = String(url || '').trim();
    if (!s) return '';
    if (/^(javascript|vbscript|file|data):/i.test(s) && !/^data:image\//i.test(s)) {
      return '';
    }
    return s;
  }

  /* 🛡️ Basic email validator */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }

  function createZoomIcon() {
    const svg = svgEl('svg', {
      'viewBox': '0 0 24 24',
      'fill': 'none',
      'stroke': 'currentColor',
      'stroke-width': '2'
    });
    svg.appendChild(svgEl('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'd': 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6'
    }));
    return svg;
  }

  /* ═══════════════════════════════════════════════════════════
     📥 CONTENT LOADER
  ═══════════════════════════════════════════════════════════ */
  async function loadContent() {
    const root = document.getElementById('app-root');
    if (!root) return false;

    try {
      const res = await fetch('content.html', {
        credentials: 'same-origin',
        headers: { 'Accept': 'text/html' }
      });
      if (!res.ok) throw new Error('Failed to load content');

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const tpl = doc.getElementById('page-content');
      if (!tpl) throw new Error('Template not found');

      const fragment = document.importNode(tpl.content, true);
      root.appendChild(fragment);
      return true;
    } catch (err) {
      console.error('Content load failed:', err);
      root.textContent = 'Failed to load page content. Please refresh.';
      return false;
    }
  }

  /* ═══════════════════════════════════════════════════════════
     📞 CONTACT INFO LOADER (from API)
  ═══════════════════════════════════════════════════════════ */
  async function loadContactInfo() {
    try {
      const res = await fetch(API.info, {
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('API error ' + res.status);

      const data = await res.json();
      if (!data.success) throw new Error('API returned failure');

      /* Update WhatsApp */
      document.querySelectorAll('[data-contact="whatsapp"]').forEach(function (a) {
        a.href = 'https://wa.me/' + data.whatsapp;
      });

      /* Update LinkedIn */
      document.querySelectorAll('[data-contact="linkedin"]').forEach(function (a) {
        a.href = data.linkedin;
      });

      /* Update GitHub */
      document.querySelectorAll('[data-contact="github"]').forEach(function (a) {
        a.href = data.github;
      });

      /* Email — always scroll to form (never expose email) */
      document.querySelectorAll('[data-contact="email"]').forEach(function (a) {
        a.href = '#contactForm';
        a.setAttribute('data-scroll-to-form', '');
      });
    } catch (err) {
      console.warn('Contact info load failed:', err);
      /* Fallback: hide loading text */
      document.querySelectorAll('[data-loading]').forEach(function (el) {
        el.textContent = 'Contact via form →';
        el.removeAttribute('data-loading');
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     🎬 INIT
  ═══════════════════════════════════════════════════════════ */
  function initInteractions() {

    /* ---------- Year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Add reveal class dynamically ---------- */
    const revealTargets = document.querySelectorAll(
      '.hero-main, .terminal-card, .stat-card, .section-head, .about-bio, .about-photo, ' +
      '.skills-bars, .skills-side .card, .project-card, .cert-card, .contact-card, ' +
      '.contact-form-card, .cert-gallery-trigger'
    );
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    /* ---------- Email card → Scroll to form ---------- */
    document.querySelectorAll('[data-scroll-to-form]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        const form = document.getElementById('contactForm');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function () {
            const firstInput = form.querySelector('input[name="name"]');
            if (firstInput) firstInput.focus({ preventScroll: true });
          }, 600);
        }
      });
    });

    /* ---------- Mobile nav ---------- */
    const navToggle  = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    function closeMenu() {
      if (!mobileMenu || !navToggle) return;
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', function () {
        const isOpen = mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          const parent = e.target.parentElement;
          const siblings = parent ? Array.from(parent.children) : [];
          const idx = siblings.indexOf(e.target);
          e.target.style.transitionDelay = (Math.max(idx, 0) % 4) * 70 + 'ms';
          e.target.classList.add('in');
          ro.unobserve(e.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { ro.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- Animated skill bars ---------- */
    const bars = document.querySelectorAll('.bar-fill[data-width]');
    if ('IntersectionObserver' in window) {
      const bo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          const bar = e.target;
          bar.style.width = bar.dataset.width || '0%';
          bo.unobserve(bar);
        });
      }, { threshold: 0.35 });
      bars.forEach(function (b) { bo.observe(b); });
    } else {
      bars.forEach(function (b) { b.style.width = b.dataset.width || '0%'; });
    }

    /* ---------- Contact Form ---------- */
    const form       = document.getElementById('contactForm');
    const statusEl   = document.getElementById('formStatus');
    const submitBtn  = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');

    /* ✅ Time token: حدّد وقت تحميل الفورم */
    if (form) {
      const timeToken = form.querySelector('#formTimeToken');
      if (timeToken) {
        timeToken.value = String(Math.floor(Date.now() / 1000));
      }
    }

    function setStatus(msg, tone) {
      if (!statusEl) return;
      const tones = {
        info:    '#94a3b8',
        success: '#34d399',
        error:   '#f87171',
        warn:    '#fbbf24'
      };
      statusEl.style.color = tones[tone] || tones.info;
      statusEl.textContent = msg;
    }

    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        /* Honeypot check (client side — server rechecks) */
        const honeypot = form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value.trim() !== '') {
          setStatus('✓ Message sent — I\'ll get back to you within 24 hours.', 'success');
          form.reset();
          return;
        }

        /* Basic validation */
        const name    = (form.querySelector('input[name="name"]')?.value || '').trim();
        const email   = (form.querySelector('input[name="email"]')?.value || '').trim();
        const message = (form.querySelector('textarea[name="message"]')?.value || '').trim();

        if (!name || !email || !message) {
          setStatus('✕ Please fill in all required fields.', 'error');
          return;
        }

        if (!isValidEmail(email)) {
          setStatus('✕ Please enter a valid email address.', 'error');
          return;
        }

        submitBtn.disabled = true;
        if (submitText) submitText.textContent = 'Sending…';
        setStatus('Transmitting…', 'info');

        try {
          const res = await fetch(API.contact, {
            method: 'POST',
            body: new FormData(form),
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' }
          });

          const data = await res.json();

          if (res.ok && data.success) {
            setStatus('✓ Message sent — I\'ll get back to you within 24 hours.', 'success');
            form.reset();
            /* ✅ جدّد الـ time token بعد الإرسال */
            const timeToken = form.querySelector('#formTimeToken');
            if (timeToken) {
              timeToken.value = String(Math.floor(Date.now() / 1000));
            }
          } else {
            setStatus('✕ ' + (data.message || 'Something went wrong.'), 'error');
          }
        } catch (err) {
          setStatus('✕ Network error. Please email me directly.', 'error');
        } finally {
          submitBtn.disabled = false;
          if (submitText) submitText.textContent = 'Send message';
        }
      });
    }

    /* ---------- Resize close menu ---------- */
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) closeMenu();
    });

    /* ---------- Certificate Lightbox ---------- */
    const lightbox      = document.getElementById('certLightbox');
    const lbImg         = document.getElementById('certLightboxImg');
    const lbTitle       = document.getElementById('certLightboxTitle');
    const lbSub         = document.getElementById('certLightboxSub');
    const lbCounter     = document.getElementById('certLightboxCounter');
    const lbClose       = document.getElementById('certClose');
    const lbPrev        = document.getElementById('certPrev');
    const lbNext        = document.getElementById('certNext');
    let currentIndex    = 0;
    let currentListRef  = [];

    function getCertButtons() {
      return Array.from(document.querySelectorAll('.cert-open')).filter(function (b) {
        return !b.closest('.cert-marquee');
      });
    }
    function getMarqueeButtons() {
      const t = document.getElementById('certMarqueeTrack');
      if (!t) return [];
      return Array.from(t.querySelectorAll('.cert-open'));
    }

    function openLightbox(list, index) {
      if (!list.length || !lightbox) return;
      currentListRef = list;
      currentIndex = (index + list.length) % list.length;
      const btn = list[currentIndex];

      if (lbImg)     lbImg.src = safeUrl(btn.dataset.certImg);
      if (lbImg)     lbImg.alt = btn.dataset.certTitle || 'Certificate';
      if (lbTitle)   lbTitle.textContent = btn.dataset.certTitle || '';
      if (lbSub)     lbSub.textContent = btn.dataset.certSub || '';
      if (lbCounter) lbCounter.textContent = (currentIndex + 1) + ' / ' + list.length;

      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(function () { if (lbImg) lbImg.src = ''; }, 300);
    }

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.cert-open');
      if (!btn || !lightbox) return;
      if (lightbox.contains(btn)) return;

      const inMarquee = !!btn.closest('.cert-marquee');
      const list = inMarquee ? getMarqueeButtons() : getCertButtons();
      const idx = list.indexOf(btn);
      if (idx >= 0) {
        e.preventDefault();
        openLightbox(list, idx);
      }
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev)  lbPrev.addEventListener('click', function () { openLightbox(currentListRef, currentIndex - 1); });
    if (lbNext)  lbNext.addEventListener('click', function () { openLightbox(currentListRef, currentIndex + 1); });

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  openLightbox(currentListRef, currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentListRef, currentIndex + 1);
      });
    }

    /* ---------- Certificate Marquee ---------- */
    const marqueeBtn   = document.getElementById('certMarqueeBtn');
    const marqueeWrap  = document.getElementById('certMarqueeWrap');
    const marqueeTrack = document.getElementById('certMarqueeTrack');

    function normalizeImg(item) {
      if (typeof item === 'string') return { src: item, title: 'Certificate', sub: '' };
      return {
        src:   (item && item.src)   || '',
        title: (item && item.title) || 'Certificate',
        sub:   (item && item.sub)   || ''
      };
    }

    function buildMarqueeItem(item) {
      const btn = el('button', 'marquee-item cert-open');
      btn.type = 'button';
      btn.dataset.certImg   = item.src;
      btn.dataset.certTitle = item.title;
      btn.dataset.certSub   = item.sub;
      btn.setAttribute('aria-label', 'View ' + item.title);

      const img = el('img');
      img.src = safeUrl(item.src);
      img.alt = item.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.setAttribute('draggable', 'false');

      const zoom = el('span', 'cert-zoom');
      zoom.appendChild(createZoomIcon());

      btn.appendChild(img);
      btn.appendChild(zoom);
      return btn;
    }

    function buildMarqueeEmpty() {
      const box = el('div', 'marquee-empty');
      const svg = svgEl('svg', {
        'viewBox': '0 0 24 24',
        'fill': 'none',
        'stroke': 'currentColor',
        'stroke-width': '1.4'
      });
      svg.appendChild(svgEl('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'd': 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z'
      }));
      box.appendChild(svg);
      box.appendChild(document.createTextNode(
        'No images yet — add paths to CERT_GALLERY_IMAGES inside style.js'
      ));
      return box;
    }

    function renderMarquee() {
      if (!marqueeTrack) return;

      while (marqueeTrack.firstChild) {
        marqueeTrack.removeChild(marqueeTrack.firstChild);
      }

      if (!CERT_GALLERY_IMAGES.length) {
        marqueeTrack.appendChild(buildMarqueeEmpty());
        return;
      }

      const items = CERT_GALLERY_IMAGES.map(normalizeImg);

      /* Two passes for seamless loop */
      for (let pass = 0; pass < 2; pass++) {
        items.forEach(function (item) {
          marqueeTrack.appendChild(buildMarqueeItem(item));
        });
      }
    }

    if (marqueeBtn && marqueeWrap) {
      renderMarquee();

      marqueeBtn.addEventListener('click', function () {
        const isOpen = marqueeWrap.classList.toggle('open');
        marqueeBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     🚀 BOOT
  ═══════════════════════════════════════════════════════════ */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(async function () {
    const ok = await loadContent();
    if (!ok) return;

    await loadContactInfo();
    initInteractions();
  });
})();