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

  // Reset gallery animations when navigating to galleries page
  if (id === 'galleries') {
    resetGalleryAnimations();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ── Reset Gallery Animations ── */
function resetGalleryAnimations() {
  // Reset all gallery items
  document.querySelectorAll('.gallery-item').forEach(item => {
    // Remove animation class
    item.classList.remove('fade-in');
    // Reset opacity
    item.style.opacity = '0';
    // Re-observe the item
    if (galleryObserverInstance) {
      galleryObserverInstance.observe(item);
    }
  });
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
let galleryObserverInstance; // Global reference for observer

function filterGallery(cat, clickedBtn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  // Show/hide items and reset animations
  document.querySelectorAll('.gallery-item').forEach(item => {
    const itemCat = item.dataset.cat;
    if (cat === 'all' || itemCat === cat) {
      item.style.display = '';
      // Reset animation for items coming into view
      item.classList.remove('fade-in');
      item.style.opacity = '0';
      // Re-observe so they animate when scrolled into view
      if (galleryObserverInstance) {
        galleryObserverInstance.observe(item);
      }
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
const BACKEND_URL = 'http://localhost:3000'; // Change if backend is on different domain

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const originalText = btn.innerHTML;
  
  // Get form data
  const formData = {
    name: document.getElementById('contactName').value.trim(),
    email: document.getElementById('contactEmail').value.trim(),
    message: document.getElementById('contactMessage').value.trim()
  };
  
  // Validate required fields
  if (!formData.name || !formData.email || !formData.message) {
    showFormMessage('Please fill out all fields', 'error');
    return;
  }
  
  // Update button
  btn.textContent = 'Sending...';
  btn.disabled = true;
  
  try {
    // Send email via backend
    const response = await fetch(`${BACKEND_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Success
      btn.innerHTML = 'Message Sent ✓';
      btn.style.background = '#2a7a2a';
      showFormMessage(data.message, 'success');
      form.reset();
      
      // Reset button after delay
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } else {
      // Server returned error
      throw new Error(data.message || 'Failed to send email');
    }
  } catch (error) {
    // Network or parsing error
    console.error('Form submission error:', error);
    
    let errorMessage = 'Unable to send message. ';
    if (error.message.includes('Failed to fetch')) {
      errorMessage += 'Is the server running? (npm start)';
    } else {
      errorMessage += error.message;
    }
    
    showFormMessage(errorMessage, 'error');
    
    // Reset button
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function showFormMessage(message, type) {
  // Remove existing message if present
  const existingMessage = document.getElementById('formMessage');
  if (existingMessage) existingMessage.remove();
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.id = 'formMessage';
  messageEl.style.cssText = `
    padding: 12px 16px;
    margin: 15px 0;
    border-radius: 6px;
    font-size: 14px;
    border-left: 4px solid ${type === 'success' ? '#2a7a2a' : '#d32f2f'};
    background-color: ${type === 'success' ? '#e8f5e9' : '#ffebee'};
    color: ${type === 'success' ? '#1b5e20' : '#b71c1c'};
  `;
  messageEl.textContent = message;
  
  // Insert before the form or as first child if no form
  const form = document.getElementById('contactForm');
  form.parentElement.insertBefore(messageEl, form);
  
  // Auto-remove success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => messageEl.remove(), 5000);
  }
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
  galleryObserverInstance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        galleryObserverInstance.unobserve(entry.target); // Only animate once per view
      }
    });
  }, { threshold: 0.25 });
  
  // Initially set all items to opacity 0, then observe them
  document.querySelectorAll('.gallery-item').forEach(item => {
    galleryObserverInstance.observe(item);
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
