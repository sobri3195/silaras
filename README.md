# SiLaras — Sistem Laporan RSAU

SiLaras adalah aplikasi web production-ready untuk pelaporan kesehatan berjenjang rumah sakit TNI AU.

## Stack
- React + Vite + TypeScript
- Local mock data layer (tanpa Supabase)
- Tailwind CSS + shadcn/ui-ready structure
- TanStack Query, TanStack Table, Recharts
- React Hook Form + Zod
- xlsx + jsPDF
- Deploy ke Vercel

## Struktur Proyek
- `src/app`: bootstrap dan routing
- `src/components`: layout dan komponen reusable
- `src/features`: modul domain (auth, dashboard, bor, diseases, review, analytics, master-data)
- `src/services`: service/repository laporan
- `src/lib`: utilitas umum dan data client

## Setup Lokal
1. Install dependency:
   ```bash
   npm install
   ```
2. Jalankan dev:
   ```bash
   npm run dev
   ```

## Workflow Status
`draft -> submitted -> revision_needed -> approved -> locked`

Audit trail tersedia via:
- `report_status_logs`
- `activity_logs`

## Akun Demo
- Admin Puskesau: `admin.puskesau@silaras.mil.id`
- Admin RS: `admin.rs@silaras.mil.id`

## Deploy ke Vercel
1. Push repo ke GitHub.
2. Import project di Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`

## Catatan Produksi
- Saat ini aplikasi berjalan dengan data mock lokal.
- Untuk integrasi backend production, sambungkan ke layanan database/auth sesuai kebutuhan infrastruktur.
