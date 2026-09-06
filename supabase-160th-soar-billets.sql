-- ============================================================
-- 160th SOAR Billets — Command Element + Two MH-60 Helo Crews
-- Run in Supabase SQL Editor → New Query
-- ============================================================

INSERT INTO public.soldiers
  (id, rank, rank_full, name, callsign, mos, mos_title, role, unit, team, status, quals, avatar)
VALUES

-- ── COMMAND ELEMENT ────────────────────────────────────────
(gen_random_uuid(), 'CPT',  'Captain',            '[VACANT]', NULL, '153A', 'Rotary Wing Aviator',         'Detachment Commander',      '160th SOAR', 'Command Element', 'VACANT', '{}', 'CPT'),
(gen_random_uuid(), 'CW4',  'Chief Warrant Officer 4', '[VACANT]', NULL, '153A', 'Rotary Wing Aviator',   'Operations Officer',         '160th SOAR', 'Command Element', 'VACANT', '{}', 'CW4'),
(gen_random_uuid(), 'SFC',  'Sergeant First Class','[VACANT]', NULL, '15Z', 'Aviation Operations',        'Detachment Sergeant',        '160th SOAR', 'Command Element', 'VACANT', '{}', 'SFC'),

-- ── MH-60 CREW 1 ───────────────────────────────────────────
(gen_random_uuid(), 'CW3',  'Chief Warrant Officer 3', '[VACANT]', NULL, '153A', 'Rotary Wing Aviator',   'Pilot in Command',           '160th SOAR', 'MH-60 Crew 1', 'VACANT', '{}', 'CW3'),
(gen_random_uuid(), 'CW2',  'Chief Warrant Officer 2', '[VACANT]', NULL, '153A', 'Rotary Wing Aviator',   'Co-Pilot',                   '160th SOAR', 'MH-60 Crew 1', 'VACANT', '{}', 'CW2'),
(gen_random_uuid(), 'SSG',  'Staff Sergeant',     '[VACANT]', NULL, '15T', 'UH-60 Helicopter Repairer',  'Crew Chief',                 '160th SOAR', 'MH-60 Crew 1', 'VACANT', '{}', 'SSG'),
(gen_random_uuid(), 'SGT',  'Sergeant',           '[VACANT]', NULL, '15T', 'UH-60 Helicopter Repairer',  'Door Gunner',                '160th SOAR', 'MH-60 Crew 1', 'VACANT', '{}', 'SGT'),

-- ── MH-60 CREW 2 ───────────────────────────────────────────
(gen_random_uuid(), 'CW3',  'Chief Warrant Officer 3', '[VACANT]', NULL, '153A', 'Rotary Wing Aviator',   'Pilot in Command',           '160th SOAR', 'MH-60 Crew 2', 'VACANT', '{}', 'CW3'),
(gen_random_uuid(), 'CW2',  'Chief Warrant Officer 2', '[VACANT]', NULL, '153A', 'Rotary Wing Aviator',   'Co-Pilot',                   '160th SOAR', 'MH-60 Crew 2', 'VACANT', '{}', 'CW2'),
(gen_random_uuid(), 'SSG',  'Staff Sergeant',     '[VACANT]', NULL, '15T', 'UH-60 Helicopter Repairer',  'Crew Chief',                 '160th SOAR', 'MH-60 Crew 2', 'VACANT', '{}', 'SSG'),
(gen_random_uuid(), 'SGT',  'Sergeant',           '[VACANT]', NULL, '15T', 'UH-60 Helicopter Repairer',  'Door Gunner',                '160th SOAR', 'MH-60 Crew 2', 'VACANT', '{}', 'SGT');
