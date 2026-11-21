(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu (full-screen sheet, scroll lock)
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
    document.body.classList.toggle('menu-open', o);
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); burger.focus(); } });
  document.addEventListener('click', function (e) { if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1180) closeMenu(); });

  // scroll-spy: highlight the nav link of the section in view (desktop bar + mobile sheet)
  var links = [].slice.call(menu.querySelectorAll('a[href^="#"]')).filter(function (a) { return !a.classList.contains('nav-cta'); });
  var pairs = links.map(function (a) { return { a: a, s: document.getElementById(a.getAttribute('href').slice(1)) }; }).filter(function (p) { return p.s; });
  var navEl = document.querySelector('.nav');
  function spy() {
    var y = window.scrollY + (navEl ? navEl.offsetHeight : 70) + 40, cur = pairs[0];
    pairs.forEach(function (p) { if (p.s.getBoundingClientRect().top + window.scrollY <= y) cur = p; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = pairs[pairs.length - 1];
    pairs.forEach(function (p) {
      var on = p === cur; p.a.classList.toggle('active', on);
      if (on) p.a.setAttribute('aria-current', 'true'); else p.a.removeAttribute('aria-current');
    });
    if (navEl) navEl.classList.toggle('sc', window.scrollY > 8);
  }
  window.addEventListener('scroll', spy, { passive: true }); window.addEventListener('resize', spy); spy();

  // reveal + counters
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

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
})();
