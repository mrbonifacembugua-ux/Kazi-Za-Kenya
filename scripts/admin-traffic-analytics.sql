-- AnyDayWork private admin traffic analytics.
-- Additive only: does not alter marketplace tables or existing app flows.

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  path text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views(created_at desc);
create index if not exists page_views_visitor_id_idx on public.page_views(visitor_id);
create index if not exists page_views_path_idx on public.page_views(path);

alter table public.page_views enable row level security;

create or replace function public.record_page_view(
  p_visitor_id uuid,
  p_path text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_visitor_id is null then return; end if;
  if p_path is null or length(trim(p_path)) = 0 then return; end if;
  insert into public.page_views(visitor_id, path)
  values (p_visitor_id, left(trim(p_path), 300));
end;
$$;

revoke all on function public.record_page_view(uuid, text) from public;
grant execute on function public.record_page_view(uuid, text) to anon, authenticated;

create or replace function public.admin_traffic_summary()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  perform public.admin_require_authorized();

  select jsonb_build_object(
    'views_today', (select count(*) from public.page_views where created_at >= date_trunc('day', now())),
    'views_7d', (select count(*) from public.page_views where created_at >= now() - interval '7 days'),
    'views_30d', (select count(*) from public.page_views where created_at >= now() - interval '30 days'),
    'views_total', (select count(*) from public.page_views),
    'unique_today', (select count(distinct visitor_id) from public.page_views where created_at >= date_trunc('day', now())),
    'unique_7d', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '7 days'),
    'unique_30d', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '30 days'),
    'unique_total', (select count(distinct visitor_id) from public.page_views),
    'registered_users', (select count(*) from public.profiles),
    'jobs_total', (select count(*) from public.jobs),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', x.path, 'views', x.views) order by x.views desc)
      from (
        select path, count(*) as views
        from public.page_views
        where created_at >= now() - interval '30 days'
        group by path
        order by count(*) desc
        limit 10
      ) x
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_traffic_summary() from public;
grant execute on function public.admin_traffic_summary() to authenticated;
