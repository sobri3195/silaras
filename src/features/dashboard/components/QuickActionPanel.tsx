import { Button } from '@/components/ui/button';

export function QuickActionPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 font-semibold">Quick Actions</h3>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        <Button variant="outline">Lihat unit belum submit</Button>
        <Button variant="outline">Lihat unit perlu revisi</Button>
        <Button variant="outline">Buka export center</Button>
        <Button variant="outline">Buka analytics lengkap</Button>
        <Button variant="outline">Buka master periode</Button>
      </div>
    </section>
  );
}
