type Row = Record<string, any>;
type QueryResult = { data: any[] | null; error: { message: string } | null };
type SingleQueryResult = { data: any | null; error: { message: string } | null };
type Filter = { field: string; operator: 'eq' | 'neq'; value: unknown };

const db: Record<string, Row[]> = {
  reporting_periods: [
    { id: 'period-apr-2026', label: 'Apr 2026', due_date: '2026-04-26T23:59:00.000Z', is_active: true },
    { id: 'period-mar-2026', label: 'Mar 2026', due_date: '2026-03-26T23:59:00.000Z', is_active: false },
  ],
  hospitals: [
    { id: 'rs-1', nama_rs: 'RSAU dr. Esnawan Antariksa', jenis: 'RSAU', tingkat: 'Tingkat II', wilayah: 'DKI Jakarta', kotama: 'Koops Udara I' },
    { id: 'rs-2', nama_rs: 'RSAU dr. M. Salamun', jenis: 'RSAU', tingkat: 'Tingkat II', wilayah: 'Jawa Barat', kotama: 'Koops Udara I' },
  ],
  bor_reports: [
    { id: 'bor-apr-rs1', hospital_id: 'rs-1', reporting_period_id: 'period-apr-2026', jumlah_tt: 210, nilai_bor: 87.32, status: 'draft', updated_at: '2026-04-22T05:22:00.000Z', submitted_at: null, reviewed_at: null, review_notes: null, due_date: '2026-04-26T23:59:00.000Z', review_status: 'need_attention' },
    { id: 'bor-mar-rs1', hospital_id: 'rs-1', reporting_period_id: 'period-mar-2026', jumlah_tt: 205, nilai_bor: 64.1, status: 'approved', updated_at: '2026-03-20T05:22:00.000Z', submitted_at: '2026-03-20T05:22:00.000Z', reviewed_at: '2026-03-22T08:00:00.000Z', review_notes: null, due_date: '2026-03-26T23:59:00.000Z', review_status: 'reviewed' },
  ],
  disease_reports: [
    { id: 'dis-apr-rs1', hospital_id: 'rs-1', reporting_period_id: 'period-apr-2026', status: 'draft', updated_at: '2026-04-22T05:22:00.000Z', submitted_at: null, reviewed_at: null, review_notes: null },
  ],
  disease_report_items: [
    { id: 'd-1', disease_report_id: 'dis-apr-rs1', ranking: 1, nama_penyakit_raw: 'Hipertensi', jumlah_tni: 53, jumlah_pns: 17, jumlah_kel: 38, jumlah_total: 108 },
    { id: 'd-2', disease_report_id: 'dis-apr-rs1', ranking: 2, nama_penyakit_raw: 'DM tipe 2', jumlah_tni: 21, jumlah_pns: 12, jumlah_kel: 11, jumlah_total: 44 },
  ],
  activity_logs: [],
};

function applyFilters(rows: Row[], filters: Filter[]) {
  return filters.reduce((acc, filter) => {
    if (filter.operator === 'eq') return acc.filter((row) => row[filter.field] === filter.value);
    return acc.filter((row) => row[filter.field] !== filter.value);
  }, rows);
}

function withRelations(table: string, rows: Row[]): Row[] {
  if (table !== 'bor_reports') return rows;
  return rows.map((row) => {
    const hospital = db.hospitals.find((item) => item.id === row.hospital_id);
    const disease = db.disease_reports.find((item) => item.hospital_id === row.hospital_id && item.reporting_period_id === row.reporting_period_id);
    const diseaseItems = disease ? db.disease_report_items.filter((item) => item.disease_report_id === disease.id) : [];
    const period = db.reporting_periods.find((item) => item.id === row.reporting_period_id);
    return { ...row, hospitals: hospital, disease_report_items: diseaseItems, reporting_periods: period ? { label: period.label } : null };
  });
}

class QueryBuilder {
  private filters: Filter[] = [];
  private limitCount: number | null = null;

  constructor(
    private readonly table: string,
    private readonly action: 'select' | 'update' | 'upsert' | 'insert',
    private readonly payload?: Row,
  ) {}

  eq(field: string, value: unknown) {
    this.filters.push({ field, operator: 'eq', value });
    return this;
  }

  neq(field: string, value: unknown) {
    this.filters.push({ field, operator: 'neq', value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    const asc = options?.ascending ?? true;
    db[this.table].sort((a, b) => {
      const left = String(a[field] ?? '');
      const right = String(b[field] ?? '');
      return asc ? left.localeCompare(right) : right.localeCompare(left);
    });
    return this;
  }

  limit(value: number) {
    this.limitCount = value;
    return this;
  }

  async maybeSingle(): Promise<SingleQueryResult> {
    const result = await this.execute();
    return { data: result.data?.[0] ?? null, error: result.error };
  }

  private async execute(): Promise<QueryResult> {
    const tableRows = db[this.table] ?? [];

    if (this.action === 'update') {
      const rows = applyFilters(tableRows, this.filters);
      rows.forEach((row) => Object.assign(row, this.payload, { updated_at: new Date().toISOString() }));
      return { data: rows, error: null };
    }

    if (this.action === 'upsert') {
      const payload = this.payload ?? {};
      const existing = tableRows.find((row) => row.hospital_id === payload.hospital_id && row.reporting_period_id === payload.reporting_period_id);
      if (existing) {
        Object.assign(existing, payload, { updated_at: new Date().toISOString() });
        return { data: [existing], error: null };
      }
      const insertRow = { ...payload, id: crypto.randomUUID(), updated_at: new Date().toISOString() };
      tableRows.push(insertRow);
      return { data: [insertRow], error: null };
    }


    if (this.action === 'insert') {
      const payload = this.payload ?? {};
      const insertRow = { ...payload, id: payload.id ?? crypto.randomUUID(), created_at: new Date().toISOString() };
      tableRows.push(insertRow);
      return { data: [insertRow], error: null };
    }

    const rows = withRelations(this.table, applyFilters(tableRows, this.filters));
    return { data: this.limitCount ? rows.slice(0, this.limitCount) : rows, error: null };
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const supabase = {
  from(table: string) {
    return {
      select: (_columns?: string) => new QueryBuilder(table, 'select'),
      update: (payload: Row) => new QueryBuilder(table, 'update', payload),
      upsert: (payload: Row, _options?: Row) => new QueryBuilder(table, 'upsert', payload),
      insert: (payload: Row) => new QueryBuilder(table, 'insert', payload),
    };
  },
};
