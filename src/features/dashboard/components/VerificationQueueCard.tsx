import { ClipboardCheck, FileClock, FilePenLine, Lock } from 'lucide-react';

export function VerificationQueueCard({ queue }: { queue: { menungguReview: number; perluRevisi: number; sudahApproved: number; locked: number } }) {
  const items = [
    { label: 'Menunggu Review', value: queue.menungguReview, icon: FileClock, tone: 'text-blue-600' },
    { label: 'Perlu Revisi', value: queue.perluRevisi, icon: FilePenLine, tone: 'text-amber-600' },
    { label: 'Sudah Approved', value: queue.sudahApproved, icon: ClipboardCheck, tone: 'text-emerald-600' },
    { label: 'Locked', value: queue.locked, icon: Lock, tone: 'text-slate-600' },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 font-semibold">Queue Verifikasi</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm"><item.icon className={`h-4 w-4 ${item.tone}`} />{item.label}</div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
