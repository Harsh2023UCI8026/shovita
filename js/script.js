document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add a light drift of warm, hand-drawn sparkles behind the scrapbook.
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width = 0;
      let height = 0;
      let particles = [];
      let frameId;
      const symbols = ['✦', '✧', '·'];

      function resizeCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        particles = Array.from({ length: Math.min(34, Math.ceil(width / 38)) }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 12 + 7,
          speed: Math.random() * 0.18 + 0.05,
          phase: Math.random() * Math.PI * 2,
          symbol: symbols[Math.floor(Math.random() * symbols.length)]
        }));
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((particle) => {
          particle.y -= particle.speed;
          particle.phase += 0.013;
          if (particle.y < -20) {
            particle.y = height + 12;
            particle.x = Math.random() * width;
          }
          ctx.globalAlpha = 0.14 + (Math.sin(particle.phase) + 1) * 0.11;
          ctx.fillStyle = '#9b718f';
          ctx.font = `${particle.size}px Georgia, serif`;
          ctx.fillText(particle.symbol, particle.x, particle.y);
        });
        ctx.globalAlpha = 1;
        frameId = window.requestAnimationFrame(animate);
      }

      resizeCanvas();
      frameId = window.requestAnimationFrame(animate);
      window.addEventListener('resize', resizeCanvas, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.cancelAnimationFrame(frameId);
        } else {
          window.cancelAnimationFrame(frameId);
          frameId = window.requestAnimationFrame(animate);
        }
      });
    }
  }

  // Reveal sections as they enter the viewport, with a no-JS-friendly fallback.
  const revealElements = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.08 });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('active'));
  }

  // Add a small 3D paper tilt only on mouse/trackpad devices.
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        const baseAngle = getComputedStyle(card).getPropertyValue('--tilt').trim() || '0deg';
        card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 7}deg) rotate(${baseAngle}) scale(1.015)`;
      });

      card.addEventListener('pointerleave', () => {
        const baseAngle = getComputedStyle(card).getPropertyValue('--tilt').trim() || '0deg';
        card.style.transform = `rotate(${baseAngle})`;
      });
    });
  }

  // Sticker files are kept in /stickers; add each filename and caption here.
  // Plain artwork backgrounds keep transparent WebP sticker edges clear.
  const STICKERS = [
    { src: 'stickers/shovi-happy-birthday.webp', caption: 'Birthday mode: Shinchan edition 🎂' },
    { src: 'stickers/shovi-reaction-chat-1.webp', caption: 'Yeh sawaal unexpected tha 😅' },
    { src: 'stickers/shovi-reaction-chat-2.webp', caption: 'Context samajhne mein glitch ho gaya 😅' },
    { src: 'stickers/shovi-reaction-chat-3.webp', caption: 'Thoda context miss ho gaya 😄' },
    { src: 'stickers/shovi-ok-ji.webp', caption: 'Okay ji, noted 😄' },
    { src: 'stickers/shovi-velle-log.webp', caption: 'Velle log spotted 😂' },
    { src: 'stickers/shovi-thumbs-up.webp', caption: 'Approved with a thumbs-up 👍' }
  ];
  const stickerSection = document.getElementById('stickers');
  const stickerNavLink = document.getElementById('stickers-nav-link');
  const stickerGrid = document.getElementById('sticker-grid');
  const lightbox = document.getElementById('sticker-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightbox = document.getElementById('lightbox-close');

  function openImagePreview(src, alt, caption) {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = caption;
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  }

  const reelImageButton = document.getElementById('reel-image-expand');
  if (reelImageButton) {
    const reelImage = reelImageButton.querySelector('img');
    reelImageButton.addEventListener('click', () => {
      if (reelImage) openImagePreview(reelImage.src, reelImage.alt, 'Woh reel, jisse yeh idea aaya ♡');
    });
  }

  if (stickerSection && stickerGrid && STICKERS.length) {
    STICKERS.forEach((sticker, index) => {
      const button = document.createElement('button');
      button.className = 'sticker-card';
      button.type = 'button';
      button.setAttribute('aria-label', `View sticker: ${sticker.caption || `Reaction ${index + 1}`}`);

      const art = document.createElement('span');
      art.className = 'sticker-art';
      const image = document.createElement('img');
      image.src = sticker.src;
      image.alt = sticker.caption ? `${sticker.caption} WhatsApp sticker` : `Shovita WhatsApp sticker ${index + 1}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      art.append(image);

      const caption = document.createElement('span');
      caption.className = 'sticker-caption';
      caption.textContent = sticker.caption || `Reaction ${String(index + 1).padStart(2, '0')}`;
      button.append(art, caption);
      button.addEventListener('click', () => {
        openImagePreview(sticker.src, image.alt, caption.textContent);
      });
      stickerGrid.append(button);
    });

    stickerSection.hidden = false;
    if (stickerNavLink) stickerNavLink.hidden = false;
    revealElements.forEach((element) => {
      if (element === stickerSection && document.documentElement.classList.contains('reveal-ready')) {
        // The section starts hidden; observe it after its sticker cards are ready.
        const revealObserver = new IntersectionObserver((entries, activeObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              activeObserver.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -45px 0px', threshold: 0.08 });
        revealObserver.observe(stickerSection);
      }
    });
  }

  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener('click', () => lightbox.close ? lightbox.close() : lightbox.removeAttribute('open'));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close ? lightbox.close() : lightbox.removeAttribute('open');
    });
  }

  // Keep the birthday song behind the page, and duck it while the gift video plays.
  const birthdaySong = document.getElementById('birthday-song');
  const musicToggle = document.getElementById('music-toggle');
  const giftVideo = document.getElementById('gift-video');

  if (birthdaySong && musicToggle) {
    let musicEnabled = false;
    let songReady = false;

    function setMusicLabel(label) {
      musicToggle.textContent = label;
    }

    function playSong() {
      if (!musicEnabled || !songReady || (giftVideo && !giftVideo.paused && !giftVideo.ended)) return;
      birthdaySong.play().then(() => {
        setMusicLabel('Birthday song band karo ♫');
      }).catch(() => {
        setMusicLabel('Birthday song chalao ♫');
      });
    }

    birthdaySong.addEventListener('canplay', () => {
      songReady = true;
      musicToggle.hidden = false;
    }, { once: true });

    birthdaySong.addEventListener('error', () => {
      songReady = false;
      musicToggle.hidden = true;
    });

    musicToggle.addEventListener('click', () => {
      if (musicEnabled && birthdaySong.paused && (!giftVideo || giftVideo.paused || giftVideo.ended)) {
        playSong();
        return;
      }

      if (musicEnabled) {
        musicEnabled = false;
        birthdaySong.pause();
        setMusicLabel('Birthday song chalao ♫');
        musicToggle.setAttribute('aria-pressed', 'false');
        return;
      }

      musicEnabled = true;
      musicToggle.setAttribute('aria-pressed', 'true');
      if (giftVideo && !giftVideo.paused && !giftVideo.ended) {
        setMusicLabel('Video ke baad song chalu hoga ♫');
      } else {
        playSong();
      }
    });

    if (giftVideo) {
      giftVideo.addEventListener('play', () => {
        if (!birthdaySong.paused) birthdaySong.pause();
        if (musicEnabled) setMusicLabel('Video ke baad song chalu hoga ♫');
      });
      giftVideo.addEventListener('pause', playSong);
      giftVideo.addEventListener('ended', playSong);
    }

    birthdaySong.addEventListener('pause', () => {
      if (!musicEnabled) setMusicLabel('Birthday song chalao ♫');
    });
  }

});
