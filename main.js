document.addEventListener('DOMContentLoaded', () => {
  const navigationLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const nav = document.querySelector('.main-nav');
  const navIndicator = document.querySelector('.nav-indicator');
  const sections = [...navigationLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  let selectedSection;

  const updateNavIndicator = () => {
    if (!nav || !navIndicator) return;

    const activeLink = document.querySelector('.main-nav a.is-active');
    if (!activeLink) return;

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();

    navIndicator.style.width = `${activeRect.width}px`;
    navIndicator.style.transform = `translateX(${activeRect.left - navRect.left}px)`;
  };

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

    updateNavIndicator();
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

    if (selectedSection) {
      const selectedIsInPosition = window.scrollY >= selectedSection.offsetTop - 1;

      if (!selectedIsInPosition) {
        return;
      }

      selectedSection = undefined;
    }

    const activeSection = sections.reduce((currentSection, section) => {
      return section.offsetTop <= window.scrollY + 1 ? section : currentSection;
    }, sections[0]);

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

  window.addEventListener('resize', updateNavIndicator);

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
