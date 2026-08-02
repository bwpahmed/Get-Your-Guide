(() => {
  const AUTOPLAY_DELAY = 7000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildSlider() {
    const overview = document.querySelector('#view-overview.active');
    if (!overview || overview.querySelector('[data-home-hero-slider]')) return;

    const firstHero = overview.querySelector(':scope > .hero.review-wrap');
    const secondHero = overview.querySelector(':scope > .home-second-hero');
    if (!firstHero || !secondHero) return;

    const slider = document.createElement('section');
    slider.className = 'home-hero-slider';
    slider.dataset.homeHeroSlider = '1';
    slider.setAttribute('aria-roledescription', 'carousel');
    slider.setAttribute('aria-label', 'Homepage highlights');
    slider.innerHTML = `
      <div class="home-hero-slider-viewport">
        <div class="home-hero-slider-track"></div>
      </div>
      <button class="home-hero-slider-arrow previous" type="button" aria-label="Previous hero">‹</button>
      <button class="home-hero-slider-arrow next" type="button" aria-label="Next hero">›</button>
      <div class="home-hero-slider-controls" aria-label="Choose hero slide">
        <button type="button" class="active" data-hero-slide="0" aria-label="Show overview hero" aria-current="true"></button>
        <button type="button" data-hero-slide="1" aria-label="Show booking hero" aria-current="false"></button>
      </div>`;

    const track = slider.querySelector('.home-hero-slider-track');
    const viewport = slider.querySelector('.home-hero-slider-viewport');
    const slides = [firstHero, secondHero].map((hero, index) => {
      const slide = document.createElement('div');
      slide.className = 'home-hero-slide';
      slide.dataset.heroSlidePanel = String(index);
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `${index + 1} of 2`);
      slide.append(hero);
      track.append(slide);
      return slide;
    });

    overview.insertBefore(slider, overview.firstElementChild);

    let activeIndex = 0;
    let timer = null;
    let pointerStart = null;
    let paused = false;

    const dots = [...slider.querySelectorAll('[data-hero-slide]')];

    function syncHeight() {
      const activeSlide = slides[activeIndex];
      if (!activeSlide) return;
      viewport.style.height = `${activeSlide.scrollHeight}px`;
    }

    function updateAccessibility() {
      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, index) => {
        const active = index === activeIndex;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', String(active));
      });
    }

    function showSlide(index, userInitiated = false) {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
      updateAccessibility();
      requestAnimationFrame(syncHeight);
      setTimeout(syncHeight, 350);
      if (userInitiated) restartAutoplay();
    }

    function stopAutoplay() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      if (reducedMotion || paused || document.hidden) return;
      timer = window.setInterval(() => showSlide(activeIndex + 1), AUTOPLAY_DELAY);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    slider.querySelector('.previous').addEventListener('click', () => showSlide(activeIndex - 1, true));
    slider.querySelector('.next').addEventListener('click', () => showSlide(activeIndex + 1, true));
    dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.heroSlide), true)));

    slider.addEventListener('mouseenter', () => { paused = true; stopAutoplay(); });
    slider.addEventListener('mouseleave', () => { paused = false; startAutoplay(); });
    slider.addEventListener('focusin', () => { paused = true; stopAutoplay(); });
    slider.addEventListener('focusout', event => {
      if (slider.contains(event.relatedTarget)) return;
      paused = false;
      startAutoplay();
    });

    slider.addEventListener('pointerdown', event => {
      if (event.target.closest('form, input, select, textarea, button, a, label')) return;
      pointerStart = { x:event.clientX, y:event.clientY };
    });
    slider.addEventListener('pointerup', event => {
      if (!pointerStart) return;
      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      showSlide(activeIndex + (deltaX < 0 ? 1 : -1), true);
    });
    slider.addEventListener('pointercancel', () => { pointerStart = null; });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    window.addEventListener('resize', syncHeight, { passive:true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(syncHeight);
      slides.forEach(slide => observer.observe(slide));
    }

    slides.forEach(slide => slide.querySelectorAll('img').forEach(image => {
      if (!image.complete) image.addEventListener('load', syncHeight, { once:true });
    }));

    showSlide(location.hash === '#home-booking-hero' ? 1 : 0);
    startAutoplay();
  }

  let queued = false;
  function queueBuild() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      buildSlider();
    });
  }

  new MutationObserver(queueBuild).observe(document.documentElement, { childList:true, subtree:true });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-view="overview"],[data-go="overview"]')) setTimeout(queueBuild, 0);
  }, true);
  queueBuild();
  setTimeout(queueBuild, 250);
  setTimeout(queueBuild, 900);
})();
