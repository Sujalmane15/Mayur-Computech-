import {
  ContentModulePage,
  type ContentFieldDefinition,
  StatusBadge,
  VisibilityBadge,
} from '../components/ContentModulePage';

const categoryOptions = [
  { label: 'General', value: 'general' },
  { label: 'Student', value: 'student' },
  { label: 'Placement', value: 'placement' },
  { label: 'Institution', value: 'institution' },
];

const formFields: ContentFieldDefinition[] = [
  { key: 'title', label: 'Achievement title', required: true, placeholder: '100% Placement Support' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Share achievement details' },
  { key: 'year', label: 'Year', type: 'number', placeholder: '2026' },
  { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://example.com/achievement.jpg' },
  { key: 'category', label: 'Category', type: 'select', options: categoryOptions },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }] },
  { key: 'visibility', label: 'Visibility', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }] },
  { key: 'sort_order', label: 'Sort order', type: 'number', placeholder: '0' },
];

function normalizeValues(values: Record<string, any>) {
  return {
    ...values,
    category: values.category || 'general',
    year: values.year === '' || values.year == null ? null : Number(values.year),
    status: values.status || 'draft',
    visibility: values.visibility || 'hidden',
    sort_order: Number(values.sort_order ?? 0),
  };
}

function validate(values: Record<string, any>) {
  const errors: Record<string, string> = {};
  if (!String(values.title ?? '').trim()) errors.title = 'Achievement title is required.';
  return errors;
}

export function AchievementsPage() {
  return (
    <ContentModulePage
      title="Achievements"
      description="Showcase notable success stories and milestones."
      table="achievements"
      select="*"
      emptyMessage="No achievements have been added yet."
      viewPermission="achievements.view"
      createPermission="achievements.create"
      updatePermission="achievements.update"
      deletePermission="achievements.delete"
      publishPermission="achievements.publish"
      formFields={formFields}
      columns={[
        { key: 'title', label: 'Title', render: (row) => <strong>{row.title}</strong> },
        { key: 'year', label: 'Year', render: (row) => <span>{row.year ?? '-'}</span> },
        { key: 'category', label: 'Category', render: (row) => <span>{row.category}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'visibility', label: 'Visibility', render: (row) => <VisibilityBadge value={row.visibility} /> },
      ]}
      defaultValues={() => ({ title: '', description: '', year: '', image_url: '', category: 'general', status: 'draft', visibility: 'hidden', sort_order: 0 })}
      searchFields={['title', 'description', 'category']}
      categoryOptions={categoryOptions}
      normalizeValues={normalizeValues}
      validate={validate}
      accent="green"
    />
  );
}
