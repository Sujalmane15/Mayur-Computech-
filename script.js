/* ===================================================
   MAYUR COMPUTECH - Vanilla JavaScript
   Interactive Course Filter & Features
=================================================== */

// Course Database
const coursesData = [
  {
    id: 'mscit',
    title: 'MS-CIT Course',
    category: 'beginner',
    duration: '3 Months',
    subtitle: 'Govt. Recognized · MS-Office 2021 & AI Tools',
    icon: '💻',
    image: 'mscit-official-banner.png',
    badge: 'MS-Office 2021 · Center: 78210482',
    topics: [
      'Computer Fundamentals & Windows 10/11',
      'MS Office 2021 Suite (Word, Excel, PPT, Outlook)',
      'MKCL Advanced Tools & Productivity',
      'Internet, Cyber Security & Modern AI Tools',
      '1000+ Govt. Exam Practice MCQs'
    ]
  },
  {
    id: 'msoffice',
    title: 'MS Office Course',
    category: 'beginner',
    duration: '3–4 Months',
    subtitle: 'MS Office 2021 Suite with AI Assistance',
    icon: '📄',
    image: 'msoffice-course-banner.jpg',
    badge: 'MS Office 2021 Suite',
    topics: [
      'Computer Fundamentals & File Management',
      'MS Word & Excel 2021 Advanced Mastery',
      'PowerPoint Presentations & Visual Design',
      'Outlook Email Management & Communication',
      'AI Productivity Tools & Workflow Automation'
    ]
  },
  {
    id: 'excel',
    title: 'Advanced Excel Course',
    category: 'business',
    duration: '3–4 Months',
    subtitle: 'Advanced Excel with AI & Analytics',
    icon: '📊',
    image: 'advanced-excel-banner.jpg',
    badge: 'Formulas & Dashboards',
    topics: [
      'Advanced Formulas & Lookups (XLOOKUP)',
      'Pivot Tables & Dynamic Dashboards',
      'Data Analysis & Cleansing',
      'Conditional Formatting & Macros',
      '260+ Practical Practice MCQs'
    ]
  },
  {
    id: 'tally',
    title: 'Tally Prime Course',
    category: 'business',
    duration: '3 Months',
    subtitle: 'Tally Prime with GST, TDS & Payroll',
    icon: '💼',
    image: 'tally-prime-banner.jpg',
    badge: 'GST & Payroll Certified',
    topics: [
      'Accounting Fundamentals & Ledgers',
      'Vouchers & Inventory Control',
      'GST, TDS & TCS Invoicing',
      'Payroll Management & Banking',
      'Financial Balance Sheets & P&L'
    ]
  },
  {
    id: 'digitalmarketing',
    title: 'Digital Marketing',
    category: 'business',
    duration: '6 Months',
    subtitle: 'For Undergraduates & Graduates',
    icon: '📈',
    image: 'digital-marketing-banner.jpg',
    badge: 'SEO & Ads Mastery',
    topics: [
      'SEO & Google Search Ads (SEM)',
      'Content & Social Media Marketing',
      'WordPress Website Creation',
      'Canva & Graphic Design Basics',
      'Google Analytics & ROI Tracking'
    ]
  },
  {
    id: 'programming',
    title: 'Programming (C & C++)',
    category: 'tech',
    duration: '3–4 Months',
    subtitle: 'For CS, IT & Engineering Students',
    icon: '⚡',
    image: 'c-cpp-banner.png',
    badge: 'C & C++ Programming',
    topics: [
      'Programming Fundamentals & Logic',
      'Object Oriented Programming (OOP)',
      'Pointers, Memory & Data Structures',
      'Algorithms & Problem Solving',
      'Hands-on Capstone Projects'
    ]
  },
  {
    id: 'webdev',
    title: 'Web Development',
    category: 'tech',
    duration: '3–4 Months',
    subtitle: 'Full Stack Frontend & Backend',
    icon: '🌐',
    image: 'web-development-banner.jpg',
    badge: 'Full Stack Web Dev',
    topics: [
      'HTML5, Modern CSS3 & JavaScript',
      'Bootstrap & Responsive Design',
      'PHP & Database Integration',
      'User Experience & Clean UI',
      'Live Portfolio Project Building'
    ]
  },
  {
    id: 'java',
    title: 'Java Programming Language',
    category: 'tech',
    duration: '3–4 Months',
    subtitle: 'Java Fundamentals to OOP Concepts',
    icon: '☕',
    image: 'java-banner.png',
    badge: 'Core Java & OOP',
    topics: [
      'Java Syntax, Variables & Data Types',
      'Control Statements, Loops & Methods',
      'Object-Oriented Programming (OOP)',
      'Arrays, Strings & Exception Handling',
      'Collections Framework & Hands-on Projects'
    ]
  },
  {
    id: 'marathi-typing',
    title: 'Marathi Typing (CCTP) 30 WPM',
    category: 'beginner',
    duration: '2–3 Months',
    subtitle: 'Govt. Certified CCTP ',
    icon: '⌨️',
    image: 'marathi-typing-banner.jpg',
    badge: 'CCTP 30 WPM Govt. Valid',
    topics: [
      'Inscript & Remington Keyboard Layouts',
      'Daily Speed & Accuracy Practice (30 WPM)',
      'Official Govt. Letter & Statement Formatting',
      'Speed Passage & Timed Typing Software',
    
    ]
  },
  {
    id: 'english-typing',
    title: 'ENGLISH TYPING (CCTP) 30/40 WPM',
    category: 'beginner',
    duration: '2–3 Months',
    subtitle: 'Govt. Certified CCTP ',
    icon: '⌨️',
    image: 'english-typing-banner.jpg',
    badge: 'CCTP 30/40 WPM Valid',
    topics: [
      'Touch Typing & Home Row Finger Techniques',
      'Daily Speed Building (30 WPM & 40 WPM)',
      'Business Letters & Statement Formatting',
      'Timed Passge Tests & Error Analysis',
    ]
  },
  {
    id: 'ai-robotics',
    title: 'AI & MLA (ROBOTICS)',
    category: 'tech',
    duration: '4–6 Months',
    subtitle: 'From Intelligence to Real World Machines',
    icon: '🤖',
    image: 'ai-robotics-banner.jpg',
    badge: 'AI, ML & Robotics',
    topics: [
      'Artificial Intelligence Basics & Python',
      'Machine Learning Algorithms & Data Analysis',
      'Model Training, Neural Networks & Computer Vision',
      'Robotics Fundamentals, Sensors & Hardware Interfacing',
      'Hands-on Robotics & Autonomous Rover Projects'
    ]
  },
  {
    id: 'power-bi',
    title: 'Microsoft Power BI',
    category: 'business',
    duration: '2–3 Months',
    subtitle: 'Turn Your Data Into Powerful Insights',
    icon: '📊',
    image: 'power-bi-banner.jpg',
    badge: 'Data Analytics & DAX',
    topics: [
      'Data Ingestion (Excel, SQL Database & Cloud)',
      'Power Query Transformation & Data Modeling',
      'DAX Calculations, Measures & KPI Visuals',
      'Interactive Executive Dashboards & Drill-through',
      'Publishing, Mobile Reports & Team Collaboration'
    ]
  }
];

