import { Activity, BellRing, CalendarClock, ClipboardCheck, TrendingDown } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { KPIStatCard } from '@/components/common/KPIStatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { rsBorHistory, rsNotifications, rsTasks } from './mock-data';

export function RsDashboardPage() {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-4">
        <KPIStatCard title="BOR Maret 2026" value="53.6%" icon={Activity} />
        <KPIStatCard title="Status Laporan" value="1 Revisi" icon={ClipboardCheck} />
        <KPIStatCard title="Deadline Terdekat" value="26 Apr" icon={CalendarClock} />
        <KPIStatCard title="Tren BOR" value="Menurun" icon={TrendingDown} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h3 className="mb-2 text-lg font-semibold">RSAU dr. Esnawan Antariksa</h3>
          <p className="mb-4 text-sm text-slate-500">Periode aktif: TW I 2026 (deadline 30 April 2026)</p>
          <div className="space-y-3">
            {rsTasks.map((task) => (
              <div key={task.name} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{task.name}</span>
                  <StatusBadge status={task.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">PIC: {task.owner}</p>
                <p className="text-xs text-slate-400">Jatuh tempo: {task.dueDate}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <BellRing size={16} />
            Notifikasi Terbaru
          </h3>
          <div className="space-y-3 text-sm">
            {rsNotifications.map((item) => (
              <div key={item.title} className="rounded-lg border p-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                <p className="mt-1 text-xs text-slate-400">{item.time}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 font-semibold">Riwayat BOR RS (Okt 2025 - Mar 2026)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rsBorHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[45, 65]} unit="%" />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Line type="monotone" dataKey="bor" stroke="#1e3a70" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
