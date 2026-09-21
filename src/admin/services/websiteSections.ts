export type WebsiteSectionType =
  | 'hero'
  | 'trainer'
  | 'trainer_carousel'
  | 'about'
  | 'courses'
  | 'why_choose_us'
  | 'gallery'
  | 'results'
  | 'achievements'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'footer';

export type WebsiteSectionFieldType = 'text' | 'textarea' | 'url' | 'select' | 'checkbox' | 'number';

export type WebsiteSectionFieldDefinition = {
  key: string;
  label: string;
  type?: WebsiteSectionFieldType;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  helperText?: string;
};

export type WebsiteSectionSchema = {
  key: WebsiteSectionType;
  label: string;
  description: string;
  allowReorder: boolean;
  allowDisable: boolean;
  fields: WebsiteSectionFieldDefinition[];
  defaultValues: Record<string, any>;
};

export const WEBSITE_SECTION_TYPES: Array<{ value: WebsiteSectionType; label: string }> = [
  { value: 'hero', label: 'Hero' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'trainer_carousel', label: 'Trainer Carousel' },
  { value: 'about', label: 'About' },
  { value: 'courses', label: 'Courses' },
  { value: 'why_choose_us', label: 'Why Choose Us' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'results', label: 'Results' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'faq', label: 'FAQ' },
  { value: 'contact', label: 'Contact' },
  { value: 'footer', label: 'Footer' },
];

