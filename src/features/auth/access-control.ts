import type { UserRole } from '@/types/domain';

export const ROLE_LABEL: Record<UserRole, string> = {
  admin_puskesau: 'Admin Puskesau',
  admin_rs: 'Admin RS',
  reviewer_kotama: 'Reviewer Kotama',
  viewer_pimpinan: 'Viewer Pimpinan',
};

export const ACCESS_CONTROL = {
  dashboardPuskesau: ['admin_puskesau', 'reviewer_kotama', 'viewer_pimpinan'],
  dashboardRs: ['admin_rs', 'admin_puskesau', 'reviewer_kotama', 'viewer_pimpinan'],
  verification: ['admin_puskesau', 'reviewer_kotama'],
  monthlyVerification: ['admin_puskesau', 'reviewer_kotama'],
  reportsBor: ['admin_rs'],
  reportsDiseases: ['admin_rs'],
  monthlyReports: ['admin_rs', 'reviewer_kotama', 'viewer_pimpinan'],
  monthlyNarrative: ['admin_rs'],
  monthlyAttachments: ['admin_rs'],
  monthlyReview: ['admin_rs', 'reviewer_kotama'],
  masterHospitals: ['admin_puskesau'],
  masterUsers: ['admin_puskesau'],
  masterPeriods: ['admin_puskesau'],
  masterReportTypes: ['admin_puskesau'],
  analytics: ['admin_puskesau', 'reviewer_kotama', 'viewer_pimpinan'],
  exports: ['admin_puskesau', 'admin_rs', 'reviewer_kotama'],
  logs: ['admin_puskesau'],
  settings: ['admin_puskesau', 'admin_rs', 'reviewer_kotama', 'viewer_pimpinan'],
} as const satisfies Record<string, readonly UserRole[]>;

export const ACCESS_SUMMARY: Record<UserRole, string[]> = {
  admin_puskesau: [
    'Dashboard Pusat & RS',
    'Verifikasi laporan',
    'Master data (RS, user, periode, report type)',
    'Analytics, export, dan user logs',
  ],
  admin_rs: [
    'Dashboard RS',
    'Input laporan BOR & penyakit',
    'Laporan bulanan (naratif/lampiran/review)',
    'Export data',
  ],
  reviewer_kotama: [
    'Dashboard Pusat & RS',
    'Verifikasi laporan harian dan bulanan',
    'Monitoring laporan bulanan',
    'Analytics & export',
  ],
  viewer_pimpinan: [
    'Dashboard Pusat & RS (read only)',
    'Lihat daftar laporan bulanan',
    'Analytics (read only)',
  ],
};

export function hasAccess(role: UserRole, allowed: readonly UserRole[]) {
  return allowed.includes(role);
}
