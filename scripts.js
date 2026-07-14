/* ============================================================
   AVYANNIC NIGERIA — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ----- ELEMENTS -----
  const header    = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('mainNav');
  const navLinks  = nav.querySelectorAll('.nav-list a');

  // ----- HAMBURGER TOGGLE -----
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ----- HEADER SCROLL EFFECT -----
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Optional: hide/show on scroll direction
    if (scrollY > lastScrollY && scrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ----- SCROLL REVEAL (Intersection Observer) -----
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ----- SMOOTH SCROLL FOR ANCHOR LINKS (enhancement) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Only prevent default if the href is just a hash-target on this page
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----- PARALLAX-LIKE HERO TEXT SHIFT (subtle) -----
  const heroContent = document.querySelector('.hero-content');

  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  // ----- CONTACT FORM — EMAIL SUBMISSION (Formspree) -----
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('formSubmitBtn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoader = submitBtn?.querySelector('.btn-loader');

  if (contactForm && formFeedback && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show loading state
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline-flex';
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';

      try {
        const formData = new FormData(contactForm);

        // Formspree AJAX submission: requires Accept: application/json
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          formFeedback.textContent = '✓ Thank you! Your message has been sent. We\'ll get back to you within 24 hours.';
          formFeedback.className = 'form-feedback form-feedback--success';
          formFeedback.style.display = 'block';
          contactForm.reset();
        } else {
          const data = await response.json();
          const errorMsg = data?.error || 'Something went wrong. Please try again later.';
          formFeedback.textContent = '✗ ' + errorMsg;
          formFeedback.className = 'form-feedback form-feedback--error';
          formFeedback.style.display = 'block';
        }
      } catch (err) {
        formFeedback.textContent = '✗ Network error. Please check your connection and try again.';
        formFeedback.className = 'form-feedback form-feedback--error';
        formFeedback.style.display = 'block';
      } finally {
        // Restore button state
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = '';
        if (btnLoader) btnLoader.style.display = 'none';
      }
    });
  }

});
