import type { UserRole } from '@/types/domain';

export const ROLE_LABEL: Record<UserRole, string> = {
  admin_pusat: 'Admin Pusat',
  admin_rs: 'Admin RS',
};

export const ACCESS_CONTROL = {
  dashboardPusat: ['admin_pusat'],
  dashboardRs: ['admin_rs', 'admin_pusat'],
  verification: ['admin_pusat'],
  monthlyVerification: ['admin_pusat'],
  reportsBor: ['admin_rs'],
  reportsDiseases: ['admin_rs'],
  monthlyReports: ['admin_rs', 'admin_pusat'],
  monthlyNarrative: ['admin_rs'],
  monthlyAttachments: ['admin_rs'],
  monthlyReview: ['admin_pusat'],
  masterHospitals: ['admin_pusat'],
  masterUsers: ['admin_pusat'],
  masterPeriods: ['admin_pusat'],
  masterReportTypes: ['admin_pusat'],
  analytics: ['admin_pusat'],
  exports: ['admin_pusat'],
  logs: ['admin_pusat'],
  settings: ['admin_pusat', 'admin_rs'],
} as const satisfies Record<string, readonly UserRole[]>;

export const ACCESS_SUMMARY: Record<UserRole, string[]> = {
  admin_pusat: [
    'Dashboard pusat lintas RS',
    'Monitoring, review, revisi, approve, lock',
    'Kelola master data, export, dan audit log',
  ],
  admin_rs: [
    'Login dan akses sesuai RS sendiri',
    'Input laporan RS sendiri',
    'Edit draft/revisi, tanpa approve/lock/master data',
  ],
};

export function hasAccess(role: UserRole, allowed: readonly UserRole[]) {
  return allowed.includes(role);
}
