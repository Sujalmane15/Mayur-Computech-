(function () {
  const fallback = {
    siteSettings: {},
    courses: [],
    gallery: [],
    results: [],
    certificates: [],
    achievements: [],
    testimonials: [],
    trainers: [],
  };

  const state = { ...fallback };

  function getConfig() {
    return window.MAYUR_GALLERY_CONFIG || {};
  }

  function buildHeaders() {
    const config = getConfig();
    return {
      apikey: config.supabaseAnonKey || '',
      Authorization: config.supabaseAnonKey ? `Bearer ${config.supabaseAnonKey}` : '',
      'Content-Type': 'application/json',
    };
  }

  function isPublicReadAllowed() {
    const config = getConfig();
    return Boolean(config.supabaseUrl && config.supabaseAnonKey);
  }

  async function requestTable(table, select, filters = []) {
    if (!isPublicReadAllowed()) {
      return [];
    }

    const config = getConfig();
    const endpoint = new URL(`${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}`);
    endpoint.searchParams.set('select', select);

    for (const filter of filters) {
      endpoint.searchParams.set(filter.column, `eq.${filter.value}`);
    }

    const response = await fetch(endpoint.toString(), {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Public CMS request failed for ${table}: ${response.status}`);
    }

    return response.json();
  }

  function normalizeGallery(rows) {
    return (rows || [])
      .filter((row) => row && row.image_path && row.title)
      .map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        alt: row.alt_text || row.title,
        path: row.image_path,
        imageUrl: row.image_url || row.thumbnail_url || '',
        thumbnailUrl: row.thumbnail_url || row.image_url || '',
        category: row.category || 'general',
        categoryLabel: row.category_label || row.category || 'General',
        displayOrder: row.display_order ?? 0,
      }));
  }

  function normalizeCourses(rows) {
    return (rows || []).map((row) => {
      const category = String(row.category || 'general');
      const features = Array.isArray(row.features)
        ? row.features.filter(Boolean)
        : typeof row.syllabus === 'string'
          ? row.syllabus.split(/\n|\|/).map((item) => item.trim()).filter(Boolean)
          : [];

      let lookupCategory = 'beginner';
      if (['tech', 'programming', 'web', 'java', 'robotics', 'ai', 'coding'].includes(category.toLowerCase())) {
        lookupCategory = 'tech';
      } else if (['business', 'accounting', 'finance', 'marketing', 'digital-skills'].includes(category.toLowerCase())) {
        lookupCategory = 'business';
      }

      return {
        id: row.slug || row.id,
        title: row.title,
        category: lookupCategory,
        duration: row.duration || 'Flexible',
        subtitle: row.short_description || row.description || 'Career-focused computer training.',
        icon: row.title?.toLowerCase().includes('java') ? '☕' : row.title?.toLowerCase().includes('excel') ? '📊' : row.title?.toLowerCase().includes('tally') ? '💼' : row.title?.toLowerCase().includes('typing') ? '⌨️' : row.title?.toLowerCase().includes('web') ? '🌐' : row.title?.toLowerCase().includes('marketing') ? '📈' : row.title?.toLowerCase().includes('robotics') || row.title?.toLowerCase().includes('ai') ? '🤖' : '💻',
        image: row.image_url || row.image_path || '',
        badge: row.title || 'Govt. Recognized',
        topics: features.length ? features : ['Career-focused practical learning', 'Hands-on guidance', 'Skill-based training'],
      };
    });
  }

  function normalizeTestimonials(rows) {
    return (rows || [])
      .filter((row) => row && row.message)
      .map((row) => ({
        id: row.id,
        name: row.name || 'Verified Student',
        designation: row.designation || 'Student',
        rating: Number(row.rating || 5),
        message: row.message,
        photo_url: row.photo_url || '',
        is_featured: Boolean(row.is_featured),
      }));
  }

  function normalizeTrainers(rows) {
    return (rows || [])
      .filter((row) => row && row.name)
      .map((row) => ({
        id: row.id,
        name: row.name,
        designation: row.designation || '',
        photo_url: row.photo_url || row.photo_path || '',
        short_description: row.short_description || '',
        experience: row.experience || '',
        qualifications: row.qualifications || '',
        expertise: row.expertise || '',
      }));
  }

  function normalizeSiteSettings(rows) {
    const normalized = {};
    for (const row of rows || []) {
      if (!row || !row.key) continue;
      normalized[row.key] = row.value ?? {};
    }
    return normalized;
  }

  async function loadPublicData() {
    if (!isPublicReadAllowed()) {
      return;
    }

    try {
      const [settingsRows, courseRows, galleryRows, resultRows, certificateRows, achievementRows, testimonialRows, trainerRows] = await Promise.all([
        requestTable('site_settings', 'key,value,is_public', [{ column: 'is_public', value: 'true' }]),
        requestTable('courses', 'id,slug,title,short_description,description,category,duration,fees,image_url,image_path,features,eligibility,syllabus,status,visibility,is_featured,sort_order', [
          { column: 'status', value: 'published' },
          { column: 'visibility', value: 'public' },
        ]),
        requestTable('gallery_items', 'id,title,description,alt_text,image_url,image_path,thumbnail_url,category,category_label,display_order,is_published', [{ column: 'is_published', value: 'true' }]),
        requestTable('results', 'id,student_name,course_name,exam_name,result_text,score,percentage,result_year,certificate_image_url,description,status,visibility,sort_order', [
          { column: 'status', value: 'published' },
          { column: 'visibility', value: 'public' },
        ]),
        requestTable('certificates', 'id,title,student_name,course_name,event_year,image_url,description,category,status,visibility,sort_order', [
          { column: 'status', value: 'published' },
          { column: 'visibility', value: 'public' },
        ]),
        requestTable('achievements', 'id,title,description,year,image_url,category,status,visibility,sort_order', [
          { column: 'status', value: 'published' },
          { column: 'visibility', value: 'public' },
        ]),
        requestTable('testimonials', 'id,name,designation,message,rating,photo_url,is_featured,status,visibility,sort_order', [
          { column: 'status', value: 'published' },
          { column: 'visibility', value: 'public' },
        ]),
        requestTable('trainers', 'id,name,designation,photo_url,photo_path,short_description,experience,qualifications,expertise,status,visibility,sort_order', [
          { column: 'status', value: 'published' },
          { column: 'visibility', value: 'public' },
        ]),
      ]);

      state.siteSettings = normalizeSiteSettings(settingsRows);
      state.courses = normalizeCourses(courseRows);
      state.gallery = normalizeGallery(galleryRows);
      state.results = resultRows || [];
      state.certificates = certificateRows || [];
      state.achievements = achievementRows || [];
      state.testimonials = normalizeTestimonials(testimonialRows);
      state.trainers = normalizeTrainers(trainerRows);

      if (typeof window !== 'undefined' && typeof window.applyPublicCmsData === 'function') {
        window.applyPublicCmsData();
      }
    } catch (error) {
      console.warn('Public CMS is unavailable. Using the existing static fallback content.', error);
      state.siteSettings = {};
      state.courses = [];
      state.gallery = [];
      state.results = [];
      state.certificates = [];
      state.achievements = [];
      state.testimonials = [];
      state.trainers = [];
    }
  }

  const publicApi = {
    state,
    getConfig,
    loadPublicData,
    getSiteSettings: () => state.siteSettings,
    getPublishedCourses: () => state.courses,
    getPublishedGallery: () => state.gallery,
    getPublishedResults: () => state.results,
    getPublishedCertificates: () => state.certificates,
    getPublishedAchievements: () => state.achievements,
    getPublishedTestimonials: () => state.testimonials,
    getPublishedTrainers: () => state.trainers,
  };

  window.MAYUR_PUBLIC_CONTENT = publicApi;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      window.MAYUR_PUBLIC_CONTENT.loadPublicData();
    });
  }
})();
