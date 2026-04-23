import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from './components/DashboardHeader';
import { KPIGrid } from './components/KPIGrid';
import { PriorityAlertPanel } from './components/PriorityAlertPanel';
import { BorRankingChart, DiseaseAggregateChart, PatientCompositionChart, SubmissionStatusDonutChart } from './components/charts';
import { HospitalMonitoringTable } from './components/HospitalMonitoringTable';
import { InsightPanel } from './components/InsightPanel';
import { QuickActionPanel } from './components/QuickActionPanel';
import { HospitalDetailDrawer } from './components/HospitalDetailDrawer';
import { EmptyState, ErrorState, LoadingState } from './components/States';
import { FilterToolbar } from './components/FilterToolbar';
import { usePuskesauDashboardData } from './hooks/usePuskesauDashboardData';
import type { DashboardFilters, HospitalDashboardRecord } from './types';

const defaultFilters: DashboardFilters = {
  periodId: '2026-Q2',
  query: '',
  submitStatus: 'all',
  reviewStatus: 'all',
  borRange: 'all',
  wilayah: 'all',
  diseaseMode: 'normalized',
};

export function PuskesauDashboardPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [selectedHospital, setSelectedHospital] = useState<HospitalDashboardRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const data = usePuskesauDashboardData(filters);

  const onExport = () => {
    const header = 'Nama RS,Jenis,Tingkat,BOR,Status Submit,Deadline\n';
    const rows = data.filtered
      .map((x) => [x.name, x.jenis, x.tingkat, x.bor.toFixed(2), x.submitStatus, x.deadline].join(','))
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `dashboard-puskesau-${filters.periodId}.csv`);
    link.click();
  };

  const chartLayout = useMemo(
    () => (
      <section className="grid gap-3 xl:grid-cols-12">
        <div className="xl:col-span-6"><BorRankingChart data={data.charts.borRanking} /></div>
        <div className="xl:col-span-3"><SubmissionStatusDonutChart data={data.charts.submissionStatus} /></div>
        <div className="xl:col-span-3"><PatientCompositionChart data={data.charts.patientComposition} /></div>
        <div className="xl:col-span-12"><DiseaseAggregateChart data={data.charts.diseaseTop} /></div>
      </section>
    ),
    [data.charts],
  );

  if (data.isLoading) return <LoadingState />;
  if (data.error) return <ErrorState message="Gagal memuat data command center. Coba refresh." />;

  return (
    <div className="space-y-4 pb-8">
      <DashboardHeader
        periodId={filters.periodId}
        query={filters.query}
        submitStatus={filters.submitStatus}
        onPeriodChange={(periodId) => setFilters((prev) => ({ ...prev, periodId }))}
        onQueryChange={(query) => setFilters((prev) => ({ ...prev, query }))}
        onSubmitStatusChange={(submitStatus) => setFilters((prev) => ({ ...prev, submitStatus: submitStatus as any }))}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['puskesau-dashboard'] })}
        onExport={onExport}
      />

      <KPIGrid metrics={data.metrics} />

      <PriorityAlertPanel notSubmitted={data.priority.notSubmitted} highBor={data.priority.highBor} lowBor={data.priority.lowBor} />

      <FilterToolbar filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} wilayahOptions={data.wilayahOptions} />

      {chartLayout}

      {data.filtered.length === 0 ? (
        <EmptyState message="Tidak ada data rumah sakit pada filter saat ini." />
      ) : (
        <HospitalMonitoringTable
          data={data.filtered}
          onRowClick={(row) => {
            setSelectedHospital(row);
            setDrawerOpen(true);
          }}
        />
      )}

      <section className="grid gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2"><InsightPanel items={data.insight} /></div>
        <QuickActionPanel />
      </section>

      <HospitalDetailDrawer open={drawerOpen} record={selectedHospital} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
