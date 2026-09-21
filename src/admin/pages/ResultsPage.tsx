import {
  ContentModulePage,
  type ContentFieldDefinition,
  StatusBadge,
  VisibilityBadge,
} from '../components/ContentModulePage';

const formFields: ContentFieldDefinition[] = [
  { key: 'student_name', label: 'Student name', required: true, placeholder: 'Student name' },
  { key: 'course_name', label: 'Course', required: true, placeholder: 'Course title' },
  { key: 'exam_name', label: 'Examination', placeholder: 'Final exam / result' },
  { key: 'result_text', label: 'Result text', placeholder: 'Pass / Distinction' },
  { key: 'score', label: 'Score', type: 'number', placeholder: '420' },
  { key: 'percentage', label: 'Percentage', type: 'number', placeholder: '92' },
  { key: 'result_year', label: 'Year', type: 'number', placeholder: '2026' },
  { key: 'certificate_image_url', label: 'Certificate image URL', type: 'url', placeholder: 'https://example.com/certificate.jpg' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short details about the result' },
  { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }, { label: 'Archived', value: 'archived' }] },
  { key: 'visibility', label: 'Visibility', type: 'select', options: [{ label: 'Public', value: 'public' }, { label: 'Hidden', value: 'hidden' }] },
  { key: 'sort_order', label: 'Sort order', type: 'number', placeholder: '0' },
];

function normalizeValues(values: Record<string, any>) {
  return {
    ...values,
    score: values.score === '' || values.score == null ? null : Number(values.score),
    percentage: values.percentage === '' || values.percentage == null ? null : Number(values.percentage),
    result_year: values.result_year === '' || values.result_year == null ? null : Number(values.result_year),
    status: values.status || 'draft',
    visibility: values.visibility || 'hidden',
    sort_order: Number(values.sort_order ?? 0),
  };
}

function validate(values: Record<string, any>) {
  const errors: Record<string, string> = {};
  if (!String(values.student_name ?? '').trim()) errors.student_name = 'Student name is required.';
  if (!String(values.course_name ?? '').trim()) errors.course_name = 'Course is required.';
  if (values.percentage != null && Number(values.percentage) > 100) errors.percentage = 'Percentage cannot exceed 100.';
  return errors;
}

export function ResultsPage() {
  return (
    <ContentModulePage
      title="Results"
      description="Manage student performance records and public achievement highlights."
      table="results"
      select="*"
      emptyMessage="No results have been added yet."
      viewPermission="results.view"
      createPermission="results.create"
      updatePermission="results.update"
      deletePermission="results.delete"
      publishPermission="results.publish"
      formFields={formFields}
      columns={[
        { key: 'student_name', label: 'Student', render: (row) => <strong>{row.student_name}</strong> },
        { key: 'course_name', label: 'Course', render: (row) => <span>{row.course_name}</span> },
        { key: 'percentage', label: 'Percentage', render: (row) => <span>{row.percentage ?? '-'}</span> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'visibility', label: 'Visibility', render: (row) => <VisibilityBadge value={row.visibility} /> },
      ]}
      defaultValues={() => ({ student_name: '', course_name: '', exam_name: '', result_text: '', score: '', percentage: '', result_year: '', certificate_image_url: '', description: '', status: 'draft', visibility: 'hidden', sort_order: 0 })}
      searchFields={['student_name', 'course_name', 'exam_name', 'result_text']}
      normalizeValues={normalizeValues}
      validate={validate}
      accent="purple"
    />
  );
}
