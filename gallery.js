/* ========================================
   Gallery v3 — tight masonry, scroll
   reveal, filtering, lightbox
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const items    = Array.from(document.querySelectorAll('.gallery-item'));
  const filters  = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = lightbox.querySelector('.lightbox-img');
  const lbTitle  = lightbox.querySelector('.lightbox-caption-title');
  const lbMeta   = lightbox.querySelector('.lightbox-caption-meta');
  const lbCount  = lightbox.querySelector('.lightbox-counter');
  const lbClose  = lightbox.querySelector('.lightbox-close');
  const lbPrev   = lightbox.querySelector('.lightbox-prev');
  const lbNext   = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let visibleItems = items;

  // --- Scroll reveal ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger slightly based on position in batch
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));

  // --- Filtering ---
  function filterGallery(category) {
    filters.forEach(btn =>
      btn.classList.toggle('active', btn.dataset.filter === category)
    );

    let shown = [];
    items.forEach(item => {
      const match = category === 'all' || item.dataset.category === category;
      item.classList.toggle('hidden', !match);
      if (match) shown.push(item);
    });

    visibleItems = shown;
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => filterGallery(btn.dataset.filter));
  });

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
    const item = visibleItems[currentIndex];
    const img  = item.querySelector('img');
    const src  = img ? (img.dataset.full || img.src) : '';

    lbImg.src   = src;
    lbImg.alt   = img ? (img.alt || '') : '';
    lbTitle.textContent = item.dataset.title || '';
    lbMeta.textContent  = item.dataset.meta  || '';
    lbCount.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    updateLightbox();
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
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
