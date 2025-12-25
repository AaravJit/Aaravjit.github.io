// ==========================================================================
// Portfolio Scripts
// ==========================================================================

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Footer Year
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // Smooth Scroll for Navigation Links
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Only handle anchor links
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          history.pushState(null, '', href);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // Active Section Highlight
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('.section[id]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');

      if (navLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          // Remove active from all links
          navLinks.forEach(function(link) {
            link.classList.remove('active');
          });
          // Add active to current link
          navLink.classList.add('active');
        }
      }
    });

    // If scrolled to top, remove all active states
    if (window.scrollY < 100) {
      navLinks.forEach(function(link) {
        link.classList.remove('active');
      });
    }
  }

  // Throttle scroll events for performance
  let scrollTimeout;
  function throttledScroll() {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(function() {
      updateActiveNav();
      scrollTimeout = null;
    }, 50);
  }

  window.addEventListener('scroll', throttledScroll, { passive: true });

  // Initial check on page load
  updateActiveNav();

})();
