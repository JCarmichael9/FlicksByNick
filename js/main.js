/* ============================================================
   NicksFlicks — Main JavaScript
   ============================================================ */

/* ── Page Navigation ── */
const PAGES = ['home', 'about', 'galleries', 'contact'];

function showPage(id) {
  document.querySelectorAll('.site-page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');

  document.querySelectorAll('.sw-btn').forEach((btn, i) => {
    btn.classList.toggle('active', PAGES[i] === id);
  });

  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    link.classList.remove('active-link');
    if (link.dataset.page === id) link.classList.add('active-link');
  });

  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    document.querySelector('.navbar-toggler').click();
  }

  if (id === 'galleries') {
    resetGalleryAnimations();
  }

  if (id === 'about') {
    animateCounters();
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ── Build Gallery from JSON ── */
function buildGalleryItem(photo) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.dataset.cat = photo.category;
  if (photo.description) div.dataset.desc = photo.description;

  const img = document.createElement('img');
  img.src = photo.src;
  img.alt = photo.alt || '';
  img.style.cursor = 'pointer';

  const watermark = document.createElement('div');
  watermark.className = 'gallery-watermark';
  watermark.innerHTML = '<span>NicksFlicks</span>';

  const tag = document.createElement('div');
  tag.className = 'gallery-sport-tag';
  tag.textContent = photo.sportTag || '';

  div.appendChild(img);
  div.appendChild(watermark);
  div.appendChild(tag);

  img.addEventListener('click', function () {
    openGalleryModal(this);
  });

  return div;
}

/* ── Shuffle Array (Fisher-Yates) ── */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Paste your published Google Sheet CSV URL here:
const CSV_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTOqdRiTncUrIdkpOzHSRpXhxUE4hIVTw0bqZ3sa4xzNeQDR1mK52wVH5kJdovVIym0Kt8hZ78Sukhr/pub?gid=0&single=true&output=csv&t=${Date.now()}`;
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error('Failed to load sheet');
    const text = await res.text();

    // Parse CSV into array of objects
    const [headerLine, ...rows] = text.trim().split('\n');
    const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const photos = rows.map(row => {
      const values = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = (values[i] || '').replace(/^"|"$/g, '').trim();
      });
      return obj;
    }).filter(p => p.src);

    const shuffled = shuffleArray(photos);
    grid.innerHTML = '';
    shuffled.forEach(photo => grid.appendChild(buildGalleryItem(photo)));

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.style.opacity = '0';
      galleryObserverInstance.observe(item);
    });

    const totalEl = document.getElementById('galleryImageTotal');
    if (totalEl) totalEl.textContent = photos.length;

  } catch (err) {
    console.error('Gallery load error:', err);
    grid.innerHTML = '<p style="color:var(--muted);padding:40px;text-align:center;">Unable to load gallery.</p>';
  }
}
/* ── Reset Gallery Animations ── */
function resetGalleryAnimations() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.classList.remove('fade-in');
    item.style.opacity = '0';
    if (galleryObserverInstance) {
      galleryObserverInstance.observe(item);
    }
  });
}

/* ── Navbar scroll effect ── */
function handleNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

/* ── Gallery Filter ── */
let galleryObserverInstance;

function filterGallery(cat, clickedBtn) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  document.querySelectorAll('.gallery-item').forEach(item => {
    const match = cat === 'all' || item.dataset.cat === cat;
    item.style.display = match ? '' : 'none';
    if (match) {
      item.classList.remove('fade-in');
      item.style.opacity = '0';
      if (galleryObserverInstance) galleryObserverInstance.observe(item);
    }
  });
}

/* ── Gallery Lightbox ── */
let currentGalleryIndex = 0;
let visibleGalleryImages = [];

function openGalleryModal(imgElement) {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImage');
  const downloadBtn = document.getElementById('galleryDownloadBtn');

  visibleGalleryImages = Array.from(document.querySelectorAll('.gallery-item')).filter(item => {
    return item.style.display !== 'none';
  });

  const clickedItem = imgElement.parentElement;
  currentGalleryIndex = visibleGalleryImages.indexOf(clickedItem);

  modalImg.src = imgElement.src;
  downloadBtn.href = imgElement.src;
  modal.style.display = 'flex';
  updateGalleryCounter();

  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  document.getElementById('galleryModal').style.display = 'none';
  document.body.style.overflow = '';
}

function nextGalleryImage() {
  if (!visibleGalleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryImages.length;
  updateGalleryModalImage();
}

function prevGalleryImage() {
  if (!visibleGalleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
  updateGalleryModalImage();
}

function updateGalleryModalImage() {
  const modalImg = document.getElementById('galleryModalImage');
  const downloadBtn = document.getElementById('galleryDownloadBtn');
  const galleryItem = visibleGalleryImages[currentGalleryIndex];
  const img = galleryItem.querySelector('img');
  modalImg.src = img.src;
  downloadBtn.href = img.src;
  updateGalleryCounter();
}

function updateGalleryCounter() {
  document.getElementById('galleryImageCounter').textContent = currentGalleryIndex + 1;
  document.getElementById('galleryImageTotal').textContent = visibleGalleryImages.length;
}

/* ── Scroll to Top ── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleGalleryScroll() {
  const btn = document.getElementById('scrollToTopBtn');
  if (!btn) return;
  if (document.getElementById('page-galleries').classList.contains('active')) {
    btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }
}

/* ── Contact Form ── */
function handleContactSubmit(e) {
  e.preventDefault();
  
  const nameField = document.getElementById('contactName');
  const emailField = document.getElementById('contactEmail');
  const messageField = document.getElementById('contactMessage');
  
  // Validate all fields are filled
  if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
    alert('Please fill out all fields before submitting.');
    return;
  }
  
  const btn = document.getElementById('submitBtn');
  const originalText = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#2a7a2a';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      document.getElementById('contactForm').reset();
    }, 2500);
  }, 1200);
}

/* ── Counter Animation ── */
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const duration = 500; // 1 second
  const framerate = 50; // update 50 times per second

  counters.forEach(counter => {
    // Reset counter to 0
    counter.textContent = '0';
    
    const target = parseInt(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const increment = target / (duration / (1000 / framerate));
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        counter.textContent = current + suffix;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, 1000 / framerate);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Set up intersection observer before loading gallery
  galleryObserverInstance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        galleryObserverInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  // Load gallery from JSON, then show home page
  loadGallery().then(() => {
    setTimeout(() => showPage('home'), 0);
  });

  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', handleContactSubmit);

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('galleryModal');
    if (modal.style.display === 'flex') {
      if (e.key === 'ArrowRight') nextGalleryImage();
      if (e.key === 'ArrowLeft') prevGalleryImage();
      if (e.key === 'Escape') closeGalleryModal();
    }
  });

  document.querySelector('.gallery-modal-overlay').addEventListener('click', closeGalleryModal);
  window.addEventListener('scroll', handleGalleryScroll, { passive: true });
});