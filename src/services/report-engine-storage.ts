import type {
  GenericReportAuditLog,
  GenericReportItem,
  GenericReportSubmission,
  ReportSubmissionStatus,
  ReportTemplate,
  ReportType,
} from '@/types/report-engine';

const LS_KEYS = {
  reportTypes: 'silaras_report_types',
  templates: 'silaras_report_templates',
  submissions: 'silaras_report_submissions',
  items: 'silaras_report_items',
  audit: 'silaras_report_audit_logs',
  periods: 'silaras_reporting_periods',
};

interface ReportingPeriod {
  id: string;
  label: string;
  month: number;
  year: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

const monthlyCatalog = [
  ['monthly_outpatient_disease', 'Laporan Bulanan Macam Penyakit / Jumlah Penyakit Rawat Jalan'],
  ['monthly_outpatient_service', 'Laporan Bulanan Pelayanan Rawat Jalan'],
  ['monthly_inpatient_service', 'Laporan Bulanan Pelayanan Rawat Inap'],
  ['monthly_death_count', 'Laporan Bulanan Jumlah Kematian'],
  ['monthly_maternal_birth_death', 'Laporan Bulanan Jumlah Kelahiran dan Kematian Ibu'],
  ['monthly_family_planning', 'Laporan Bulanan Data Keluarga Berencana'],
  ['monthly_tbc_control', 'Laporan Bulanan Pemberantasan Penyakit TBC'],
  ['monthly_dental_visit', 'Laporan Bulanan Kunjungan dan Pengunjung Poli Gigi'],
  ['monthly_oral_cases', 'Laporan Bulanan Kasus Penyakit Gigi dan Mulut'],
  ['monthly_oral_treatment', 'Laporan Bulanan Jumlah Pengobatan Penyakit Gigi dan Mulut'],
  ['monthly_sanitation', 'Laporan Bulanan Sanitasi Lingkungan'],
  ['monthly_treatment_room', 'Laporan Bulanan Ruang Tindakan'],
  ['monthly_hiv_cases', 'Laporan Bulanan Jumlah Kasus HIV/AIDS'],
  ['monthly_prescription_received', 'Laporan Bulanan Jumlah Penerimaan Resep'],
  ['monthly_lost_workday', 'Laporan Bulanan Jumlah Kehilangan Hari Kerja'],
  ['monthly_health_screening', 'Laporan Bulanan Uji Kesehatan'],
  ['monthly_health_personnel', 'Laporan Bulanan Data Personel Kesehatan'],
  ['monthly_malaria_cases', 'Laporan Bulanan Jumlah Kasus Malaria'],
] as const;

function nowIso() {
  return new Date().toISOString();
}

function createTemplate(reportTypeId: string, title: string): ReportTemplate {
  const isChecklist = title.toLowerCase().includes('sanitasi');
  const isPersonnel = title.toLowerCase().includes('personel');
  const baseColumns = isPersonnel
    ? [
        { key: 'jabatan', label: 'Jabatan', type: 'text' as const, validation: { required: true } },
        { key: 'jumlah_pria', label: 'Jumlah Pria', type: 'number' as const, validation: { min: 0, noNegative: true } },
        { key: 'jumlah_wanita', label: 'Jumlah Wanita', type: 'number' as const, validation: { min: 0, noNegative: true } },
        {
          key: 'jumlah_total',
          label: 'Jumlah Total',
          type: 'calculated' as const,
          computed_from: ['jumlah_pria', 'jumlah_wanita'],
          validation: { noNegative: true },
        },
      ]
    : [
        { key: 'indikator', label: 'Indikator', type: 'text' as const, validation: { required: true } },
        { key: 'laki_laki', label: 'Laki-laki', type: 'number' as const, validation: { min: 0, noNegative: true } },
        { key: 'perempuan', label: 'Perempuan', type: 'number' as const, validation: { min: 0, noNegative: true } },
        {
          key: 'total',
          label: 'Total',
          type: 'calculated' as const,
          computed_from: ['laki_laki', 'perempuan'],
          validation: { noNegative: true },
        },
      ];

  return {
    id: `tpl-${reportTypeId}`,
    report_type_id: reportTypeId,
    version: 1,
    schema: {
      sections: [
        {
          id: 'ringkasan',
          title: 'Ringkasan Laporan',
          description: `Ringkasan utama untuk ${title}`,
          fields: [
            { key: 'periode_catatan', label: 'Catatan Periode', type: 'textarea', validation: { required: true } },
            { key: 'petugas_pj', label: 'Penanggung Jawab', type: 'text', validation: { required: true } },
            { key: 'tanggal_input', label: 'Tanggal Input', type: 'date', validation: { required: true } },
            ...(isChecklist
              ? [
                  {
                    key: 'status_sanitasi',
                    label: 'Status Sanitasi',
                    type: 'radio' as const,
                    options: ['Baik', 'Cukup', 'Perlu Tindakan'],
                    validation: { required: true },
                  },
                ]
              : []),
          ],
        },
        {
          id: 'tabel_utama',
          title: 'Tabel Rincian',
          repeatable_rows: true,
          columns: baseColumns,
          summary_rules: ['total = laki_laki + perempuan', 'nilai tidak boleh negatif'],
        },
        {
          id: 'catatan',
          title: 'Catatan Review Internal',
          fields: [{ key: 'notes', label: 'Catatan Tambahan', type: 'notes' }],
        },
      ],
    },
    created_at: nowIso(),
    updated_at: nowIso(),
  };
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

function ensurePeriod() {
  const existing = parse<ReportingPeriod[]>(LS_KEYS.periods, []);
  if (existing.length > 0) return existing;
  const active: ReportingPeriod = {
    id: 'period-2026-04',
    label: 'April 2026',
    month: 4,
    year: 2026,
    is_active: true,
    start_date: '2026-04-01',
    end_date: '2026-04-30',
  };
  write(LS_KEYS.periods, [active]);
  return [active];
}

function seed() {
  if (parse<ReportType[]>(LS_KEYS.reportTypes, []).length > 0) return;
  const now = nowIso();
  const reportTypes: ReportType[] = monthlyCatalog.map(([code, title], index) => ({
    id: `rt-${code}`,
    code,
    title,
    description: `${title} untuk kebutuhan monitoring bulanan rumah sakit/faskes.`,
    category: 'pelayanan_kesehatan',
    frequency: 'bulanan',
    is_tabular: true,
    is_active: true,
    needs_summary: true,
    supports_review: true,
    due_day_of_month: 5,
    restricted_hospital_ids: index % 6 === 0 ? ['RS-001'] : undefined,
    created_at: now,
    updated_at: now,
  }));

  const templates = reportTypes.map((rt) => createTemplate(rt.id, rt.title));
  const [period] = ensurePeriod();
  const hospitalId = localStorage.getItem('silaras_hospital_id') ?? 'RS-001';
  localStorage.setItem('silaras_hospital_id', hospitalId);

  const starterStatuses: ReportSubmissionStatus[] = ['draft', 'submitted', 'revision_needed', 'approved'];
  const submissions: GenericReportSubmission[] = reportTypes.slice(0, 4).map((rt, index) => ({
    id: `sub-${rt.id}-${period.id}`,
    report_type_id: rt.id,
    hospital_id: hospitalId,
    reporting_period_id: period.id,
    status: starterStatuses[index],
    review_notes: index === 2 ? ['Mohon rapikan total laki-laki/perempuan pada baris 3.'] : [],
    created_by: 'admin_rs',
    updated_by: 'admin_rs',
    submitted_at: index >= 1 ? now : null,
    approved_at: index === 3 ? now : null,
    locked_at: null,
    due_date: '2026-05-05',
    created_at: now,
    updated_at: now,
  }));

  const items: GenericReportItem[] = submissions.flatMap((sub) => [
    {
      id: `item-${sub.id}-1`,
      submission_id: sub.id,
      row_order: 1,
      payload: { indikator: 'Kasus Baru', laki_laki: 10, perempuan: 9, total: 19 },
      created_at: now,
      updated_at: now,
    },
    {
      id: `item-${sub.id}-2`,
      submission_id: sub.id,
      row_order: 2,
      payload: { indikator: 'Kontrol', laki_laki: 16, perempuan: 18, total: 34 },
      created_at: now,
      updated_at: now,
    },
  ]);

  const auditLogs: GenericReportAuditLog[] = submissions.map((sub) => ({
    id: `audit-${sub.id}`,
    submission_id: sub.id,
    action: sub.status === 'draft' ? 'save_draft' : sub.status === 'submitted' ? 'submit' : sub.status === 'revision_needed' ? 'request_revision' : 'approve',
    actor: 'system_seed',
    next_status: sub.status,
    created_at: now,
  }));

  write(LS_KEYS.reportTypes, reportTypes);
  write(LS_KEYS.templates, templates);
  write(LS_KEYS.submissions, submissions);
  write(LS_KEYS.items, items);
  write(LS_KEYS.audit, auditLogs);
}

export const reportEngineStorage = {
  init() {
    ensurePeriod();
    seed();
  },
  listPeriods() {
    return parse<ReportingPeriod[]>(LS_KEYS.periods, []);
  },
  getActivePeriod() {
    return this.listPeriods().find((x) => x.is_active) ?? null;
  },
  listReportTypes() {
    this.init();
    return parse<ReportType[]>(LS_KEYS.reportTypes, []);
  },
  saveReportTypes(types: ReportType[]) {
    write(LS_KEYS.reportTypes, types);
  },
  listTemplates() {
    this.init();
    return parse<ReportTemplate[]>(LS_KEYS.templates, []);
  },
  getTemplateByReportTypeId(reportTypeId: string) {
    return this.listTemplates().find((x) => x.report_type_id === reportTypeId) ?? null;
  },
  listSubmissions() {
    this.init();
    return parse<GenericReportSubmission[]>(LS_KEYS.submissions, []);
  },
  listItems() {
    this.init();
    return parse<GenericReportItem[]>(LS_KEYS.items, []);
  },
  listAuditLogs() {
    this.init();
    return parse<GenericReportAuditLog[]>(LS_KEYS.audit, []);
  },
  upsertSubmission(submission: GenericReportSubmission) {
    const all = this.listSubmissions();
    const idx = all.findIndex((x) => x.id === submission.id);
    if (idx >= 0) all[idx] = submission;
    else all.push(submission);
    write(LS_KEYS.submissions, all);
  },
  replaceItems(submissionId: string, rows: GenericReportItem[]) {
    const all = this.listItems().filter((x) => x.submission_id !== submissionId).concat(rows);
    write(LS_KEYS.items, all);
  },
  appendAudit(log: GenericReportAuditLog) {
    const all = this.listAuditLogs();
    all.push(log);
    write(LS_KEYS.audit, all);
  },
  resetTemplates() {
    localStorage.removeItem(LS_KEYS.reportTypes);
    localStorage.removeItem(LS_KEYS.templates);
    seed();
  },
  resetSubmissions() {
    localStorage.removeItem(LS_KEYS.submissions);
    localStorage.removeItem(LS_KEYS.items);
    localStorage.removeItem(LS_KEYS.audit);
    seed();
  },
  exportJson() {
    this.init();
    return JSON.stringify(
      {
        reportTypes: this.listReportTypes(),
        templates: this.listTemplates(),
        submissions: this.listSubmissions(),
        items: this.listItems(),
        auditLogs: this.listAuditLogs(),
        periods: this.listPeriods(),
      },
      null,
      2,
    );
  },
  importJson(payload: string) {
    const parsed = JSON.parse(payload) as {
      reportTypes: ReportType[];
      templates: ReportTemplate[];
      submissions: GenericReportSubmission[];
      items: GenericReportItem[];
      auditLogs: GenericReportAuditLog[];
      periods?: ReportingPeriod[];
    };
    write(LS_KEYS.reportTypes, parsed.reportTypes ?? []);
    write(LS_KEYS.templates, parsed.templates ?? []);
    write(LS_KEYS.submissions, parsed.submissions ?? []);
    write(LS_KEYS.items, parsed.items ?? []);
    write(LS_KEYS.audit, parsed.auditLogs ?? []);
    if (parsed.periods) write(LS_KEYS.periods, parsed.periods);
  },
  storageKeys: LS_KEYS,
};
