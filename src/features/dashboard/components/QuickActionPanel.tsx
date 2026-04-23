import { BarChart3, ClipboardCheck, FileSpreadsheet, Siren, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { label: 'Lihat RS belum submit', icon: Siren },
  { label: 'Buka antrian verifikasi', icon: ClipboardCheck },
  { label: 'Lihat RS prioritas tinggi', icon: TriangleAlert },
  { label: 'Export rekap', icon: FileSpreadsheet },
  { label: 'Buka analytics lengkap', icon: BarChart3 },
];

export function QuickActionsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 font-semibold text-[#0E254A] dark:text-cyan-300">Quick Actions</h3>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {actions.map((action) => (
          <Button key={action.label} variant="outline" className="justify-start gap-2 rounded-xl">
            <action.icon className="h-4 w-4" />{action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