const getPublicCourses = () => {
  const cmsCourses = window.MAYUR_PUBLIC_CONTENT?.getPublishedCourses?.() || [];
  return cmsCourses.length ? cmsCourses : coursesData;
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

// Render Courses to Grid
function renderCourses(filterCategory) {
  const container = document.getElementById('coursesGrid');
  if (!container) return;

  const sourceCourses = getPublicCourses();
  const filtered = filterCategory === 'all' 
    ? sourceCourses 
    : sourceCourses.filter(c => c.category === filterCategory);

  container.innerHTML = filtered.map(course => {
    const hasImage = Boolean(course.image);
    const safeTitle = escapeHtml(course.title);
    const safeSubtitle = escapeHtml(course.subtitle);
    const safeDuration = escapeHtml(course.duration);
    const safeBadge = escapeHtml(course.badge || 'Govt. Recognized');
    const safeCourseUrl = escapeHtml(course.title);
    const safeTopics = (course.topics || []).map((topic) => `
      <li>
        <i class="fa-solid fa-circle-check"></i>
        <span>${escapeHtml(topic)}</span>
      </li>
    `).join('');
    return `
    <div class="course-card ${hasImage ? 'has-banner' : ''}" id="course-${escapeHtml(course.id)}">
      ${hasImage ? `
        <div class="course-banner-wrap" onclick="openBannerModal('${escapeHtml(course.image)}', '${safeTitle}')" title="Click to view full official poster">
          <img src="${escapeHtml(course.image)}" alt="${safeTitle} Official Poster" class="course-banner-img" loading="lazy" />
          <div class="course-banner-overlay">
            <span class="banner-badge-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i> View Full Poster</span>
          </div>
          <span class="course-banner-duration">${safeDuration}</span>
        </div>
      ` : ''}

      <div class="course-card-body">
        <div>
          <div class="course-card-top ${hasImage ? 'with-banner' : ''}">
            <div class="course-icon-badge">${escapeHtml(course.icon)}</div>
            ${hasImage ? `
              <span class="course-official-pill"><i class="fa-solid fa-award"></i> ${safeBadge}</span>
            ` : `
              <span class="course-duration">${safeDuration}</span>
            `}
          </div>
          <h3 class="course-title">${safeTitle}</h3>
          <p class="course-subtitle">${safeSubtitle}</p>
          <ul class="course-topics">
            ${safeTopics}
          </ul>
        </div>
        <a href="#contact" class="course-action-btn" onclick="selectCourse('${safeCourseUrl}')">
          Enquire for ${safeTitle}
        </a>
      </div>
    </div>
  `;
  }).join('');
}

// Category Filter Tabs
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');
      renderCourses(category);
    });
  });
}

