document.addEventListener('DOMContentLoaded', () => {
  /* ==================== CONSTANTS ==================== */
  const WHATSAPP_NUMBER = '59168831831';
  // 12 de diciembre de 2026 a las 7:00 PM (19:00)
  const EVENT_DATE = new Date(2026, 11, 12, 19, 0, 0).getTime();

  /* ==================== ELEMENTS ==================== */
  const coverScreen = document.getElementById('cover-screen');
  const invitationScreen = document.getElementById('invitation-screen');
  const envelope3d = document.getElementById('envelope-3d');
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const openTextBtn = document.getElementById('open-text-btn');
  const backToCoverBtn = document.getElementById('back-to-cover-btn');

  // Countdown
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  // Audio player
  const bgMusic = document.getElementById('bg-music');
  const waveform = document.getElementById('waveform');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const restartAudioBtn = document.getElementById('restart-audio-btn');
  const muteAudioBtn = document.getElementById('mute-audio-btn');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const iconVol = document.getElementById('icon-vol');
  const iconMute = document.getElementById('icon-mute');

  // RSVP Modal
  const rsvpModal = document.getElementById('rsvp-modal');
  const openRsvpBtn = document.getElementById('open-rsvp-btn');
  const closeRsvpBtn = document.getElementById('close-rsvp-btn');
  const rsvpForm = document.getElementById('rsvp-form');

  // Photo Lightbox
  const photoModal = document.getElementById('photo-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closePhotoBtn = document.getElementById('close-photo-btn');

  /* ==================== SPARKLE CANVAS ==================== */
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speedY: Math.random() * 0.25 + 0.08,
      twinkle: Math.random() * 0.02 + 0.005,
    }));
  }

  function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.y -= p.speedY;
      p.alpha += p.twinkle;
      if (p.alpha > 0.85 || p.alpha < 0.15) p.twinkle *= -1;
      if (p.y < -5) {
        p.y = canvas.height + 5;
        p.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 242, 255, ${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(animateSparkles);
  }

  resizeCanvas();
  createParticles();
  animateSparkles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  /* ==================== AUDIO PLAYER (musica.mp3) ==================== */
  let isPlaying = false;
  let isMuted = false;

  function updatePlayerUI() {
    waveform.classList.toggle('playing', isPlaying);
    iconPlay.classList.toggle('hidden', isPlaying);
    iconPause.classList.toggle('hidden', !isPlaying);
    iconVol.classList.toggle('hidden', isMuted);
    iconMute.classList.toggle('hidden', !isMuted);
  }

  function startMusic() {
    bgMusic.muted = isMuted;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updatePlayerUI();
        })
        .catch(() => {
          isPlaying = false;
          updatePlayerUI();
        });
    } else {
      isPlaying = true;
      updatePlayerUI();
    }
  }

  function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    updatePlayerUI();
  }

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  });

  restartAudioBtn.addEventListener('click', () => {
    bgMusic.currentTime = 0;
    startMusic();
  });

  muteAudioBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    updatePlayerUI();
  });

  /* ==================== ENVELOPE OPEN / CLOSE ==================== */
  function openInvitation() {
    envelope3d.classList.add('opening');
    startMusic();

    setTimeout(() => {
      coverScreen.classList.add('is-leaving');
      invitationScreen.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'instant' });
      triggerInitialReveals();
    }, 650);
  }

  function returnToCover() {
    pauseMusic();
    envelope3d.classList.remove('opening');
    coverScreen.classList.remove('is-leaving');
    invitationScreen.classList.remove('visible');
  }

  openEnvelopeBtn.addEventListener('click', openInvitation);
  openTextBtn.addEventListener('click', openInvitation);
  backToCoverBtn.addEventListener('click', returnToCover);

  /* ==================== COUNTDOWN TIMER ==================== */
  function pad(num) {
    return String(Math.max(0, num)).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==================== SCROLL REVEAL ==================== */
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => observer.observe(el));

  function triggerInitialReveals() {
    revealItems.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add('in-view');
      }
    });
  }

  /* ==================== RSVP MODAL (WHATSAPP) ==================== */
  openRsvpBtn.addEventListener('click', () => {
    rsvpModal.classList.add('open');
  });

  closeRsvpBtn.addEventListener('click', () => {
    rsvpModal.classList.remove('open');
  });

  rsvpModal.addEventListener('click', (e) => {
    if (e.target === rsvpModal) {
      rsvpModal.classList.remove('open');
    }
  });

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value.trim();
    const attendance = document.getElementById('guest-attendance').value;
    const count = document.getElementById('guest-count').value;
    const message = document.getElementById('guest-message').value.trim();

    let text = `¡Hola Alejandra! Soy *${name}*.\n`;
    text += `Confirmación para tu graduación (12 de diciembre, 7:00 PM):\n`;
    text += `• Asistencia: *${attendance}*\n`;
    text += `• Cantidad de personas: *${count}*`;
    if (message) {
      text += `\n• Mensaje: "${message}"`;
    }

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    rsvpModal.classList.remove('open');
  });

  /* ==================== PHOTO LIGHTBOX ==================== */
  document.querySelectorAll('.polaroid').forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-photo');
      const caption = card.getAttribute('data-caption');
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      photoModal.classList.add('open');
    });
  });

  closePhotoBtn.addEventListener('click', () => {
    photoModal.classList.remove('open');
  });

  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
      photoModal.classList.remove('open');
    }
  });
});
