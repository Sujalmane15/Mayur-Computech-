drop policy if exists "Public can read published site settings" on public.site_settings;
create policy "Public can read published site settings"
  on public.site_settings for select
  using (is_public = true);

drop policy if exists "Public can read published courses" on public.courses;
create policy "Public can read published courses"
  on public.courses for select
  using (status = 'published' and visibility = 'public');

drop policy if exists "Public can read published results" on public.results;
create policy "Public can read published results"
  on public.results for select
  using (status = 'published' and visibility = 'public');

drop policy if exists "Public can read published certificates" on public.certificates;
create policy "Public can read published certificates"
  on public.certificates for select
  using (status = 'published' and visibility = 'public');

drop policy if exists "Public can read published achievements" on public.achievements;
drop policy if exists "Public can read published achievements" on public.achievements;
create policy "Public can read published achievements"
  on public.achievements for select
  using (status = 'published' and visibility = 'public');

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials"
  on public.testimonials for select
  using (status = 'published' and visibility = 'public');
