# SiLaras — Sistem Laporan RSAU

SiLaras adalah aplikasi web production-ready untuk pelaporan kesehatan berjenjang rumah sakit TNI AU.

## Stack
- React + Vite + TypeScript
- Supabase (Auth, DB, Storage, RLS)
- Tailwind CSS + shadcn/ui-ready structure
- TanStack Query, TanStack Table, Recharts
- React Hook Form + Zod
- xlsx + jsPDF
- Deploy ke Vercel

## Struktur Proyek
- `src/app`: bootstrap dan routing
- `src/components`: layout dan komponen reusable
- `src/features`: modul domain (auth, dashboard, bor, diseases, review, analytics, master-data)
- `src/services`: service/repository ke Supabase
- `src/lib`: utilitas umum dan client
- `supabase/migrations`: schema SQL + RLS + trigger
- `supabase/seed`: seed data TW I 2026

## Setup Lokal
1. Install dependency:
   ```bash
   npm install
   ```
2. Salin env:
   ```bash
   cp .env.example .env
   ```
3. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. Jalankan dev:
   ```bash
   npm run dev
   ```

## Setup Supabase
1. Buat project Supabase.
2. Jalankan migration SQL di `supabase/migrations/20260423010000_init_silaras.sql`.
3. Buat user Auth demo, lalu sesuaikan UUID di `supabase/seed/seed.sql`.
4. Jalankan seed SQL.

## Workflow Status
`draft -> submitted -> revision_needed -> approved -> locked`

Audit trail tersedia via:
- `report_status_logs`
- `activity_logs`

## Akun Demo
- Admin Puskesau: `admin.puskesau@silaras.mil.id`
- Admin RS: `admin.rs@silaras.mil.id`

> Password diatur dari Supabase Auth Dashboard.

## Deploy ke Vercel
1. Push repo ke GitHub.
2. Import project di Vercel.
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Build command: `npm run build`
5. Output directory: `dist`

## Catatan Produksi
- RLS ketat per role (`admin_puskesau`, `admin_rs`, `viewer_pimpinan`, `reviewer_kotama`).
- Gunakan HTTPS, MFA, dan password policy di Supabase Auth.
- Disarankan tambahkan monitoring (Sentry/Logflare) dan backup policy.
