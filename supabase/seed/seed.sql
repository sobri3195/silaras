insert into public.hospitals (kode_rs, nama_rs, jenis_rs, alias_rs, wilayah) values
('RSAU-001','RSPAU dr. S. Hardjolukito','BLU','Hardjolukito','Yogyakarta'),
('RSAU-002','RSAU dr. Esnawan Antariksa','BLU','Esnawan Antariksa','Jakarta'),
('RSAU-003','RSAU dr. M. Salamun','BLU','M. Salamun','Bandung'),
('RSAU-004','RSAU dr. Efram Harsana','Non BLU',null,'Pontianak'),
('RSAU-005','RSAU dr. Hasan Toto ATS','Non BLU',null,'Malang'),
('RSAU-006','RSAU dr. Doddy Sardjoto','Non BLU',null,'Makassar'),
('RSAU-007','RSAU dr. Siswanto','Non BLU',null,'Jakarta'),
('RSAU-008','RSAU dr. Sukirman','Non BLU',null,'Surabaya'),
('RSAU-009','RSAU dr. M. Sutomo','Non BLU',null,'Malang'),
('RSAU-010','RSAU dr. Yuniati Wisma Ranai','Non BLU',null,'Ranai'),
('RSAU-011','RSAU dr. Norman Lubis','Non BLU',null,'Medan'),
('RSAU-012','RSAU dr. Hoediono','Non BLU',null,'Yogyakarta'),
('RSAU-013','RSAU dr. Soemitro','Non BLU',null,'Surabaya'),
('RSAU-014','RSAU Lanud Dhomber Balikpapan','Non BLU',null,'Balikpapan'),
('RSAU-015','RSAU Lanud Samsudin Noor','Non BLU',null,'Banjarmasin'),
('RSAU-016','RSAU dr. Abdul Malik','Non BLU',null,'Pontianak'),
('RSAU-017','RSAU Lanud Samratulangi','Non BLU',null,'Manado'),
('RSAU-018','RSAU dr. M. Munir','Non BLU',null,'Madiun');

insert into public.reporting_periods (id, label, jenis_periode, triwulan, tahun, due_date, is_active)
values ('11111111-1111-1111-1111-111111111111', 'TW I 2026', 'triwulan', 1, 2026, '2026-04-30', true);

insert into public.disease_categories (id, code, display_name, description) values
('d1111111-1111-1111-1111-111111111111','INF','Infeksi Saluran Nafas','Kelompok ISPA dan turunannya'),
('d2222222-2222-2222-2222-222222222222','CARD','Kardiovaskular','Kelompok hipertensi dan jantung');

insert into public.disease_normalization_rules (match_text, normalized_name, disease_category_id, priority) values
('hipertensi','Hipertensi','d2222222-2222-2222-2222-222222222222',10),
('ispa','ISPA','d1111111-1111-1111-1111-111111111111',10),
('influenza','Influenza','d1111111-1111-1111-1111-111111111111',20);

-- Demo profiles: create auth users first in Supabase Auth dashboard, then map IDs below.
-- Example mapping placeholders:
insert into public.profiles (id, full_name, email, role, hospital_id)
values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin Puskesau', 'admin.puskesau@silaras.mil.id', 'admin_puskesau', null),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Admin RSAU Esnawan', 'admin.rs@silaras.mil.id', 'admin_rs', (select id from public.hospitals where kode_rs='RSAU-002'))
on conflict (id) do nothing;

insert into public.bor_reports (hospital_id, reporting_period_id, jumlah_tt, nilai_bor, status, created_by, updated_by)
select id, '11111111-1111-1111-1111-111111111111', 100, bor, 'submitted', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
from (
values
('RSAU-001',53.00),('RSAU-002',53.60),('RSAU-003',63.80),('RSAU-004',42.42),('RSAU-005',67.28),('RSAU-006',58.02),('RSAU-007',20.79),('RSAU-008',48.11),('RSAU-009',71.79),('RSAU-010',7.38),('RSAU-011',25.85),('RSAU-012',31.92),('RSAU-013',0.10),('RSAU-014',4.20),('RSAU-015',13.38),('RSAU-016',17.55),('RSAU-017',47.67),('RSAU-018',26.79)
) as seed(kode_rs, bor)
join public.hospitals h on h.kode_rs = seed.kode_rs;

insert into public.disease_reports (hospital_id, reporting_period_id, status, created_by, updated_by)
select id, '11111111-1111-1111-1111-111111111111', 'submitted', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
from public.hospitals;

insert into public.disease_report_items (disease_report_id, ranking, nama_penyakit_raw, nama_penyakit_normalized, disease_category_id, jumlah_tni, jumlah_pns, jumlah_kel)
select dr.id, s.ranking, s.raw_name, s.norm_name, s.cat, s.tni, s.pns, s.kel
from public.disease_reports dr
cross join (
  values
  (1,'Hipertensi grade 1','Hipertensi','d2222222-2222-2222-2222-222222222222',22,10,19),
  (2,'ISPA akut','ISPA','d1111111-1111-1111-1111-111111111111',18,8,15),
  (3,'Dispepsia','Dispepsia',null,13,5,12),
  (4,'Diabetes mellitus tipe 2','Diabetes Mellitus',null,10,7,9),
  (5,'Nyeri punggung bawah','Low Back Pain',null,8,4,8),
  (6,'Influenza','Influenza','d1111111-1111-1111-1111-111111111111',9,3,7),
  (7,'Dermatitis','Dermatitis',null,5,2,4),
  (8,'Migraine','Migraine',null,4,1,3),
  (9,'Vertigo','Vertigo',null,3,1,2),
  (10,'Anemia ringan','Anemia',null,2,1,2)
) as s(ranking, raw_name, norm_name, cat, tni, pns, kel);
