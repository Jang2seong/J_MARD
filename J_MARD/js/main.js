const archiveButtons = document.querySelectorAll('.archive-submenu-link');
const interactionLabel = document.createElement('div');
const heroSection = document.getElementById('heroSection');
const heroTitle = document.getElementById('heroTitle');
const heroSubtitle = document.getElementById('heroSubtitle');
interactionLabel.className = 'interaction-label';
document.body.appendChild(interactionLabel);

const blockedKeyCombos = [
  'PrintScreen',
  'F12',
  'F9',
  'F10',
  'F11',
  'Meta+Shift+3',
  'Meta+Shift+4',
  'Ctrl+Shift+I',
  'Ctrl+Shift+J',
  'Ctrl+Shift+C',
  'Ctrl+Shift+K',
  'Ctrl+U',
  'Ctrl+S',
  'Ctrl+P',
  'Meta+S',
  'Meta+P',
  'Meta+Option+I'
];

function isCaptureBlockedKey(event) {
  const modifier = event.ctrlKey ? 'Ctrl' : event.metaKey ? 'Meta' : event.altKey ? 'Alt' : '';
  const shift = event.shiftKey ? '+Shift' : '';
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (event.key === 'PrintScreen' || event.key === 'F12') return true;
  if ((event.ctrlKey || event.metaKey) && ['s', 'c', 'x', 'p', 'u', 'i', 'j'].includes(key.toLowerCase())) return true;
  if (event.altKey && event.key === 'Tab') return true;

  if (modifier) {
    const combo = `${modifier}${shift}+${key}`;
    return blockedKeyCombos.includes(combo) || blockedKeyCombos.includes(`${modifier}${shift}`);
  }

  return false;
}

const archiveOverlay = document.getElementById('archiveOverlay');
const archiveTitle = document.getElementById('archiveTitle');
const archiveDescription = document.getElementById('archiveDescription');
const archiveClose = document.getElementById('archiveClose');
const heroMedia = document.getElementById('heroMedia');
const heroMediaCaption = document.querySelector('.hero-media-caption');
const paintingImage = document.getElementById('paintingImage');
const paintingCaption = document.getElementById('paintingCaption');
const paintingPrev = document.getElementById('paintingPrev');
const paintingNext = document.getElementById('paintingNext');
const mainArea = document.querySelector('.main-area');
const dividerLine = document.querySelector('.divider-line');
const projectsMenu = document.querySelector('a.menu-item[data-target="projects"]');
const imageBase = './images/';
const paintingSlides = [
  {
    image: 'cloud.png',
    alt: '뭉게구름 회화 작품',
    caption: '뭉게구름 116.8x60.2 50P 캔버스에 아크릴'
  },
  {
    image: 'blossom.png',
    alt: '블로섬 회화 작품',
    caption: '블로섬 90x60 40P 캔버스에 아크릴'
  },
  {
    image: 'sea weve.png',
    alt: '바다 물결 회화 작품',
    caption: 'Sea Wave 116.8x60.2 50P 캔버스에 아크릴'
  }
];
const paintingPreloadImages = paintingSlides.map((slide) => {
  const img = new Image();
  img.src = `${imageBase}${slide.image}`;
  return img;
});

if (projectsMenu) {
  projectsMenu.addEventListener('mouseenter', () => projectsMenu.classList.add('is-hovered'));
  projectsMenu.addEventListener('mouseleave', () => projectsMenu.classList.remove('is-hovered'));
}
const sectionOrder = ['home', 'archive', 'painting', 'media', 'about', 'projects', 'contact'];
let currentPaintingIndex = 0;
let scrollTimeout = null;

function updatePaintingSlide(index, animate = true) {
  if (!paintingSlides.length || !paintingImage) return;
  currentPaintingIndex = ((index % paintingSlides.length) + paintingSlides.length) % paintingSlides.length;
  const slide = paintingSlides[currentPaintingIndex];

  paintingImage.classList.remove('fade-in');
  paintingImage.onload = () => {
    requestAnimationFrame(() => {
      paintingImage.classList.add('fade-in');
    });
  };
  paintingImage.onerror = () => {
    paintingImage.classList.add('fade-in');
  };

  paintingImage.src = `${imageBase}${slide.image}`;
  paintingImage.alt = slide.alt;
  if (paintingCaption) {
    paintingCaption.textContent = slide.caption;
  }
}

