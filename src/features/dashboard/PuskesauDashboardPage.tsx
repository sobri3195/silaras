import { AlertTriangle, Bed, Building2, CheckCircle2, Timer } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { KPIStatCard } from '@/components/common/KPIStatCard';
import { hospitals, composition } from './mock-data';

export function PuskesauDashboardPage() {
  const borData = hospitals.map(([name, bor]) => ({ name, bor }));
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-5">
        <KPIStatCard title="Total RS" value="18" icon={Building2} />
        <KPIStatCard title="Sudah Submit" value="14" icon={CheckCircle2} />
        <KPIStatCard title="Belum Submit" value="4" icon={Timer} />
        <KPIStatCard title="Rata-rata BOR" value="37.65%" icon={Bed} />
        <KPIStatCard title="Butuh Perhatian" value="3" icon={AlertTriangle} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 font-semibold">Ranking BOR Rumah Sakit</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={borData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
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
                    <Cell key={i} fill={['#1e3a70', '#0ea5e9', '#10b981'][i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
