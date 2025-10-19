document.addEventListener('DOMContentLoaded', function () {
  var menu = document.getElementById('menu');
  var toggleBtn = document.querySelector('.mobile-toggle');

  window.toggleMobileMenu = function () {
    if (!menu || !toggleBtn) return;
    var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', (!expanded).toString());
    menu.classList.toggle('active');
  };

  if (menu) {
    menu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href && href.length > 1) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (menu.classList.contains('active')) {
              window.toggleMobileMenu();
            }
          }
        }
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
      window.toggleMobileMenu();
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  var revealTargets = document.querySelectorAll('section, .work-experience article, .bento .bento-item, .contact .contact-card');
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
});

