-- Additive, server-only mirror. Existing Supabase tables and RoadLenz record IDs are preserved.
begin;
create table if not exists public.roadlenz_records (
  source text not null,
  collection text not null,
  id text not null,
  data jsonb not null,
  revision bigint not null,
  synced_at timestamptz not null default now(),
  primary key (source, collection, id)
);
create table if not exists public.roadlenz_sync_state (
  source text primary key,
  revision bigint not null,
  synced_at timestamptz not null default now()
);
alter table public.roadlenz_records enable row level security;
alter table public.roadlenz_sync_state enable row level security;
revoke all on public.roadlenz_records, public.roadlenz_sync_state from anon, authenticated;
grant select, insert, update, delete on public.roadlenz_records, public.roadlenz_sync_state to service_role;

create or replace function public.roadlenz_apply_snapshot(p_source text, p_revision bigint, p_records jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare previous_revision bigint;
begin
  if p_source is null or length(p_source) = 0 or length(p_source) > 100 or p_revision <= 0 or jsonb_typeof(p_records) <> 'array' then
    raise exception 'Invalid snapshot';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('roadlenz:' || p_source, 0));
  select revision into previous_revision from public.roadlenz_sync_state where source = p_source;
  if previous_revision is not null and previous_revision >= p_revision then
    return jsonb_build_object('applied', false, 'revision', previous_revision);
  end if;
  insert into public.roadlenz_records(source, collection, id, data, revision, synced_at)
  select p_source, item->>'collection', item->>'id', item->'data', p_revision, now()
  from jsonb_array_elements(p_records) as item
  on conflict (source, collection, id) do update
  set data = excluded.data, revision = excluded.revision, synced_at = excluded.synced_at;
  delete from public.roadlenz_records where source = p_source and revision < p_revision;
  insert into public.roadlenz_sync_state(source, revision, synced_at) values(p_source, p_revision, now())
  on conflict (source) do update set revision = excluded.revision, synced_at = excluded.synced_at;
  return jsonb_build_object('applied', true, 'revision', p_revision);
end;
$$;
revoke all on function public.roadlenz_apply_snapshot(text,bigint,jsonb) from public, anon, authenticated;
grant execute on function public.roadlenz_apply_snapshot(text,bigint,jsonb) to service_role;
commit;
