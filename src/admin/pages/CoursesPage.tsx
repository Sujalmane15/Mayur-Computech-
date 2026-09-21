import {
  ContentModulePage,
  type ContentFieldDefinition,
  StatusBadge,
  VisibilityBadge,
} from '../components/ContentModulePage';

const categoryOptions = [
  { label: 'General', value: 'general' },
  { label: 'MS Office', value: 'ms-office' },
  { label: 'Accounting', value: 'accounting' },
  { label: 'Digital Skills', value: 'digital-skills' },
  { label: 'Career', value: 'career' },
];

const formFields: ContentFieldDefinition[] = [
  { key: 'title', label: 'Course title', required: true, placeholder: 'e.g. Advanced Excel' },
  { key: 'slug', label: 'Slug', required: true, placeholder: 'advanced-excel' },
  { key: 'short_description', label: 'Short description', required: true, placeholder: 'Brief summary shown on listings' },
  { key: 'description', label: 'Full description', type: 'textarea', placeholder: 'Course detail copy' },
  { key: 'category', label: 'Category', type: 'select', options: categoryOptions },
  { key: 'duration', label: 'Duration', placeholder: '3 Months' },
  { key: 'fees', label: 'Fees', placeholder: '₹4,500' },
  { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://example.com/course.jpg' },
  { key: 'features', label: 'Features', type: 'textarea', helperText: 'One item per line', placeholder: 'Hands-on labs\nLive practice\nCertificate' },
  { key: 'eligibility', label: 'Eligibility', type: 'textarea', placeholder: 'Basic computer knowledge' },
  { key: 'syllabus', label: 'Syllabus', type: 'textarea', placeholder: 'Topic list' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }] },
  { key: 'visibility', label: 'Visibility', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }] },
  { key: 'is_featured', label: 'Featured course', type: 'checkbox' },
  { key: 'sort_order', label: 'Sort order', type: 'number', placeholder: '0' },
];

function normalizeValues(values: Record<string, any>) {
  const slug = String(values.slug ?? values.title ?? '').trim();
  const nextSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return {
    ...values,
    slug: nextSlug || 'course',
    category: values.category || 'general',
    status: values.status || 'draft',
    visibility: values.visibility || 'hidden',
    sort_order: Number(values.sort_order ?? 0),
    is_featured: Boolean(values.is_featured),
    features: typeof values.features === 'string'
      ? values.features
          .split(/\r?\n|\s*[,;]\s*/)
          .map((item: string) => item.trim())
          .filter(Boolean)
      : Array.isArray(values.features) ? values.features : [],
  };
}

function validate(values: Record<string, any>) {
  const errors: Record<string, string> = {};

  if (!String(values.title ?? '').trim()) errors.title = 'Course title is required.';
  if (!String(values.slug ?? '').trim()) errors.slug = 'Slug is required.';
  if (!String(values.short_description ?? '').trim()) errors.short_description = 'Short description is required.';
  if (!String(values.category ?? '').trim()) errors.category = 'Choose a category.';

  return errors;
}

export function CoursesPage() {
  return (
    <ContentModulePage
      title="Courses"
      description="Manage the courses catalog, pricing, curriculum, and publishing state."
      table="courses"
      select="*"
      emptyMessage="No courses exist yet. Add the first course to start the catalog."
      viewPermission="courses.view"
      createPermission="courses.create"
      updatePermission="courses.update"
      deletePermission="courses.delete"
      publishPermission="courses.publish"
      formFields={formFields}
      columns={[
        { key: 'title', label: 'Course', render: (row) => <strong>{row.title}</strong> },
        { key: 'category', label: 'Category', render: (row) => <span>{row.category}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'visibility', label: 'Visibility', render: (row) => <VisibilityBadge value={row.visibility} /> },
        { key: 'sort_order', label: 'Order', render: (row) => <span>{row.sort_order ?? 0}</span> },
      ]}
      defaultValues={() => ({
        title: '', slug: '', short_description: '', description: '', category: 'general', duration: '', fees: '', image_url: '', features: [], eligibility: '', syllabus: '', status: 'draft', visibility: 'hidden', is_featured: false, sort_order: 0,
      })}
      searchFields={['title', 'short_description', 'slug', 'category']}
      categoryOptions={categoryOptions}
      statusOptions={[{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }]}
      visibilityOptions={[{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }]}
      normalizeValues={normalizeValues}
      validate={validate}
      accent="blue"
    />
  );
}
