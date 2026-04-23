export type UserRole = 'admin_puskesau' | 'admin_rs' | 'reviewer_kotama' | 'viewer_pimpinan';
export type ReportStatus = 'draft' | 'submitted' | 'revision_needed' | 'approved' | 'locked';

export interface Hospital {
  id: string;
  kode_rs: string;
  nama_rs: string;
  wilayah?: string | null;
}

export interface BorReport {
  id: string;
  hospital_id: string;
  reporting_period_id: string;
  jumlah_tt: number;
  nilai_bor: number;
  status: ReportStatus;
}

export interface DiseaseItem {
  ranking: number;
  nama_penyakit_raw: string;
  jumlah_tni: number;
  jumlah_pns: number;
  jumlah_kel: number;
  jumlah_total: number;
}
