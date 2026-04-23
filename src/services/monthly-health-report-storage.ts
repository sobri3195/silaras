import type {
  MonthlyAttachmentAuditLog,
  MonthlyAttachmentItem,
  MonthlyAttachmentSubmission,
  MonthlyAttachmentTemplate,
  MonthlyNarrativeReport,
  MonthlyNarrativeSection,
  MonthlyPeriodOption,
  MonthlyHospitalOption,
  MonthlyReportStatus,
} from '@/types/monthly-health-report';

const KEYS = {
  hospitals: 'silaras_monthly_hospitals',
  periods: 'silaras_monthly_periods',
  narrative: 'silaras_monthly_narratives',
  templates: 'silaras_monthly_attachment_templates',
  submissions: 'silaras_monthly_attachment_submissions',
  items: 'silaras_monthly_attachment_items',
  logs: 'silaras_monthly_attachment_logs',
};

const wiriadinataHospitalId = 'RS-WIRIADINATA';
const april2026PeriodId = 'period-2026-04';

const narrativeSections: MonthlyNarrativeSection[] = [
  { key: 'umum', title: 'Umum', helper: 'Gambaran umum laporan operasional kesehatan bulan berjalan.', required: true },
  { key: 'maksud_tujuan', title: 'Maksud dan Tujuan', required: true },
  { key: 'ruang_lingkup', title: 'Ruang Lingkup' },
  { key: 'dasar', title: 'Dasar', required: true },
  { key: 'kegiatan_promotif', title: 'Kegiatan Promotif' },
  { key: 'kegiatan_preventif', title: 'Kegiatan Preventif' },
  { key: 'kegiatan_kuratif', title: 'Kegiatan Kuratif' },
  { key: 'dukungan_kesehatan', title: 'Dukungan Kesehatan' },
  { key: 'pelayanan_kesehatan', title: 'Pelayanan Kesehatan' },
  { key: 'personel', title: 'Personel' },
  { key: 'masalah_hambatan', title: 'Masalah dan Hambatan' },
  { key: 'cara_mengatasi', title: 'Cara Mengatasi Masalah' },
  { key: 'kesimpulan', title: 'Kesimpulan' },
  { key: 'saran', title: 'Saran' },
  { key: 'penutup', title: 'Penutup' },
];

const diseaseCategories = [
  'Influenza', 'ISPA', 'Penyakit paru & saluran napas bawah', 'Penyakit usus', 'Demam', 'Diare', 'Dispepsia', 'Hipertensi',
  'Diabetes melitus', 'Dermatitis', 'Alergi', 'Tonsilitis', 'Konjungtivitis', 'Vertigo', 'Migrain', 'Asma', 'Pneumonia',
  'Covid-like illness', 'Tifoid', 'Gastritis', 'Luka trauma', 'Penyakit sendi', 'Penyakit ginjal', 'Penyakit jantung',
  'Anemia', 'Gangguan psikologis', 'Penyakit mata', 'Penyakit THT', 'Penyakit kulit infeksi', 'Penyakit gigi mulut', 'TBC', 'Lain-lain',
];

function nowIso() {
  return new Date().toISOString();
}

