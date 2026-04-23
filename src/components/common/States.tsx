export const LoadingState = () => <div className="rounded-2xl border bg-white p-6">Memuat data...</div>;
export const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700">{message}</div>
);
export const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed p-6 text-slate-500">{message}</div>
);
