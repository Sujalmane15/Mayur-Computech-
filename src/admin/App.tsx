import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProvider, useAdminContext } from './context/AdminContext';
import { AchievementsPage } from './pages/AchievementsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { CoursesPage } from './pages/CoursesPage';
import { DashboardPage } from './pages/DashboardPage';
import { GalleryPage } from './pages/GalleryPage';
import { LoginPage } from './pages/LoginPage';
import { MediaPage } from './pages/MediaPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ResultsPage } from './pages/ResultsPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { TrainersPage } from './pages/TrainersPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { WebsiteDashboardPage } from './pages/WebsiteDashboardPage';
import { WebsiteSectionsPage } from './pages/WebsiteSectionsPage';
import { WebsiteSeoPage } from './pages/WebsiteSeoPage';
import { WebsiteSettingsPage } from './pages/WebsiteSettingsPage';

function AdminAppRoutes() {
  const { role } = useAdminContext();

  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/website" element={<ProtectedRoute requiredPermission="website.view"><WebsiteDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/website/homepage" element={<ProtectedRoute requiredPermission="website.view"><WebsiteDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/website/sections" element={<ProtectedRoute requiredPermission="sections.view"><WebsiteSectionsPage /></ProtectedRoute>} />
          <Route path="/admin/website/navigation" element={<ProtectedRoute requiredPermission="navigation.view"><PlaceholderPage title="Navigation" description="Navigation management is a future task." /></ProtectedRoute>} />
          <Route path="/admin/website/settings" element={<ProtectedRoute requiredPermission="settings.view"><WebsiteSettingsPage /></ProtectedRoute>} />
          <Route path="/admin/website/seo" element={<ProtectedRoute requiredPermission="seo.view"><WebsiteSeoPage /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute requiredPermission="courses.view"><CoursesPage /></ProtectedRoute>} />
          <Route path="/admin/trainers" element={<ProtectedRoute requiredPermission="trainers.view"><TrainersPage /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute requiredPermission="gallery.view"><GalleryPage /></ProtectedRoute>} />
          <Route path="/admin/results" element={<ProtectedRoute requiredPermission="results.view"><ResultsPage /></ProtectedRoute>} />
          <Route path="/admin/certificates" element={<ProtectedRoute requiredPermission="certificates.view"><CertificatesPage /></ProtectedRoute>} />
          <Route path="/admin/achievements" element={<ProtectedRoute requiredPermission="achievements.view"><AchievementsPage /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute requiredPermission="testimonials.view"><TestimonialsPage /></ProtectedRoute>} />
          <Route path="/admin/media" element={<ProtectedRoute requiredPermission="media.view"><MediaPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredPermission="admins.view"><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/permissions" element={<ProtectedRoute requiredPermission="permissions.view"><PermissionsPage /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute requiredPermission="audit.view"><AuditLogsPage /></ProtectedRoute>} />
          <Route path="/admin/system" element={<ProtectedRoute requiredPermission="system.view"><PlaceholderPage title="System" description="System controls are intentionally deferred." /></ProtectedRoute>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export function AdminRouter() {
  return (
    <AdminProvider>
      <AdminAppRoutes />
    </AdminProvider>
  );
}
