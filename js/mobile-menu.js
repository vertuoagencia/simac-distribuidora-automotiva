document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-menu-buttons a');

  function toggleMenu() {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  }

  function closeMenu() {
    mobileToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
  }

  mobileToggle.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function(event) {
    const isClickOnToggle = mobileToggle.contains(event.target);
    const isClickOnMenu = mobileMenu.contains(event.target);

    if (!isClickOnToggle && !isClickOnMenu && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
});
