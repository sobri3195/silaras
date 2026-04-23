import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage, ProtectedRoute, RoleGuard } from '@/features/auth/auth';
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

function Shell({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/puskesau" element={<Navigate to="/dashboard/puskesau" replace />} />
      <Route path="/rs" element={<Navigate to="/dashboard/rs" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard/puskesau" replace />} />
        <Route path="/dashboard/puskesau" element={<Shell><PuskesauDashboardPage /></Shell>} />
        <Route path="/dashboard/rs" element={<Shell><RsDashboardPage /></Shell>} />
        <Route path="/reports/bor" element={<Shell><BorFormPage /></Shell>} />
        <Route path="/reports/diseases" element={<Shell><DiseaseFormPage /></Shell>} />
        <Route path="/reports/monthly" element={<Shell><MonthlyReportsListPage /></Shell>} />
        <Route path="/reports/monthly/narrative" element={<Shell><MonthlyNarrativePage /></Shell>} />
        <Route path="/reports/monthly/attachments" element={<Shell><MonthlyAttachmentsPage /></Shell>} />
        <Route path="/reports/monthly/attachments/:code" element={<Shell><MonthlyAttachmentDetailPage /></Shell>} />
        <Route path="/reports/monthly/review" element={<Shell><MonthlyReviewPage /></Shell>} />
        <Route path="/reports/monthly/preview/:submissionId" element={<Shell><MonthlyPreviewPage /></Shell>} />
        <Route path="/reports/monthly/:reportTypeCode" element={<Shell><MonthlyReportFormPage /></Shell>} />
        <Route path="/reports/monthly/:reportTypeCode/:submissionId" element={<Shell><MonthlySubmissionDetailPage /></Shell>} />
        <Route path="/reports/:hospitalId/:periodId" element={<Shell><ReportDetailPage /></Shell>} />
        <Route element={<RoleGuard allow={['admin_puskesau', 'reviewer_kotama']} />}>
          <Route path="/verification" element={<Shell><VerificationPage /></Shell>} />
          <Route path="/verification/monthly" element={<Shell><MonthlyVerificationPage /></Shell>} />
          <Route path="/master/hospitals" element={<Shell><HospitalsMasterPage /></Shell>} />
          <Route path="/master/users" element={<Shell><UsersMasterPage /></Shell>} />
          <Route path="/master/periods" element={<Shell><PeriodsMasterPage /></Shell>} />
          <Route path="/master/report-types" element={<Shell><ReportTypesMasterPage /></Shell>} />
        </Route>
        <Route path="/analytics" element={<Shell><AnalyticsPage /></Shell>} />
        <Route path="/settings" element={<Shell><SettingsPage /></Shell>} />
        <Route path="/exports" element={<Shell><ExportsPage /></Shell>} />
        <Route path="/logs" element={<Shell><UserLogsPage /></Shell>} />
      </Route>
    </Routes>
  );
}
