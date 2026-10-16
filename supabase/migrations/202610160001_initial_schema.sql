-- VocalFlow initial schema for Supabase / PostgreSQL.
-- Apply to a new Supabase project. Application data is always scoped to an academy.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists btree_gist with schema extensions;
create schema if not exists private;

create type public.academy_role as enum ('owner', 'manager', 'teacher', 'student');
create type public.member_status as enum ('active', 'invited', 'disabled');
create type public.student_status as enum ('active', 'paused', 'withdrawn');
create type public.lesson_status as enum ('scheduled', 'attended', 'absent', 'cancelled');
create type public.booking_status as enum ('booked', 'cancelled', 'attended', 'no_show');
create type public.pass_entry_kind as enum ('grant', 'attendance', 'refund', 'adjustment');
create type public.payment_method as enum ('card', 'bank_transfer', 'cash', 'easy_pay', 'other');
create type public.financial_kind as enum ('income', 'expense');
create type public.financial_source as enum ('manual', 'payment', 'recurring');
create type public.notification_status as enum ('queued', 'sent', 'failed');

create table public.academies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  timezone text not null default 'Asia/Seoul',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 1 and 100),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academy_members (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.academy_role not null,
  status public.member_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (academy_id, user_id),
  unique (academy_id, id)
);

create table public.student_levels (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  name text not null,
  daily_room_limit_minutes integer not null check (daily_room_limit_minutes between 0 and 1440),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (academy_id, id),
  unique (academy_id, name)
);

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null check (length(trim(display_name)) between 1 and 100),
  phone text,
  subject text not null default '보컬',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (academy_id, id),
  unique (academy_id, user_id)
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  name text not null,
  room_type text not null default 'practice' check (room_type in ('practice', 'lesson', 'both')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (academy_id, id),
  unique (academy_id, name)
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  level_id uuid not null,
  primary_teacher_id uuid,
  display_name text not null check (length(trim(display_name)) between 1 and 100),
  phone text,
  guardian_name text,
  guardian_phone text,
  monthly_fee numeric(12, 2) not null default 0 check (monthly_fee >= 0),
  status public.student_status not null default 'active',
  joined_on date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (academy_id, id),
  unique (academy_id, user_id),
  foreign key (academy_id, level_id) references public.student_levels(academy_id, id) on delete restrict,
  foreign key (academy_id, primary_teacher_id) references public.teachers(academy_id, id) on delete restrict
);

create table public.teacher_room_assignments (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  teacher_id uuid not null,
  room_id uuid not null,
  weekday smallint not null check (weekday between 1 and 7),
  starts_at time not null,
  ends_at time not null,
  valid_from date not null default current_date,
  valid_until date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (valid_until is null or valid_until >= valid_from),
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete cascade,
  foreign key (academy_id, room_id) references public.rooms(academy_id, id) on delete cascade
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  student_id uuid not null,
  teacher_id uuid not null,
  room_id uuid not null,
  lesson_type text not null default '1:1 보컬 레슨',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.lesson_status not null default 'scheduled',
  attendance_recorded_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  unique (academy_id, id),
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict,
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete restrict,
  foreign key (academy_id, room_id) references public.rooms(academy_id, id) on delete restrict,
  constraint lessons_room_no_overlap
    exclude using gist (
      room_id extensions.gist_uuid_ops with =,
      tstzrange(starts_at, ends_at, '[)') with &&
    ) where (status in ('scheduled', 'attended')),
  constraint lessons_teacher_no_overlap
    exclude using gist (
      teacher_id extensions.gist_uuid_ops with =,
      tstzrange(starts_at, ends_at, '[)') with &&
    ) where (status in ('scheduled', 'attended')),
  constraint lessons_student_no_overlap
    exclude using gist (
      student_id extensions.gist_uuid_ops with =,
      tstzrange(starts_at, ends_at, '[)') with &&
    ) where (status in ('scheduled', 'attended'))
);

