document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.innerHTML = isExpanded ? '✕' : '☰';
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.innerHTML = '☰';
      });
    });
  }

  // --- Sticky Nav Bar & Active Indicator ---
  const navBar = document.querySelector('.nav-bar');
  const sections = document.querySelectorAll('section[id], div[id].day-block');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    // Sticky nav shadow
    if (window.scrollY > 50) {
      navBar.classList.add('scrolled');
    } else {
      navBar.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentId = '';
    const scrollPos = window.scrollY + 150; // offset for nav-bar

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Scroll Reveal Animation ---
  const revealBlocks = document.querySelectorAll('.day-block');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealBlocks.forEach(block => {
      const blockTop = block.getBoundingClientRect().top;
      if (blockTop < triggerBottom) {
        block.classList.add('reveal');
      }
    });
  };
  
  // Initial run
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);

  // --- Initialize Carousels ---
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-indicators');
    
    if (slides.length <= 1) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Create pagination dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = index;
        updateCarousel();
      });
    });
  });

  // --- Lightbox System ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-btn.prev');
  const lightboxNext = lightbox.querySelector('.lightbox-btn.next');

  let currentGalleryImages = [];
  let currentImageIndex = 0;

  // Find all images within polaroid containers and set up click events
  const polaroids = document.querySelectorAll('.polaroid-media-container');
  polaroids.forEach(polaroid => {
    const images = Array.from(polaroid.querySelectorAll('img'));
    const captionText = polaroid.querySelector('.polaroid-caption') ? polaroid.querySelector('.polaroid-caption').textContent : '';

    images.forEach((img, index) => {
      img.addEventListener('click', () => {
        currentGalleryImages = images.map(i => ({
          src: i.getAttribute('src'),
          alt: i.getAttribute('alt') || captionText
        }));
        currentImageIndex = index;
        openLightbox();
      });
    });
  });

  function openLightbox() {
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
  }

  function updateLightboxImage() {
    if (currentGalleryImages.length === 0) return;
    const currentImg = currentGalleryImages[currentImageIndex];
    lightboxImg.setAttribute('src', currentImg.src);
    lightboxCaption.textContent = currentImg.alt;
    
    // Manage counter and navigation buttons
    if (currentGalleryImages.length > 1) {
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
      lightboxPrev.style.display = 'flex';
      lightboxNext.style.display = 'flex';
    } else {
      lightboxCounter.textContent = '';
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
    }
  }

  function nextImage() {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    updateLightboxImage();
  }

  function prevImage() {
    if (currentGalleryImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxImage();
  }

  // Lightbox Event Listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });

  // Close when clicking background outside the image and controls
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });

  // --- Back to Top Button ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
