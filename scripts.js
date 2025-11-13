document.addEventListener('DOMContentLoaded', function () {
  var menu = document.getElementById('menu');
  var toggleBtn = document.querySelector('.mobile-toggle');
  var header = document.querySelector('header');

  // Mobile menu toggle
  window.toggleMobileMenu = function () {
    if (!menu || !toggleBtn) return;
    var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', (!expanded).toString());
    menu.classList.toggle('active');
  };

  // Scroll progress indicator
  function updateScrollProgress() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    
    if (!document.getElementById('scroll-progress')) {
      var progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.style.cssText = 'position: fixed; top: 0; left: 0; width: ' + scrolled + '%; height: 3px; background: linear-gradient(90deg, #64ffda, #00d9a5); z-index: 100; transition: width 0.1s ease;';
      document.body.appendChild(progressBar);
    } else {
      document.getElementById('scroll-progress').style.width = scrolled + '%';
    }
  }

  window.addEventListener('scroll', updateScrollProgress);

  // Header shadow on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

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

  // Enhanced intersection observer with stagger effect
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.classList.add('is-visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  var revealTargets = document.querySelectorAll('section, .work-experience article, .bento .bento-item, .contact .contact-card');
  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Add hover effect to skill tags
  var skillTags = document.querySelectorAll('.skills ul li');
  skillTags.forEach(function(tag) {
    tag.addEventListener('click', function() {
      this.style.transform = 'scale(1.1)';
      setTimeout(function(el) {
        el.style.transform = '';
      }, 200, this);
    });
  });

  // Smooth scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerOffset = 100;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        if (menu && menu.classList.contains('active')) {
          window.toggleMobileMenu();
        }
      }
    });
  });

  // Make work experience cards clickable
  var workCards = document.querySelectorAll('.work-experience article');
  workCards.forEach(function(card, index) {
    var link = card.querySelector('figure a');
    if (link) {
      console.log('Card ' + index + ' has link:', link.href);
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', function(e) {
        // Don't trigger if clicking directly on the anchor tag
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          console.log('Clicked on link directly');
          return;
        }
        
        console.log('Opening:', link.href);
        window.open(link.href, '_blank', 'noopener,noreferrer');
      });
    } else {
      console.log('Card ' + index + ' has no link');
    }
  });
});

// Toggle skills content function
window.toggleSkillsContent = function() {
  var skillsContent = document.getElementById('skillsContent');
  var toggleBtn = document.querySelector('.skills-toggle-btn');
  var btnText = toggleBtn.querySelector('.btn-text');
  var btnIcon = toggleBtn.querySelector('.btn-icon');
  
  if (skillsContent && toggleBtn) {
    var isVisible = skillsContent.style.display !== 'none';
    
    if (isVisible) {
      skillsContent.style.display = 'none';
      btnText.textContent = 'View Technical Skills';
      btnIcon.textContent = '▼';
      toggleBtn.classList.remove('expanded');
    } else {
      skillsContent.style.display = 'block';
      btnText.textContent = 'Hide Technical Skills';
      btnIcon.textContent = '▲';
      toggleBtn.classList.add('expanded');
      
      // Smooth scroll animation
      setTimeout(function() {
        skillsContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 100);
    }
  }
};
