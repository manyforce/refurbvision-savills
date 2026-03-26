// ========== RefurbVision - Main JS ==========

document.addEventListener('DOMContentLoaded', () => {

  // ========== Scroll Fade-In Animation ==========
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));

  // ========== Navbar Transparent → Solid on Scroll ==========
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');
  const navThreshold = () => hero ? hero.offsetHeight - 100 : 10;

  window.addEventListener('scroll', () => {
    if (window.scrollY > navThreshold()) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ========== Mobile Menu Toggle ==========
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    menuIcon.setAttribute('d', isOpen
      ? 'M4 6h16M4 12h16M4 18h16'
      : 'M6 18L18 6M6 6l12 12'
    );
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
  });

  // ========== FAQ Accordion ==========
  document.querySelectorAll('.faq-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const isOpen = item.classList.contains('open');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-content').classList.add('hidden');
          openItem.querySelector('.faq-toggle').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('open');
      content.classList.toggle('hidden');
      button.setAttribute('aria-expanded', !isOpen);
    });
  });

  // ========== Smooth Scroll for Anchor Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========== Video Play Button Overlay ==========
  document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const overlay = wrapper.querySelector('.play-overlay');
    if (!video || !overlay) return;

    let hasStarted = false;

    // Only the overlay triggers the initial play
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      video.play();
    });

    video.addEventListener('play', () => {
      if (!hasStarted) {
        hasStarted = true;
        video.setAttribute('controls', '');
      }
      overlay.classList.add('hidden-overlay');
    });

    video.addEventListener('ended', () => {
      hasStarted = false;
      video.removeAttribute('controls');
      overlay.classList.remove('hidden-overlay');
    });
  });

  // ========== Contact Form Handling ==========
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Submit to Formspree — emails richbowdler@gmail.com
      fetch('https://formspree.io/f/xnjgopyd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {}); // silent fail — UX already handled below


      // Show success state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enquiry Sent!';
      submitBtn.classList.remove('bg-teal', 'hover:bg-teal-dark');
      submitBtn.classList.add('bg-green-600');
      submitBtn.disabled = true;

      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.add('bg-teal', 'hover:bg-teal-dark');
        submitBtn.classList.remove('bg-green-600');
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

});
