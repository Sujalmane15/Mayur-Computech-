create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  alt_text text not null,
  image_url text not null,
  image_path text not null,
  image_file_id text,
  thumbnail_url text,
  category text not null,
  category_label text not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_public_order_idx
  on public.gallery_items (is_published, display_order, created_at);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists "Public can read published gallery" on public.gallery_items;
create policy "Public can read published gallery"
  on public.gallery_items for select
  using (is_published = true or public.is_admin());

drop policy if exists "Admins can insert gallery" on public.gallery_items;
create policy "Admins can insert gallery"
  on public.gallery_items for insert
  with check (public.is_admin() and created_by = auth.uid());

drop policy if exists "Admins can update gallery" on public.gallery_items;
create policy "Admins can update gallery"
  on public.gallery_items for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete gallery" on public.gallery_items;
create policy "Admins can delete gallery"
  on public.gallery_items for delete
  using (public.is_admin());

drop policy if exists "Admins can read admin records" on public.admin_users;
create policy "Admins can read admin records"
  on public.admin_users for select
  using (user_id = auth.uid());

create or replace function public.set_gallery_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_items_updated_at on public.gallery_items;
create trigger gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_gallery_updated_at();

-- After creating the first account in Supabase Auth, grant it admin access:
-- insert into public.admin_users (user_id) values ('AUTH_USER_UUID');