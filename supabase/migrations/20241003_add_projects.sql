create extension if not exists pgcrypto;

drop trigger if exists project_submissions_updated_at on public.project_submissions;
drop trigger if exists projects_updated_at on public.projects;
drop function if exists public.touch_project_submissions_updated_at();
drop function if exists public.touch_projects_updated_at();
drop table if exists public.project_submissions cascade;
drop table if exists public.projects cascade;

create table if not exists public.module_projects (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  description text,
  xp_value integer,
  rubric jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists module_projects_module_id_idx on public.module_projects (module_id);
create index if not exists module_projects_is_active_idx on public.module_projects (is_active);

create table if not exists public.module_project_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.module_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  repository_url text not null,
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint module_project_submissions_unique_user_project unique (project_id, user_id)
);

create index if not exists module_project_submissions_project_id_idx on public.module_project_submissions (project_id);
create index if not exists module_project_submissions_user_id_idx on public.module_project_submissions (user_id);

create or replace function public.touch_module_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create or replace function public.touch_module_project_submissions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

create trigger module_projects_updated_at
before update on public.module_projects
for each row
execute function public.touch_module_projects_updated_at();

create trigger module_project_submissions_updated_at
before update on public.module_project_submissions
for each row
execute function public.touch_module_project_submissions_updated_at();

commit;
