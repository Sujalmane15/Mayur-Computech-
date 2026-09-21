export type PermissionCode =
  | 'dashboard.view'
  | 'gallery.view'
  | 'gallery.create'
  | 'gallery.update'
  | 'gallery.delete'
  | 'gallery.publish'
  | 'courses.view'
  | 'courses.create'
  | 'courses.update'
  | 'courses.delete'
  | 'courses.publish'
  | 'trainers.view'
  | 'trainers.create'
  | 'trainers.update'
  | 'trainers.delete'
  | 'trainers.publish'
  | 'results.view'
  | 'results.create'
  | 'results.update'
  | 'results.delete'
  | 'results.publish'
  | 'certificates.view'
  | 'certificates.create'
  | 'certificates.update'
  | 'certificates.delete'
  | 'certificates.publish'
  | 'achievements.view'
  | 'achievements.create'
  | 'achievements.update'
  | 'achievements.delete'
  | 'achievements.publish'
  | 'testimonials.view'
  | 'testimonials.create'
  | 'testimonials.update'
  | 'testimonials.delete'
  | 'testimonials.publish'
  | 'media.view'
  | 'media.upload'
  | 'media.update'
  | 'media.delete'
  | 'website.view'
  | 'website.update'
  | 'sections.view'
  | 'sections.create'
  | 'sections.update'
  | 'sections.delete'
  | 'sections.reorder'
  | 'sections.publish'
  | 'navigation.view'
  | 'navigation.update'
  | 'seo.view'
  | 'seo.update'
  | 'settings.view'
  | 'settings.update'
  | 'admins.view'
  | 'admins.create'
  | 'admins.update'
  | 'admins.delete'
  | 'admins.deactivate'
  | 'permissions.view'
  | 'permissions.update'
  | 'audit.view'
  | 'system.view'
  | 'system.update';

export const ADMIN_SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', permission: 'dashboard.view' },
  {
    label: 'Website',
    permission: 'website.view',
    children: [
      { label: 'Homepage', path: '/admin/website/homepage', permission: 'website.view' },
      { label: 'Sections', path: '/admin/website/sections', permission: 'sections.view' },
      { label: 'Navigation', path: '/admin/website/navigation', permission: 'navigation.view' },
      { label: 'Settings', path: '/admin/website/settings', permission: 'settings.view' },
      { label: 'SEO', path: '/admin/website/seo', permission: 'seo.view' },
    ],
  },
  {
    label: 'Content',
    permission: 'courses.view',
    children: [
      { label: 'Courses', path: '/admin/courses', permission: 'courses.view' },
      { label: 'Trainers', path: '/admin/trainers', permission: 'trainers.view' },
      { label: 'Gallery', path: '/admin/gallery', permission: 'gallery.view' },
      { label: 'Results', path: '/admin/results', permission: 'results.view' },
      { label: 'Certificates', path: '/admin/certificates', permission: 'certificates.view' },
      { label: 'Achievements', path: '/admin/achievements', permission: 'achievements.view' },
      { label: 'Testimonials', path: '/admin/testimonials', permission: 'testimonials.view' },
    ],
  },
  { label: 'Media', path: '/admin/media', permission: 'media.view' },
  {
    label: 'Administration',
    permission: 'admins.view',
    children: [
      { label: 'Admin Users', path: '/admin/users', permission: 'admins.view' },
      { label: 'Roles & Permissions', path: '/admin/permissions', permission: 'permissions.view' },
      { label: 'Audit Logs', path: '/admin/audit-logs', permission: 'audit.view' },
    ],
  },
  { label: 'System', path: '/admin/system', permission: 'system.view' },
] as const;

export function hasPermission(permissions: string[] = [], code: string) {
  return permissions.includes(code);
}

export function hasRole(role: string | null | undefined, expectedRole: string) {
  return role === expectedRole;
}
