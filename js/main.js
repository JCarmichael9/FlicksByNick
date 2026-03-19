/* ============================================================
   FlicksByNick — Main JavaScript
   ============================================================ */

/* ── Page Navigation ── */
const PAGES = ['home', 'about', 'galleries', 'contact'];

function showPage(id) {
  // Hide all pages
  document.querySelectorAll('.site-page').forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');

  // Update switcher buttons
  document.querySelectorAll('.sw-btn').forEach((btn, i) => {
    btn.classList.toggle('active', PAGES[i] === id);
  });

  // Update nav link highlights
  document.querySelectorAll('#mainNav .nav-link').forEach(link => {
    link.classList.remove('active-link');
    if (link.dataset.page === id) link.classList.add('active-link');
  });

  // Close navbar collapse on mobile
  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    const navbarToggler = document.querySelector('.navbar-toggler');
    navbarToggler.click();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ── Navbar scroll effect ── */
function handleNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

/* ── Gallery Filter ── */
function filterGallery(cat, clickedBtn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  // Show/hide items
  document.querySelectorAll('.gallery-item').forEach(item => {
    const itemCat = item.dataset.cat;
    if (cat === 'all' || itemCat === cat) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

/* ── Gallery Lightbox ── */
let currentGalleryIndex = 0;
let visibleGalleryImages = [];

function openGalleryModal(imgElement) {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImage');
  
  // Get all visible gallery items
  visibleGalleryImages = Array.from(document.querySelectorAll('.gallery-item')).filter(item => {
    return item.style.display !== 'none';
  });
  
  // Find the clicked image index
  const clickedImg = imgElement.parentElement;
  currentGalleryIndex = visibleGalleryImages.indexOf(clickedImg);
  
  // Set the modal image
  modalImg.src = imgElement.src;
  modal.style.display = 'flex';
  updateGalleryCounter();
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  const modal = document.getElementById('galleryModal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function nextGalleryImage() {
  if (visibleGalleryImages.length === 0) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryImages.length;
  updateGalleryModalImage();
}

function prevGalleryImage() {
  if (visibleGalleryImages.length === 0) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
  updateGalleryModalImage();
}

function updateGalleryModalImage() {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImage');
  const galleryItem = visibleGalleryImages[currentGalleryIndex];
  const img = galleryItem.querySelector('img');
  
  modalImg.src = img.src;
  updateGalleryCounter();
}

function updateGalleryCounter() {
  document.getElementById('galleryImageCounter').textContent = currentGalleryIndex + 1;
  document.getElementById('galleryImageTotal').textContent = visibleGalleryImages.length;
}

/* ── Contact Form ── */
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const originalText = btn.textContent;

  // Simulate send
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

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll listener
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Give Bootstrap a tick to initialize before touching the navbar
  setTimeout(() => showPage('home'), 0);

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', handleContactSubmit);
  
  // Gallery lightbox - add click handlers to all gallery images
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      openGalleryModal(this);
    });
  });
  
  // Fade-in animation for gallery items on scroll
  // Triggers when 25% of the image is visible in viewport
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        galleryObserver.unobserve(entry.target); // Only animate once per image
      }
    });
  }, { threshold: 0.25 });
  
  // Initially set all items to opacity 0, then observe them
  document.querySelectorAll('.gallery-item').forEach(item => {
    galleryObserver.observe(item);
  });
  
  // Keyboard navigation for gallery modal
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('galleryModal');
    if (modal.style.display === 'flex') {
      if (e.key === 'ArrowRight') nextGalleryImage();
      if (e.key === 'ArrowLeft') prevGalleryImage();
      if (e.key === 'Escape') closeGalleryModal();
    }
  });
  
  // Close modal on overlay click
  document.querySelector('.gallery-modal-overlay').addEventListener('click', closeGalleryModal);
});