if (paintingPrev) {
  paintingPrev.addEventListener('click', () => updatePaintingSlide(currentPaintingIndex - 1));
}

if (paintingNext) {
  paintingNext.addEventListener('click', () => updatePaintingSlide(currentPaintingIndex + 1));
}

updatePaintingSlide(currentPaintingIndex);

function scrollToSection(target) {
  setHeroSection(target);
  window.location.hash = target;
}

function handleDividerWheel(event) {
  if (!dividerLine) return;
  event.preventDefault();

  const delta = event.deltaY;
  if (Math.abs(delta) < 10) return;
  if (scrollTimeout) return;

  const currentHash = (window.location.hash || '#home').replace('#', '') || 'home';
  const currentIndex = sectionOrder.indexOf(currentHash);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex;
  if (delta > 0) nextIndex = Math.min(currentIndex + 1, sectionOrder.length - 1);
  if (delta < 0) nextIndex = Math.max(currentIndex - 1, 0);
  if (nextIndex === currentIndex) return;

  scrollToSection(sectionOrder[nextIndex]);
  scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 600);
}

if (dividerLine) {
  dividerLine.addEventListener('wheel', handleDividerWheel, { passive: false });
}

function setHeroSection(target) {
  const sectionMap = {
    home: { title: 'J_MARD', subtitle: 'Creative Director' },
    painting: { title: 'PAINTING', subtitle: '회화' },
    media: { title: 'MEDIA ART', subtitle: '미디어 아트 아카이브' },
    about: { title: 'PROFILE', subtitle: 'Jang seong Lee 1999 08.04' },
    archive: { title: '작가노트', subtitle: '작품 아카이브' },
    projects: { title: 'PROJECTS', subtitle: '프로젝트' },
    contact: { title: 'CONTACT', subtitle: 'mail: ssyaaa3578@naver.com' }
  };

  const section = sectionMap[target] || sectionMap.home;
  const showsArtwork = target === 'painting';
  setHeroTitle(section.title);
  if (heroSubtitle) heroSubtitle.textContent = section.subtitle;
  if (heroSection) heroSection.classList.toggle('hero--section', target !== 'home');
  if (mainArea) mainArea.classList.toggle('artwork-visible', showsArtwork);

  if (heroMedia) {
    heroMedia.classList.toggle('show', showsArtwork);
    heroMedia.setAttribute('aria-hidden', String(!showsArtwork));
  }

  const contactCard = document.getElementById('contactCard');
  const showContact = target === 'contact';
  if (contactCard) {
    contactCard.classList.toggle('show', showContact);
    contactCard.setAttribute('aria-hidden', String(!showContact));
  }

  if (heroMediaCaption && showsArtwork) {
    heroMediaCaption.textContent = '';
  }
}

let heroTitleTransitionTimer = null;

function setHeroTitle(title) {
  if (!heroTitle) return;

  window.clearTimeout(heroTitleTransitionTimer);
  heroTitle.classList.add('is-changing');
  heroTitleTransitionTimer = window.setTimeout(() => {
    heroTitle.textContent = title;
    window.requestAnimationFrame(() => {
      heroTitle.classList.remove('is-changing');
    });
  }, 150);
}

function showArchiveContent(title, description) {
  archiveTitle.textContent = title;
  archiveDescription.textContent = description;
  archiveOverlay.classList.add('show');
  archiveOverlay.setAttribute('aria-hidden', 'false');
}

function hideArchiveContent() {
  archiveOverlay.classList.remove('show');
  archiveOverlay.setAttribute('aria-hidden', 'true');
}

archiveButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const target = button.getAttribute('data-target') || 'home';
    const label = button.getAttribute('data-label');
    const description = button.getAttribute('data-description') || `${label} 섹션으로 이동합니다.`;

    event.preventDefault();
    event.stopPropagation();
    hideArchiveContent();
    setHeroSection(target);
    if (target) {
      window.location.hash = target;
    }

    interactionLabel.textContent = `${label} 섹션으로 이동했습니다.`;
    interactionLabel.classList.add('show');
    setTimeout(() => {
      interactionLabel.classList.remove('show');
    }, 1400);
  });
});

