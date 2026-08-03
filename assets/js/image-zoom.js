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
      // Capture object-fit/object-position before any DOM changes, since
      // those only work on the <img> itself, not on the wrapping div.
      var computed = window.getComputedStyle(img);
      var objectFit = computed.objectFit;
      var objectPosition = computed.objectPosition;

      var wrap = document.createElement('div');
      // Copy the image's classes onto the wrap so any layout CSS that
      // targets .project-img (flex sizing, row/split layouts, etc.)
      // still applies correctly now that the wrap is the real layout box.
      wrap.className = 'project-img-zoom-wrap ' + img.className;

      // Move inline sizing styles (max-width, margin, display, etc.) from
      // the img onto the wrap too, for images with their own custom sizing.
      var hadInlineStyle = img.getAttribute('style');
      if (hadInlineStyle) {
        wrap.setAttribute('style', wrap.getAttribute('style') ? wrap.getAttribute('style') + ';' + hadInlineStyle : hadInlineStyle);
      }

      // The inner img always just fills whatever box the wrap establishes.
      img.removeAttribute('style');
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.display = 'block';
      img.style.objectFit = objectFit;
      img.style.objectPosition = objectPosition;

      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      img.className = '';

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
