-- ============================================
-- 20th SFG Supabase Database Setup
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- 1. PROFILES TABLE (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  display_name text,
  role text not null default 'member' check (role in ('member', 'admin', 'superadmin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

create policy "Admins can read all profiles" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

create policy "Admins can update profiles" on profiles
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. SOLDIERS TABLE
create table if not exists public.soldiers (
  id text primary key,
  rank text not null,
  rank_full text not null,
  name text not null,
  callsign text,
  mos text not null,
  mos_title text not null,
  role text not null,
  unit text not null,
  team text,
  status text not null default 'VACANT'
    check (status in ('ACTIVE DUTY', 'RESERVE', 'LOA', 'DISCHARGED', 'VACANT')),
  enlist_date text,
  last_promotion text,
  time_in_service text,
  time_in_grade text,
  quals text[] default '{}',
  avatar text not null default 'RCT',
  awards jsonb default '[]',
  service_record jsonb default '[]',
  rank_history jsonb default '[]',
  assignment_history jsonb default '[]',
  combat_record jsonb default '[]',
  qualification_record jsonb default '[]',
  photo_url text,
  signature_url text,
  discord_id text,
  timezone text,
  last_active text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- STORAGE BUCKET for soldier images
-- Step 1: Create the bucket
insert into storage.buckets (id, name, public) values ('soldiers', 'soldiers', true)
on conflict (id) do nothing;

-- Step 2: Allow admins to upload files
create policy "Admins can upload soldier images" on storage.objects
  for insert with check (
    bucket_id = 'soldiers'
    and exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

-- Step 3: Allow admins to update/overwrite files
create policy "Admins can update soldier images" on storage.objects
  for update using (
    bucket_id = 'soldiers'
    and exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

-- Step 4: Allow admins to delete files
create policy "Admins can delete soldier images" on storage.objects
  for delete using (
    bucket_id = 'soldiers'
    and exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

-- Step 5: Allow anyone to read (public bucket)
create policy "Anyone can read soldier images" on storage.objects
  for select using (bucket_id = 'soldiers');

alter table public.soldiers enable row level security;

-- Public can read soldiers (roster page)
create policy "Anyone can read soldiers" on soldiers for select using (true);

-- Only admins can modify
create policy "Admins can insert soldiers" on soldiers
  for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

create policy "Admins can update soldiers" on soldiers
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

create policy "Admins can delete soldiers" on soldiers
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );


-- 3. APPLICATIONS TABLE
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  callsign text not null,
  age int not null,
  discord_username text not null,
  timezone text not null,
  arma_hours text not null,
  prior_units text,
  mos_preference text not null,
  availability text[] default '{}',
  motivation text not null,
  referred_by text,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'DENIED')),
  admin_notes text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

-- Logged-in users can submit one application (tied to their user_id)
create policy "Authenticated users can insert applications" on applications
  for insert with check (auth.uid() is not null and user_id = auth.uid());

-- Users can read their own application
create policy "Users can read own application" on applications
  for select using (user_id = auth.uid());

-- Admins can read all applications
create policy "Admins can read applications" on applications
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

create policy "Admins can update applications" on applications
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );

create policy "Admins can delete applications" on applications
  for delete using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'superadmin'))
  );


-- ============================================
-- SEED DATA: Initial roster billets
-- ============================================

-- Group HQ
insert into soldiers (id, rank, rank_full, name, mos, mos_title, role, unit, status, quals, avatar) values
  ('hq-co',  'COL', 'Colonel',                 '[VACANT]', '18A', 'SF Officer',         'Commanding Officer',          'Group Headquarters', 'VACANT', '{"SF Tab","Ranger Tab","Airborne","HALO"}', 'CO'),
  ('hq-csm', 'CSM', 'Command Sergeant Major',  '[VACANT]', '18Z', 'SF Senior Sergeant', 'Command Sergeant Major',      'Group Headquarters', 'VACANT', '{"SF Tab","Airborne","CIB"}',               'CSM'),
  ('hq-s3',  'MAJ', 'Major',                   '[VACANT]', '18A', 'SF Officer',         'S3 Operations Officer',       'Group Headquarters', 'VACANT', '{"SF Tab","Airborne"}',                     'S3')
on conflict (id) do nothing;

