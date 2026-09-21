# CMS progress tracker

## Phase 1 — Database foundation + RBAC + security

Status: complete

### Files created
- [supabase/migrations/202609210001_cms_rbac.sql](../supabase/migrations/202609210001_cms_rbac.sql)

### Files modified
- No public website or UI files were changed in this phase.

### Database migrations
- Added the CMS RBAC schema for roles, permissions, role permissions, admin users, site settings, site sections, course/results/certificate/achievement/testimonial models, media, audit logs, and content revisions.
- Preserved the existing gallery foundation while applying stronger admin governance.

### RLS
- Enabled row-level security on the new CMS tables.
- Restricted management to authenticated admin users with explicit permissions.
- Protected admin escalation by preventing non-super-admin role assignment or status changes.

### Roles
- SUPER_ADMIN
- CLIENT_ADMIN

### Permissions
- Added the initial permission set for gallery, courses, results, certificates, achievements, testimonials, media, website, sections, navigation, SEO, settings, admins, permissions, audit, and system controls.
- CLIENT_ADMIN receives only business-content permissions and is not granted developer/system permissions.

### Security verification
- Public gallery reads remain limited to published content.
- Non-admins cannot read admin metadata or write CMS resources.
- Authorization is enforced via database functions and RLS, not hidden UI elements.

### Tests
- npm run lint
- npm run build

### Known issues
- No Phase 1 code changes were required beyond the secure database schema.
- The admin UI itself remains intentionally out of scope until the next loop.

### Next phase
- Build the admin shell, authentication, and RBAC-aware route protections in the next loop without changing the public website.