document.querySelectorAll('a.menu-item, .menu-link, .top-nav a').forEach((item) => {
  item.addEventListener('click', (event) => {
    const target = item.getAttribute('data-target') || 'home';
    hideArchiveContent();
    setHeroSection(target);
    if (target) {
      event.preventDefault();
      const safeTarget = String(target).trim().toLowerCase();
      if (safeTarget === 'home' || ['about', 'archive', 'projects', 'contact'].includes(safeTarget)) {
        window.location.hash = safeTarget;
      }
    }
  });
});

document.querySelectorAll('.project-detail-item').forEach((projectItem) => {
  const selectProject = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setHeroTitle(projectItem.dataset.projectTitle || '');
  };

  projectItem.addEventListener('click', selectProject);
  projectItem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      selectProject(event);
    }
  });
});

archiveClose.addEventListener('click', hideArchiveContent);
archiveOverlay.addEventListener('click', (event) => {
  if (event.target === archiveOverlay) {
    hideArchiveContent();
  }
});

const initialTarget = (window.location.hash || '#home').slice(1).trim().toLowerCase();
setHeroSection(sectionOrder.includes(initialTarget) ? initialTarget : 'home');

window.addEventListener('hashchange', () => {
  const target = (window.location.hash || '#home').slice(1).trim().toLowerCase();
  setHeroSection(sectionOrder.includes(target) ? target : 'home');
});

const canvas = document.getElementById('cloudCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let animationFrame = null;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawClouds();
  }

  function drawClouds(time = 0) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const clouds = [
      { x: width * 0.12, y: height * 0.18, scale: 0.9, drift: 0.0007 },
      { x: width * 0.72, y: height * 0.24, scale: 0.7, drift: 0.0005 },
      { x: width * 0.38, y: height * 0.33, scale: 0.6, drift: 0.0009 },
      { x: width * 0.82, y: height * 0.12, scale: 0.5, drift: 0.0006 }
    ];

    clouds.forEach((cloud, index) => {
      const sway = Math.sin(time * cloud.drift + index) * 16;
      drawCloud(cloud.x + sway, cloud.y, cloud.scale);
    });
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.shadowBlur = 22;
    ctx.shadowColor = 'rgba(143, 154, 166, 0.18)';

    const baseColor = 'rgba(255, 255, 255, 0.96)';
    const edgeColor = 'rgba(227, 232, 238, 0.9)';

    drawBlob(-56, 0, 34, baseColor, edgeColor);
    drawBlob(-18, -12, 38, baseColor, edgeColor);
    drawBlob(18, -8, 30, baseColor, edgeColor);
    drawBlob(54, 0, 28, baseColor, edgeColor);
    drawBlob(12, 18, 24, baseColor, edgeColor);

    ctx.restore();
  }

  function drawBlob(x, y, radius, fill, stroke) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }

  function animate() {
    const time = performance.now();
    drawClouds(time);
    animationFrame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
}

document.addEventListener('contextmenu', (event) => {
  if (event.target.closest('.hero-media') || event.target.closest('.painting-left') || event.target.closest('img') || event.target.closest('canvas')) {
    event.preventDefault();
  }
});

document.addEventListener('dragstart', (event) => {
  if (event.target.closest('.painting-left') || event.target.closest('img') || event.target.closest('canvas') || event.target.classList.contains('painting-image')) {
    event.preventDefault();
  }
});

document.addEventListener('selectstart', (event) => {
  if (event.target.closest('img, canvas, .painting-left, .hero-media')) {
    event.preventDefault();
  }
});

document.addEventListener('copy', (event) => {
  event.preventDefault();
});

document.addEventListener('cut', (event) => {
  event.preventDefault();
});

document.addEventListener('paste', (event) => {
  event.preventDefault();
});

document.addEventListener('keydown', (event) => {
  if (isCaptureBlockedKey(event)) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  if (event.key === 'F12' || event.key === 'PrintScreen') {
    event.preventDefault();
    event.stopPropagation();
  }
});

window.addEventListener('blur', () => {
  document.body.classList.add('capture-focus-lost');
});

window.addEventListener('focus', () => {
  document.body.classList.remove('capture-focus-lost');
});

if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
  const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getDisplayMedia = function() {
    return Promise.reject(new DOMException('Screen capture is disabled on this page.', 'NotAllowedError'));
  };
  navigator.mediaDevices.getDisplayMedia = Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', {
    configurable: true,
    writable: true,
    value: function() {
      return Promise.reject(new DOMException('Screen capture is disabled on this page.', 'NotAllowedError'));
    }
  });
}
