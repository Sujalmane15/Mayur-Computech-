-- Trainers CMS migration (additive — does not modify existing migrations)
-- Creates a dedicated trainers table following the same pattern as courses/testimonials.

create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null default '',
  photo_url text,
  photo_path text,
  short_description text not null default '',
  experience text,
  qualifications text,
  expertise text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  visibility text not null default 'hidden' check (visibility in ('public', 'hidden')),
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_trainers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trainers_updated_at
before update on public.trainers
for each row execute function public.set_trainers_updated_at();

-- RLS: PUBLIC can read only published + public trainers
create policy "Public can read published trainers"
  on public.trainers for select
  using (status = 'published' and visibility = 'public');

-- RLS: SUPER_ADMIN full access
create policy "Super admins can manage trainers"
  on public.trainers for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- RLS: CLIENT_ADMIN CRUD per permissions
create policy "Clients can read trainers"
  on public.trainers for select
  using (public.has_permission('trainers.view'));

create policy "Clients can create trainers"
  on public.trainers for insert
  with check (public.has_permission('trainers.create'));

create policy "Clients can update trainers"
  on public.trainers for update
  using (public.has_permission('trainers.update'))
  with check (public.has_permission('trainers.update'));

create policy "Clients can delete trainers"
  on public.trainers for delete
  using (public.has_permission('trainers.delete'));

-- Indexes
create index if not exists trainers_status_visibility_idx
  on public.trainers (status, visibility, sort_order);

-- Insert trainer permissions (SUPER_ADMIN gets all)
insert into public.admin_permissions (code, module, label, description)
values
  ('trainers.view', 'trainers', 'View Trainers', 'Read trainer records'),
  ('trainers.create', 'trainers', 'Create Trainers', 'Create trainer records'),
  ('trainers.update', 'trainers', 'Update Trainers', 'Edit trainer records'),
  ('trainers.delete', 'trainers', 'Delete Trainers', 'Delete trainer records'),
  ('trainers.publish', 'trainers', 'Publish Trainers', 'Publish or hide trainer records')
on conflict (code) do nothing;

-- Assign trainers permissions to SUPER_ADMIN
insert into public.role_permissions (role_id, permission_id)
select ar.id, ap.id
from public.admin_roles ar
join public.admin_permissions ap on ap.code in (
  'trainers.view', 'trainers.create', 'trainers.update', 'trainers.delete', 'trainers.publish'
)
where ar.role_name = 'SUPER_ADMIN'
on conflict do nothing;

-- Assign trainers permissions to CLIENT_ADMIN
insert into public.role_permissions (role_id, permission_id)
select ar.id, ap.id
from public.admin_roles ar
join public.admin_permissions ap on ap.code in (
  'trainers.view', 'trainers.create', 'trainers.update', 'trainers.delete', 'trainers.publish'
)
where ar.role_name = 'CLIENT_ADMIN'
on conflict do nothing;