create table public.lesson_feedback (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  lesson_id uuid not null,
  teacher_id uuid not null,
  focus_area text not null default '종합',
  strengths text not null check (length(trim(strengths)) between 1 and 1000),
  improvement text not null check (length(trim(improvement)) between 1 and 1000),
  homework text not null check (length(trim(homework)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (academy_id, lesson_id),
  foreign key (academy_id, lesson_id) references public.lessons(academy_id, id) on delete cascade,
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete restrict
);

create table public.room_bookings (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  room_id uuid not null,
  student_id uuid,
  teacher_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.booking_status not null default 'booked',
  no_show_recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (num_nonnulls(student_id, teacher_id) = 1),
  unique (academy_id, id),
  foreign key (academy_id, room_id) references public.rooms(academy_id, id) on delete restrict,
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict,
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete restrict,
  constraint room_bookings_room_no_overlap
    exclude using gist (
      room_id extensions.gist_uuid_ops with =,
      tstzrange(starts_at, ends_at, '[)') with &&
    ) where (status = 'booked')
);

create table public.student_pass_ledger (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  student_id uuid not null,
  lesson_id uuid,
  entry_kind public.pass_entry_kind not null,
  lesson_delta integer not null check (lesson_delta <> 0),
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict,
  foreign key (academy_id, lesson_id) references public.lessons(academy_id, id) on delete restrict,
  check (
    (entry_kind = 'attendance' and lesson_delta = -1 and lesson_id is not null)
    or (entry_kind = 'refund' and lesson_delta = 1 and lesson_id is not null)
    or (entry_kind in ('grant', 'adjustment') and lesson_id is null)
  )
);
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  student_id uuid not null,
  description text not null,
  period_start date,
  period_end date,
  amount numeric(12, 2) not null check (amount > 0),
  due_date date not null,
  cancelled_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (period_end is null or period_start is null or period_end >= period_start),
  unique (academy_id, id),
  unique (academy_id, id, student_id),
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  student_id uuid not null,
  received_amount numeric(12, 2) not null check (received_amount > 0),
  method public.payment_method not null,
  received_at timestamptz not null default now(),
  external_reference text,
  memo text,
  recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (academy_id, id),
  unique (academy_id, id, student_id),
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict
);

create table public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  student_id uuid not null,
  payment_id uuid not null,
  invoice_id uuid not null,
  amount numeric(12, 2) not null check (amount > 0),
  created_at timestamptz not null default now(),
  unique (academy_id, payment_id, invoice_id),
  foreign key (academy_id, payment_id, student_id)
    references public.payments(academy_id, id, student_id) on delete cascade,
  foreign key (academy_id, invoice_id, student_id)
    references public.invoices(academy_id, id, student_id) on delete restrict
);

create table public.teacher_pay_rates (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  teacher_id uuid not null,
  rate_per_lesson numeric(12, 2) not null check (rate_per_lesson >= 0),
  effective_from date not null,
  effective_until date,
  created_at timestamptz not null default now(),
  check (effective_until is null or effective_until > effective_from),
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete cascade,
  constraint teacher_pay_rates_no_overlap
    exclude using gist (
      teacher_id extensions.gist_uuid_ops with =,
      daterange(effective_from, coalesce(effective_until, 'infinity'::date), '[)') with &&
    )
);

create table public.payroll_adjustments (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  teacher_id uuid not null,
  payroll_month date not null check (extract(day from payroll_month) = 1),
  amount numeric(12, 2) not null check (amount <> 0),
  reason text not null check (length(trim(reason)) between 1 and 500),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete restrict
);

create table public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  kind public.financial_kind not null,
  category text not null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  occurred_on date not null default current_date,
  source public.financial_source not null default 'manual',
  source_id uuid,
  teacher_id uuid,
  student_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check ((source = 'manual' and source_id is null) or (source <> 'manual' and source_id is not null)),
  foreign key (academy_id, teacher_id) references public.teachers(academy_id, id) on delete restrict,
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict
);
create unique index financial_transactions_unique_source
  on public.financial_transactions(academy_id, source, source_id)
  where source_id is not null;

create table public.recurring_transaction_templates (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  kind public.financial_kind not null,
  category text not null,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  day_of_month smallint not null check (day_of_month between 1 and 28),
  starts_on date not null default current_date,
  ends_on date,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on),
  unique (academy_id, id)
);

