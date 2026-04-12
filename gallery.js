/* ========================================
   Gallery v6 — grid/col toggle,
   scroll reveal, lightbox
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const items    = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lbImg    = lightbox.querySelector('.lightbox-img');
  const lbTitle  = lightbox.querySelector('.lightbox-caption-title');
  const lbCount  = lightbox.querySelector('.lightbox-counter');
  const lbClose  = lightbox.querySelector('.lightbox-close');
  const lbPrev   = lightbox.querySelector('.lightbox-prev');
  const lbNext   = lightbox.querySelector('.lightbox-next');
  const toggle   = document.getElementById('viewToggle');

  let currentIndex = 0;

  // --- View toggle ---
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('view-col');
    // Re-trigger scroll reveal for newly visible items
    items.forEach(item => {
      if (!item.classList.contains('visible')) {
        observer.observe(item);
      }
    });
  });

  // --- Scroll reveal ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));

  // --- Lightbox ---
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = items[currentIndex];
    const img  = item.querySelector('img');
    lbImg.src  = img.dataset.full || img.src;
    lbImg.alt  = img.alt || '';
    lbTitle.textContent = item.dataset.title || '';
    lbCount.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    updateLightbox();
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    switch (e.key) {
      case 'Escape':     closeLightbox(); break;
      case 'ArrowLeft':  navigate(-1);    break;
      case 'ArrowRight': navigate(1);     break;
    }
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
  }, { passive: true });
});
