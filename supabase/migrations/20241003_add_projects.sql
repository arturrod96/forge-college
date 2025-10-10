begin;

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  project_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_module_id_idx on public.projects (module_id);

create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null,
  repository_url text not null,
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint project_submissions_unique_user_project unique (project_id, user_id)
);

create index if not exists project_submissions_project_id_idx on public.project_submissions (project_id);
create index if not exists project_submissions_user_id_idx on public.project_submissions (user_id);

create or replace function public.touch_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create or replace function public.touch_project_submissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create trigger projects_updated_at
before update on public.projects
for each row
execute function public.touch_projects_updated_at();

create trigger project_submissions_updated_at
before update on public.project_submissions
for each row
execute function public.touch_project_submissions_updated_at();

commit;