create table public.academy_settings (
  academy_id uuid primary key references public.academies(id) on delete cascade,
  no_show_limit smallint not null default 3 check (no_show_limit between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  student_id uuid,
  recipient_type text not null check (recipient_type in ('student', 'guardian')),
  recipient_phone text not null,
  template_code text not null,
  status public.notification_status not null default 'queued',
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (academy_id, student_id) references public.students(academy_id, id) on delete restrict
);

create index academy_members_user_idx on public.academy_members(user_id, status);
create index students_academy_status_idx on public.students(academy_id, status);
create index lessons_academy_start_idx on public.lessons(academy_id, starts_at);
create index lessons_teacher_start_idx on public.lessons(academy_id, teacher_id, starts_at);
create index lessons_student_start_idx on public.lessons(academy_id, student_id, starts_at);
create index room_bookings_student_start_idx on public.room_bookings(academy_id, student_id, starts_at);
create index invoices_student_due_idx on public.invoices(academy_id, student_id, due_date) where cancelled_at is null;
create index payments_student_received_idx on public.payments(academy_id, student_id, received_at);
create index transactions_academy_date_idx on public.financial_transactions(academy_id, occurred_on);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger academies_set_updated_at before update on public.academies
  for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger teachers_set_updated_at before update on public.teachers
  for each row execute function public.set_updated_at();
create trigger students_set_updated_at before update on public.students
  for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();
create trigger lesson_feedback_set_updated_at before update on public.lesson_feedback
  for each row execute function public.set_updated_at();
create trigger room_bookings_set_updated_at before update on public.room_bookings
  for each row execute function public.set_updated_at();
create trigger academy_settings_set_updated_at before update on public.academy_settings
  for each row execute function public.set_updated_at();

create or replace function private.has_academy_role(
  _academy_id uuid,
  _roles public.academy_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.academy_members m
    where m.academy_id = _academy_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and (_roles is null or m.role = any(_roles))
  );
$$;

create or replace function private.is_linked_student(_academy_id uuid, _student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_academy_role(
    _academy_id,
    array['student']::public.academy_role[]
  ) and exists (
    select 1 from public.students s
    where s.academy_id = _academy_id
      and s.id = _student_id
      and s.user_id = (select auth.uid())
  );
$$;

create or replace function private.can_access_student(_academy_id uuid, _student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_academy_role(
    _academy_id,
    array['owner', 'manager']::public.academy_role[]
  ) or private.is_linked_student(_academy_id, _student_id) or exists (
    select 1
    from public.students s
    where s.academy_id = _academy_id
      and s.id = _student_id
      and exists (
        select 1
        from public.teachers t
        where t.academy_id = s.academy_id
          and t.id = s.primary_teacher_id
          and t.user_id = (select auth.uid())
          and private.has_academy_role(
            s.academy_id,
            array['teacher']::public.academy_role[]
          )
      )
  );
$$;

create or replace function private.can_access_teacher(_academy_id uuid, _teacher_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_academy_role(
    _academy_id,
    array['owner', 'manager']::public.academy_role[]
  ) or exists (
    select 1 from public.teachers t
    where t.academy_id = _academy_id
      and t.id = _teacher_id
      and t.user_id = (select auth.uid())
      and private.has_academy_role(
        _academy_id,
        array['teacher']::public.academy_role[]
      )
  );
$$;

create or replace function public.create_academy(_name text, _display_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_academy_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;
  if _name is null or length(trim(_name)) not between 1 and 120 then
    raise exception 'Academy name must be between 1 and 120 characters';
  end if;
  if _display_name is null or length(trim(_display_name)) not between 1 and 100 then
    raise exception 'Display name must be between 1 and 100 characters';
  end if;

  insert into public.profiles (user_id, display_name)
  values (auth.uid(), trim(_display_name))
  on conflict (user_id) do update set display_name = excluded.display_name;

  insert into public.academies (name) values (trim(_name))
  returning id into new_academy_id;
  insert into public.academy_members (academy_id, user_id, role)
  values (new_academy_id, auth.uid(), 'owner');
  insert into public.academy_settings (academy_id) values (new_academy_id);
  return new_academy_id;
end;
$$;

create or replace function private.record_lesson_pass_use()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'attended' then
      return new;
    end if;
    insert into public.student_pass_ledger (
      academy_id, student_id, lesson_id, entry_kind, lesson_delta, description, created_by
    ) values (
      new.academy_id, new.student_id, new.id, 'attendance', -1,
      '레슨 출석 차감', coalesce(new.created_by, auth.uid())
    );
  elsif old.status is distinct from new.status and new.status = 'attended' then
    insert into public.student_pass_ledger (
      academy_id, student_id, lesson_id, entry_kind, lesson_delta, description, created_by
    ) values (
      new.academy_id, new.student_id, new.id, 'attendance', -1,
      '레슨 출석 차감', coalesce(new.created_by, auth.uid())
    );
  elsif old.status = 'attended' and new.status <> 'attended' then
    insert into public.student_pass_ledger (
      academy_id, student_id, lesson_id, entry_kind, lesson_delta, description, created_by
    ) values (
      old.academy_id, old.student_id, old.id, 'refund', 1,
      '출석 취소 환불', auth.uid()
    );
  end if;
  return new;
end;
$$;

create or replace function private.set_lesson_attendance_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'attended' then
      new.attendance_recorded_at := now();
    end if;
  elsif old.status is distinct from new.status then
    if new.status = 'attended' then
      new.attendance_recorded_at := now();
    elsif old.status = 'attended' then
      new.attendance_recorded_at := null;
    end if;
  end if;
  return new;
end;
$$;

create trigger lessons_record_pass_use
  after insert or update of status on public.lessons
  for each row execute function private.record_lesson_pass_use();
create trigger lessons_set_attendance_timestamp
  before insert or update of status on public.lessons
  for each row execute function private.set_lesson_attendance_timestamp();

create or replace function private.protect_teacher_lesson_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status = 'attended' and (
    new.academy_id is distinct from old.academy_id
    or new.student_id is distinct from old.student_id
    or new.teacher_id is distinct from old.teacher_id
    or new.room_id is distinct from old.room_id
    or new.lesson_type is distinct from old.lesson_type
    or new.starts_at is distinct from old.starts_at
    or new.ends_at is distinct from old.ends_at
  ) then
    raise exception 'Attended lessons cannot be reassigned or rescheduled';
  end if;
  if private.has_academy_role(old.academy_id, array['owner', 'manager']::public.academy_role[]) then
    return new;
  end if;
  if not private.can_access_teacher(old.academy_id, old.teacher_id) then
    raise exception 'Only the assigned teacher or an academy administrator may update this lesson';
  end if;
  if new.academy_id is distinct from old.academy_id
    or new.student_id is distinct from old.student_id
    or new.teacher_id is distinct from old.teacher_id
    or new.room_id is distinct from old.room_id
    or new.lesson_type is distinct from old.lesson_type
    or new.starts_at is distinct from old.starts_at
    or new.ends_at is distinct from old.ends_at
    or new.created_by is distinct from old.created_by
    or new.created_at is distinct from old.created_at
    or new.attendance_recorded_at is distinct from old.attendance_recorded_at
    or (old.status <> 'scheduled' and new.status is distinct from old.status)
    or new.status not in ('scheduled', 'attended', 'absent') then
    raise exception 'Teachers may only record attendance for their assigned lessons';
  end if;
  return new;
end;
$$;
create trigger lessons_protect_teacher_update
  before update on public.lessons
  for each row execute function private.protect_teacher_lesson_update();

create or replace function private.validate_lesson_schedule()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status not in ('scheduled', 'attended') then
    return new;
  end if;

  -- Serialize room checks shared with practice bookings; exclusion constraints
  -- independently protect lesson-vs-lesson overlaps for room, teacher, and student.
  perform pg_advisory_xact_lock(hashtextextended(new.room_id::text, 0));
  if exists (
    select 1 from public.room_bookings b
    where b.academy_id = new.academy_id
      and b.room_id = new.room_id
      and b.status = 'booked'
      and b.starts_at < new.ends_at
      and new.starts_at < b.ends_at
  ) then
    raise exception 'Lesson overlaps an existing practice-room booking';
  end if;
  if exists (
    select 1
    from public.teacher_room_assignments a
    join public.academies academy on academy.id = new.academy_id
    where a.academy_id = new.academy_id
      and a.active
      and a.weekday = extract(isodow from (new.starts_at at time zone academy.timezone))::smallint
      and (new.starts_at at time zone academy.timezone)::date between a.valid_from and coalesce(a.valid_until, 'infinity'::date)
      and (new.starts_at at time zone academy.timezone)::time < a.ends_at
      and a.starts_at < (new.ends_at at time zone academy.timezone)::time
      and (a.room_id <> new.room_id or a.teacher_id <> new.teacher_id)
  ) then
    raise exception 'Lesson conflicts with a recurring teacher-room assignment';
  end if;

  return new;
end;
$$;
create trigger lessons_validate_room_booking
  before insert or update of room_id, starts_at, ends_at, status on public.lessons
  for each row execute function private.validate_lesson_schedule();

create or replace function private.validate_room_booking()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  booking_student public.students%rowtype;
  configured_limit smallint;
  daily_limit integer;
  total_minutes integer;
  no_show_count integer;
  booking_date date;
  booking_weekday smallint;
  booking_start time;
  booking_end time;
begin
  if new.status <> 'booked' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.room_id::text, 0));
  if exists (
    select 1 from public.lessons l
    where l.academy_id = new.academy_id
      and l.room_id = new.room_id
      and l.status in ('scheduled', 'attended')
      and l.starts_at < new.ends_at
      and new.starts_at < l.ends_at
  ) then
    raise exception 'Practice-room booking overlaps a scheduled lesson';
  end if;

  booking_date := (new.starts_at at time zone coalesce(
    (select a.timezone from public.academies a where a.id = new.academy_id),
    'Asia/Seoul'
  ))::date;
  booking_weekday := extract(isodow from booking_date)::smallint;
  booking_start := (new.starts_at at time zone coalesce(
    (select a.timezone from public.academies a where a.id = new.academy_id),
    'Asia/Seoul'
  ))::time;
  booking_end := (new.ends_at at time zone coalesce(
    (select a.timezone from public.academies a where a.id = new.academy_id),
    'Asia/Seoul'
  ))::time;

  if new.student_id is not null then
    select * into booking_student
    from public.students
    where academy_id = new.academy_id and id = new.student_id;

    select s.daily_room_limit_minutes into daily_limit
    from public.student_levels s
    where s.academy_id = new.academy_id and s.id = booking_student.level_id;

    if daily_limit is not null then
      perform pg_advisory_xact_lock(hashtextextended(new.student_id::text || booking_date::text, 0));
      select coalesce(sum(extract(epoch from (b.ends_at - b.starts_at)) / 60), 0)::integer
        into total_minutes
      from public.room_bookings b
      where b.academy_id = new.academy_id
        and b.student_id = new.student_id
        and b.status = 'booked'
        and (b.starts_at at time zone coalesce(
          (select a.timezone from public.academies a where a.id = new.academy_id),
          'Asia/Seoul'
        ))::date = booking_date
        and b.id is distinct from new.id;

      if total_minutes + extract(epoch from (new.ends_at - new.starts_at)) / 60 > daily_limit then
        raise exception 'Daily practice-room limit exceeded for this student';
      end if;

      select count(*) into no_show_count
      from public.room_bookings b
      where b.academy_id = new.academy_id
        and b.student_id = new.student_id
        and b.status = 'no_show';
      select s.no_show_limit into configured_limit
      from public.academy_settings s where s.academy_id = new.academy_id;
      if no_show_count >= coalesce(configured_limit, 3) then
        raise exception 'Student is blocked from room bookings because of repeated no-shows';
      end if;
    end if;
  end if;

  if exists (
    select 1
    from public.teacher_room_assignments a
    where a.academy_id = new.academy_id
      and a.room_id = new.room_id
      and a.active
      and a.weekday = booking_weekday
      and booking_date between a.valid_from and coalesce(a.valid_until, 'infinity'::date)
      and booking_start < a.ends_at
      and a.starts_at < booking_end
  ) then
    raise exception 'Room is reserved for a recurring teacher lesson';
  end if;

  return new;
end;
$$;

create trigger room_bookings_validate
  before insert or update of room_id, student_id, starts_at, ends_at, status
  on public.room_bookings
  for each row execute function private.validate_room_booking();

create or replace function private.validate_payment_allocation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  invoice_total numeric(12, 2);
  payment_total numeric(12, 2);
  invoice_allocated numeric(12, 2);
  payment_allocated numeric(12, 2);
begin
  select i.amount into invoice_total
  from public.invoices i
  where i.academy_id = new.academy_id and i.id = new.invoice_id
    and i.student_id = new.student_id and i.cancelled_at is null
  for update;
  if invoice_total is null then
    raise exception 'Invoice not found or cancelled';
  end if;

  select p.received_amount into payment_total
  from public.payments p
  where p.academy_id = new.academy_id and p.id = new.payment_id
    and p.student_id = new.student_id
  for update;
  if payment_total is null then
    raise exception 'Payment not found';
  end if;

  select coalesce(sum(a.amount), 0) into invoice_allocated
  from public.payment_allocations a
  where a.academy_id = new.academy_id and a.invoice_id = new.invoice_id
    and a.id is distinct from new.id;
  select coalesce(sum(a.amount), 0) into payment_allocated
  from public.payment_allocations a
  where a.academy_id = new.academy_id and a.payment_id = new.payment_id
    and a.id is distinct from new.id;

  if invoice_allocated + new.amount > invoice_total then
    raise exception 'Payment allocation exceeds the invoice balance';
  end if;
  if payment_allocated + new.amount > payment_total then
    raise exception 'Payment allocation exceeds the received amount';
  end if;
  return new;
end;
$$;

create trigger payment_allocations_validate
  before insert or update on public.payment_allocations
  for each row execute function private.validate_payment_allocation();

create view public.student_pass_balances
with (security_invoker = true)
as
select
  s.academy_id,
  s.id as student_id,
  coalesce(sum(l.lesson_delta), 0)::integer as lessons_remaining
from public.students s
left join public.student_pass_ledger l
  on l.academy_id = s.academy_id and l.student_id = s.id
group by s.academy_id, s.id;

create view public.invoice_balances
with (security_invoker = true)
as
select
  i.academy_id,
  i.id as invoice_id,
  i.student_id,
  i.description,
  i.amount,
  i.due_date,
  coalesce(sum(a.amount), 0)::numeric(12, 2) as paid_amount,
  (i.amount - coalesce(sum(a.amount), 0))::numeric(12, 2) as outstanding_amount,
  case
    when i.cancelled_at is not null then 'cancelled'
    when coalesce(sum(a.amount), 0) >= i.amount then 'paid'
    when i.due_date < current_date then 'overdue'
    when coalesce(sum(a.amount), 0) > 0 then 'partial'
    else 'unpaid'
  end as payment_status
from public.invoices i
left join public.payment_allocations a
  on a.academy_id = i.academy_id and a.invoice_id = i.id
where i.cancelled_at is null
group by i.academy_id, i.id;

create view public.teacher_monthly_payroll
with (security_invoker = true)
as
with lesson_totals as (
  select
    lesson_rows.academy_id,
    lesson_rows.teacher_id,
    date_trunc('month', lesson_rows.lesson_date::timestamp)::date as payroll_month,
    count(*)::integer as attended_lessons,
    coalesce(sum(r.rate_per_lesson), 0)::numeric(12, 2) as lesson_pay
  from (
    select
      l.academy_id,
      l.teacher_id,
      l.starts_at,
      (l.starts_at at time zone academy.timezone)::date as lesson_date
    from public.lessons l
    join public.academies academy on academy.id = l.academy_id
    where l.status = 'attended'
  ) lesson_rows
  left join public.teacher_pay_rates r
    on r.academy_id = lesson_rows.academy_id
    and r.teacher_id = lesson_rows.teacher_id
    and lesson_rows.lesson_date >= r.effective_from
    and (r.effective_until is null or lesson_rows.lesson_date < r.effective_until)
  group by
    lesson_rows.academy_id,
    lesson_rows.teacher_id,
    date_trunc('month', lesson_rows.lesson_date::timestamp)::date
),
adjustments as (
  select academy_id, teacher_id, payroll_month, sum(amount)::numeric(12, 2) as adjustment_total
  from public.payroll_adjustments
  group by academy_id, teacher_id, payroll_month
)
select
  coalesce(t.academy_id, a.academy_id) as academy_id,
  coalesce(t.teacher_id, a.teacher_id) as teacher_id,
  coalesce(t.payroll_month, a.payroll_month) as payroll_month,
  coalesce(t.attended_lessons, 0)::integer as attended_lessons,
  coalesce(t.lesson_pay, 0)::numeric(12, 2) as lesson_pay,
  coalesce(a.adjustment_total, 0)::numeric(12, 2) as adjustment_total,
  (coalesce(t.lesson_pay, 0) + coalesce(a.adjustment_total, 0))::numeric(12, 2) as expected_pay
from lesson_totals t
full outer join adjustments a
  on a.academy_id = t.academy_id
  and a.teacher_id = t.teacher_id
  and a.payroll_month = t.payroll_month;

create or replace function public.get_room_availability(
  _academy_id uuid,
  _from timestamptz,
  _to timestamptz
)
returns table (
  room_id uuid,
  room_name text,
  starts_at timestamptz,
  ends_at timestamptz,
  reservation_type text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
    or not private.has_academy_role(_academy_id)
    or _from is null
    or _to is null
    or _to <= _from
    or _to > _from + interval '14 days' then
    raise exception 'A valid academy membership and a range of up to 14 days are required';
  end if;

  return query
    select r.id, r.name, b.starts_at, b.ends_at, 'practice'::text
    from public.room_bookings b
    join public.rooms r on r.academy_id = b.academy_id and r.id = b.room_id
    where b.academy_id = _academy_id
      and b.status = 'booked'
      and b.starts_at < _to and b.ends_at > _from
    union all
    select r.id, r.name, l.starts_at, l.ends_at, 'lesson'::text
    from public.lessons l
    join public.rooms r on r.academy_id = l.academy_id and r.id = l.room_id
    where l.academy_id = _academy_id
      and l.status in ('scheduled', 'attended')
      and l.starts_at < _to and l.ends_at > _from;
end;
$$;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
revoke all on function private.has_academy_role(uuid, public.academy_role[]) from public, anon;
revoke all on function private.can_access_student(uuid, uuid) from public, anon;
revoke all on function private.can_access_teacher(uuid, uuid) from public, anon;
revoke all on function private.is_linked_student(uuid, uuid) from public, anon;
grant execute on function private.has_academy_role(uuid, public.academy_role[]) to authenticated;
grant execute on function private.can_access_student(uuid, uuid) to authenticated;
grant execute on function private.can_access_teacher(uuid, uuid) to authenticated;
grant execute on function private.is_linked_student(uuid, uuid) to authenticated;
revoke all on function public.create_academy(text, text) from public, anon;
grant execute on function public.create_academy(text, text) to authenticated;
revoke all on function public.get_room_availability(uuid, timestamptz, timestamptz) from public, anon;
grant execute on function public.get_room_availability(uuid, timestamptz, timestamptz) to authenticated;
grant usage on type
  public.academy_role,
  public.member_status,
  public.student_status,
  public.lesson_status,
  public.booking_status,
  public.pass_entry_kind,
  public.payment_method,
  public.financial_kind,
  public.financial_source,
  public.notification_status
to authenticated;

alter table public.academies enable row level security;
alter table public.profiles enable row level security;
alter table public.academy_members enable row level security;
alter table public.student_levels enable row level security;
alter table public.teachers enable row level security;
alter table public.rooms enable row level security;
alter table public.students enable row level security;
alter table public.teacher_room_assignments enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_feedback enable row level security;
alter table public.room_bookings enable row level security;
alter table public.student_pass_ledger enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.payment_allocations enable row level security;
alter table public.teacher_pay_rates enable row level security;
alter table public.payroll_adjustments enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.recurring_transaction_templates enable row level security;
alter table public.academy_settings enable row level security;
alter table public.notification_logs enable row level security;

create policy academies_member_read on public.academies
  for select to authenticated using (private.has_academy_role(id));
create policy academies_owner_update on public.academies
  for update to authenticated
  using (private.has_academy_role(id, array['owner']::public.academy_role[]))
  with check (private.has_academy_role(id, array['owner']::public.academy_role[]));

create policy profiles_self_read on public.profiles
  for select to authenticated using (user_id = (select auth.uid()));
create policy profiles_self_insert on public.profiles
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy profiles_self_update on public.profiles
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy academy_members_member_read on public.academy_members
  for select to authenticated using (private.has_academy_role(academy_id));
create policy academy_members_owner_manage on public.academy_members
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner']::public.academy_role[]));

create policy student_levels_member_read on public.student_levels
  for select to authenticated using (private.has_academy_role(academy_id));
create policy student_levels_admin_manage on public.student_levels
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy teachers_member_read on public.teachers
  for select to authenticated using (private.has_academy_role(academy_id));
create policy teachers_admin_manage on public.teachers
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy rooms_member_read on public.rooms
  for select to authenticated using (private.has_academy_role(academy_id));
create policy rooms_admin_manage on public.rooms
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy students_authorized_read on public.students
  for select to authenticated using (private.can_access_student(academy_id, id));
create policy students_admin_manage on public.students
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy teacher_assignments_member_read on public.teacher_room_assignments
  for select to authenticated using (private.has_academy_role(academy_id));
create policy teacher_assignments_admin_manage on public.teacher_room_assignments
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy lessons_authorized_read on public.lessons
  for select to authenticated
  using (
    private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[])
    or private.can_access_teacher(academy_id, teacher_id)
    or private.can_access_student(academy_id, student_id)
  );
create policy lessons_admin_manage on public.lessons
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));
create policy lessons_teacher_attendance on public.lessons
  for update to authenticated
  using (private.can_access_teacher(academy_id, teacher_id))
  with check (private.can_access_teacher(academy_id, teacher_id));

create policy feedback_authorized_read on public.lesson_feedback
  for select to authenticated
  using (
    private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[])
    or private.can_access_teacher(academy_id, teacher_id)
    or exists (
      select 1
      from public.lessons l
      where l.academy_id = lesson_feedback.academy_id
        and l.id = lesson_feedback.lesson_id
        and private.is_linked_student(l.academy_id, l.student_id)
    )
  );
