import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from './components/DashboardHeader';
import { KPIGrid } from './components/KPIGrid';
import { PriorityAlertsPanel } from './components/PriorityAlertPanel';
import { BorRankingChart, BorTrendChart, NationalDiseaseChart, PatientDistributionChart, SubmissionStatusChart } from './components/charts';
import { MonitoringTable } from './components/HospitalMonitoringTable';
import { QuickActionsPanel } from './components/QuickActionPanel';
import { HospitalDetailDrawer } from './components/HospitalDetailDrawer';
import { EmptyState, ErrorState, LoadingState } from './components/States';
import { FilterToolbar } from './components/FilterToolbar';
import { VerificationQueueCard } from './components/VerificationQueueCard';
import { usePuskesauDashboardData } from './hooks/usePuskesauDashboardData';
import type { DashboardFilters, HospitalDashboardRecord } from './types';

const defaultFilters: DashboardFilters = {
  periodId: '2026-Q2', query: '', submitStatus: 'all', reviewStatus: 'all', borRange: 'all', wilayah: 'all', diseaseMode: 'normalized',
};

export function DashboardPuskesauPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [selectedHospital, setSelectedHospital] = useState<HospitalDashboardRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const data = usePuskesauDashboardData(filters);

  const onExport = () => {
    const header = 'Nama RS,TT,BOR,Status Submit,Status Verifikasi,Last Update,Deadline\n';
    const rows = data.filtered.map((x) => [x.name, x.totalBeds, x.bor.toFixed(2), x.submitStatus, x.reviewStatus, x.lastSubmit ?? '-', x.deadline].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `dashboard-puskesau-${filters.periodId}.csv`);
    link.click();
  };

  const openHospitalById = (hospitalId: string) => {
    const hospital = data.rows.find((x) => x.id === hospitalId);
    if (!hospital) return;
    setSelectedHospital(hospital);
    setDrawerOpen(true);
  };

  const chartLayout = useMemo(() => (
    <section className="grid gap-3 xl:grid-cols-12">
      <div className="xl:col-span-6"><BorTrendChart data={data.charts.borTrend} /></div>
      <div className="xl:col-span-3"><SubmissionStatusChart data={data.charts.submissionStatus} /></div>
      <div className="xl:col-span-3"><VerificationQueueCard queue={data.queue} /></div>
      <div className="xl:col-span-6"><BorRankingChart data={data.charts.borRanking} /></div>
      <div className="xl:col-span-6"><PatientDistributionChart data={data.charts.patientComposition} /></div>
      <div className="xl:col-span-12"><NationalDiseaseChart data={data.charts.diseaseTop} mode={filters.diseaseMode} /></div>
    </section>
  ), [data.charts, data.queue, filters.diseaseMode]);

  if (data.isLoading) return <LoadingState />;
  if (data.error) return <ErrorState message="Gagal memuat data command center. Coba refresh." />;

  return (
    <div className="space-y-4 pb-8">
      <DashboardHeader
        periodId={filters.periodId}
        query={filters.query}
        submitStatus={filters.submitStatus}
        freshness={data.freshness}
        onPeriodChange={(periodId) => setFilters((prev) => ({ ...prev, periodId }))}
        onQueryChange={(query) => setFilters((prev) => ({ ...prev, query }))}
        onSubmitStatusChange={(submitStatus) => setFilters((prev) => ({ ...prev, submitStatus: submitStatus as any }))}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['puskesau-dashboard'] })}
        onExport={onExport}
      />

      <QuickActionsPanel />
      <KPIGrid metrics={data.metrics} freshness={data.freshness} />
      <FilterToolbar filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} wilayahOptions={data.wilayahOptions} />
      {chartLayout}

      {data.filtered.length === 0 ? <EmptyState message="Tidak ada data rumah sakit pada filter saat ini." /> : (
        <MonitoringTable data={data.filtered} onRowClick={(row) => { setSelectedHospital(row); setDrawerOpen(true); }} />
      )}

      <PriorityAlertsPanel alerts={data.priority.alerts} onOpenHospital={openHospitalById} />

      <HospitalDetailDrawer open={drawerOpen} record={selectedHospital} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export const PuskesauDashboardPage = DashboardPuskesauPage;
