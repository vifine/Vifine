// Image zoom for project case-study pages: wraps every .project-img with a
// magnifier badge and opens a full-screen lightbox on click.
// Purely additive — works on any page that has .project-img elements,
// no template/content changes required.
(function () {
  var scriptEl = document.currentScript;
  var iconSrc = scriptEl
    ? new URL('../img/icons/zoom-search.svg', scriptEl.src).href
    : 'assets/img/icons/zoom-search.svg';

  function init() {
    var images = document.querySelectorAll('.project-img');
    if (!images.length) return;

    // Build the shared lightbox once
    var lightbox = document.createElement('div');
    lightbox.className = 'project-img-lightbox';
    lightbox.innerHTML =
      '<button class="project-img-lightbox-close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<img src="" alt="">';
    document.body.appendChild(lightbox);
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.project-img-lightbox-close');

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
    });
    closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // Wrap each project image with a zoom badge
    images.forEach(function (img) {
      var wrap = document.createElement('div');
      wrap.className = 'project-img-zoom-wrap';

      // Move any inline sizing styles (max-width, margin, display, etc.)
      // from the img onto the wrap, so the wrap's box always matches the
      // image's actual rendered size/position instead of stretching full width.
      if (img.getAttribute('style')) {
        wrap.setAttribute('style', img.getAttribute('style'));
        img.removeAttribute('style');
      }
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.display = 'block';

      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);

      var badge = document.createElement('span');
      badge.className = 'project-img-zoom-badge';
      badge.innerHTML = '<img src="' + iconSrc + '" alt="">';
      wrap.appendChild(badge);

      wrap.addEventListener('click', function () {
        openLightbox(img.src, img.alt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
