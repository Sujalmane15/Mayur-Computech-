import {
  ContentModulePage,
  type ContentFieldDefinition,
  StatusBadge,
  VisibilityBadge,
} from '../components/ContentModulePage';

const categoryOptions = [
  { label: 'General', value: 'general' },
  { label: 'Course', value: 'course' },
  { label: 'Placement', value: 'placement' },
  { label: 'Achievement', value: 'achievement' },
];

const formFields: ContentFieldDefinition[] = [
  { key: 'title', label: 'Certificate title', required: true, placeholder: 'Certified Excel Professional' },
  { key: 'student_name', label: 'Student name', placeholder: 'Student name' },
  { key: 'course_name', label: 'Course name', placeholder: 'MS Office' },
  { key: 'event_year', label: 'Year', type: 'number', placeholder: '2026' },
  { key: 'image_url', label: 'Certificate image URL', type: 'url', placeholder: 'https://example.com/certificate.jpg' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief notes' },
  { key: 'category', label: 'Category', type: 'select', options: categoryOptions },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }] },
  { key: 'visibility', label: 'Visibility', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }] },
  { key: 'sort_order', label: 'Sort order', type: 'number', placeholder: '0' },
];

function normalizeValues(values: Record<string, any>) {
  return {
    ...values,
    category: values.category || 'general',
    event_year: values.event_year === '' || values.event_year == null ? null : Number(values.event_year),
    status: values.status || 'draft',
    visibility: values.visibility || 'hidden',
    sort_order: Number(values.sort_order ?? 0),
  };
}

function validate(values: Record<string, string>) {
  const errors: Record<string, string> = {};
  if (!String(values.title ?? '').trim()) errors.title = 'Certificate title is required.';
  return errors;
}

export function CertificatesPage() {
  return (
    <ContentModulePage
      title="Certificates"
      description="Track certificates and showcase learner achievements."
      table="certificates"
      select="*"
      emptyMessage="No certificates exist yet."
      viewPermission="certificates.view"
      createPermission="certificates.create"
      updatePermission="certificates.update"
      deletePermission="certificates.delete"
      publishPermission="certificates.publish"
      formFields={formFields}
      columns={[
        { key: 'title', label: 'Title', render: (row) => <strong>{row.title}</strong> },
        { key: 'student_name', label: 'Student', render: (row) => <span>{row.student_name ?? '-'}</span> },
        { key: 'event_year', label: 'Year', render: (row) => <span>{row.event_year ?? '-'}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'visibility', label: 'Visibility', render: (row) => <VisibilityBadge value={row.visibility} /> },
      ]}
      defaultValues={() => ({ title: '', student_name: '', course_name: '', event_year: '', image_url: '', description: '', category: 'general', status: 'draft', visibility: 'hidden', sort_order: 0 })}
      searchFields={['title', 'student_name', 'course_name']}
      categoryOptions={categoryOptions}
      normalizeValues={normalizeValues}
      validate={validate}
      accent="orange"
    />
  );
}
