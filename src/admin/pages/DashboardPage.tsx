import { Link } from 'react-router-dom';
import { useAdminContext } from '../context/AdminContext';

const statCards = [
  { label: 'Courses', value: 'Content' },
  { label: 'Gallery', value: 'Photos' },
  { label: 'Results', value: 'Student Results' },
  { label: 'Testimonials', value: 'Trust' },
];

export function DashboardPage() {
  const { isSuperAdmin, isClientAdmin, role, permissions } = useAdminContext();

  const actions = isSuperAdmin
    ? [
        { label: 'Website', to: '/admin/website' },
        { label: 'Courses', to: '/admin/courses' },
        { label: 'Gallery', to: '/admin/gallery' },
        { label: 'Results', to: '/admin/results' },
        { label: 'Admin Users', to: '/admin/users' },
      ]
    : isClientAdmin
      ? [
          { label: 'Add Course', to: '/admin/courses' },
          { label: 'Upload Photos', to: '/admin/gallery' },
          { label: 'Add Result', to: '/admin/results' },
          { label: 'Add Certificate', to: '/admin/certificates' },
          { label: 'Add Testimonial', to: '/admin/testimonials' },
        ]
      : [];

  const permittedModules = [
    { label: 'Courses', path: '/admin/courses', visible: permissions.includes('courses.view') },
    { label: 'Gallery', path: '/admin/gallery', visible: permissions.includes('gallery.view') },
    { label: 'Results', path: '/admin/results', visible: permissions.includes('results.view') },
    { label: 'Certificates', path: '/admin/certificates', visible: permissions.includes('certificates.view') },
    { label: 'Achievements', path: '/admin/achievements', visible: permissions.includes('achievements.view') },
    { label: 'Testimonials', path: '/admin/testimonials', visible: permissions.includes('testimonials.view') },
    { label: 'Media', path: '/admin/media', visible: permissions.includes('media.view') },
  ].filter((item) => item.visible);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="dashboard-grid compact">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <p>{card.label}</p>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel-block">
        <h2>Role</h2>
        <p>{role ?? 'Unknown'}</p>
      </div>

      <div className="panel-block">
        <h2>Available content</h2>
        <div className="tag-list">
          {permittedModules.map((item) => (
            <Link key={item.path} to={item.path} className="tag-item">{item.label}</Link>
          ))}
        </div>
      </div>

      <div className="panel-block">
        <h2>Quick actions</h2>
        <div className="tag-list">
          {actions.map((item) => (
            <Link key={item.to} to={item.to} className="tag-item">{item.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