-- ODA-201
insert into soldiers (id, rank, rank_full, name, mos, mos_title, role, unit, team, status, quals, avatar) values
  ('oda201-cdr',   'CPT', 'Captain',                 '[VACANT]', '18A',  'Detachment Commander',        'ODA-201 Commander',                    '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne","HALO"}',  'CPT'),
  ('oda201-xo',    'CW2', 'Chief Warrant Officer 2', '[VACANT]', '180A', 'Asst. Detachment Commander',  'ODA-201 Asst. Detachment Commander',   '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         'CW2'),
  ('oda201-tm',    'MSG', 'Master Sergeant',          '[VACANT]', '18Z',  'Team Sergeant',               'ODA-201 Team Sergeant',                '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne","CIB"}',   'MSG'),
  ('oda201-oi',    'SFC', 'Sergeant First Class',     '[VACANT]', '18Z',  'Asst. Ops & Intel Sergeant',  'Asst. Operations & Intelligence Sgt',  '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18Z'),
  ('oda201-18b1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18B',  'Weapons Sergeant',            'Senior Weapons Sergeant',              '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18B'),
  ('oda201-18b2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18B',  'Weapons Sergeant',            'Junior Weapons Sergeant',              '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18B'),
  ('oda201-18c1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18C',  'Engineer Sergeant',           'Senior Engineer Sergeant',             '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne","Demo"}',  '18C'),
  ('oda201-18c2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18C',  'Engineer Sergeant',           'Junior Engineer Sergeant',             '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18C'),
  ('oda201-18d1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18D',  'Medical Sergeant',            'Senior Medical Sergeant',              '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne","SOCM"}',  '18D'),
  ('oda201-18d2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18D',  'Medical Sergeant',            'Junior Medical Sergeant',              '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18D'),
  ('oda201-18e1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18E',  'Communications Sergeant',     'Senior Communications Sergeant',       '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18E'),
  ('oda201-18e2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18E',  'Communications Sergeant',     'Junior Communications Sergeant',       '1st Battalion, 20th SFG', 'ODA-201', 'VACANT', '{"SF Tab","Airborne"}',         '18E')
on conflict (id) do nothing;

-- ODA-203
insert into soldiers (id, rank, rank_full, name, mos, mos_title, role, unit, team, status, quals, avatar) values
  ('oda203-cdr',   'CPT', 'Captain',                 '[VACANT]', '18A',  'Detachment Commander',        'ODA-203 Commander',                    '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         'CPT'),
  ('oda203-xo',    'CW2', 'Chief Warrant Officer 2', '[VACANT]', '180A', 'Asst. Detachment Commander',  'ODA-203 Asst. Detachment Commander',   '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         'CW2'),
  ('oda203-tm',    'MSG', 'Master Sergeant',          '[VACANT]', '18Z',  'Team Sergeant',               'ODA-203 Team Sergeant',                '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         'MSG'),
  ('oda203-oi',    'SFC', 'Sergeant First Class',     '[VACANT]', '18Z',  'Asst. Ops & Intel Sergeant',  'Asst. Operations & Intelligence Sgt',  '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18Z'),
  ('oda203-18b1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18B',  'Weapons Sergeant',            'Senior Weapons Sergeant',              '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18B'),
  ('oda203-18b2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18B',  'Weapons Sergeant',            'Junior Weapons Sergeant',              '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18B'),
  ('oda203-18c1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18C',  'Engineer Sergeant',           'Senior Engineer Sergeant',             '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18C'),
  ('oda203-18c2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18C',  'Engineer Sergeant',           'Junior Engineer Sergeant',             '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18C'),
  ('oda203-18d1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18D',  'Medical Sergeant',            'Senior Medical Sergeant',              '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne","SOCM"}',  '18D'),
  ('oda203-18d2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18D',  'Medical Sergeant',            'Junior Medical Sergeant',              '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18D'),
  ('oda203-18e1',  'SFC', 'Sergeant First Class',     '[VACANT]', '18E',  'Communications Sergeant',     'Senior Communications Sergeant',       '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18E'),
  ('oda203-18e2',  'SSG', 'Staff Sergeant',            '[VACANT]', '18E',  'Communications Sergeant',     'Junior Communications Sergeant',       '2nd Battalion, 20th SFG', 'ODA-203', 'VACANT', '{"SF Tab","Airborne"}',         '18E')
on conflict (id) do nothing;


-- 160th SOAR
insert into soldiers (id, rank, rank_full, name, mos, mos_title, role, unit, team, status, quals, avatar) values
  ('soar-cdr',   'MAJ', 'Major',                   '[VACANT]', '15A',  'Aviation Officer',            'Detachment Commander',          '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Air Assault","Aviator Wings"}', 'MAJ'),
  ('soar-xo',    'CPT', 'Captain',                 '[VACANT]', '15A',  'Aviation Officer',            'Detachment Executive Officer',  '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Aviator Wings"}',               'CPT'),
  ('soar-psg',   'SFC', 'Sergeant First Class',    '[VACANT]', '15Z',  'Senior Aviation NCO',         'Platoon Sergeant',              '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Air Assault"}',                 'SFC'),
  ('soar-p1',    'CW3', 'Chief Warrant Officer 3', '[VACANT]', '153D', 'MH-60 Pilot',                 'Pilot in Command',              '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Aviator Wings","NVG"}',         'CW3'),
  ('soar-p2',    'CW2', 'Chief Warrant Officer 2', '[VACANT]', '153D', 'MH-60 Pilot',                 'Co-Pilot',                      '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Aviator Wings"}',               'CW2'),
  ('soar-p3',    'CW3', 'Chief Warrant Officer 3', '[VACANT]', '153E', 'MH-47 Pilot',                 'Pilot in Command',              '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Aviator Wings","NVG"}',         'CW3'),
  ('soar-p4',    'CW2', 'Chief Warrant Officer 2', '[VACANT]', '153E', 'MH-47 Pilot',                 'Co-Pilot',                      '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Aviator Wings"}',               'CW2'),
  ('soar-ce1',   'SSG', 'Staff Sergeant',          '[VACANT]', '15U',  'CH-47 Helicopter Repairer',   'Crew Chief',                    '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Air Assault"}',                 'SSG'),
  ('soar-ce2',   'SGT', 'Sergeant',                '[VACANT]', '15T',  'UH-60 Helicopter Repairer',   'Crew Chief',                    '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Air Assault"}',                 'SGT'),
  ('soar-dg1',   'SSG', 'Staff Sergeant',          '[VACANT]', '15Y',  'AH-64 Armament/Elect',        'Door Gunner',                   '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne","Air Assault"}',                 'SSG'),
  ('soar-dg2',   'SGT', 'Sergeant',                '[VACANT]', '15Y',  'AH-64 Armament/Elect',        'Door Gunner',                   '160th SOAR', '160th SOAR', 'VACANT', '{"Airborne"}',                               'SGT')
on conflict (id) do nothing;


-- ============================================
-- MAKE YOUR FIRST ADMIN
-- After creating an account via the login page, run:
-- UPDATE profiles SET role = 'superadmin' WHERE email = 'YOUR_EMAIL_HERE';
-- ============================================
