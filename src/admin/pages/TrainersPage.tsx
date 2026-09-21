import {
  ContentModulePage,
  type ContentFieldDefinition,
  StatusBadge,
  VisibilityBadge,
} from '../components/ContentModulePage';

const formFields: ContentFieldDefinition[] = [
  { key: 'name', label: 'Name', required: true, placeholder: 'Trainer name' },
  { key: 'designation', label: 'Designation', required: true, placeholder: 'e.g. Senior Faculty' },
  { key: 'photo_url', label: 'Photo URL', type: 'url', placeholder: 'https://example.com/photo.jpg' },
  { key: 'short_description', label: 'Short description', type: 'textarea', placeholder: 'Brief introduction' },
  { key: 'experience', label: 'Experience', type: 'textarea', placeholder: 'Years and details' },
  { key: 'qualifications', label: 'Qualifications', type: 'textarea', placeholder: 'Degrees, certifications' },
  { key: 'expertise', label: 'Expertise / Specialization', type: 'textarea', placeholder: 'Areas of expertise' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }] },
  { key: 'visibility', label: 'Visibility', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }] },
  { key: 'sort_order', label: 'Display order', type: 'number', placeholder: '0' },
];

function normalizeValues(values: Record<string, any>) {
  return {
    ...values,
    designation: values.designation || '',
    photo_url: values.photo_url || null,
    short_description: values.short_description || '',
    experience: values.experience || null,
    qualifications: values.qualifications || null,
    expertise: values.expertise || null,
    status: values.status || 'draft',
    visibility: values.visibility || 'hidden',
    sort_order: Number(values.sort_order ?? 0),
  };
}

function validate(values: Record<string, any>) {
  const errors: Record<string, string> = {};
  if (!String(values.name ?? '').trim()) errors.name = 'Name is required.';
  if (!String(values.designation ?? '').trim()) errors.designation = 'Designation is required.';
  return errors;
}

export function TrainersPage() {
  return (
    <ContentModulePage
      title="Trainers"
      description="Manage trainers for the public carousel and website."
      table="trainers"
      select="*"
      emptyMessage="No trainers have been added yet."
      viewPermission="trainers.view"
      createPermission="trainers.create"
      updatePermission="trainers.update"
      deletePermission="trainers.delete"
      publishPermission="trainers.publish"
      formFields={formFields}
      columns={[
        { key: 'name', label: 'Name', render: (row) => <strong>{row.name}</strong> },
        { key: 'designation', label: 'Designation', render: (row) => <span>{row.designation}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'visibility', label: 'Visibility', render: (row) => <VisibilityBadge value={row.visibility} /> },
        { key: 'sort_order', label: 'Order', render: (row) => <span>{row.sort_order ?? 0}</span> },
      ]}
      defaultValues={() => ({ name: '', designation: '', photo_url: '', short_description: '', experience: '', qualifications: '', expertise: '', status: 'draft', visibility: 'hidden', sort_order: 0 })}
      searchFields={['name', 'designation']}
      normalizeValues={normalizeValues}
      validate={validate}
      accent="blue"
    />
  );
}
