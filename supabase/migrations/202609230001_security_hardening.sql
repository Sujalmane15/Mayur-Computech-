create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.status = 'active'
  );
$$;

create or replace function public.is_active_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.status = 'active'
  );
$$;

create or replace function public.has_admin_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    join public.admin_roles ar on ar.id = au.role_id
    where au.user_id = auth.uid()
      and au.status = 'active'
      and ar.role_name = has_admin_role.role_name
  );
$$;

create or replace function public.current_admin_user()
returns public.admin_users
language sql
stable
security definer
set search_path = public
as $$
  select au.*
  from public.admin_users au
  where au.user_id = auth.uid()
    and au.status = 'active'
  limit 1;
$$;

create or replace function public.get_admin_status(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select au.status
  from public.admin_users au
  where au.user_id = p_user_id
  limit 1;
$$;

create or replace function public.prevent_last_super_admin_removal()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_super_admin_count integer;
begin
  if tg_op = 'UPDATE' then
    if (old.status = 'active' and old.role_id is not null and old.role_id = (select id from public.admin_roles where role_name = 'SUPER_ADMIN'))
       and ((new.status is distinct from 'active') or (new.role_id is distinct from old.role_id and new.role_id is not null and new.role_id <> (select id from public.admin_roles where role_name = 'SUPER_ADMIN')))
    then
      select count(*) into active_super_admin_count
      from public.admin_users au
      join public.admin_roles ar on ar.id = au.role_id
      where au.status = 'active' and ar.role_name = 'SUPER_ADMIN';

      if active_super_admin_count <= 1 then
        raise exception 'At least one active Super Admin must remain.';
      end if;
    end if;
  end if;

  if tg_op = 'DELETE' then
    if old.status = 'active' and old.role_id = (select id from public.admin_roles where role_name = 'SUPER_ADMIN') then
      select count(*) into active_super_admin_count
      from public.admin_users au
      join public.admin_roles ar on ar.id = au.role_id
      where au.status = 'active' and ar.role_name = 'SUPER_ADMIN';

      if active_super_admin_count <= 1 then
        raise exception 'At least one active Super Admin must remain.';
      end if;
    end if;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists admin_users_last_super_admin_guard on public.admin_users;
create trigger admin_users_last_super_admin_guard
before update or delete on public.admin_users
for each row execute function public.prevent_last_super_admin_removal();

alter table public.admin_users enable row level security;

-- Remove CMS-era admin_users policies to replace with active-aware version.
drop policy if exists "Admins can read admin records" on public.admin_users;
drop policy if exists "Admins can view own profile" on public.admin_users;
drop policy if exists "Admins can read active admin records" on public.admin_users;

create policy "Admins can read active admin records"
  on public.admin_users for select
  using (user_id = auth.uid() or public.is_super_admin());

-- Replace CMS RBAC gallery policies with active-admin-hardened versions.
-- The is_admin() function in this migration already enforces status='active'.
drop policy if exists "CMS admins can read gallery" on public.gallery_items;
drop policy if exists "CMS admins can update gallery" on public.gallery_items;
drop policy if exists "Public gallery reads require active admin or published item" on public.gallery_items;
drop policy if exists "Admins can update existing gallery only if active" on public.gallery_items;

create policy "Public gallery reads require active admin or published item"
  on public.gallery_items for select
  using (is_published = true or public.is_admin());

create policy "Admins can update existing gallery only if active"
  on public.gallery_items for update
  using (public.is_admin())
  with check (public.is_admin());

comment on function public.is_admin is 'Returns true only for active admin user records.';
comment on function public.is_active_admin_user is 'Compatibility helper for active admins only.';
comment on function public.has_admin_role is 'Returns true when the current user has the supplied active admin role.';
