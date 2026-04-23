import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ForbiddenPage, HospitalScopeGuard, LoginPage, ProtectedRoute, RoleGuard, UnauthorizedPage } from '@/features/auth/auth';
import { PuskesauDashboardPage } from '@/features/dashboard/PuskesauDashboardPage';
import { RsDashboardPage } from '@/features/dashboard/RsDashboardPage';
import { BorFormPage } from '@/features/bor/BorFormPage';
import { DiseaseFormPage } from '@/features/diseases/DiseaseFormPage';
import { VerificationPage } from '@/features/review/VerificationPage';
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage';
import { HospitalsMasterPage, PeriodsMasterPage, SettingsPage, UsersMasterPage } from '@/features/master-data/MasterPages';
import { UserLogsPage } from '@/features/master-data/UserLogsPage';
import { ExportsPage } from '@/features/dashboard/ExportsPage';
import { ReportDetailPage } from '@/features/review/ReportDetailPage';
import { MonthlyReportsListPage } from '@/features/reports/monthly/MonthlyReportsListPage';
import { MonthlyReportFormPage } from '@/features/reports/monthly/MonthlyReportFormPage';
import { MonthlySubmissionDetailPage } from '@/features/reports/monthly/MonthlySubmissionDetailPage';
import { MonthlyVerificationPage } from '@/features/reports/monthly/MonthlyVerificationPage';
import { ReportTypesMasterPage } from '@/features/reports/monthly/ReportTypesMasterPage';
import { MonthlyNarrativePage } from '@/features/reports/monthly-health/MonthlyNarrativePage';
import { MonthlyAttachmentsPage } from '@/features/reports/monthly-health/MonthlyAttachmentsPage';
import { MonthlyAttachmentDetailPage } from '@/features/reports/monthly-health/MonthlyAttachmentDetailPage';
import { MonthlyReviewPage } from '@/features/reports/monthly-health/MonthlyReviewPage';
import { MonthlyPreviewPage } from '@/features/reports/monthly-health/MonthlyPreviewPage';
import { ACCESS_CONTROL } from '@/features/auth/access-control';

function Shell({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Shell><UnauthorizedPage /></Shell>} />
      <Route path="/forbidden" element={<Shell><ForbiddenPage /></Shell>} />
      <Route path="/pusat" element={<Navigate to="/dashboard/pusat" replace />} />
      <Route path="/rs" element={<Navigate to="/dashboard/rs" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard/rs" replace />} />
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.dashboardPusat]} />}>
          <Route path="/dashboard/pusat" element={<Shell><PuskesauDashboardPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.dashboardRs]} />}>
          <Route path="/dashboard/rs" element={<Shell><RsDashboardPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.reportsBor]} />}>
          <Route path="/reports/bor" element={<Shell><BorFormPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.reportsDiseases]} />}>
          <Route path="/reports/diseases" element={<Shell><DiseaseFormPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.monthlyReports]} />}>
          <Route path="/reports/monthly" element={<Shell><MonthlyReportsListPage /></Shell>} />
          <Route path="/reports/monthly/preview/:submissionId" element={<Shell><MonthlyPreviewPage /></Shell>} />
          <Route path="/reports/monthly/:reportTypeCode" element={<Shell><MonthlyReportFormPage /></Shell>} />
          <Route element={<HospitalScopeGuard />}>
            <Route path="/reports/monthly/:reportTypeCode/:submissionId" element={<Shell><MonthlySubmissionDetailPage /></Shell>} />
          </Route>
          <Route element={<HospitalScopeGuard />}>
            <Route path="/reports/:hospitalId/:periodId" element={<Shell><ReportDetailPage /></Shell>} />
          </Route>
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.monthlyNarrative]} />}>
          <Route path="/reports/monthly/narrative" element={<Shell><MonthlyNarrativePage /></Shell>} />
          <Route path="/reports/monthly/attachments" element={<Shell><MonthlyAttachmentsPage /></Shell>} />
          <Route path="/reports/monthly/attachments/:code" element={<Shell><MonthlyAttachmentDetailPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.monthlyReview]} />}>
          <Route path="/reports/monthly/review" element={<Shell><MonthlyReviewPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.verification]} />}>
          <Route path="/verification" element={<Shell><VerificationPage /></Shell>} />
          <Route path="/verification/monthly" element={<Shell><MonthlyVerificationPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.masterHospitals]} />}>
          <Route path="/master/hospitals" element={<Shell><HospitalsMasterPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.masterUsers]} />}>
          <Route path="/master/users" element={<Shell><UsersMasterPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.masterPeriods]} />}>
          <Route path="/master/periods" element={<Shell><PeriodsMasterPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.masterReportTypes]} />}>
          <Route path="/master/report-types" element={<Shell><ReportTypesMasterPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.analytics]} />}>
          <Route path="/analytics" element={<Shell><AnalyticsPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.settings]} />}>
          <Route path="/settings" element={<Shell><SettingsPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.exports]} />}>
          <Route path="/exports" element={<Shell><ExportsPage /></Shell>} />
        </Route>
        <Route element={<RoleGuard allow={[...ACCESS_CONTROL.logs]} />}>
          <Route path="/logs" element={<Shell><UserLogsPage /></Shell>} />
        </Route>
      </Route>
    </Routes>
  );
}
