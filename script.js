const envelopeWrap = document.getElementById('envelopeWrap');
const envelope = document.getElementById('envelope');
const burstLayer = document.getElementById('burstLayer');
const resetBtn = document.getElementById('resetBtn');
const letterOverlay = document.getElementById('letterOverlay');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const ambientHearts = document.getElementById('ambientHearts');
const floatingProfile = document.getElementById('floating-profile');
const profileModal = document.getElementById('profileModal');
const closeProfileBtn = document.getElementById('closeProfileBtn');

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
let currentCustomLetter = null; // Store custom letter if loaded from URL

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

  // Track event with Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'envelope_opened', {
      'event_category': 'engagement',
      'event_label': 'User opened valentine envelope'
    });
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

// Hide replay button and keep showing custom letter if viewing a shared letter
function hideReplayButtonIfCustomLetter() {
  const letterId = getUrlParameter('letter');
  if (letterId && resetBtn) {
    resetBtn.style.display = 'none';
  }
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

function openProfileModal() {
  // Track event with Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'profile_modal_opened', {
      'event_category': 'engagement',
      'event_label': 'User viewed creator profile'
    });
  }

  profileModal.classList.add('show');
  profileModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('profile-modal-visible');
}

function closeProfileModal() {
  profileModal.classList.remove('show');
  profileModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('profile-modal-visible');
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
floatingProfile.addEventListener('click', openProfileModal);
floatingProfile.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openProfileModal();
  }
});
closeProfileBtn.addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    closeProfileModal();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profileModal.classList.contains('show')) {
    closeProfileModal();
  }
});

startAmbientHearts();

// -- Greeting letters: randomly choose one on each page load ----------------
const GREETING_LETTERS = [
  {
    title: 'Hey You,',
    paragraphs: [
      'Hi. Na-miss lang kita a little, so I left this small note to make you smile kahit saglit.',
      'I really appreciate the time you give, even the simple chats. Ang laki ng effect nun sa day ko.',
      'If you ever need company, nandito lang ako. Coffee, walk, or quiet tambay. I’m good.'
    ],
    signoff: ['Always,', 'Freki (Josh)']
  },
  {
    title: 'Hello :)',
    paragraphs: [
      'Kamusta ka? I kinda miss our random kwentos, pati yung nonsense talks that somehow make everything lighter.',
      'Your messages, updates, even memes. Maliit man, pero they mean a lot to me.',
      'Sana we can hang out soon. Kahit simple lang, basta magkasama.'
    ],
    signoff: ['Ingat palagi,', 'Freki (Josh)']
  },
  {
    title: 'Smile muna',
    paragraphs: [
      'Quick reminder: na-appreciate kita. Baka hindi mo napapansin, pero I do.',
      'Every small effort, every reply, every time you remember me. Thank you talaga.',
      'No rush. When you’re ready, we’ll find time to chill.'
    ],
    signoff: ['Warmly,', 'Freki (Josh)']
  },
  {
    title: 'Kamusta?',
    paragraphs: [
      'If busy ka, okay lang. But if you have a little time, message me. Gusto ko lang malaman how you are.',
      'Thanks for the simple gestures. You make normal days feel better, pramis.',
      'I miss the jokes, the stories, and even the plans na hanggang drawing board pa.'
    ],
    signoff: ['Here lang,', 'Freki (Josh)']
  },
  {
    title: 'Hi Friend,',
    paragraphs: [
      'Reminder lang: you matter. And yes, kasama ako sa nagca-care.',
      'I hope you get rest and find small things that make you happy today.',
      'Kapag ready ka, let’s go out. Food, talk, tambay. No pressure at all.'
    ],
    signoff: ['See you soon,', 'Freki (Josh)']
  },

  // NEW ONES -------------------------------------------------------------

  {
    title: 'Uy Ikaw,',
    paragraphs: [
      'Just passing by your day to say hi. Sana okay ka right now.',
      'If things feel heavy, pahinga ka muna. You do not have to carry everything at once.',
      'Message me anytime. Kahit random thought lang, go.'
    ],
    signoff: ['Nandito lang,', 'Freki (Josh)']
  },
  {
    title: 'Hi :)',
    paragraphs: [
      'I hope something good happens to you today. Kahit maliit lang, okay na.',
      'Thank you for being someone I can talk to. That means more than you think.',
      'Libre mo ako ng time mo minsan ha. Kahit saglit lang.'
    ],
    signoff: ['Always rooting for you,', 'Freki (Josh)']
  },
  {
    title: 'Quick hello',
    paragraphs: [
      'Wala lang. I just wanted you to know someone is thinking about you.',
      'Life gets busy, minsan magulo. But you are doing better than you think.',
      'If napagod ka, rest. I will still be here.'
    ],
    signoff: ['Take it easy,', 'Freki (Josh)']
  },
  {
    title: 'Hoy :)',
    paragraphs: [
      'Drink water, breathe, and smile a little for me.',
      'Salamat sa presence mo. Kahit tahimik lang minsan, it matters.',
      'Balang araw, sabay tayo ulit magkwento nang walang iniisip na oras.'
    ],
    signoff: ['Okay?', 'Freki (Josh)']
  },
  {
    title: 'For you,',
    paragraphs: [
      'Not sure if you need this, but I am proud of you.',
      'You survive days people do not even know were hard for you. Astig ka.',
      'And if you ever doubt yourself, kausapin mo lang ako.'
    ],
    signoff: ['Proud of you palagi,', 'Freki (Josh)']
  }
];

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (s) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}

