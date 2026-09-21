import {
  ContentModulePage,
  type ContentFieldDefinition,
  FeaturedBadge,
  StatusBadge,
  VisibilityBadge,
} from '../components/ContentModulePage';

const formFields: ContentFieldDefinition[] = [
  { key: 'name', label: 'Name', required: true, placeholder: 'Student name' },
  { key: 'designation', label: 'Designation', placeholder: 'Student / Alumni' },
  { key: 'message', label: 'Message', required: true, type: 'textarea', placeholder: 'This course helped me...' },
  { key: 'rating', label: 'Rating', type: 'number', min: 1, max: 5, placeholder: '5' },
  { key: 'photo_url', label: 'Photo URL', type: 'url', placeholder: 'https://example.com/photo.jpg' },
  { key: 'is_featured', label: 'Featured testimonial', type: 'checkbox' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }] },
  { key: 'visibility', label: 'Visibility', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }] },
  { key: 'sort_order', label: 'Sort order', type: 'number', placeholder: '0' },
];

function normalizeValues(values: Record<string, any>) {
  return {
    ...values,
    rating: Number(values.rating ?? 5),
    is_featured: Boolean(values.is_featured),
    status: values.status || 'draft',
    visibility: values.visibility || 'hidden',
    sort_order: Number(values.sort_order ?? 0),
  };
}

function validate(values: Record<string, any>) {
  const errors: Record<string, string> = {};
  if (!String(values.name ?? '').trim()) errors.name = 'Name is required.';
  if (!String(values.message ?? '').trim()) errors.message = 'Message is required.';
  const rating = Number(values.rating ?? 0);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) errors.rating = 'Rating must be between 1 and 5.';
  return errors;
}

export function TestimonialsPage() {
  return (
    <ContentModulePage
      title="Testimonials"
      description="Manage written testimonials and social proof."
      table="testimonials"
      select="*"
      emptyMessage="No testimonials have been added yet."
      viewPermission="testimonials.view"
      createPermission="testimonials.create"
      updatePermission="testimonials.update"
      deletePermission="testimonials.delete"
      publishPermission="testimonials.publish"
      formFields={formFields}
      columns={[
        { key: 'name', label: 'Name', render: (row) => <strong>{row.name}</strong> },
        { key: 'rating', label: 'Rating', render: (row) => <span>{row.rating ?? 0} / 5</span> },
        { key: 'is_featured', label: 'Featured', render: (row) => <FeaturedBadge value={Boolean(row.is_featured)} /> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'visibility', label: 'Visibility', render: (row) => <VisibilityBadge value={row.visibility} /> },
      ]}
      defaultValues={() => ({ name: '', designation: '', message: '', rating: 5, photo_url: '', is_featured: false, status: 'draft', visibility: 'hidden', sort_order: 0 })}
      searchFields={['name', 'designation', 'message']}
      normalizeValues={normalizeValues}
      validate={validate}
      accent="pink"
    />
  );
}
