-- Test: RLS is enabled on all intended tables
BEGIN;

SELECT plan(15);

-- All protected tables must have RLS enabled
SELECT ok(rowsecurity, 'achievements has RLS enabled') FROM pg_tables WHERE tablename='achievements' AND schemaname='public';
SELECT ok(rowsecurity, 'admin_permissions has RLS enabled') FROM pg_tables WHERE tablename='admin_permissions' AND schemaname='public';
SELECT ok(rowsecurity, 'admin_roles has RLS enabled') FROM pg_tables WHERE tablename='admin_roles' AND schemaname='public';
SELECT ok(rowsecurity, 'admin_users has RLS enabled') FROM pg_tables WHERE tablename='admin_users' AND schemaname='public';
SELECT ok(rowsecurity, 'audit_logs has RLS enabled') FROM pg_tables WHERE tablename='audit_logs' AND schemaname='public';
SELECT ok(rowsecurity, 'certificates has RLS enabled') FROM pg_tables WHERE tablename='certificates' AND schemaname='public';
SELECT ok(rowsecurity, 'content_revisions has RLS enabled') FROM pg_tables WHERE tablename='content_revisions' AND schemaname='public';
SELECT ok(rowsecurity, 'courses has RLS enabled') FROM pg_tables WHERE tablename='courses' AND schemaname='public';
SELECT ok(rowsecurity, 'gallery_items has RLS enabled') FROM pg_tables WHERE tablename='gallery_items' AND schemaname='public';
SELECT ok(rowsecurity, 'media_library has RLS enabled') FROM pg_tables WHERE tablename='media_library' AND schemaname='public';
SELECT ok(rowsecurity, 'results has RLS enabled') FROM pg_tables WHERE tablename='results' AND schemaname='public';
SELECT ok(rowsecurity, 'role_permissions has RLS enabled') FROM pg_tables WHERE tablename='role_permissions' AND schemaname='public';
SELECT ok(rowsecurity, 'site_sections has RLS enabled') FROM pg_tables WHERE tablename='site_sections' AND schemaname='public';
SELECT ok(rowsecurity, 'site_settings has RLS enabled') FROM pg_tables WHERE tablename='site_settings' AND schemaname='public';
SELECT ok(rowsecurity, 'testimonials has RLS enabled') FROM pg_tables WHERE tablename='testimonials' AND schemaname='public';

SELECT * FROM finish();

ROLLBACK;
