# Evaluasi Fitur yang Kurang / Perlu Ditingkatkan (SiLaras)

Dokumen ini merangkum area fitur yang saat ini masih kurang optimal berdasarkan kondisi aplikasi (masih mode mock/local).

## 1) Autentikasi & Otorisasi Belum Production-Grade
**Kondisi saat ini**
- Role dan akses masih dominan mode demo/lokal.
- Belum terlihat integrasi SSO/IdP organisasi.

**Dampak**
- Risiko akses tidak sesuai kebijakan bila dipakai multi-unit nyata.
- Sulit melakukan governance akses jangka panjang.

**Usulan perbaikan**
- Integrasi auth provider production (mis. SSO internal).
- Terapkan RBAC/ABAC yang konsisten per menu, aksi, dan data scope.
- Tambahkan session policy (timeout, device/session management).

## 2) Data Persistence Masih Lokal (LocalStorage/Mock)
**Kondisi saat ini**
- Data laporan, workflow, dan audit banyak bergantung pada local storage/demo seed.

**Dampak**
- Data tidak reliabel untuk operasional nyata (bisa hilang/berbeda antar perangkat).
- Tidak siap untuk kolaborasi real-time lintas pengguna.

**Usulan perbaikan**
- Migrasi penuh ke backend terpusat (database + API).
- Tambahkan mekanisme backup, versioning, dan conflict handling.
- Siapkan strategi migrasi data dari local demo ke environment production.

## 3) Audit Trail & Kepatuhan Belum Komprehensif
**Kondisi saat ini**
- Audit log ada, namun belum jelas standar kepatuhan, retensi, dan immutability.

**Dampak**
- Sulit memenuhi kebutuhan investigasi insiden dan audit formal.
- Risiko data perubahan tidak terlacak secara forensik.

**Usulan perbaikan**
- Tambahkan event audit yang lebih detail (before/after, actor, reason).
- Terapkan immutable log (append-only) dan kebijakan retensi.
- Sediakan export audit terstandar untuk kebutuhan pemeriksaan.

## 4) Validasi Data Belum Menutup Semua Skenario
**Kondisi saat ini**
- Validasi form dinamis sudah ada, tetapi kemungkinan belum mencakup seluruh aturan domain medis/operasional.

**Dampak**
- Potensi data tidak konsisten antar satkes/RS.
- Meningkatkan beban revisi saat tahap verifikasi.

**Usulan perbaikan**
- Definisikan rulebook validasi per jenis report secara formal.
- Tambahkan cross-field dan cross-section validation.
- Berikan pesan error yang lebih spesifik dan rekomendasi perbaikan otomatis.

## 5) Kolaborasi & Workflow Tim Masih Terbatas
**Kondisi saat ini**
- Alur submit-review-approve sudah ada, tapi fitur kolaborasi mendalam belum menonjol.

**Dampak**
- Komunikasi revisi berpotensi tersebar di luar sistem.
- Sulit mengelola SLA dan prioritas verifikasi lintas unit.

**Usulan perbaikan**
- Tambah komentar bertingkat per field/section.
- Tambah assignment verifier + SLA timer + notifikasi eskalasi.
- Sediakan dashboard workload reviewer dan bottleneck analysis.

## 6) Monitoring Operasional & Alerting Belum Matang
**Kondisi saat ini**
- Dashboard analitik tersedia, namun observability aplikasi (error/performa/availability) belum terlihat lengkap.

**Dampak**
- Gangguan layanan berpotensi terlambat terdeteksi.
- Sulit melakukan root-cause analysis saat insiden.

**Usulan perbaikan**
- Integrasi logging terpusat + error tracking + performance tracing.
- Buat health dashboard operasional dan alert otomatis.
- Tetapkan SLO/SLI untuk endpoint kritikal dan alur submit laporan.

## 7) UX Mobile & Aksesibilitas Perlu Peningkatan
**Kondisi saat ini**
- Belum ada indikator kuat terkait optimasi mobile-first dan standar aksesibilitas.

**Dampak**
- Pengguna lapangan berpotensi kurang nyaman saat input cepat.
- Risiko tidak memenuhi kebutuhan pengguna dengan keterbatasan akses.

**Usulan perbaikan**
- Audit responsivitas layar kecil untuk semua halaman inti.
- Terapkan checklist WCAG (kontras, keyboard nav, screen-reader labels).
- Sederhanakan alur input cepat (shortcut, draft cerdas, autofill terbatas).

## Prioritas Implementasi (Quick Win → Strategic)
1. **P0 (segera):** backend persistence + auth production + audit trail minimum.
2. **P1 (jangka pendek):** validasi domain lanjutan + notifikasi workflow.
3. **P2 (jangka menengah):** observability penuh + kolaborasi reviewer tingkat lanjut + aksesibilitas menyeluruh.

---
Dokumen ini bisa dijadikan baseline backlog untuk roadmap versi production SiLaras.