function renderLetter(letter) {
  const titleEl = document.getElementById('letterTitle');
  const contentEl = document.getElementById('letterContent');
  if (!titleEl || !contentEl) return;

  titleEl.textContent = letter.title || '';
  const html = (letter.paragraphs || []).map(p => `<p>${escapeHTML(p)}</p>`).join('') +
    `<p class="letter-signoff">${escapeHTML(letter.signoff[0] || '')}<br><span>${escapeHTML(letter.signoff[1] || '')}</span></p>`;
  contentEl.innerHTML = html;
}

function pickRandomLetter() {
  const idx = Math.floor(Math.random() * GREETING_LETTERS.length);
  renderLetter(GREETING_LETTERS[idx]);
}

// Get URL parameter value
function getUrlParameter(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

// Fetch custom letter from Supabase
async function fetchCustomLetter(letterId) {
  if (!supabaseClient) {
    console.log('Supabase not initialized. Using random greeting instead.');
    return null;
  }

  try {
    const { data, error } = await supabaseClient
      .from('user_letters')
      .select('*')
      .eq('letter_id', letterId)
      .single();

    if (error) {
      console.error('Error fetching letter:', error);
      return null;
    }

    // Increment view count
    if (data) {
      supabaseClient
        .from('user_letters')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('letter_id', letterId)
        .then()
        .catch(err => console.error('Failed to update view count:', err));
    }

    return data;
  } catch (err) {
    console.error('Failed to fetch custom letter:', err);
    return null;
  }
}

// Format custom letter to match the greeting letter structure
function formatCustomLetterForDisplay(data) {
  if (!data) return null;
  
  return {
    title: data.recipient_name ? `For ${data.recipient_name},` : 'A Letter for You,',
    paragraphs: [
      data.message || ''
    ],
    signoff: ['With love,', data.sender_name || 'Unknown']
  };
}

// Meta tags are now static - no longer need dynamic updates
// All letters share the same generic message: "I sent you a Valentine's Card!"

// Show sender info for custom letters
function showSenderInfo(senderName) {
  const senderInfo = document.getElementById('senderInfo');
  const senderNameEl = document.getElementById('senderName');
  if (senderInfo && senderNameEl) {
    senderNameEl.textContent = senderName;
    senderInfo.style.display = 'block';
  }
}

// Hide sender info for default greetings
function hideSenderInfo() {
  const senderInfo = document.getElementById('senderInfo');
  if (senderInfo) {
    senderInfo.style.display = 'none';
  }
}
async function loadAndDisplayLetter() {
  const letterId = getUrlParameter('letter');
  
  if (letterId) {
    // Try to load custom letter
    const customLetterData = await fetchCustomLetter(letterId);
    if (customLetterData) {
      currentCustomLetter = formatCustomLetterForDisplay(customLetterData);
      renderLetter(currentCustomLetter);
      hideReplayButtonIfCustomLetter();
      showSenderInfo(customLetterData.sender_name);
      return;
    }
  }
  
  // Fall back to random greeting
  hideSenderInfo();
  pickRandomLetter();
}

// Pick a random greeting on load, or load custom letter if URL has ?letter=
window.addEventListener('load', loadAndDisplayLetter);


// Ensure `.floating-header2` sits exactly 5px below the main floating header.
function adjustFloatingHeaderGap() {
  const mainHeader = document.getElementById('floating-profile');
  const dateHeader = document.querySelector('.floating-header2');
  if (!mainHeader || !dateHeader) return;

  const rect = mainHeader.getBoundingClientRect();
  // rect.bottom is viewport pixels from top; for fixed positioning we can use that directly.
  const desiredTop = Math.round(rect.bottom + 5);
  dateHeader.style.top = `${desiredTop}px`;
}

// Run on load and on resize/orientation changes.
window.addEventListener('load', adjustFloatingHeaderGap);
window.addEventListener('resize', adjustFloatingHeaderGap);
window.addEventListener('orientationchange', adjustFloatingHeaderGap);

// Observe header size changes (handles font loading, avatar image, or dynamic content).
const observedHeader = document.getElementById('floating-profile');
if (observedHeader && window.ResizeObserver) {
  const ro = new ResizeObserver(adjustFloatingHeaderGap);
  ro.observe(observedHeader);
}

// -- Share letter functionality ----------------
const shareLetterBtn = document.getElementById('shareLetterBtn');

async function shareLetter() {
  const url = window.location.href;
  const title = 'FrekiJosh sent you a Valentine\'s Card!';
  const text = 'I opened my heart for you. Tap to see what\'s inside...';

  // Track event with Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'letter_shared', {
      'event_category': 'engagement',
      'event_label': 'User shared the valentine card'
    });
  }

  // Try using Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url
      });
      return;
    } catch (err) {
      // User cancelled or share failed, fall back to copy
    }
  }

  // Fallback: copy URL to clipboard
  try {
    await navigator.clipboard.writeText(url);
    showShareNotification('Link copied to clipboard!');
  } catch (err) {
    // Last resort: select text for manual copy
    const tempInput = document.createElement('textarea');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showShareNotification('Link copied!');
  }
}

function showShareNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'share-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);

  // Remove after 2.5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 2500);
}

if (shareLetterBtn) {
  shareLetterBtn.addEventListener('click', shareLetter);
}

// -- Letter Editor Modal Functionality ----------------

// TODO: Initialize Supabase with your credentials
// Get these from your Supabase project dashboard
const SUPABASE_URL = 'https://iaseqpmzgxykdkuuehyp.supabase.co'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhc2VxcG16Z3h5a2RrdXVlaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzM3NzMsImV4cCI6MjA4NjY0OTc3M30.KLU_ElpB63wQ8rZF-JwzfwL7ZHAnRjuNnJXU5f6NtOA'; // Your anonymous key

let supabaseClient = null;

// Initialize Supabase if credentials are set
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
}

const createLetterBtn = document.getElementById('createLetterBtn');
const letterEditorModal = document.getElementById('letterEditorModal');
const closeEditorBtn = document.getElementById('closeEditorBtn');
const cancelEditorBtn = document.getElementById('cancelEditorBtn');
const letterForm = document.getElementById('letterForm');
const charCountEl = document.getElementById('charCount');
const messageInput = document.getElementById('formLetterMessage');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Track character count
if (messageInput) {
  messageInput.addEventListener('input', (e) => {
    const count = e.target.value.length;
    charCountEl.textContent = `${count} / 2000 characters`;
  });
}

function openLetterEditor() {
  if (!supabaseClient) {
    alert('Letter creation is not available yet. Please contact support.');
    return;
  }
  letterEditorModal.classList.add('show');
  letterEditorModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('editor-modal-visible');
}

