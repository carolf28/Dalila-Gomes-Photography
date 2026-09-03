document.addEventListener('DOMContentLoaded', () => {
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