create policy feedback_teacher_insert on public.lesson_feedback
  for insert to authenticated
  with check (
    private.can_access_teacher(academy_id, teacher_id)
    and exists (
      select 1 from public.lessons l
      where l.academy_id = lesson_feedback.academy_id
        and l.id = lesson_feedback.lesson_id
        and l.teacher_id = lesson_feedback.teacher_id
        and l.status = 'attended'
    )
  );
create policy feedback_teacher_update on public.lesson_feedback
  for update to authenticated
  using (
    private.can_access_teacher(academy_id, teacher_id)
    and exists (
      select 1 from public.lessons l
      where l.academy_id = lesson_feedback.academy_id
        and l.id = lesson_feedback.lesson_id
        and l.teacher_id = lesson_feedback.teacher_id
        and l.status = 'attended'
    )
  )
  with check (
    private.can_access_teacher(academy_id, teacher_id)
    and exists (
      select 1 from public.lessons l
      where l.academy_id = lesson_feedback.academy_id
        and l.id = lesson_feedback.lesson_id
        and l.teacher_id = lesson_feedback.teacher_id
        and l.status = 'attended'
    )
  );
create policy feedback_admin_manage on public.lesson_feedback
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy room_bookings_authorized_read on public.room_bookings
  for select to authenticated
  using (
    private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[])
    or (student_id is not null and private.is_linked_student(academy_id, student_id))
    or (teacher_id is not null and private.can_access_teacher(academy_id, teacher_id))
  );