// Gallery Filters
let galleryItems = [];
let visibleGalleryItems = [];
let currentGalleryIndex = -1;

function getImageKitUrl(path, width, imageUrl = '') {
  const sourceUrl = imageUrl || '';
  if (sourceUrl) {
    const separator = sourceUrl.includes('?') ? '&' : '?';
    return `${sourceUrl}${separator}tr=w-${width},q-82,f-auto`;
  }
  const endpoint = window.MAYUR_GALLERY_CONFIG?.imageKitUrlEndpoint?.replace(/\/$/, '');
  if (!endpoint || !path) return '';
  const separator = path.includes('?') ? '&' : '?';
  return `${endpoint}/${path.replace(/^\//, '')}${separator}tr=w-${width},q-82,f-auto`;
}

function escapeGalleryText(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

function renderGallery(filter = 'all') {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  visibleGalleryItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  grid.innerHTML = '';
  if (!visibleGalleryItems.length) {
    grid.innerHTML = `<div class="gallery-empty-state"><i class="fa-regular fa-images"></i><h3>${galleryItems.length ? 'No photos in this category yet' : 'Gallery coming soon'}</h3><p>${galleryItems.length ? 'Choose another category to continue exploring Mayur Computech.' : 'New photos from our classrooms, lab, and student milestones will appear here.'}</p></div>`;
    return;
  }

  visibleGalleryItems.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'gallery-item';
    card.setAttribute('aria-label', `Open ${escapeHtml(item.title)}`);
    card.addEventListener('click', () => openGalleryItem(index));
    card.innerHTML = `<div class="gallery-img-wrapper"><img src="${escapeGalleryText(getImageKitUrl(item.path, 720, item.imageUrl))}" alt="${escapeGalleryText(item.alt)}" loading="lazy"><div class="gallery-overlay"><span class="gallery-pill-tag">${escapeGalleryText(item.categoryLabel)}</span><h4>${escapeGalleryText(item.title)}</h4><p>${escapeGalleryText(item.description)} <i class="fa-solid fa-magnifying-glass-plus"></i></p></div></div>`;
    const image = card.querySelector('img');
    image.addEventListener('error', () => {
      card.classList.add('gallery-item-error');
      image.removeAttribute('src');
      image.alt = 'Image unavailable';
      image.parentElement.insertAdjacentHTML('beforeend', '<div class="gallery-image-fallback"><i class="fa-regular fa-image"></i><span>Image unavailable</span></div>');
    }, {once: true});
    grid.appendChild(card);
  });
}

