create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin_puskesau','admin_rs','reviewer_kotama','viewer_pimpinan');
create type public.report_status as enum ('draft','submitted','revision_needed','approved','locked');
create type public.entity_type as enum ('bor_report','disease_report');

create table public.hospitals (
  id uuid primary key default gen_random_uuid(),
  kode_rs text unique not null,
  nama_rs text not null,
  alias_rs text,
  jenis_rs text not null,
  tingkat_rs text,
  satuan text,
  wilayah text,
  jumlah_tt_default integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role public.user_role not null,
  hospital_id uuid references public.hospitals(id),
  kotama text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reporting_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  jenis_periode text not null check (jenis_periode in ('bulanan','triwulan','semester','tahunan','khusus')),
  triwulan integer,
  bulan integer,
  semester integer,
  tahun integer not null,
  due_date date,
  is_active boolean not null default false,
  is_locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.bor_reports (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id),
  reporting_period_id uuid not null references public.reporting_periods(id),
  jumlah_tt integer not null check (jumlah_tt > 0),
  nilai_bor numeric(5,2) not null check (nilai_bor >= 0 and nilai_bor <= 100),
  notes text,
  status public.report_status not null default 'draft',
  submitted_at timestamptz,
  approved_at timestamptz,
  locked_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  review_notes text,
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(hospital_id, reporting_period_id)
);

create table public.disease_reports (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id),
  reporting_period_id uuid not null references public.reporting_periods(id),
  status public.report_status not null default 'draft',
  submitted_at timestamptz,
  approved_at timestamptz,
  locked_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  review_notes text,
  created_by uuid not null references public.profiles(id),
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(hospital_id, reporting_period_id)
);

create table public.disease_categories (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  display_name text not null,
  description text,
  is_active boolean not null default true
);

create table public.disease_normalization_rules (
  id uuid primary key default gen_random_uuid(),
  match_text text not null,
  normalized_name text not null,
  disease_category_id uuid references public.disease_categories(id),
  priority integer not null default 100,
  is_active boolean not null default true
);

create table public.disease_report_items (
  id uuid primary key default gen_random_uuid(),
  disease_report_id uuid not null references public.disease_reports(id) on delete cascade,
  ranking integer not null check (ranking between 1 and 10),
  nama_penyakit_raw text not null,
  nama_penyakit_normalized text,
  disease_category_id uuid references public.disease_categories(id),
  jumlah_tni integer not null default 0 check (jumlah_tni >= 0),
  jumlah_pns integer not null default 0 check (jumlah_pns >= 0),
  jumlah_kel integer not null default 0 check (jumlah_kel >= 0),
  jumlah_total integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(disease_report_id, ranking)
);

