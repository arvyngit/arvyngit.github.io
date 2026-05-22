const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
  document.addEventListener('mousemove', e => {
    cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    follower.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 17}px)`;
  });
  document.querySelectorAll('a, button, .doc-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(1.5)';
      follower.style.width = '50px';
      follower.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '35px';
      follower.style.height = '35px';
    });
  });
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) {
      ls.classList.add('hidden');
      setTimeout(() => { ls.style.display = 'none'; }, 800);
    }
  }, 2800);
});

function generateStars() {
  const container = document.querySelector('.stars-bg');
  if (!container) return;
  for (let i = 0; i < 180; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${Math.random()*4+2}s;
      animation-delay:${Math.random()*5}s;
    `;
    container.appendChild(s);
  }
}

function generateMath() {
  const container = document.querySelector('.math-bg');
  if (!container) return;
  const syms = ['∑','∫','π','∞','Δ','∇','∂','α','β','γ','λ','σ','μ','01','10','11','≈','≠','∈','⊂','⊕','√','²','³'];
  for (let i = 0; i < 25; i++) {
    const el = document.createElement('div');
    el.className = 'math-symbol';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    el.style.cssText = `
      left:${Math.random()*100}%;
      --spd:${Math.random()*25+15}s;
      animation-delay:${Math.random()*20}s;
      font-size:${Math.random()*1+0.7}rem;
    `;
    container.appendChild(el);
  }
}

generateStars();
generateMath();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  highlightNav();
  revealOnScroll();
});

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

function highlightNav() {
  const sections = ['home','dokumentasi','about','skills','experience','contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideTimer;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  slides[currentSlide].classList.add('exit-left');
  setTimeout(() => slides[currentSlide] && slides[currentSlide].classList.remove('exit-left'), 800);
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startSlider() {
  slideTimer = setInterval(nextSlide, 5000);
}

if (slides.length > 0) {
  slides[0].classList.add('active');
  dots[0] && dots[0].classList.add('active');
  startSlider();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(slideTimer);
      goToSlide(i);
      startSlider();
    });
  });

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (btnPrev) btnPrev.addEventListener('click', () => { clearInterval(slideTimer); prevSlide(); startSlider(); });
  if (btnNext) btnNext.addEventListener('click', () => { clearInterval(slideTimer); nextSlide(); startSlider(); });

  let touchStartX = 0;
  const sliderEl = document.querySelector('.hero-slider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        clearInterval(slideTimer);
        diff > 0 ? nextSlide() : prevSlide();
        startSlider();
      }
    });
  }
}

const carousel = document.querySelector('.docs-carousel');
const docsPrev = document.getElementById('docs-prev');
const docsNext = document.getElementById('docs-next');

if (carousel) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  let autoTimer = null;
  let isAutoPaused = false;

  const pauseAuto = () => {
    isAutoPaused = true;
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const resumeAuto = () => {
    isAutoPaused = false;
    if (autoTimer) return;

    autoTimer = setInterval(() => {
      if (!carousel || isAutoPaused) return;
      const step = getStep();
      if (typeof carousel.scrollBy === 'function') {
        carousel.scrollBy({ left: 1 * step, behavior: 'auto' });
      } else {
        carousel.scrollLeft += step;
      }

      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2) {
        carousel.scrollLeft = 0;
      }
    }, 1800);
  };


  const getStep = () => {
    const firstCard = carousel.querySelector('.doc-card');
    if (!firstCard) return 320;
    return firstCard.getBoundingClientRect().width + 25; // card width + gap(25px)
  };

  const moveBy = (dir) => {
    if (!carousel) return;
    pauseAuto();

    const step = getStep();

    if (typeof carousel.scrollBy === 'function') {
      carousel.scrollBy({ left: dir * step, behavior: 'smooth' });
    } else {
      carousel.scrollLeft += dir * step;
    }

    window.clearTimeout(moveBy._t);
    moveBy._t = window.setTimeout(resumeAnim, 800);
  };

  docsPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    moveBy(-1);
  });

  docsNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    moveBy(1);
  });

  carousel.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    pauseAnim();
    carousel.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      carousel.style.cursor = 'grab';
      resumeAnim();
    }
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollLeft - (x - startX);
  });

  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].pageX;
    pauseAnim();
  }, { passive: true });

  carousel.addEventListener('touchend', () => {
    resumeAnim();
  });
}


function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) closeModal(m.id);
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

document.querySelectorAll('.doc-card').forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.getAttribute('data-modal');
    if (modalId) openModal(modalId);
  });
});

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.getAttribute('data-modal');
    if (modalId) openModal(modalId);
  });
});

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
}
revealOnScroll();

function typeEffect(el, texts, speed = 80) {
  if (!el) return;
  let ti = 0, ci = 0, deleting = false;
  function type() {
    const txt = texts[ti];
    el.textContent = deleting ? txt.slice(0, ci--) : txt.slice(0, ci++);
    if (!deleting && ci > txt.length) {
      setTimeout(() => { deleting = true; type(); }, 2000);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      ti = (ti + 1) % texts.length;
      ci = 0;
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  type();
}

const typeEl = document.getElementById('typing-text');
if (typeEl) {
  typeEffect(typeEl, ['Network Engineer', 'IT Infrastructure', 'Web Server Admin', 'MikroTik Expert', 'FTTH Specialist']);
}

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '▲';
scrollTopBtn.style.cssText = `
  position:fixed; bottom:30px; right:30px;
  width:42px; height:42px;
  border-radius:50%;
  background:rgba(0,245,255,0.15);
  border:1px solid rgba(0,245,255,0.4);
  color:#00f5ff;
  font-size:0.9rem;
  cursor:pointer;
  z-index:999;
  opacity:0;
  transition:all 0.3s ease;
  backdrop-filter:blur(10px);
`;
document.body.appendChild(scrollTopBtn);
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  scrollTopBtn.style.opacity = window.scrollY > 300 ? '1' : '0';
});