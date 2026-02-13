function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window)) {
    animatedEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay');
          if (delay) {
            el.style.transitionDelay = `${parseInt(delay, 10)}ms`;
          }
          el.classList.add('visible');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedEls.forEach((el) => observer.observe(el));
}

function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  function open(item) {
    const fullSrc = item.getAttribute('data-full');
    const placeholder = item.querySelector('.gallery-image');
    const figcaption = item.querySelector('figcaption');

    if (fullSrc) {
      img.src = fullSrc;
    } else if (placeholder) {
      img.src = placeholder.dataset.src || '';
    }

    caption.textContent = figcaption ? figcaption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  items.forEach((item) => {
    item.addEventListener('click', () => open(item));
  });

  [closeBtn, backdrop].forEach((el) => {
    if (!el) return;
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      close();
    }
  });
}

function initGalleryNavigation() {
  const scroller = document.getElementById('gallery-scroller');
  const prev = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');

  if (!scroller || !prev || !next) return;

  const scrollStep = () => scroller.clientWidth * 0.9;

  prev.addEventListener('click', () => {
    scroller.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    scroller.scrollBy({ left: scrollStep(), behavior: 'smooth' });
  });
}

function initLetter() {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;

  envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
  });
}

function initMusic() {
  const audio = document.getElementById('background-music');
  const toggleBtn = document.getElementById('music-toggle');
  const finalBtn = document.getElementById('final-music-btn');

  if (!audio) return;

  let isPlaying = false;

  function updateButtons() {
    if (toggleBtn) {
      toggleBtn.classList.toggle('music-active', isPlaying);
      const label = toggleBtn.querySelector('.music-label');
      if (label) {
        label.textContent = isPlaying ? 'Музыка играет' : 'Музыка для нас';
      }
    }

    if (finalBtn) {
      finalBtn.textContent = isPlaying
        ? 'Поставить на паузу'
        : 'Слушать нашу мелодию ещё раз';
    }
  }

  function play() {
    // Если src ещё не проставлен у самого audio, пробуем взять его из тега <source>
    if (!audio.src) {
      const source = audio.querySelector('source');
      if (source && source.src) {
        audio.src = source.src;
      }
    }
    audio
      .play()
      .then(() => {
        isPlaying = true;
        updateButtons();
      })
      .catch((err) => {
        console.warn('Браузер запретил автозапуск звука. Попробуй ещё раз нажать кнопку.', err);
      });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    updateButtons();
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (finalBtn) finalBtn.addEventListener('click', toggle);
}

window.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initScrollAnimations();
  initLightbox();
  initGalleryNavigation();
  initLetter();
  initMusic();
});
