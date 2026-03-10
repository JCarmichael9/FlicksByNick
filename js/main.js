/* ============================================================
   FlicksByNick — Main JavaScript
   ============================================================ */

/* ── Page Navigation ── */
const PAGES = ['home', 'about', 'galleries', 'contact', 'mobile'];

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

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Close mobile nav if open
  const navCollapse = document.getElementById('navbarNav');
  if (navCollapse && navCollapse.classList.contains('show')) {
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) toggler.click();
  }
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

  // Start on home page
  showPage('home');

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', handleContactSubmit);
});
