document.addEventListener('DOMContentLoaded', () => {
  const navigationLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = [...navigationLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  let selectedSection;

  const setActiveLink = (hash) => {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === hash;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const hash = link.getAttribute('href');
      selectedSection = document.querySelector(hash);
      setActiveLink(hash);
    });
  });

  let scrollFrame;

  const updateActiveSection = () => {
    scrollFrame = undefined;
    const readingLine = window.innerHeight * 0.35;

    if (selectedSection) {
      const selectedBounds = selectedSection.getBoundingClientRect();
      const selectedIsInPosition = selectedBounds.top <= readingLine && selectedBounds.bottom > readingLine;

      if (!selectedIsInPosition) {
        return;
      }

      selectedSection = undefined;
    }

    const activeSection = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= readingLine && bounds.bottom > readingLine;
    });

    if (activeSection) {
      setActiveLink(`#${activeSection.id}`);
    }
  };

  window.addEventListener('scroll', () => {
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(updateActiveSection);
    }
  }, { passive: true });

  window.addEventListener('hashchange', () => {
    setActiveLink(window.location.hash || '#feed');
  });

  setActiveLink(window.location.hash || '#feed');
  updateActiveSection();

  const carousel = document.querySelector('#heroCarousel');

  if (carousel && window.Swiper) {
    const swiper = new Swiper(carousel, {
      loop: true,
      speed: 700,
      slidesPerView: 'auto',
      allowTouchMove: false,
      watchOverflow: true,
      updateOnWindowResize: true
    });

    carousel.addEventListener('click', () => swiper.slideNext());

    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') swiper.slideNext();
      if (event.key === 'ArrowLeft') swiper.slidePrev();
    });
  }
});
