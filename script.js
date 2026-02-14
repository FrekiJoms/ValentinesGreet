const envelopeWrap = document.getElementById('envelopeWrap');
const envelope = document.getElementById('envelope');
const burstLayer = document.getElementById('burstLayer');
const resetBtn = document.getElementById('resetBtn');
const letterOverlay = document.getElementById('letterOverlay');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const ambientHearts = document.getElementById('ambientHearts');

const HEART_COUNT = 42;
const SPARKLE_COUNT = 30;
const LETTER_REVEAL_DELAY = 700;
const ENVELOPE_CLOSE_DURATION = 520;
const AMBIENT_HEART_CAP = 20;
const AMBIENT_HEART_INTERVAL = 480;

let burstTimer;
let letterTimer;
let replayTimer;
let ambientTimer;
let isReplaying = false;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clearParticles() {
  burstLayer.textContent = '';
  if (burstTimer) {
    clearTimeout(burstTimer);
  }
}

function clearLetterTimer() {
  if (letterTimer) {
    clearTimeout(letterTimer);
    letterTimer = null;
  }
}

function clearReplayTimer() {
  if (replayTimer) {
    clearTimeout(replayTimer);
    replayTimer = null;
  }
}

function createAmbientHeart() {
  if (!ambientHearts || ambientHearts.childElementCount >= AMBIENT_HEART_CAP) {
    return;
  }

  const heart = document.createElement('span');
  heart.className = 'ambient-heart';

  const size = randomBetween(10, 24);
  const opacity = randomBetween(0.18, 0.58);
  const duration = randomBetween(7.5, 13.5);
  const drift = randomBetween(-55, 55);
  const spin = randomBetween(-35, 35);
  const left = randomBetween(2, 98);

  heart.style.setProperty('--left', `${left}vw`);
  heart.style.setProperty('--a-size', `${size}px`);
  heart.style.setProperty('--a-opacity', opacity.toFixed(2));
  heart.style.setProperty('--a-duration', `${duration}s`);
  heart.style.setProperty('--a-drift', `${drift}px`);
  heart.style.setProperty('--a-spin', `${spin}deg`);

  ambientHearts.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove(), { once: true });
}

function startAmbientHearts() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  for (let i = 0; i < 6; i += 1) {
    createAmbientHeart();
  }

  ambientTimer = setInterval(createAmbientHeart, AMBIENT_HEART_INTERVAL);
}

function hideLetterOverlay() {
  letterOverlay.classList.remove('show');
  letterOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('letter-visible');
}

function showLetterOverlay() {
  letterOverlay.classList.add('show');
  letterOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('letter-visible');
}

function createHeart() {
  const heart = document.createElement('span');
  heart.className = 'heart';

  const size = randomBetween(8, 24);
  const driftX = randomBetween(-210, 210);
  const riseY = randomBetween(-360, -620);
  const duration = randomBetween(2.8, 5.4);
  const delay = randomBetween(0, 0.65);
  const opacity = randomBetween(0.38, 0.9);
  const spin = randomBetween(-45, 45);

  heart.style.setProperty('--size', `${size}px`);
  heart.style.setProperty('--x', `${driftX}px`);
  heart.style.setProperty('--y', `${riseY}px`);
  heart.style.setProperty('--duration', `${duration}s`);
  heart.style.setProperty('--delay', `${delay}s`);
  heart.style.setProperty('--opacity', opacity.toFixed(2));
  heart.style.setProperty('--spin', `${spin}deg`);

  return heart;
}

function createSparkle() {
  const sparkle = document.createElement('span');
  sparkle.className = 'sparkle';

  const size = randomBetween(3, 8);
  const driftX = randomBetween(-240, 240);
  const riseY = randomBetween(-120, -460);
  const duration = randomBetween(1.6, 3.2);
  const delay = randomBetween(0, 0.7);

  sparkle.style.setProperty('--s-size', `${size}px`);
  sparkle.style.setProperty('--sx', `${driftX}px`);
  sparkle.style.setProperty('--sy', `${riseY}px`);
  sparkle.style.setProperty('--s-duration', `${duration}s`);
  sparkle.style.setProperty('--s-delay', `${delay}s`);

  return sparkle;
}

function burstParticles() {
  clearParticles();
  const frag = document.createDocumentFragment();

  for (let i = 0; i < HEART_COUNT; i += 1) {
    frag.appendChild(createHeart());
  }

  for (let i = 0; i < SPARKLE_COUNT; i += 1) {
    frag.appendChild(createSparkle());
  }

  burstLayer.appendChild(frag);
  burstTimer = setTimeout(() => {
    burstLayer.textContent = '';
  }, 6200);
}

function openEnvelope(force = false) {
  if (!force && isReplaying) {
    return;
  }

  if (!force && envelope.classList.contains('open')) {
    return;
  }

  envelope.classList.add('open');
  burstParticles();

  clearLetterTimer();
  letterTimer = setTimeout(showLetterOverlay, LETTER_REVEAL_DELAY);
}

function resetEnvelope() {
  if (isReplaying) {
    return;
  }

  isReplaying = true;
  resetBtn.disabled = true;
  hideLetterOverlay();
  clearLetterTimer();
  clearReplayTimer();
  envelope.classList.remove('open');
  clearParticles();
  // Force a reflow so the next open animation always restarts cleanly.
  void envelope.offsetWidth;

  replayTimer = setTimeout(() => {
    openEnvelope(true);
    isReplaying = false;
    resetBtn.disabled = false;
    replayTimer = null;
  }, ENVELOPE_CLOSE_DURATION);
}

function closeLetterExperience() {
  hideLetterOverlay();
  clearLetterTimer();
  clearReplayTimer();
  isReplaying = false;
  resetBtn.disabled = false;
  envelope.classList.remove('open');
  clearParticles();
}

envelopeWrap.addEventListener('click', openEnvelope);
envelopeWrap.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openEnvelope();
  }
});

resetBtn.addEventListener('click', resetEnvelope);
closeLetterBtn.addEventListener('click', closeLetterExperience);
letterOverlay.addEventListener('click', (event) => {
  if (event.target === letterOverlay) {
    closeLetterExperience();
  }
});

startAmbientHearts();
