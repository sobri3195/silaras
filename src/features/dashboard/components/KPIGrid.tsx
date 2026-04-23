import { AlertTriangle, Bed, Building2, CheckCircle2, ShieldAlert, Timer } from 'lucide-react';
import { KPIStatCard } from './KPIStatCard';

export function KPIGrid({ metrics, freshness }: { metrics: any; freshness: { lastSync: string; activePeriod: string } }) {
  const updateLabel = new Date(freshness.lastSync).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <KPIStatCard icon={Building2} title="Total RS" value={metrics.totalHospitals.toLocaleString('id-ID')} subtext="Unit aktif nasional" meta={`Periode ${freshness.activePeriod}`} />
      <KPIStatCard icon={CheckCircle2} title="Sudah Submit" value={metrics.submittedCount.toLocaleString('id-ID')} subtext="+6% dibanding periode lalu" meta={`Update ${updateLabel}`} tone="success" />
      <KPIStatCard icon={Timer} title="Belum Submit" value={metrics.notSubmittedCount.toLocaleString('id-ID')} subtext="Perlu follow-up verifikasi" meta="Target 0 sebelum deadline" tone="warning" />
      <KPIStatCard icon={Bed} title="Rata-rata BOR" value={`${metrics.avgBor.toFixed(2)}%`} subtext="Benchmark nasional 60-85%" meta="Threshold operasional" />
      <KPIStatCard icon={ShieldAlert} title="Butuh Perhatian" value={metrics.needsAttention.toLocaleString('id-ID')} subtext="BOR kritis / review attention" meta="Prioritas tindak cepat" tone="danger" />
      <KPIStatCard icon={AlertTriangle} title="Overdue" value={metrics.overdueCount.toLocaleString('id-ID')} subtext="Melewati tenggat submit" meta="Eskalasikan ke kotama" tone="danger" />
    </section>
  );
}