create policy room_bookings_admin_manage on public.room_bookings
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));
create policy room_bookings_student_create on public.room_bookings
  for insert to authenticated
  with check (
    student_id is not null
    and private.is_linked_student(academy_id, student_id)
    and teacher_id is null
  );
create policy room_bookings_teacher_create on public.room_bookings
  for insert to authenticated
  with check (
    teacher_id is not null
    and private.can_access_teacher(academy_id, teacher_id)
    and student_id is null
  );

create policy pass_ledger_student_read on public.student_pass_ledger
  for select to authenticated
  using (
    private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[])
    or private.is_linked_student(academy_id, student_id)
    or private.can_access_teacher(academy_id, (select s.primary_teacher_id from public.students s where s.academy_id = student_pass_ledger.academy_id and s.id = student_pass_ledger.student_id))
  );
create policy pass_ledger_admin_manage on public.student_pass_ledger
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy invoices_authorized_read on public.invoices
  for select to authenticated
  using (
    private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[])
    or private.is_linked_student(academy_id, student_id)
  );
create policy invoices_admin_manage on public.invoices
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy payments_authorized_read on public.payments
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]) or private.is_linked_student(academy_id, student_id));
create policy payments_admin_manage on public.payments
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy allocations_authorized_read on public.payment_allocations
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]) or private.is_linked_student(academy_id, student_id));
create policy allocations_admin_manage on public.payment_allocations
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy pay_rates_admin_read on public.teacher_pay_rates
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]) or private.can_access_teacher(academy_id, teacher_id));
create policy pay_rates_admin_manage on public.teacher_pay_rates
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