create table public.report_status_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type public.entity_type not null,
  entity_id uuid not null,
  from_status public.report_status,
  to_status public.report_status not null,
  action_by uuid references public.profiles(id),
  action_notes text,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  hospital_id uuid references public.hospitals(id),
  reporting_period_id uuid references public.reporting_periods(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_disease_total()
returns trigger language plpgsql as $$
begin
  new.jumlah_total = coalesce(new.jumlah_tni,0)+coalesce(new.jumlah_pns,0)+coalesce(new.jumlah_kel,0);
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.user_role language sql stable as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_hospital_id()
returns uuid language sql stable as $$
  select hospital_id from public.profiles where id = auth.uid();
$$;

create or replace function public.can_edit_report(report_status public.report_status)
returns boolean language sql stable as $$
  select case
    when public.current_user_role() = 'admin_puskesau' then true
    when public.current_user_role() = 'admin_rs' and report_status in ('draft','revision_needed') then true
    else false
  end;
$$;

create or replace function public.log_report_status_change()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.report_status_logs(entity_type, entity_id, from_status, to_status, action_by)
    values (case when tg_table_name = 'bor_reports' then 'bor_report' else 'disease_report' end, new.id, null, new.status, auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.report_status_logs(entity_type, entity_id, from_status, to_status, action_by)
    values (case when tg_table_name = 'bor_reports' then 'bor_report' else 'disease_report' end, new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger hospitals_updated_at before update on public.hospitals for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger bor_reports_updated_at before update on public.bor_reports for each row execute function public.set_updated_at();
create trigger disease_reports_updated_at before update on public.disease_reports for each row execute function public.set_updated_at();
create trigger disease_items_updated_at before update on public.disease_report_items for each row execute function public.set_updated_at();
create trigger app_settings_updated_at before update on public.app_settings for each row execute function public.set_updated_at();
create trigger disease_total before insert or update on public.disease_report_items for each row execute function public.set_disease_total();
create trigger bor_status_log after insert or update on public.bor_reports for each row execute function public.log_report_status_change();
create trigger disease_status_log after insert or update on public.disease_reports for each row execute function public.log_report_status_change();

alter table public.hospitals enable row level security;
alter table public.profiles enable row level security;
alter table public.reporting_periods enable row level security;
alter table public.bor_reports enable row level security;
alter table public.disease_reports enable row level security;
alter table public.disease_report_items enable row level security;
alter table public.report_status_logs enable row level security;
alter table public.activity_logs enable row level security;
alter table public.disease_categories enable row level security;
alter table public.disease_normalization_rules enable row level security;

create policy puskesau_full_hospitals on public.hospitals for all using (public.current_user_role() = 'admin_puskesau') with check (public.current_user_role() = 'admin_puskesau');
create policy read_hospitals_all_roles on public.hospitals for select using (public.current_user_role() in ('admin_puskesau','admin_rs','reviewer_kotama','viewer_pimpinan'));

create policy profiles_self_or_puskesau on public.profiles for select using (id = auth.uid() or public.current_user_role() = 'admin_puskesau');
create policy profiles_manage_puskesau on public.profiles for all using (public.current_user_role() = 'admin_puskesau') with check (public.current_user_role() = 'admin_puskesau');

create policy periods_read_all on public.reporting_periods for select using (true);
create policy periods_manage_puskesau on public.reporting_periods for all using (public.current_user_role() = 'admin_puskesau') with check (public.current_user_role() = 'admin_puskesau');

create policy bor_select on public.bor_reports for select using (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id())
  or (public.current_user_role() = 'viewer_pimpinan' and status in ('approved','locked'))
);
create policy bor_insert on public.bor_reports for insert with check (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id())
);
create policy bor_update on public.bor_reports for update using (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id() and public.can_edit_report(status))
) with check (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id() and public.can_edit_report(status))
);

create policy disease_select on public.disease_reports for select using (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id())
  or (public.current_user_role() = 'viewer_pimpinan' and status in ('approved','locked'))
);
create policy disease_insert on public.disease_reports for insert with check (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id())
);
create policy disease_update on public.disease_reports for update using (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id() and public.can_edit_report(status))
) with check (
  public.current_user_role() = 'admin_puskesau'
  or (public.current_user_role() = 'admin_rs' and hospital_id = public.current_user_hospital_id() and public.can_edit_report(status))
);

create policy disease_items_access on public.disease_report_items for all using (
  exists (
    select 1 from public.disease_reports dr
    where dr.id = disease_report_id
    and (
      public.current_user_role() = 'admin_puskesau'
      or (public.current_user_role() = 'admin_rs' and dr.hospital_id = public.current_user_hospital_id())
      or (public.current_user_role() = 'viewer_pimpinan' and dr.status in ('approved','locked'))
    )
  )
) with check (
  exists (
    select 1 from public.disease_reports dr
    where dr.id = disease_report_id
    and (
      public.current_user_role() = 'admin_puskesau'
      or (public.current_user_role() = 'admin_rs' and dr.hospital_id = public.current_user_hospital_id() and public.can_edit_report(dr.status))
    )
  )
);

create policy read_master_disease on public.disease_categories for select using (true);
create policy write_master_disease on public.disease_categories for all using (public.current_user_role() = 'admin_puskesau') with check (public.current_user_role() = 'admin_puskesau');
create policy read_norm_rules on public.disease_normalization_rules for select using (true);
create policy write_norm_rules on public.disease_normalization_rules for all using (public.current_user_role() = 'admin_puskesau') with check (public.current_user_role() = 'admin_puskesau');

create policy report_status_logs_select on public.report_status_logs for select using (public.current_user_role() in ('admin_puskesau','admin_rs','viewer_pimpinan'));
create policy activity_logs_select on public.activity_logs for select using (public.current_user_role() in ('admin_puskesau','admin_rs','viewer_pimpinan'));