function closeLetterEditor() {
  letterEditorModal.classList.remove('show');
  letterEditorModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('editor-modal-visible');
  letterForm.reset();
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
  charCountEl.textContent = '0 / 2000 characters';
  // Reset form visibility after closing
  document.getElementById('formFields').style.display = 'block';
}

async function submitLetter(e) {
  e.preventDefault();

  const senderName = document.getElementById('formSenderName').value.trim();
  const recipientName = document.getElementById('formRecipientName').value.trim();
  const letterTitle = document.getElementById('formLetterTitle').value.trim();
  const letterMessage = document.getElementById('formLetterMessage').value.trim();

  if (!senderName || !recipientName || !letterTitle || !letterMessage) {
    showError('Please fill in all fields');
    return;
  }

  const submitBtn = document.getElementById('submitLetterBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating...';

  try {
    // Generate a unique ID for the letter
    const letterId = generateUniqueId();

    // Save to Supabase
    const { data, error } = await supabaseClient
      .from('user_letters')
      .insert([
        {
          letter_id: letterId,
          sender_name: senderName,
          recipient_name: recipientName,
          title: letterTitle,
          message: letterMessage,
          created_at: new Date().toISOString(),
          view_count: 0
        }
      ]);

    if (error) {
      showError('Failed to create letter: ' + error.message);
      return;
    }

    // Generate shareable URL
    const shareUrl = `${window.location.origin}?letter=${letterId}`;

    // Hide form fields and show success message
    document.getElementById('formFields').style.display = 'none';
    successMessage.style.display = 'block';
    document.getElementById('generatedUrl').value = shareUrl;

    // Track event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'letter_created', {
        'event_category': 'engagement',
        'event_label': 'User created custom letter'
      });
    }

  } catch (err) {
    showError('An error occurred: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create & Get Link';
  }
}

function generateUniqueId() {
  return 'letter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

// Event listeners for letter editor
if (createLetterBtn) {
  createLetterBtn.addEventListener('click', openLetterEditor);
}

if (closeEditorBtn) {
  closeEditorBtn.addEventListener('click', closeLetterEditor);
}

if (cancelEditorBtn) {
  cancelEditorBtn.addEventListener('click', closeLetterEditor);
}

if (letterForm) {
  letterForm.addEventListener('submit', submitLetter);
}

// Copy URL button
const copyUrlBtn = document.getElementById('copyUrlBtn');
if (copyUrlBtn) {
  copyUrlBtn.addEventListener('click', async () => {
    const urlInput = document.getElementById('generatedUrl');
    try {
      await navigator.clipboard.writeText(urlInput.value);
      showShareNotification('Link copied to clipboard!');
    } catch {
      urlInput.select();
      document.execCommand('copy');
      showShareNotification('Link copied!');
    }
  });
}

// Close editor on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && letterEditorModal.classList.contains('show')) {
    closeLetterEditor();
  }
});

// Close editor on background click
letterEditorModal.addEventListener('click', (e) => {
  if (e.target === letterEditorModal) {
    closeLetterEditor();
  }
});

// Add overflow hidden when editor is open
const originalBodyOverflow = document.body.style.overflow;

function addOverflowHidden() {
  document.body.style.overflow = 'hidden';
}

function removeOverflowHidden() {
  document.body.style.overflow = originalBodyOverflow;
}

// -- Track social link clicks ----------------
const socialLinks = document.querySelectorAll('.social-link');
const feedbackBtn = document.querySelector('.feedback-btn');

socialLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const platform = link.querySelector('span:last-child')?.textContent || 'Unknown';
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_link_clicked', {
        'event_category': 'outbound',
        'event_label': `Clicked: ${platform}`,
        'link_url': link.href
      });
    }
  });
});

if (feedbackBtn) {
  feedbackBtn.addEventListener('click', (e) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feedback_clicked', {
        'event_category': 'outbound',
        'event_label': 'User sent feedback email'
      });
    }
  });
}
