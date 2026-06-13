document.addEventListener('DOMContentLoaded', function () {
  var menu = document.getElementById('menu');
  var toggleBtn = document.querySelector('.mobile-toggle');
  var header = document.querySelector('header');
  var headerOffset = 100;

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
      progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#64ffda,#00d9a5);z-index:100;transition:width 0.1s ease;';
      document.body.appendChild(progressBar);
    }

    progressBar.style.width = scrolled + '%';
  }

  window.addEventListener('scroll', function () {
    updateScrollProgress();
    if (header) {
      header.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0,0,0,0.15)' : 'none';
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
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

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
