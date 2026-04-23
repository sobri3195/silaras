import { AlertTriangle, Bed, Building2, CheckCircle2, Timer } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { KPIStatCard } from '@/components/common/KPIStatCard';
import { composition, hospitals, monthlyBorTrend, puskesauAlerts, submissionStatus } from './mock-data';

export function PuskesauDashboardPage() {
  const borData = hospitals
    .map(([name, bor]) => ({ name, bor }))
    .sort((a, b) => b.bor - a.bor);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-5">
        <KPIStatCard title="Total RS" value="18" icon={Building2} />
        <KPIStatCard title="Sudah Submit" value="14" icon={CheckCircle2} />
        <KPIStatCard title="Belum Submit" value="2" icon={Timer} />
        <KPIStatCard title="Rata-rata BOR" value="49.8%" icon={Bed} />
        <KPIStatCard title="Butuh Perhatian" value="3" icon={AlertTriangle} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
          <h3 className="mb-4 font-semibold">Tren BOR Nasional RS TNI AU (6 bulan)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBorTrend}>
                <defs>
                  <linearGradient id="borGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a70" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e3a70" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" fill="none" name="Target" />
                <Area type="monotone" dataKey="bor" stroke="#1e3a70" fill="url(#borGradient)" name="BOR Aktual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 font-semibold">Status Pengumpulan Laporan</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={submissionStatus} dataKey="value" nameKey="name" outerRadius={100}>
                  {submissionStatus.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 font-semibold">Ranking BOR Rumah Sakit</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={borData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="bor" fill="#1e3a70" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 font-semibold">Distribusi Pasien</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={composition} dataKey="value" nameKey="name" outerRadius={100}>
                  {composition.map((_, i) => (
                    <Cell key={i} fill={['#1e3a70', '#0ea5e9', '#10b981', '#f59e0b'][i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 font-semibold">Peringatan Prioritas</h3>
        <div className="space-y-3">
          {puskesauAlerts.map((alert) => (
            <article key={alert.hospital} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/20">
              <p className="font-medium text-slate-900 dark:text-slate-100">{alert.hospital}</p>
              <p className="text-slate-600 dark:text-slate-300">{alert.issue}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">{alert.severity}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
