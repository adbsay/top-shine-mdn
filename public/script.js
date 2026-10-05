// ===== TOP SHINE WEBSITE - PREMIUM JAVASCRIPT (Webflow/Framer Level) =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== LENIS SMOOTH SCROLL (Webflow-style butter smooth) =====
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } catch (e) {
    // Fallback if Lenis fails
    console.log('Lenis not available, using native scroll');
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  // ===== CURSOR GLOW (Desktop Framer-level effect) =====
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (cursorGlow && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursorGlow() {
      // Smooth lerp
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`;
      requestAnimationFrame(animateCursorGlow);
    }
    requestAnimationFrame(animateCursorGlow);
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // ===== MOBILE MENU TOGGLE =====
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      if (lenis) {
        mobileMenu.classList.contains('active') ? lenis.stop() : lenis.start();
      }
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('#beranda, #layanan, #portfolio, #promo, #lokasi');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-section]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });

        mobileNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      // Close mobile menu if it's open
      const hamburger = document.getElementById('navHamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      if (hamburger && mobileMenu && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }

      if (target) {
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        // Use native scroll on mobile for better reliability
        if (lenis && window.innerWidth > 768) {
          lenis.scrollTo(top, { duration: 1.2 });
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ===== SCROLL REVEAL ANIMATIONS (Intersection Observer) =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== BEFORE/AFTER SLIDER =====
  const baSlider = document.getElementById('baSlider');
  const baImgBefore = document.getElementById('baImgBefore');
  const baLine = document.getElementById('baLine');
  const baHandle = document.getElementById('baHandle');

  if (baSlider && baImgBefore && baLine && baHandle) {
    let isDragging = false;

    function updateSliderPosition(clientX) {
      const rect = baSlider.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;

      baImgBefore.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      baLine.style.left = percent + '%';
      baHandle.style.left = percent + '%';
    }

    baSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSliderPosition(e.clientX);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        updateSliderPosition(e.clientX);
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    baSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (isDragging) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // ===== HERO SLIDER =====
  const heroImages = [
    'assets/hero_section_foto.png',
    'assets/foto1.png',
    'assets/foto2.jpg',
    'assets/foto4.jpg',
    'assets/foto5.jpg'
  ];
  
  let currentHeroSlide = 0;
  const heroCurrentEl = document.getElementById('heroCurrentSlide');
  const heroTotalEl = document.getElementById('heroTotalSlides');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  const heroBgImg = document.querySelector('.hero-bg img');

  if (heroTotalEl) {
    heroTotalEl.textContent = heroImages.length.toString().padStart(2, '0');
  }

  function updateHeroSlide(index) {
    currentHeroSlide = index;
    if (heroCurrentEl) {
      heroCurrentEl.textContent = (currentHeroSlide + 1).toString().padStart(2, '0');
    }
    if (heroBgImg) {
      heroBgImg.style.opacity = '0';
      heroBgImg.style.transform = 'scale(1.05)';
      heroBgImg.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        heroBgImg.src = heroImages[currentHeroSlide];
        heroBgImg.onload = () => {
          heroBgImg.style.opacity = '1';
          heroBgImg.style.transform = 'scale(1)';
        };
      }, 400);
    }
  }

  if (heroPrev) {
    heroPrev.addEventListener('click', () => {
      const newIndex = currentHeroSlide === 0 ? heroImages.length - 1 : currentHeroSlide - 1;
      updateHeroSlide(newIndex);
    });
  }

  if (heroNext) {
    heroNext.addEventListener('click', () => {
      const newIndex = currentHeroSlide === heroImages.length - 1 ? 0 : currentHeroSlide + 1;
      updateHeroSlide(newIndex);
    });
  }

  // Auto-slide hero every 6 seconds
  setInterval(() => {
    const newIndex = currentHeroSlide === heroImages.length - 1 ? 0 : currentHeroSlide + 1;
    updateHeroSlide(newIndex);
  }, 6000);

  // ===== SERVICE CARD CLICK -> WhatsApp =====
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceWALinks = {
    'Coating': 'Halo Top Shine, saya tertarik dengan layanan Coating Sapphire.',
    'PPF': 'Halo Top Shine, saya tertarik dengan layanan PPF Paint Protection Film.',
    'Kaca Film': 'Halo Top Shine, saya tertarik dengan layanan Kaca Film.',
    'Detailing': 'Halo Top Shine, saya tertarik dengan layanan Detailing.'
  };

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent?.trim();
      const message = serviceWALinks[title] || 'Halo Top Shine, saya ingin konsultasi.';
      window.open(`https://api.whatsapp.com/send/?phone=6282216552727&text=${encodeURIComponent(message)}`, '_blank');
    });
  });

  // ===== PORTFOLIO LIGHTBOX (Framer-level) =====
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      
      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;

      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();

      // Trigger animation
      requestAnimationFrame(() => {
        lightbox.classList.add('active');
      });

      lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
          }
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        }, 400);
      });

      // ESC key to close
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          lightbox.click();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  });

  // ===== MAGNETIC EFFECT ON CTA BUTTONS (Framer-level) =====
  const magneticElements = document.querySelectorAll('.nav-cta, .hero-cta, .promo-cta-btn');
  
  if (window.innerWidth > 768) {
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          el.style.transition = '';
        }, 400);
      });
    });
  }

  // ===== PARALLAX ON HERO (subtle, Webflow-style) =====
  const heroContent = document.querySelector('.hero-content');
  const heroGlow = document.querySelector('.hero-glow');

  if (heroContent && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      
      if (scrolled < heroHeight) {
        const parallaxOffset = scrolled * 0.3;
        const opacityFade = 1 - (scrolled / heroHeight) * 1.5;
        heroContent.style.transform = `translateY(${parallaxOffset}px)`;
        heroContent.style.opacity = Math.max(0, opacityFade);
        
        if (heroGlow) {
          heroGlow.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
      }
    }, { passive: true });
  }

  // ===== TILT EFFECT ON SERVICE CARDS (Framer-level) =====
  if (window.innerWidth > 768) {
    const tiltCards = document.querySelectorAll('.service-card, .before-after-card, .location-card, .hours-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

});

// ===== CLOSE MOBILE MENU (Global) =====
function closeMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger) hamburger.classList.remove('active');
  if (mobileMenu) mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}
