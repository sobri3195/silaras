import { ReportStatus } from '@/types/domain';

export type ReviewStatus = 'pending' | 'reviewed' | 'need_attention';
export type BorRisk = 'critical' | 'warning' | 'normal' | 'low';

export interface DiseaseReportItem {
  name: string;
  normalizedName?: string;
  tni: number;
  pns: number;
  kel: number;
  total: number;
}

export interface HospitalDashboardRecord {
  id: string;
  name: string;
  jenis: string;
  tingkat: string;
  wilayah?: string;
  kotama?: string;
  totalBeds: number;
  bor: number;
  submitStatus: ReportStatus;
  reviewStatus: ReviewStatus;
  diseaseStatus: 'ok' | 'needs_normalization' | 'missing';
  lastSubmit: string | null;
  deadline: string;
  dueDate: string;
  patientComposition: {
    tni: number;
    pns: number;
    kel: number;
  };
  diseaseItems: DiseaseReportItem[];
}

export interface DashboardFilters {
  periodId: string;
  query: string;
  submitStatus: 'all' | ReportStatus;
  reviewStatus: 'all' | ReviewStatus;
  borRange: 'all' | 'critical' | 'warning' | 'normal' | 'low';
  wilayah: 'all' | string;
  diseaseMode: 'normalized' | 'raw';
}
