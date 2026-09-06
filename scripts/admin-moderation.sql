-- AnyDayWork moderation backend.
-- STAGED ONLY on the development branch. Do not run against production until tested.

create table if not exists public.admin_users (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_moderation_log (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null,
  action text not null,
  target_type text not null,
  target_id uuid,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.admin_moderation_log enable row level security;

create or replace function public.admin_is_authorized()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.admin_is_authorized() from public;
grant execute on function public.admin_is_authorized() to authenticated;

create or replace function public.admin_require_authorized()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.admin_is_authorized() then
    raise exception 'administrator access required' using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.admin_require_authorized() from public;

create or replace function public.admin_list_users()
returns table (
  id uuid,
  full_name text,
  role text,
  country_code text,
  area text,
  is_active boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.admin_require_authorized();
  return query
  select p.id, p.full_name, p.role, p.country_code, p.area, p.is_active, p.created_at
  from public.profiles p
  order by p.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;

create or replace function public.admin_list_jobs()
returns table (
  id uuid,
  title text,
  category text,
  country_code text,
  area text,
  status text,
  created_at timestamptz,
  customer_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.admin_require_authorized();
  return query
  select j.id, j.title, j.category, j.country_code, j.area, j.status, j.created_at, j.customer_id
  from public.jobs j
  order by j.created_at desc;
end;
$$;

revoke all on function public.admin_list_jobs() from public;
grant execute on function public.admin_list_jobs() to authenticated;

create or replace function public.admin_list_actions()
returns table (
  id bigint,
  action text,
  target_type text,
  target_id uuid,
  reason text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.admin_require_authorized();
  return query
  select l.id, l.action, l.target_type, l.target_id, l.reason, l.created_at
  from public.admin_moderation_log l
  order by l.created_at desc
  limit 500;
end;
$$;

revoke all on function public.admin_list_actions() from public;
grant execute on function public.admin_list_actions() to authenticated;

create or replace function public.admin_set_user_active(
  p_user_id uuid,
  p_active boolean,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.admin_require_authorized();

  if p_user_id = auth.uid() and not p_active then
    raise exception 'an administrator cannot suspend their own account';
  end if;

  update public.profiles
  set is_active = p_active, updated_at = now()
  where id = p_user_id;

  if not found then
    raise exception 'user profile not found';
  end if;

  insert into public.admin_moderation_log(admin_user_id, action, target_type, target_id, reason)
  values (auth.uid(), case when p_active then 'restore_user' else 'suspend_user' end, 'user', p_user_id, nullif(trim(p_reason), ''));
end;
$$;

revoke all on function public.admin_set_user_active(uuid, boolean, text) from public;
grant execute on function public.admin_set_user_active(uuid, boolean, text) to authenticated;

create or replace function public.admin_remove_job(
  p_job_id uuid,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.admin_require_authorized();

  update public.jobs
  set status = 'cancelled', updated_at = now()
  where id = p_job_id;

  if not found then
    raise exception 'job not found';
  end if;

  insert into public.admin_moderation_log(admin_user_id, action, target_type, target_id, reason)
  values (auth.uid(), 'remove_job', 'job', p_job_id, nullif(trim(p_reason), ''));
end;
$$;

revoke all on function public.admin_remove_job(uuid, text) from public;
grant execute on function public.admin_remove_job(uuid, text) to authenticated;

-- No public table policies are added. Access is only through the guarded SECURITY DEFINER RPCs.
-- To authorize the first administrator later, insert that authenticated user's UUID into
-- public.admin_users only after this migration has been tested in a safe environment.