function parse<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function templateFactory(): MonthlyAttachmentTemplate[] {
  return [
    {
      id: 'tpl-a01', code: 'KES/A-01/BL', title: 'Macam Penyakit / Jumlah Penderita Rawat Jalan', description: '32 kategori penyakit rawat jalan.', mode: 'table', repeatable_rows: true,
      grouped_headers: [{ label: 'Distribusi Pasien', columns: ['tni_au', 'angkatan_lain', 'bpjs_non_tni', 'yanmas', 'jumlah'] }],
      fields: [
        { key: 'macam_penyakit', label: 'Macam Penyakit', type: 'text', required: true },
        { key: 'tni_au', label: 'TNI AU', type: 'number' },
        { key: 'angkatan_lain', label: 'Angkatan Lain', type: 'number' },
        { key: 'bpjs_non_tni', label: 'BPJS non TNI', type: 'number' },
        { key: 'yanmas', label: 'Yanmas', type: 'number' },
        { key: 'jumlah', label: 'Jumlah', type: 'calculated', readonly: true, formula: { sum: ['tni_au', 'angkatan_lain', 'bpjs_non_tni', 'yanmas'] } },
      ], total_fields: ['tni_au', 'angkatan_lain', 'bpjs_non_tni', 'yanmas', 'jumlah'],
      default_rows: diseaseCategories.map((item) => ({ macam_penyakit: item, tni_au: 0, angkatan_lain: 0, bpjs_non_tni: 0, yanmas: 0, jumlah: 0 })),
    },
    {
      id: 'tpl-a02', code: 'KES/A-02/BL', title: 'Pelayanan Rawat Jalan', description: 'Layanan spesialis, UGD, umum.', mode: 'table', repeatable_rows: true,
      fields: [
        { key: 'layanan', label: 'Layanan', type: 'select', options: ['Spesialis', 'UGD', 'Umum'] },
        { key: 'kunjungan_baru', label: 'Kunjungan Baru', type: 'number' },
        { key: 'kunjungan_ulang', label: 'Kunjungan Ulang', type: 'number' },
        { key: 'bpjs_non_tni', label: 'BPJS non TNI', type: 'number' },
        { key: 'yanmas', label: 'Yanmas', type: 'number' },
        { key: 'jumlah', label: 'Jumlah', type: 'calculated', formula: { sum: ['kunjungan_baru', 'kunjungan_ulang', 'bpjs_non_tni', 'yanmas'] }, readonly: true },
        { key: 'keterangan', label: 'Keterangan', type: 'notes' },
      ], total_fields: ['kunjungan_baru', 'kunjungan_ulang', 'bpjs_non_tni', 'yanmas', 'jumlah'],
      default_rows: [{ layanan: 'Umum', kunjungan_baru: 44, kunjungan_ulang: 59, bpjs_non_tni: 33, yanmas: 70, jumlah: 103, keterangan: 'Total poliklinik umum 103 pasien' }],
    },
    { id: 'tpl-a03', code: 'KES/A-03/BL', title: 'Pelayanan Rawat Inap', description: 'Rekap rawat inap bulanan.', mode: 'table', repeatable_rows: true,
      fields: [
        { key: 'macam_penyakit', label: 'Macam Penyakit', type: 'text' }, { key: 'jumlah_penderita', label: 'Jumlah Penderita', type: 'number' }, { key: 'hari_rawat', label: 'Hari Rawat', type: 'number' }, { key: 'status_pasien', label: 'Status Pasien', type: 'text' }, { key: 'jumlah', label: 'Jumlah', type: 'calculated', readonly: true, formula: { sum: ['jumlah_penderita', 'hari_rawat'] } },
      ], default_rows: [] },
    { id: 'tpl-a04', code: 'KES/A-04/BL', title: 'Jumlah Kematian', description: 'Statistik kematian bulanan.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'status', label: 'Status', type: 'text' }, { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: ['L', 'P'] }, { key: 'sebab_kematian', label: 'Sebab Kematian', type: 'text' }, { key: 'jumlah', label: 'Jumlah', type: 'number' }, { key: 'keterangan', label: 'Keterangan', type: 'notes' }], default_rows: [] },
    { id: 'tpl-a05', code: 'KES/A-05/BL', title: 'Jumlah Kelahiran dan Kematian Ibu', description: 'Kelahiran dan MMR.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'kelompok_pasien', label: 'Kelompok Pasien', type: 'text' }, { key: 'kelahiran_normal', label: 'Kelahiran Normal', type: 'number' }, { key: 'kelahiran_prematur', label: 'Kelahiran Prematur', type: 'number' }, { key: 'kematian_ibu', label: 'Kematian Ibu', type: 'number' }, { key: 'total', label: 'Total', type: 'calculated', readonly: true, formula: { sum: ['kelahiran_normal', 'kelahiran_prematur', 'kematian_ibu'] } }, { key: 'mmr_note', label: 'MMR Note', type: 'notes' }], default_rows: [] },
    { id: 'tpl-a06', code: 'KES/A-06/BL', title: 'Data Keluarga Berencana', description: 'Metadata klinik KB dan capaian.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'metadata_klinik_kb', label: 'Metadata Klinik KB', type: 'text' }, { key: 'populasi', label: 'Populasi', type: 'number' }, { key: 'pus', label: 'PUS', type: 'number' }, { key: 'metode_kontrasepsi', label: 'Metode Kontrasepsi', type: 'text' }, { key: 'kunjungan_ulang', label: 'Kunjungan Ulang', type: 'number' }, { key: 'peserta_ganti_cara', label: 'Peserta Ganti Cara', type: 'number' }, { key: 'kegiatan_luar_klinik', label: 'Kegiatan di luar klinik', type: 'notes' }],
      default_rows: [{ metadata_klinik_kb: 'Klinik KB Satkes Lanud Wiriadinata', populasi: 200, pus: 80, metode_kontrasepsi: 'Pil/Suntik/IUD', kunjungan_ulang: 15, peserta_ganti_cara: 2, kegiatan_luar_klinik: 'Akseptor KB bulan April: 15' }] },
    { id: 'tpl-a07', code: 'KES/A-07/BL', title: 'Pemberantasan Penyakit TBC', description: 'Cakupan pemeriksaan dan pengobatan TBC.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'indikator', label: 'Indikator', type: 'text' }, { key: 'jumlah_pemeriksaan', label: 'Jumlah Pemeriksaan', type: 'number' }, { key: 'jumlah_kasus', label: 'Jumlah Kasus', type: 'number' }, { key: 'status_pengobatan', label: 'Status Pengobatan', type: 'text' }, { key: 'penggunaan_obat', label: 'Penggunaan Obat', type: 'text' }, { key: 'mikroskopik_radiologi', label: 'Pemeriksaan Mikroskopik / Radiologi', type: 'text' }, { key: 'lain_lain', label: 'Lain-lain', type: 'notes' }],
      default_rows: [{ indikator: 'Perkembangan kasus TBC', jumlah_pemeriksaan: 0, jumlah_kasus: 0, status_pengobatan: 'Tidak ada kasus', penggunaan_obat: '-', mikroskopik_radiologi: '-', lain_lain: 'Laporan perkembangan TBC = 0' }] },
    { id: 'tpl-ac08', code: 'KES/AC-08/BL', title: 'Pengunjung & Kunjungan Poliklinik Gigi', description: 'Kunjungan poli gigi.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'golongan_pasien', label: 'Golongan Pasien', type: 'text' }, { key: 'kunjungan_baru', label: 'Kunjungan Baru', type: 'number' }, { key: 'kunjungan_ulang', label: 'Kunjungan Ulang', type: 'number' }, { key: 'keterangan', label: 'Keterangan', type: 'notes' }],
      default_rows: [{ golongan_pasien: 'Seluruh golongan', kunjungan_baru: 0, kunjungan_ulang: 0, keterangan: 'Belum memiliki dokter gigi.' }] },
    { id: 'tpl-a09', code: 'KES/A-09/BL', title: 'Kasus Penyakit Gigi dan Mulut', description: 'Daftar penyakit gigi dan mulut.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'kode', label: 'Kode', type: 'text' }, { key: 'jenis_penyakit', label: 'Jenis Penyakit', type: 'text' }, { key: 'distribusi_pasien', label: 'Distribusi Pasien', type: 'text' }, { key: 'jumlah', label: 'Jumlah', type: 'number' }], default_rows: [] },
    { id: 'tpl-a10', code: 'KES/A-10/BL', title: 'Jumlah Pengobatan Penyakit Gigi dan Mulut', description: 'Rekap tindakan gigi dan mulut.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'kategori', label: 'Kategori', type: 'select', options: ['Bedah Mulut', 'Konservasi/Endodontia', 'Prosthodontia', 'Periodontia', 'Orthodontia', 'Oral Medicine'] }, { key: 'jumlah', label: 'Jumlah', type: 'number' }, { key: 'keterangan', label: 'Keterangan', type: 'notes' }], default_rows: [] },
    { id: 'tpl-a12', code: 'KES/A-12/BL', title: 'Sanitasi Lingkungan', description: 'Penilaian sanitasi lingkungan satkes.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'area', label: 'Area', type: 'select', options: ['Pembuangan sampah', 'Saluran air', 'Dapur dan sanitasi makanan', 'Halaman', 'Air minum', 'Pemberantasan serangga', 'Penilaian asrama/komplek', 'Penilaian kantor'] }, { key: 'nilai', label: 'Nilai (%)', type: 'percentage' }, { key: 'catatan', label: 'Catatan', type: 'notes' }], default_rows: [] },
    { id: 'tpl-a17', code: 'KES/A-17/BL', title: 'Kegiatan Radiologi / USG', description: 'Layanan radiologi dan USG.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'jenis_layanan', label: 'Jenis Layanan', type: 'select', options: ['Radiologi', 'USG'] }, { key: 'jenis_pemeriksaan', label: 'Jenis Pemeriksaan', type: 'text' }, { key: 'distribusi_pasien', label: 'Distribusi Pasien', type: 'text' }, { key: 'jumlah', label: 'Jumlah', type: 'number' }], default_rows: [{ jenis_layanan: 'Radiologi', jenis_pemeriksaan: 'Rontgen Thorax', distribusi_pasien: 'N/A', jumlah: 0 }] },
    { id: 'tpl-a19', code: 'KES/A-19/BL', title: 'Jumlah Penerimaan Resep', description: 'Resep berdasarkan unit layanan.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'unit', label: 'Unit', type: 'select', options: ['Rawat Jalan', 'Rawat Inap', 'UGD'] }, { key: 'jumlah', label: 'Jumlah', type: 'number' }, { key: 'total', label: 'Total', type: 'calculated', readonly: true, formula: { sum: ['jumlah'] } }], default_rows: [] },
    { id: 'tpl-a20', code: 'KES/A-20/BL', title: 'Jumlah Kehilangan Hari Kerja', description: 'Rekap cuti sakit dan kehilangan hari kerja.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'klasifikasi_personel', label: 'Klasifikasi Personel', type: 'text' }, { key: 'jumlah_orang_cuti_sakit', label: 'Jumlah Orang Cuti Sakit', type: 'number' }, { key: 'jumlah_hilang_hari_kerja', label: 'Jumlah Kehilangan Hari Kerja', type: 'number' }, { key: 'keterangan', label: 'Keterangan', type: 'notes' }], default_rows: [] },
    { id: 'tpl-hiv', code: 'HIV-PERKEMBANGAN', title: 'Laporan Perkembangan Kasus HIV/AIDS', description: 'Perkembangan kasus HIV/AIDS.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'bagian', label: 'Bagian', type: 'select', options: ['Menurut status', 'Menurut strata', 'Menurut usia'] }, { key: 'jumlah_kasus', label: 'Jumlah Kasus', type: 'number' }, { key: 'catatan', label: 'Catatan', type: 'notes' }],
      default_rows: [{ bagian: 'Menurut status', jumlah_kasus: 0, catatan: 'Laporan HIV/AIDS = 0' }, { bagian: 'Menurut strata', jumlah_kasus: 0, catatan: '' }, { bagian: 'Menurut usia', jumlah_kasus: 0, catatan: '' }] },
    { id: 'tpl-tbc', code: 'TBC-PERKEMBANGAN', title: 'Laporan Perkembangan Kasus TBC', description: 'Perkembangan kasus TBC.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'bagian', label: 'Bagian', type: 'select', options: ['Menurut status', 'Menurut strata', 'Menurut usia'] }, { key: 'jumlah_kasus', label: 'Jumlah Kasus', type: 'number' }, { key: 'catatan', label: 'Catatan', type: 'notes' }],
      default_rows: [{ bagian: 'Menurut status', jumlah_kasus: 0, catatan: 'Laporan TBC perkembangan = 0' }, { bagian: 'Menurut strata', jumlah_kasus: 0, catatan: '' }, { bagian: 'Menurut usia', jumlah_kasus: 0, catatan: '' }] },
    { id: 'tpl-malaria', code: 'MALARIA-PERKEMBANGAN', title: 'Laporan Perkembangan Kasus Malaria', description: 'Perkembangan kasus Malaria.', mode: 'table', repeatable_rows: true,
      fields: [{ key: 'bagian', label: 'Bagian', type: 'select', options: ['Menurut status', 'Menurut strata', 'Menurut usia'] }, { key: 'jumlah_kasus', label: 'Jumlah Kasus', type: 'number' }, { key: 'catatan', label: 'Catatan', type: 'notes' }],
      default_rows: [{ bagian: 'Menurut status', jumlah_kasus: 0, catatan: 'Laporan Malaria = 0' }, { bagian: 'Menurut strata', jumlah_kasus: 0, catatan: '' }, { bagian: 'Menurut usia', jumlah_kasus: 0, catatan: '' }] },
  ];
}

function appendLog(submissionId: string, actor: string, action: MonthlyAttachmentAuditLog['action'], previous?: MonthlyReportStatus, next?: MonthlyReportStatus, notes?: string) {
  const logs = parse<MonthlyAttachmentAuditLog[]>(KEYS.logs, []);
  logs.push({ id: crypto.randomUUID(), submission_id: submissionId, action, actor, notes, previous_status: previous, next_status: next, created_at: nowIso() });
  write(KEYS.logs, logs);
}

function ensureSeed() {
  if (parse<MonthlyAttachmentTemplate[]>(KEYS.templates, []).length > 0) return;
  const now = nowIso();
  const hospitals: MonthlyHospitalOption[] = [{ id: wiriadinataHospitalId, name: 'Lanud Wiriadinata' }, { id: 'RS-001', name: 'RSAU Demo' }];
  const periods: MonthlyPeriodOption[] = [{ id: april2026PeriodId, label: 'April 2026' }];
  const templates = templateFactory();

  const narrative: MonthlyNarrativeReport = {
    id: crypto.randomUUID(), hospital_id: wiriadinataHospitalId, reporting_period_id: april2026PeriodId,
    title: 'Laporan Bulanan Bidang Kesehatan Lanud Wiriadinata April 2026', status: 'draft',
    introduction: 'Pendahuluan pelaksanaan operasional kesehatan Satkes Lanud Wiriadinata bulan April 2026.', legal_basis: 'Dasar: perintah komando atas dan program kerja satkes.',
    activities_summary: 'Fokus layanan promotif, preventif, kuratif dengan tren kunjungan poliklinik umum 103 pasien.', facilities_summary: 'Belum memiliki tenaga rontgen, alat rontgen rusak, fasilitas poli gigi belum tersedia.', personnel_summary: 'Personel kesehatan aktif 10 orang.',
    issues_and_constraints: 'Keterbatasan SDM dokter gigi dan tenaga radiologi.', mitigation: 'Koordinasi dukungan tenaga lintas fasilitas dan rencana perbaikan alat.', conclusion: 'Pelayanan dasar berjalan baik dengan kendala fasilitas spesifik.', suggestions: 'Prioritas pengadaan/perbaikan alat rontgen dan pemenuhan dokter gigi.', closing_note: 'Demikian laporan bulanan Satkes untuk menjadi bahan evaluasi.',
    sections: {
      umum: 'Pelaksanaan layanan kesehatan berjalan sesuai rencana operasi satkes.',
      maksud_tujuan: 'Sebagai bahan pertanggungjawaban dan evaluasi pelaksanaan dukungan kesehatan.',
      ruang_lingkup: 'Layanan poliklinik umum, KB, surveilans penyakit dan dukungan operasional.',
      dasar: 'Perintah dan ketentuan pelaporan bulanan bidang kesehatan.',
      kegiatan_promotif: 'Edukasi PHBS pada personel dan keluarga.',
      kegiatan_preventif: 'Pemantauan penyakit menonjol: Flu, Demam, Diare.',
      kegiatan_kuratif: 'Pelayanan kuratif berjalan dengan total kunjungan poliklinik umum 103 pasien.',
      dukungan_kesehatan: 'Dukungan kesehatan rutin untuk kegiatan satuan.',
      pelayanan_kesehatan: 'Militer 11, ASN 3, Keluarga 56, sisanya pasien umum/BPJS.',
      personel: 'Total personel kesehatan 10 orang.',
      masalah_hambatan: 'Belum memiliki dokter gigi dan tenaga rontgen, alat rontgen rusak.',
      cara_mengatasi: 'Koordinasi rujukan dan usulan perbaikan sarana prasarana.',
      kesimpulan: 'Pelayanan kesehatan tetap berjalan walau ada keterbatasan SDM/fasilitas.',
      saran: 'Pemenuhan SDM dan sarpras menjadi prioritas triwulan berikutnya.',
      penutup: 'Laporan disusun sebagai bahan monitoring komando.',
    },
    created_by: 'admin_rs', updated_by: 'admin_rs', submitted_at: null, reviewed_at: null, approved_at: null, locked_at: null, review_notes: [], created_at: now, updated_at: now,
  };

  const submissions: MonthlyAttachmentSubmission[] = [];
  const items: MonthlyAttachmentItem[] = [];
  for (const template of templates) {
    const submissionId = crypto.randomUUID();
    submissions.push({
      id: submissionId, attachment_code: template.code, attachment_title: template.title, hospital_id: wiriadinataHospitalId, reporting_period_id: april2026PeriodId, status: 'draft', metadata: { source: 'seed_wiriadinata_april_2026' },
      created_by: 'admin_rs', updated_by: 'admin_rs', submitted_at: null, reviewed_at: null, approved_at: null, locked_at: null, review_notes: [], created_at: now, updated_at: now,
    });
    (template.default_rows.length ? template.default_rows : [{}]).forEach((row, index) => {
      items.push({ id: crypto.randomUUID(), submission_id: submissionId, row_order: index + 1, payload: row, created_at: now, updated_at: now });
    });
  }

  write(KEYS.hospitals, hospitals);
  write(KEYS.periods, periods);
  write(KEYS.templates, templates);
  write(KEYS.narrative, [narrative]);
  write(KEYS.submissions, submissions);
  write(KEYS.items, items);
  write(KEYS.logs, []);
}

export const monthlyHealthReportStorage = {
  init() { ensureSeed(); },
  getNarrativeTemplateSections() { return narrativeSections; },
  listHospitals() { this.init(); return parse<MonthlyHospitalOption[]>(KEYS.hospitals, []); },
  listPeriods() { this.init(); return parse<MonthlyPeriodOption[]>(KEYS.periods, []); },
  listTemplates() { this.init(); return parse<MonthlyAttachmentTemplate[]>(KEYS.templates, []); },
  getTemplateByCode(code: string) { return this.listTemplates().find((x) => x.code === code) ?? null; },
  listNarratives() { this.init(); return parse<MonthlyNarrativeReport[]>(KEYS.narrative, []); },
  getNarrative(hospitalId: string, periodId: string) {
    return this.listNarratives().find((x) => x.hospital_id === hospitalId && x.reporting_period_id === periodId) ?? null;
  },
  saveNarrative(input: MonthlyNarrativeReport, actor: string, mode: 'autosave' | 'draft' | 'submit') {
    const all = this.listNarratives();
    const idx = all.findIndex((x) => x.id === input.id);
    const nextStatus: MonthlyReportStatus = mode === 'submit' ? 'submitted' : 'draft';
    const next: MonthlyNarrativeReport = { ...input, status: nextStatus, updated_by: actor, updated_at: nowIso(), submitted_at: mode === 'submit' ? nowIso() : input.submitted_at };
    if (idx >= 0) all[idx] = next;
    else all.push(next);
    write(KEYS.narrative, all);
    return next;
  },
  listAttachmentSubmissions(hospitalId: string, periodId: string) {
    return this.init(), parse<MonthlyAttachmentSubmission[]>(KEYS.submissions, []).filter((x) => x.hospital_id === hospitalId && x.reporting_period_id === periodId);
  },
  getAttachmentSubmission(hospitalId: string, periodId: string, code: string) {
    return this.listAttachmentSubmissions(hospitalId, periodId).find((x) => x.attachment_code === code) ?? null;
  },
  getAttachmentItems(submissionId: string) {
    return this.init(), parse<MonthlyAttachmentItem[]>(KEYS.items, []).filter((x) => x.submission_id === submissionId).sort((a, b) => a.row_order - b.row_order);
  },
  saveAttachmentRows(submissionId: string, rows: Record<string, string | number | boolean | null>[], actor: string, mode: 'autosave' | 'draft' | 'submit') {
    const submissions = parse<MonthlyAttachmentSubmission[]>(KEYS.submissions, []);
    const target = submissions.find((x) => x.id === submissionId);
    if (!target) throw new Error('Submission tidak ditemukan.');
    const prev = target.status;
    const nextStatus: MonthlyReportStatus = mode === 'submit' ? 'submitted' : 'draft';
    target.status = nextStatus;
    target.updated_by = actor;
    target.updated_at = nowIso();
    if (mode === 'submit') target.submitted_at = nowIso();
    write(KEYS.submissions, submissions);

    const currentItems = parse<MonthlyAttachmentItem[]>(KEYS.items, []);
    const filtered = currentItems.filter((x) => x.submission_id !== submissionId);
    const now = nowIso();
    const replaced = rows.map((row, index) => ({ id: crypto.randomUUID(), submission_id: submissionId, row_order: index + 1, payload: row, created_at: now, updated_at: now }));
    write(KEYS.items, [...filtered, ...replaced]);
    appendLog(submissionId, actor, mode === 'submit' ? 'submit' : mode === 'autosave' ? 'autosave' : 'save_draft', prev, nextStatus);
    return target;
  },
  transitionSubmission(submissionId: string, actor: string, action: 'review' | 'request_revision' | 'approve' | 'lock', notes?: string) {
    const submissions = parse<MonthlyAttachmentSubmission[]>(KEYS.submissions, []);
    const target = submissions.find((x) => x.id === submissionId);
    if (!target) throw new Error('Submission tidak ditemukan.');
    const prev = target.status;
    const now = nowIso();
    if (action === 'review') {
      target.status = 'in_review'; target.reviewed_at = now;
    }
    if (action === 'request_revision') {
      target.status = 'revision_needed'; if (notes) target.review_notes = [...target.review_notes, notes];
    }
    if (action === 'approve') {
      target.status = 'approved'; target.approved_at = now;
    }
    if (action === 'lock') {
      target.status = 'locked'; target.locked_at = now;
    }
    target.updated_at = now;
    target.updated_by = actor;
    write(KEYS.submissions, submissions);
    appendLog(submissionId, actor, action, prev, target.status, notes);
    return target;
  },
  listAuditLogs(submissionId: string) {
    return this.init(), parse<MonthlyAttachmentAuditLog[]>(KEYS.logs, []).filter((x) => x.submission_id === submissionId);
  },
  storageKeys: KEYS,
};
