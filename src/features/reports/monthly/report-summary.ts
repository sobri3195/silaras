import { reportEngineStorage } from '@/services/report-engine-storage';

export function getMonthlySummary(hospitalId?: string) {
  reportEngineStorage.init();
  const period = reportEngineStorage.getActivePeriod();
  const types = reportEngineStorage.listReportTypes().filter((x) => x.is_active);
  const submissions = reportEngineStorage
    .listSubmissions()
    .filter((x) => x.reporting_period_id === period?.id)
    .filter((x) => !hospitalId || x.hospital_id === hospitalId);

  const countStatus = (status: string) => submissions.filter((x) => x.status === status).length;
  const lateType = types[0]?.title ?? '-';
  return {
    wajib: types.length,
    masuk: countStatus('submitted') + countStatus('approved') + countStatus('locked'),
    belumMasuk: Math.max(types.length - submissions.length, 0),
    revisi: countStatus('revision_needed'),
    approved: countStatus('approved'),
    locked: countStatus('locked'),
    draft: countStatus('draft'),
    jenisPalingTerlambat: lateType,
    rumahSakitPalingTerlambat: 'RSAU Demo',
  };
}
