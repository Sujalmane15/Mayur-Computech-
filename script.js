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
    subtitle: 'Govt. Certified CCTP / GCC-TBC Speed Training',
    icon: '⌨️',
    image: 'marathi-typing-banner.jpg',
    badge: 'CCTP 30 WPM Govt. Valid',
    topics: [
      'Inscript & Remington Keyboard Layouts',
      'Daily Speed & Accuracy Practice (30 WPM)',
      'Official Govt. Letter & Statement Formatting',
      'Speed Passage & Timed Typing Software',
      'Govt. GCC-TBC / CCTP Exam Readiness'
    ]
  },
  {
    id: 'english-typing',
    title: 'ENGLISH TYPING (CCTP) 30/40 WPM',
    category: 'beginner',
    duration: '2–3 Months',
    subtitle: 'Govt. Certified CCTP / GCC-TBC Speed Training',
    icon: '⌨️',
    image: 'english-typing-banner.jpg',
    badge: 'CCTP 30/40 WPM Valid',
    topics: [
      'Touch Typing & Home Row Finger Techniques',
      'Daily Speed Building (30 WPM & 40 WPM)',
      'Business Letters & Statement Formatting',
      'Timed Passage Tests & Error Analysis',
      'GCC-TBC / CCTP Govt. Exam Preparation'
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

// Render Courses to Grid
function renderCourses(filterCategory) {
  const container = document.getElementById('coursesGrid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? coursesData 
    : coursesData.filter(c => c.category === filterCategory);

  container.innerHTML = filtered.map(course => {
    const hasImage = Boolean(course.image);
    return `
    <div class="course-card ${hasImage ? 'has-banner' : ''}" id="course-${course.id}">
      ${hasImage ? `
        <div class="course-banner-wrap" onclick="openBannerModal('${course.image}', '${course.title}')" title="Click to view full official poster">
          <img src="${course.image}" alt="${course.title} Official Poster" class="course-banner-img" loading="lazy" />
          <div class="course-banner-overlay">
            <span class="banner-badge-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i> View Full Poster</span>
          </div>
          <span class="course-banner-duration">${course.duration}</span>
        </div>
      ` : ''}

      <div class="course-card-body">
        <div>
          <div class="course-card-top ${hasImage ? 'with-banner' : ''}">
            <div class="course-icon-badge">${course.icon}</div>
            ${hasImage ? `
              <span class="course-official-pill"><i class="fa-solid fa-award"></i> ${course.badge || 'Govt. Recognized'}</span>
            ` : `
              <span class="course-duration">${course.duration}</span>
            `}
          </div>
          <h3 class="course-title">${course.title}</h3>
          <p class="course-subtitle">${course.subtitle}</p>
          <ul class="course-topics">
            ${course.topics.map(topic => `
              <li>
                <i class="fa-solid fa-circle-check"></i>
                <span>${topic}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <a href="#contact" class="course-action-btn" onclick="selectCourse('${course.title}')">
          Enquire for ${course.title}
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
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.g-filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-gfilter');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
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
        statusMsg.innerHTML = `<span style="color: #16a34a; font-weight: bold;">
          Thank you, ${name}! Your enquiry for ${course} has been noted. Mayur Sir / Sujal Sir will call you shortly on ${phone}.
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
    modalImg.src = imageSrc;
    if (modalTitle) {
      modalTitle.textContent = title;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeBannerModal() {
  const modal = document.getElementById('bannerModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeBannerModal();
});

// Expose globals for inline events
window.openBannerModal = openBannerModal;
window.openGalleryModal = openGalleryModal;
window.closeBannerModal = closeBannerModal;
window.selectCourse = selectCourse;

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
});
