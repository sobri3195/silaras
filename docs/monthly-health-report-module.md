# Monthly Health Report Module (LocalStorage)

Modul ini menambahkan **Laporan Bulanan Satkes** yang terdiri dari:

1. **Laporan naratif bulanan**
2. **Lampiran tabular bulanan KES/A-xx/BL + perkembangan kasus**

## Fitur utama
- Workflow status: draft → submit → in_review/revision_needed → approved → locked.
- Autosave draft untuk naratif dan lampiran.
- Dynamic form engine untuk template lampiran.
- Export PDF/Excel per lampiran.
- Print preview formal untuk submission.
- Review notes dan audit log per lampiran.

## Rute
- `/reports/monthly/narrative`
- `/reports/monthly/attachments`
- `/reports/monthly/attachments/:code`
- `/reports/monthly/review`
- `/reports/monthly/preview/:submissionId`

## Data model baru
- `MonthlyNarrativeReport`
- `MonthlyNarrativeSection`
- `MonthlyAttachmentSubmission`
- `MonthlyAttachmentItem`
- `MonthlyAttachmentTemplate`
- `MonthlyAttachmentAuditLog`

Lihat definisi di `src/types/monthly-health-report.ts`.

## Storage service
Service utama ada di `src/services/monthly-health-report-storage.ts`.

Storage key localStorage:
- `silaras_monthly_hospitals`
- `silaras_monthly_periods`
- `silaras_monthly_narratives`
- `silaras_monthly_attachment_templates`
- `silaras_monthly_attachment_submissions`
- `silaras_monthly_attachment_items`
- `silaras_monthly_attachment_logs`

## Seed demo Wiriadinata April 2026
Auto-seed tersedia untuk:
- Faskes: **Lanud Wiriadinata** (`RS-WIRIADINATA`)
- Periode: **April 2026** (`period-2026-04`)

Contoh data termasuk:
- Poliklinik umum total 103 pasien.
- Militer 11, ASN 3, Keluarga 56.
- Akseptor KB 15.
- Penyakit menonjol: Flu, Demam, Diare.
- Personel kesehatan 10.
- Belum ada dokter gigi, belum ada tenaga rontgen, alat rontgen rusak.
- HIV/TBC/Malaria perkembangan = 0.
