import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useMemo } from 'react';

const schema = z.object({
  jumlah_tt: z.coerce.number().int().positive(),
  nilai_bor: z.coerce.number().min(0).max(100),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
const BOR_DRAFT_STORAGE_KEY = 'silaras:bor-draft';
const borDefaultValues: FormValues = { jumlah_tt: 120, nilai_bor: 53, notes: '' };

export function BorFormPage() {
  const storageDefaultValues = useMemo(() => {
    const storedDraft = localStorage.getItem(BOR_DRAFT_STORAGE_KEY);
    if (!storedDraft) return borDefaultValues;

    try {
      const parsedDraft = schema.parse(JSON.parse(storedDraft));
      return parsedDraft;
    } catch {
      localStorage.removeItem(BOR_DRAFT_STORAGE_KEY);
      return borDefaultValues;
    }
  }, []);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: storageDefaultValues });
  const onSubmit = (values: FormValues) => {
    localStorage.setItem(BOR_DRAFT_STORAGE_KEY, JSON.stringify(values));
    alert('Draft BOR tersimpan ke localStorage.');
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Form BOR</h3>
        <StatusBadge status="draft" />
      </div>
      <label className="block text-sm">Jumlah TT<input className="mt-1 w-full rounded-xl border p-2" {...form.register('jumlah_tt')} /></label>
      <label className="block text-sm">Nilai BOR (%)<input className="mt-1 w-full rounded-xl border p-2" {...form.register('nilai_bor')} /></label>
      <label className="block text-sm">Catatan<textarea className="mt-1 w-full rounded-xl border p-2" rows={3} {...form.register('notes')} /></label>
      <button className="rounded-xl bg-primary px-4 py-2 text-white">Simpan Draft</button>
    </form>
  );
}
