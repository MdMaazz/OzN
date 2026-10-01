(() => {
  const header = document.getElementById('site-header');
  const backTop = document.querySelector('.back-top');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileViewport = window.matchMedia('(max-width: 767px)');

  const updateScrollState = () => {
    const showBackTop = window.scrollY > 300;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    backTop.classList.toggle('is-visible', showBackTop);
    backTop.setAttribute('aria-hidden', String(!showBackTop));
    backTop.tabIndex = showBackTop ? 0 : -1;
  };
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', mobileViewport.matches ? 'true' : 'false');
    document.body.classList.remove('menu-open');
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    nav.classList.toggle('is-open', !open);
    nav.setAttribute('aria-hidden', mobileViewport.matches ? String(open) : 'false');
    document.body.classList.toggle('menu-open', !open);
    if (!open) nav.querySelector('a').focus();
  });
  nav.setAttribute('aria-hidden', mobileViewport.matches ? 'true' : 'false');
  mobileViewport.addEventListener('change', closeMenu);
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  if (!form) return;
  const showError = (id, message) => { document.getElementById(id + '-error').textContent = message; document.getElementById(id).setAttribute('aria-invalid', 'true'); };
  const clearError = id => { document.getElementById(id + '-error').textContent = ''; document.getElementById(id).removeAttribute('aria-invalid'); };
  ['name', 'email', 'message'].forEach(id => document.getElementById(id).addEventListener('input', () => clearError(id)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let valid = true;
    [name, email, message].forEach(field => clearError(field.id));
    if (!name.value.trim()) { showError('name', 'Please enter your name.'); valid = false; }
    if (!email.validity.valid) { showError('email', 'Please enter a valid email.'); valid = false; }
    if (!message.value.trim()) { showError('message', 'Please tell us how we can help.'); valid = false; }
    if (!valid) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    const submit = form.querySelector('button[type="submit"]');
    submit.classList.add('is-loading'); submit.disabled = true;
    window.setTimeout(() => {
      submit.classList.remove('is-loading'); submit.disabled = false; form.reset();
      document.getElementById('form-status').textContent = 'Thank you — your enquiry is ready to send.';
      toast.classList.add('is-visible');
      window.setTimeout(() => toast.classList.remove('is-visible'), 4500);
    }, reduceMotion ? 0 : 650);
  });
})();
