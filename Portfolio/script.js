// ============================================================
// Muhammad Shayan Shahid — Portfolio
// Vanilla JS: nav interactions, scroll reveal, FAQ accordion,
// contact form validation + mailto handoff.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Mobile nav toggle ---------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('menu-open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close mobile menu after choosing a link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------------- FAQ accordion ---------------- */
  const faqButtons = document.querySelectorAll('.faq-q');

  faqButtons.forEach((btn) => {
    const answer = btn.nextElementSibling;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items (single-open accordion)
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.nextElementSibling.style.maxHeight = null;
        }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Contact form validation + mailto ---------------- */
  const form = document.getElementById('contactForm');

  if (form) {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const formNote = document.getElementById('formNote');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fieldConfigs = [
      {
        field: nameField,
        errorEl: document.getElementById('nameError'),
        validate: (value) => value.trim().length >= 2,
        message: 'Please enter your name (at least 2 characters).',
      },
      {
        field: emailField,
        errorEl: document.getElementById('emailError'),
        validate: (value) => emailPattern.test(value.trim()),
        message: 'Please enter a valid email address.',
      },
      {
        field: messageField,
        errorEl: document.getElementById('messageError'),
        validate: (value) => value.trim().length >= 10,
        message: 'Please add a few more details (at least 10 characters).',
      },
    ];

    const validateField = (config) => {
      const value = config.field.value;
      const valid = config.validate(value);
      config.field.classList.toggle('invalid', !valid);
      config.errorEl.textContent = valid ? '' : config.message;
      return valid;
    };

    // Validate on blur for immediate feedback
    fieldConfigs.forEach((config) => {
      config.field.addEventListener('blur', () => validateField(config));
      config.field.addEventListener('input', () => {
        if (config.field.classList.contains('invalid')) validateField(config);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const results = fieldConfigs.map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        formNote.textContent = 'Please fix the highlighted fields before sending.';
        formNote.style.color = '#ff8080';
        return;
      }

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const message = messageField.value.trim();

      const subject = `Portfolio inquiry from ${name}`;
      const body = `${message}\n\n— ${name} (${email})`;

      const mailtoLink = `mailto:msshahid23052006@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;

      formNote.style.color = '';
      formNote.textContent = 'Opening your email client — thanks for reaching out!';
      form.reset();
      fieldConfigs.forEach((config) => {
        config.field.classList.remove('invalid');
        config.errorEl.textContent = '';
      });
    });
  }
});
