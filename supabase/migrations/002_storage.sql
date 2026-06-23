-- Create public media storage bucket for free-tier portraits and audio
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vozviva-media',
  'vozviva-media',
  true,
  52428800, -- 50 MB per file
  array['image/jpeg','image/png','image/webp','audio/flac','audio/wav','audio/mpeg','video/mp4','video/webm']
)
on conflict (id) do nothing;

-- Anyone can read (public bucket)
create policy "Public read vozviva-media"
  on storage.objects for select
  using (bucket_id = 'vozviva-media');

-- Authenticated users can upload their own files
create policy "Authenticated upload vozviva-media"
  on storage.objects for insert
  with check (bucket_id = 'vozviva-media' and auth.role() = 'authenticated');
