document.addEventListener('DOMContentLoaded', function () {
  var menu = document.getElementById('menu');
  var toggleBtn = document.querySelector('.mobile-toggle');
  var header = document.querySelector('header');
  var headerOffset = 100;
  var storageKey = 'portfolio-lang';

  function getNestedValue(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function setLanguage(lang) {
    if (!window.PORTFOLIO_I18N || !window.PORTFOLIO_I18N[lang]) return;

    var strings = window.PORTFOLIO_I18N[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = getNestedValue(strings, el.getAttribute('data-i18n'));
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var value = getNestedValue(strings, el.getAttribute('data-i18n-alt'));
      if (value !== null) el.setAttribute('alt', value);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var value = getNestedValue(strings, el.getAttribute('data-i18n-aria'));
      if (value !== null) el.setAttribute('aria-label', value);
    });

    if (strings.meta) {
      document.title = strings.meta.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', strings.meta.description);
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try {
      localStorage.setItem(storageKey, lang);
    } catch (e) { /* ignore */ }
  }

  var savedLang = 'fr';
  try {
    savedLang = localStorage.getItem(storageKey) || 'fr';
  } catch (e) { /* ignore */ }

  if (savedLang !== 'fr') setLanguage(savedLang);

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(btn.getAttribute('data-lang'));
      if (menu && menu.classList.contains('active')) {
        window.toggleMobileMenu();
      }
    });
  });

  window.toggleMobileMenu = function () {
    if (!menu || !toggleBtn) return;
    var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', (!expanded).toString());
    menu.classList.toggle('active');
  };

  function updateScrollProgress() {
    var winScroll = document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    var progressBar = document.getElementById('scroll-progress');

    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#64ffda,#00d9a5);z-index:100;transition:width 0.1s ease;';
      document.body.appendChild(progressBar);
    }

    progressBar.style.width = scrolled + '%';
  }

  window.addEventListener('scroll', function () {
    updateScrollProgress();
    if (header) {
      header.style.boxShadow = window.scrollY > 50 ? '0 2px 12px rgba(0,0,0,0.18)' : 'none';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

      if (menu && menu.classList.contains('active')) {
        window.toggleMobileMenu();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
      window.toggleMobileMenu();
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, index * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('section, .work-experience article, .case-study-card, .contact-card').forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  document.querySelectorAll('.work-experience article').forEach(function (card) {
    var link = card.querySelector('figure a');
    if (!link) return;

    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      window.open(link.href, '_blank', 'noopener,noreferrer');
    });
  });
});
