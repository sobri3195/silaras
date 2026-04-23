import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Memuat command center...</div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}</div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30"><AlertTriangle className="mb-2 h-4 w-4" />{message}</div>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500 dark:border-slate-700"><Inbox className="mx-auto mb-2 h-6 w-6" />{message}</div>;
}