export const WEBSITE_SECTION_REGISTRY: Record<WebsiteSectionType, WebsiteSectionSchema> = {
  hero: {
    key: 'hero',
    label: 'Hero',
    description: 'Main homepage introduction, CTA, and banner configuration.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Learn Today. Build Your Career.' },
      { key: 'subheading', label: 'Highlight line', type: 'text', placeholder: 'Build your future with practical training.' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short summary shown beneath the headline.' },
      { key: 'primary_cta_label', label: 'Primary CTA label', type: 'text', placeholder: 'Explore Courses' },
      { key: 'primary_cta_url', label: 'Primary CTA URL', type: 'url', placeholder: '#courses' },
      { key: 'secondary_cta_label', label: 'Secondary CTA label', type: 'text', placeholder: 'Talk to an Advisor' },
      { key: 'secondary_cta_url', label: 'Secondary CTA URL', type: 'url', placeholder: 'https://wa.me/918655050595' },
      { key: 'badge', label: 'Badge text', type: 'text', placeholder: 'Govt. Authorised Computer Training Institute' },
      { key: 'background_image', label: 'Background image URL', type: 'url', placeholder: 'https://example.com/hero.jpg' },
    ],
    defaultValues: {
      heading: 'Learn Today. Build Your Career.',
      subheading: 'Build your future with practical training.',
      description: 'Practical, career-focused computer training designed to build real-world skills and career confidence.',
      primary_cta_label: 'Explore Courses',
      primary_cta_url: '#courses',
      secondary_cta_label: 'Talk to an Advisor',
      secondary_cta_url: 'https://wa.me/918655050595',
      badge: 'Govt. Authorised Computer Training Institute',
      background_image: '',
    },
  },
  trainer: {
      key: 'trainer',
      label: 'Trainer',
      description: 'Trainer profile and credentials section.',
      allowReorder: true,
      allowDisable: true,
      fields: [
        { key: 'name', label: 'Trainer name', type: 'text', placeholder: 'Mayur Sir' },
        { key: 'role', label: 'Role', type: 'text', placeholder: 'Computer Education Expert & Trainer CEO' },
        { key: 'intro', label: 'Intro copy', type: 'textarea', placeholder: 'A short profile summary.' },
        { key: 'experience', label: 'Experience', type: 'text', placeholder: '13+ Years' },
        { key: 'education', label: 'Education', type: 'text', placeholder: 'Computer Diploma' },
        { key: 'photo_url', label: 'Photo URL', type: 'url', placeholder: 'https://example.com/trainer.jpg' },
      ],
      defaultValues: {
        name: 'Mayur Sir',
        role: 'Computer Education Expert & Trainer CEO',
        intro: 'With 13+ years of experience in computer education, Mayur Sir has been helping students build practical computer skills and develop their confidence.',
        experience: '13+ Years',
        education: 'Computer Diploma',
        photo_url: '',
      },
    },
    trainer_carousel: {
      key: 'trainer_carousel',
      label: 'Trainer Carousel',
      description: 'Carousel showcasing multiple trainers from the CMS.',
      allowReorder: true,
      allowDisable: true,
      fields: [
        { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Meet Our Expert Trainers' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Learn from experienced professionals dedicated to your career growth.' },
        { key: 'item_limit', label: 'Number of trainers to show', type: 'number', placeholder: '6' },
        { key: 'cta_label', label: 'CTA Label', type: 'text', placeholder: 'View All Trainers' },
        { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: '#trainers-carousel' },
      ],
      defaultValues: {
        heading: 'Meet Our Expert Trainers',
        description: 'Learn from experienced professionals dedicated to your career growth.',
        item_limit: 6,
        cta_label: 'View All Trainers',
        cta_url: '#trainers-carousel',
      },
    },
  about: {
    key: 'about',
    label: 'About',
    description: 'Institution profile and differentiators.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Empowering Careers Through Practical Computer Education' },
      { key: 'lead', label: 'Lead paragraph', type: 'textarea', placeholder: 'Primary introduction paragraph.' },
      { key: 'body', label: 'Body copy', type: 'textarea', placeholder: 'Longer explanatory paragraph.' },
      { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://example.com/about.jpg' },
      { key: 'cta_label', label: 'CTA label', type: 'text', placeholder: 'Explore Courses' },
      { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: '#courses' },
    ],
    defaultValues: {
      heading: 'Empowering Careers Through Practical Computer Education',
      lead: 'Government Authorised Computer Training Institute in Ghansoli, Navi Mumbai.',
      body: 'Dedicated to 100% practical, job-oriented training and individual mentorship.',
      image_url: '',
      cta_label: 'Explore Courses',
      cta_url: '#courses',
    },
  },
  courses: {
    key: 'courses',
    label: 'Courses',
    description: 'Presentation controls for the courses section without duplicating course records.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Professional Training Programs' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short intro for the courses section.' },
      { key: 'item_limit', label: 'Item limit', type: 'number', placeholder: '12' },
      { key: 'featured_only', label: 'Featured courses only', type: 'checkbox' },
      { key: 'cta_label', label: 'CTA label', type: 'text', placeholder: 'View all courses' },
      { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: '#courses' },
    ],
    defaultValues: {
      heading: 'Professional Training Programs',
      description: 'Comprehensive courses designed for beginners, graduates, and engineering students to achieve career readiness.',
      item_limit: 12,
      featured_only: false,
      cta_label: 'View all courses',
      cta_url: '#courses',
    },
  },
  why_choose_us: {
    key: 'why_choose_us',
    label: 'Why Choose Us',
    description: 'Feature highlight cards and differentiators.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Built for Real-World Competence' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short overview of strengths.' },
      { key: 'feature_cards', label: 'Feature cards (JSON array)', type: 'textarea', placeholder: '[{"title":"Concept Clarity","description":"..."}]' },
    ],
    defaultValues: {
      heading: 'Built for Real-World Competence',
      description: 'We focus on practical, hands-on lab sessions to ensure every student gains real confidence before entering the job market.',
      feature_cards: '[{"title":"Concept Clarity","description":"Step-by-step fundamentals taught with personal attention."},{"title":"100% Hands-on Practice","description":"Dedicated computer workstation and lab practice."}]',
    },
  },
  gallery: {
    key: 'gallery',
    label: 'Gallery',
    description: 'Homepage gallery presentation that references the existing gallery records.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Life at Mayur Computech' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'A short introduction for the gallery section.' },
      { key: 'item_limit', label: 'Item limit', type: 'number', placeholder: '8' },
      { key: 'cta_label', label: 'CTA label', type: 'text', placeholder: 'View gallery' },
      { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: '#gallery' },
    ],
    defaultValues: {
      heading: 'Life at Mayur Computech',
      description: 'Take a visual tour of our modern computer lab, hands-on typing sessions, and student mentoring.',
      item_limit: 8,
      cta_label: 'View gallery',
      cta_url: '#gallery',
    },
  },
  results: {
    key: 'results',
    label: 'Results',
    description: 'Result highlights fed from the public results CMS.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Student Results' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description about student outcomes.' },
      { key: 'item_limit', label: 'Item limit', type: 'number', placeholder: '6' },
    ],
    defaultValues: {
      heading: 'Student Results',
      description: 'Track performance and notable achievements from the public results catalog.',
      item_limit: 6,
    },
  },
  achievements: {
    key: 'achievements',
    label: 'Achievements',
    description: 'Achievement highlights and milestones.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Achievements' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Intro text for achievements.' },
      { key: 'item_limit', label: 'Item limit', type: 'number', placeholder: '6' },
    ],
    defaultValues: {
      heading: 'Our Achievements',
      description: 'Celebrating student milestones, certifications, and progress stories.',
      item_limit: 6,
    },
  },
  testimonials: {
    key: 'testimonials',
    label: 'Testimonials',
    description: 'Testimonial spotlight and review section presentation.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Real Student Google Reviews' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Intro text for the testimonials section.' },
      { key: 'item_limit', label: 'Item limit', type: 'number', placeholder: '6' },
      { key: 'featured_only', label: 'Featured reviews only', type: 'checkbox' },
    ],
    defaultValues: {
      heading: 'Real Student Google Reviews',
      description: 'Check out genuine feedback and success stories shared by our students.',
      item_limit: 6,
      featured_only: false,
    },
  },
  faq: {
    key: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions section. Use the existing FAQ content when available.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Frequently Asked Questions' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Intro copy for the FAQ section.' },
      { key: 'show_collapse', label: 'Enable accordion behaviour', type: 'checkbox' },
    ],
    defaultValues: {
      heading: 'Frequently Asked Questions',
      description: 'Find quick answers to common queries about certificate validity, batches, and fees.',
      show_collapse: true,
    },
  },
  contact: {
    key: 'contact',
    label: 'Contact',
    description: 'Contact and enquiry section settings.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Start Your Journey Today' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Intro text for the contact section.' },
      { key: 'phone', label: 'Phone number', type: 'text', placeholder: '8655050595' },
      { key: 'email', label: 'Email address', type: 'text', placeholder: 'hello@mayurcomputech.com' },
      { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Sector 5, Ghansoli, Navi Mumbai' },
    ],
    defaultValues: {
      heading: 'Start Your Journey Today',
      description: 'Have questions about course syllabus, batch timings, or fee structure?',
      phone: '8655050595',
      email: '',
      address: 'Shop No 5, Plot No 18, Ambe Bhumi CHS, Sector 5, Ghansoli, Navi Mumbai – 400701, Maharashtra',
    },
  },
  footer: {
    key: 'footer',
    label: 'Footer',
    description: 'Footer links and brand block.',
    allowReorder: true,
    allowDisable: true,
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Mayur Computech' },
      { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Learn Today • Build Tomorrow' },
      { key: 'copyright', label: 'Copyright text', type: 'text', placeholder: '© 2025 Mayur Computech' },
    ],
    defaultValues: {
      heading: 'Mayur Computech',
      tagline: 'Learn Today • Build Tomorrow',
      copyright: '© 2025 Mayur Computech',
    },
  },
};

export function getWebsiteSectionSchema(type: WebsiteSectionType) {
  return WEBSITE_SECTION_REGISTRY[type] ?? WEBSITE_SECTION_REGISTRY.hero;
}

export function parseSectionDisplayValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value == null) return '';
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

export function isSafeWebsiteUrl(input: string) {
  if (!input || !input.trim()) return true;
  const trimmed = input.trim();

  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;

  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function getDefaultSectionRecord(type: WebsiteSectionType) {
  const schema = getWebsiteSectionSchema(type);

  return {
    section_key: schema.key,
    component_type: schema.key,
    title: schema.label,
    content: { ...schema.defaultValues },
    status: 'draft',
    is_enabled: true,
    sort_order: 0,
    settings: {},
  };
}
