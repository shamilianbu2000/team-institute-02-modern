(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // active nav link
  var links = {};
  menu.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          links[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) so.observe(s); });

    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });

    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { count(en.target); co.unobserve(en.target); } });
    }, { threshold: .6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  function count(el) {
    var t = parseFloat(el.dataset.count), d = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = t.toFixed(d); return; }
    var s = null, dur = 1400;
    function f(ts) {
      if (!s) s = ts;
      var p = Math.min((ts - s) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (t * e).toFixed(d);
      if (p < 1) requestAnimationFrame(f); else el.textContent = t.toFixed(d);
    }
    requestAnimationFrame(f);
  }

  // course filter + flip
  var chips = document.querySelectorAll('.chip'), cards = document.querySelectorAll('.flip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
      cards.forEach(function (card) { card.hidden = !(c.dataset.f === 'all' || card.dataset.cat === c.dataset.f); });
    });
  });
  function flip(card) { var on = card.classList.toggle('on'); card.setAttribute('aria-pressed', on); }
  cards.forEach(function (card) {
    card.addEventListener('click', function () { flip(card); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(card); } });
  });

  // method tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.step-btn'));
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); selectTab(n); n.focus(); }
    });
  });

  // FAQ
  document.querySelectorAll('.faq-q').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.faq-item'), o = item.classList.toggle('open');
      b.setAttribute('aria-expanded', o);
    });
  });

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
