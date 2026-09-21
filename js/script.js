document.addEventListener('DOMContentLoaded', () => {
  // 1. Particle Canvas Drift (Sparkles & Stars)
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 45;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 12 + 6;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.symbol = Math.random() > 0.4 ? '✨' : (Math.random() > 0.5 ? '⭐' : '🪄');
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;

        if (this.y < -20 || this.opacity <= 0) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px sans-serif`;
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.restore();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      if (prefersReducedMotion) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    if (!prefersReducedMotion) {
      animateParticles();
    }
  }

  // 2. Scroll Reveal Fade-up
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // 3. Interactive Polaroid Custom Image Upload Handler
  const polaroidFrames = document.querySelectorAll('.polaroid-frame');
  polaroidFrames.forEach(frame => {
    const fileInput = frame.querySelector('.polaroid-file-input');
    const imgWrapper = frame.querySelector('.polaroid-img-wrapper img');

    if (fileInput && imgWrapper) {
      frame.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            imgWrapper.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });

  // 4. 3D Tilt Effect on Gallery Cards
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg rotation
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // 5. Celebrate Button Confetti
  const btn = document.getElementById('celebrateBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.confetti) {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FF69B4', '#FF00FF', '#FFD700', '#DAA520', '#FFFFFF']
        });
      }
    });
  }

  // 6. Blow Candle Interaction
  const candle = document.getElementById('candle');
  const flame = document.getElementById('flame');
  
  if (candle && flame) {
    candle.addEventListener('click', () => {
      if (!flame.classList.contains('blown-out')) {
        flame.classList.add('blown-out');
        
        // Fire mini confetti burst over the cake
        if (window.confetti) {
          const rect = candle.getBoundingClientRect();
          const x = (rect.left + (rect.width / 2)) / window.innerWidth;
          const y = (rect.top + (rect.height / 2)) / window.innerHeight;
          
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: x, y: y },
            colors: ['#FFD700', '#FFFFFF']
          });
        }
      }
    });
  }
});