function syncGalleryFromCms() {
  const cmsGallery = window.MAYUR_PUBLIC_CONTENT?.getPublishedGallery?.() || [];
  if (!cmsGallery.length) return false;

  galleryItems = cmsGallery;
  const allButton = document.querySelector('[data-gfilter="all"]');
  if (allButton) allButton.textContent = `All Photos (${galleryItems.length})`;
  renderGallery(document.querySelector('.g-filter-btn.active')?.getAttribute('data-gfilter') || 'all');
  return true;
}

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.g-filter-btn');
  const configuredItems = window.MAYUR_GALLERY_CONFIG?.items || [];
  galleryItems = configuredItems.filter(item => item.path && item.alt && item.title && item.category);
  const allButton = document.querySelector('[data-gfilter="all"]');
  if (allButton) allButton.textContent = `All Photos (${galleryItems.length})`;
  renderGallery();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-gfilter');
      renderGallery(filter);
    });
  });

  if (!syncGalleryFromCms()) {
    loadPublishedGallery();
  }
}

async function loadPublishedGallery() {
  const config = window.MAYUR_GALLERY_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey) return;
  const endpoint = `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/gallery_items?select=id,title,description,alt_text,image_url,image_path,thumbnail_url,category,category_label,display_order&is_published=eq.true&order=display_order.asc,created_at.desc`;
  try {
    const response = await fetch(endpoint, {
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`
      }
    });
    if (!response.ok) throw new Error('Published gallery unavailable');
    const rows = await response.json();
    const trainerItem = rows.find(row => row.category === 'trainer');
    const trainerPortrait = document.getElementById('trainerPortrait');
    const trainerPortraitImage = document.getElementById('trainerPortraitImage');
    if (trainerItem && trainerPortrait && trainerPortraitImage) {
      trainerPortraitImage.src = trainerItem.image_url || trainerItem.thumbnail_url || getImageKitUrl(trainerItem.image_path, 720);
      trainerPortrait.hidden = false;
    }
    galleryItems = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      alt: row.alt_text,
      path: row.image_path,
      imageUrl: row.image_url,
      thumbnailUrl: row.thumbnail_url,
      category: row.category,
      categoryLabel: row.category_label
    })).filter(item => item.category !== 'trainer');
    const allButton = document.querySelector('[data-gfilter="all"]');
    if (allButton) allButton.textContent = `All Photos (${galleryItems.length})`;
    renderGallery(document.querySelector('.g-filter-btn.active')?.getAttribute('data-gfilter') || 'all');
  } catch (error) {
    console.warn('Using static gallery fallback:', error);
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const btn = i.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

// Active Nav on Scroll (ScrollSpy)
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0;
    const scrollPos = scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Select Course into Contact Form
function selectCourse(courseName) {
  const selectDropdown = document.getElementById('courseSelect');
  if (selectDropdown) {
    selectDropdown.value = courseName;
  }
}

// Mobile Menu Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        // Set active immediately on click
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// Contact Form Handler
function updateTestimonialsFromCms() {
  const cmsTestimonials = window.MAYUR_PUBLIC_CONTENT?.getPublishedTestimonials?.() || [];
  const container = document.querySelector('.testimonials-grid');
  if (!container || !cmsTestimonials.length) return false;

  container.innerHTML = cmsTestimonials.map((item) => {
    const stars = Array.from({ length: 5 }, (_, index) => `
      <i class="fa-solid fa-star${index < Number(item.rating || 5) ? '' : '-half-stroke'}" aria-hidden="true"></i>
    `).join('');
    const avatarText = (item.name || 'ST').split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase().slice(0, 2);

    return `
      <div class="testimonial-card google-card">
        <div class="testi-card-top">
          <div class="testi-header">
            <div class="testi-avatar" style="background: #1a73e8;">${escapeHtml(avatarText)}</div>
            <div>
              <h4 class="reviewer-name">${escapeHtml(item.name)}<i class="fa-solid fa-circle-check verified-icon" title="Verified Student Review"></i></h4>
              <span class="testi-date"><i class="fa-regular fa-clock"></i> ${escapeHtml(item.designation || 'Verified Student')}</span>
            </div>
          </div>
          <div class="google-corner-badge" title="Verified Student Review"><i class="fa-brands fa-google"></i></div>
        </div>
        <div class="testi-stars">${stars}</div>
        <span class="testi-course-pill">${escapeHtml(item.designation || 'Student Review')}</span>
        <p class="testi-text">"${escapeHtml(item.message)}"</p>
        <div class="testi-card-footer">
          <span class="testi-badge"><i class="fa-solid fa-circle-check"></i> Verified Student</span>
          <a href="https://g.page/r/Cbr2GCg8dQWrEBM/review" target="_blank" rel="noopener noreferrer" class="google-view-link">
            <span>Google Review</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');

  return true;
}

function initContactForm() {
  const form = document.getElementById('enquiryForm');
  const statusMsg = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('studentName')?.value || '';
      const phone = document.getElementById('studentPhone')?.value || '';
      const course = document.getElementById('courseSelect')?.value || '';
      const message = document.getElementById('studentMessage')?.value || '';

      if (statusMsg) {
        const safeName = escapeHtml(name);
        const safeCourse = escapeHtml(course);
        const safePhone = escapeHtml(phone);
        statusMsg.innerHTML = `<span style="color: #16a34a; font-weight: bold;">
          Thank you, ${safeName}! Your enquiry for ${safeCourse} has been noted. Mayur Sir / Sujal Sir will call you shortly on ${safePhone}.
        </span>`;
        statusMsg.style.display = 'block';
      }

      // Prefill WhatsApp link
      const whatsappText = encodeURIComponent(`Hello Mayur Computech! I want to enquire about ${course}. Name: ${name}, Phone: ${phone}. Message: ${message}`);
      const directWhatsAppUrl = `https://wa.me/918655050595?text=${whatsappText}`;
      
      setTimeout(() => {
        if (confirm("Would you like to chat directly with Mayur Sir on WhatsApp now?")) {
          window.open(directWhatsAppUrl, '_blank');
        }
      }, 500);

      form.reset();
    });
  }
}

