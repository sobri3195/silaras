import { Activity, AlertTriangle, Bed, Building2, CheckCircle2, ClipboardList, Timer, TrendingDown, TrendingUp } from 'lucide-react';
import { KPIStatCard } from './KPIStatCard';

export function KPIGrid({ metrics }: { metrics: any }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
      <KPIStatCard icon={Building2} title="Total Rumah Sakit" value={metrics.totalHospitals.toLocaleString('id-ID')} note="Unit aktif terdaftar" />
      <KPIStatCard icon={CheckCircle2} title="Sudah Submit" value={metrics.submittedCount.toLocaleString('id-ID')} note="Termasuk approved/locked" tone="success" />
      <KPIStatCard icon={Timer} title="Belum Submit" value={metrics.notSubmittedCount.toLocaleString('id-ID')} note="Perlu follow up" tone="warning" />
      <KPIStatCard icon={AlertTriangle} title="Overdue" value={metrics.overdueCount.toLocaleString('id-ID')} note="Melewati tenggat" tone="danger" />
      <KPIStatCard icon={Bed} title="Rata-rata BOR" value={`${metrics.avgBor.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} note="Nasional seluruh RS" />
      <KPIStatCard icon={TrendingUp} title="BOR Tertinggi" value={`${(metrics.highestBor?.bor ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} note={metrics.highestBor?.name ?? '-'} tone="danger" />
      <KPIStatCard icon={TrendingDown} title="BOR Terendah" value={`${(metrics.lowestBor?.bor ?? 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} note={metrics.lowestBor?.name ?? '-'} tone="warning" />
      <KPIStatCard icon={ClipboardList} title="Total Kasus Penyakit" value={metrics.totalDiseaseCases.toLocaleString('id-ID')} note="Akumulasi top 10" />
    </section>
  );
}
