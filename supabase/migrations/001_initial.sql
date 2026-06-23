create table videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  type text not null,
  script text,
  actor_description text,
  provider text not null default 'replicate',
  status text not null default 'pending',
  video_url text,
  thumbnail_url text,
  replicate_job_id text,
  heygen_video_id text,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table videos enable row level security;

create policy "Users can only see their own videos"
  on videos for all
  using (auth.uid() = user_id);

create index videos_user_id_idx on videos(user_id);
create index videos_status_idx on videos(status);