create policy payroll_adjustments_authorized_read on public.payroll_adjustments
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]) or private.can_access_teacher(academy_id, teacher_id));
create policy payroll_adjustments_admin_manage on public.payroll_adjustments
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner']::public.academy_role[]));

create policy financial_transactions_admin_read on public.financial_transactions
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));
create policy financial_transactions_owner_manage on public.financial_transactions
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner']::public.academy_role[]));

create policy recurring_templates_admin_read on public.recurring_transaction_templates
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));
create policy recurring_templates_owner_manage on public.recurring_transaction_templates
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner']::public.academy_role[]));

create policy academy_settings_member_read on public.academy_settings
  for select to authenticated using (private.has_academy_role(academy_id));
create policy academy_settings_owner_manage on public.academy_settings
  for all to authenticated
  using (private.has_academy_role(academy_id, array['owner']::public.academy_role[]))
  with check (private.has_academy_role(academy_id, array['owner']::public.academy_role[]));

create policy notification_logs_admin_read on public.notification_logs
  for select to authenticated
  using (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));
create policy notification_logs_admin_insert on public.notification_logs
  for insert to authenticated
  with check (private.has_academy_role(academy_id, array['owner', 'manager']::public.academy_role[]));

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

comment on table public.student_pass_ledger is
  'Lesson credits are stored as an append-only ledger; attended lessons consume one credit through a trigger.';
comment on table public.lesson_feedback is
  'One current 1:1 lesson feedback record per lesson; visible only to the assigned teacher, admins, and that student.';
comment on table public.payment_allocations is
  'Allocates receipts to invoices and prevents allocating more than either the invoice total or payment amount.';
comment on table public.room_bookings is
  'Practice-room reservations. GiST exclusion prevents overlapping bookings in the same room.';
comment on view public.student_pass_balances is
  'Current lesson credits calculated from the pass ledger; negative values indicate attendance without sufficient credit.';