// Dynamic Footer Year
function updateDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Banner & Gallery Lightbox Modal
window.currentModalCourse = '';
const galleryModalState = {
  title: '',
  categoryLabel: '',
  imageUrl: ''
};

function openBannerModal(imageSrc, courseTitle) {
  const modal = document.getElementById('bannerModal');
  const modalImg = document.getElementById('bannerModalImg');
  const modalTitle = document.getElementById('bannerModalTitle');
  if (modal && modalImg) {
    window.currentModalCourse = courseTitle;
    modalImg.src = imageSrc;
    if (modalTitle) {
      modalTitle.textContent = `${courseTitle} - Official Admission Poster`;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function openGalleryModal(imageSrc, title, desc) {
  const modal = document.getElementById('bannerModal');
  const modalImg = document.getElementById('bannerModalImg');
  const modalTitle = document.getElementById('bannerModalTitle');
  if (modal && modalImg) {
    window.currentModalCourse = title;
    currentGalleryIndex = -1;
    document.getElementById('galleryModalPrev').hidden = true;
    document.getElementById('galleryModalNext').hidden = true;
    modalImg.src = imageSrc;
    modalImg.alt = title;
    if (modalTitle) {
      modalTitle.textContent = title;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function openGalleryItem(index) {
  const item = visibleGalleryItems[index];
  if (!item) return;
  currentGalleryIndex = index;
  galleryModalState.title = item.title;
  galleryModalState.categoryLabel = item.categoryLabel;
  galleryModalState.imageUrl = getImageKitUrl(item.path, 1600, item.imageUrl);
  const modal = document.getElementById('bannerModal');
  const modalImg = document.getElementById('bannerModalImg');
  const modalTitle = document.getElementById('bannerModalTitle');
  const modalTag = document.querySelector('.banner-modal-tag');
  if (!modal || !modalImg) return;
  modalImg.src = galleryModalState.imageUrl;
  modalImg.alt = item.alt;
  if (modalTitle) modalTitle.textContent = item.title;
  if (modalTag) modalTag.textContent = item.categoryLabel;
  document.getElementById('galleryModalPrev').hidden = visibleGalleryItems.length < 2;
  document.getElementById('galleryModalNext').hidden = visibleGalleryItems.length < 2;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function showGalleryItem(offset) {
  if (currentGalleryIndex < 0 || visibleGalleryItems.length < 2) return;
  const nextIndex = (currentGalleryIndex + offset + visibleGalleryItems.length) % visibleGalleryItems.length;
  openGalleryItem(nextIndex);
}

function showPreviousGalleryItem() {
  showGalleryItem(-1);
}

function showNextGalleryItem() {
  showGalleryItem(1);
}

function closeBannerModal() {
  const modal = document.getElementById('bannerModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeBannerModal();
  if (e.key === 'ArrowLeft') showPreviousGalleryItem();
  if (e.key === 'ArrowRight') showNextGalleryItem();
});

// Expose globals for inline events
window.openBannerModal = openBannerModal;
window.openGalleryModal = openGalleryModal;
window.showPreviousGalleryItem = showPreviousGalleryItem;
window.showNextGalleryItem = showNextGalleryItem;
window.closeBannerModal = closeBannerModal;
window.selectCourse = selectCourse;

window.applyPublicCmsData = function applyPublicCmsData() {
  if (window.MAYUR_PUBLIC_CONTENT?.getPublishedCourses?.().length) {
    renderCourses(document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all');
  }

  if (window.MAYUR_PUBLIC_CONTENT?.getPublishedGallery?.().length) {
    syncGalleryFromCms();
  }

  updateTestimonialsFromCms();
  renderTrainersCarousel();
};

// Trainers Carousel
let trainersCurrentIndex = 0;
let trainersInterval = null;
let trainersPaused = false;

function getTrainersPerView() {
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
}

function renderTrainersCarousel() {
  const track = document.getElementById('trainersTrack');
  const dotsContainer = document.getElementById('trainersDots');
  const emptyMsg = document.getElementById('trainersEmpty');
  const header = document.getElementById('trainersCarouselHeader');
  if (!track) return;

  const trainers = (window.MAYUR_PUBLIC_CONTENT?.getPublishedTrainers?.()) || [];

  if (!trainers.length) {
    track.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';
    if (emptyMsg) emptyMsg.hidden = false;
    if (header) header.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.hidden = true;
  if (header) header.style.display = '';

  trainersCurrentIndex = 0;
  const perView = getTrainersPerView();
  const totalPages = Math.max(1, Math.ceil(trainers.length / perView));

  track.innerHTML = trainers.map(function(trainer, i) {
    const alt = 'Photo of ' + (trainer.name || 'Trainer');
    return '<div class="trainer-card" data-index="' + i + '">' +
      '<div class="trainer-card-photo">' +
        '<img src="' + escapeHtml(trainer.photo_url || '') + '" alt="' + escapeHtml(alt) + '" loading="lazy" />' +
      '</div>' +
      '<div class="trainer-card-body">' +
        '<h4 class="trainer-card-name">' + escapeHtml(trainer.name) + '</h4>' +
        '<p class="trainer-card-designation">' + escapeHtml(trainer.designation || '') + '</p>' +
        (trainer.short_description ? '<p class="trainer-card-desc">' + escapeHtml(trainer.short_description) + '</p>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = trainers.map(function(_, i) {
      return '<button type="button" class="trainer-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '" role="tab" aria-label="Go to trainer ' + (i + 1) + '"></button>';
    }).join('');
    dotsContainer.querySelectorAll('.trainer-dot').forEach(function(dot) {
      dot.addEventListener('click', function() {
        trainersCurrentIndex = parseInt(dot.getAttribute('data-dot'), 10);
        updateTrainersCarousel();
        resetTrainersAuto();
      });
    });
  }

  updateTrainersCarousel();
  startTrainersAuto();
}

function updateTrainersCarousel() {
  const track = document.getElementById('trainersTrack');
  if (!track) return;
  const perView = getTrainersPerView();
  const totalPages = Math.max(1, Math.ceil((window.MAYUR_PUBLIC_CONTENT?.getPublishedTrainers?.().length || 1) / perView));
  if (trainersCurrentIndex >= totalPages) trainersCurrentIndex = 0;

  const cardWidth = track.querySelector('.trainer-card')?.offsetWidth || 0;
  const gap = 24;
  const offset = trainersCurrentIndex * (cardWidth + gap) * perView;
  track.style.transform = 'translateX(-' + offset + 'px)';

  const dots = document.querySelectorAll('.trainer-dot');
  dots.forEach(function(dot, i) {
    dot.classList.toggle('active', i === trainersCurrentIndex);
  });

  const prevBtn = document.getElementById('trainersPrev');
  const nextBtn = document.getElementById('trainersNext');
  if (prevBtn) prevBtn.disabled = trainersCurrentIndex === 0;
  if (nextBtn) nextBtn.disabled = trainersCurrentIndex >= totalPages - 1;
}

function startTrainersAuto() {
  stopTrainersAuto();
  trainersInterval = setInterval(function() {
    if (!trainersPaused) {
      const totalPages = Math.max(1, Math.ceil((window.MAYUR_PUBLIC_CONTENT?.getPublishedTrainers?.().length || 1) / getTrainersPerView()));
      trainersCurrentIndex = (trainersCurrentIndex + 1) % totalPages;
      updateTrainersCarousel();
    }
  }, 6000);
}

function stopTrainersAuto() {
  if (trainersInterval) {
    clearInterval(trainersInterval);
    trainersInterval = null;
  }
}

function resetTrainersAuto() {
  stopTrainersAuto();
  startTrainersAuto();
}

function initTrainersCarouselControls() {
  const prevBtn = document.getElementById('trainersPrev');
  const nextBtn = document.getElementById('trainersNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (trainersCurrentIndex > 0) {
        trainersCurrentIndex--;
        updateTrainersCarousel();
        resetTrainersAuto();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const totalPages = Math.max(1, Math.ceil((window.MAYUR_PUBLIC_CONTENT?.getPublishedTrainers?.().length || 1) / getTrainersPerView()));
      if (trainersCurrentIndex < totalPages - 1) {
        trainersCurrentIndex++;
        updateTrainersCarousel();
        resetTrainersAuto();
      }
    });
  }

  const carousel = document.getElementById('trainersCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', function() { trainersPaused = true; });
    carousel.addEventListener('mouseleave', function() { trainersPaused = false; });
  }

  let touchStartX = 0;
  if (carousel) {
    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      trainersPaused = true;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        const totalPages = Math.max(1, Math.ceil((window.MAYUR_PUBLIC_CONTENT?.getPublishedTrainers?.().length || 1) / getTrainersPerView()));
        if (diff > 0 && trainersCurrentIndex < totalPages - 1) {
          trainersCurrentIndex++;
        } else if (diff < 0 && trainersCurrentIndex > 0) {
          trainersCurrentIndex--;
        }
        updateTrainersCarousel();
      }
      trainersPaused = false;
      resetTrainersAuto();
    }, { passive: true });
  }

  window.addEventListener('resize', function() {
    updateTrainersCarousel();
  });
}

// Expose globals for inline events
window.openBannerModal = openBannerModal;
window.openGalleryModal = openGalleryModal;
window.showPreviousGalleryItem = showPreviousGalleryItem;
window.showNextGalleryItem = showNextGalleryItem;
window.closeBannerModal = closeBannerModal;
window.selectCourse = selectCourse;
window.renderTrainersCarousel = renderTrainersCarousel;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderCourses('all');
  initCategoryFilters();
  initGalleryFilters();
  initFaqAccordion();
  initScrollSpy();
  initMobileNav();
  initContactForm();
  updateDynamicYear();
  updateTestimonialsFromCms();
  renderTrainersCarousel();
  initTrainersCarouselControls();
});
/* =========================================================
   SIDE DEVELOPER AUTO SLIDER
   Changes developer every 3 seconds
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const developerProfiles = document.querySelectorAll(
    ".side-developer-profile"
  );

  if (!developerProfiles.length) return;

  let currentDeveloper = 0;

  setInterval(function () {

    // Current developer hide
    developerProfiles[currentDeveloper].classList.remove("active");

    // Next developer
    currentDeveloper =
      (currentDeveloper + 1) % developerProfiles.length;

    // Next developer show
    developerProfiles[currentDeveloper].classList.add("active");

  }, 3000);

});
/* =========================================================
   SIDE DEVELOPER BUTTON + 10 SECOND AUTO CHANGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const widget = document.getElementById("sideDeveloperWidget");
  const label = widget?.querySelector(".side-developer-label");
  const profiles = widget?.querySelectorAll(".side-developer-profile");

  if (!widget || !label || !profiles.length) return;

  let currentDeveloper = 0;

  /* Open / Close developer card */
  label.addEventListener("click", function () {
    widget.classList.toggle("open");
  });

  /* Change developer every 10 seconds */
  setInterval(function () {

    profiles[currentDeveloper].classList.remove("active");

    currentDeveloper =
      (currentDeveloper + 1) % profiles.length;

    profiles[currentDeveloper].classList.add("active");

  }, 10000);

});

