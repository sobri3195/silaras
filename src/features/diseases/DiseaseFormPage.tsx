import { useFieldArray, useForm } from 'react-hook-form';

type DiseaseRow = { ranking: number; nama_penyakit_raw: string; jumlah_tni: number; jumlah_pns: number; jumlah_kel: number };

type FormValues = { items: DiseaseRow[] };

const defaults = Array.from({ length: 10 }).map((_, i) => ({ ranking: i + 1, nama_penyakit_raw: '', jumlah_tni: 0, jumlah_pns: 0, jumlah_kel: 0 }));

export function DiseaseFormPage() {
  const { control, register, handleSubmit } = useForm<FormValues>({ defaultValues: { items: defaults } });
  const { fields } = useFieldArray({ control, name: 'items' });
  return (
    <form onSubmit={handleSubmit((v) => alert(`Submitted ${v.items.length} item`))} className="rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-lg font-semibold">10 Besar Penyakit Menonjol</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr><th>Rank</th><th>Penyakit</th><th>TNI</th><th>PNS</th><th>KEL</th></tr></thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={f.id} className="border-t">
                <td><input className="w-12 rounded border p-1" {...register(`items.${i}.ranking`)} /></td>
                <td><input className="w-64 rounded border p-1" {...register(`items.${i}.nama_penyakit_raw`)} /></td>
                <td><input className="w-20 rounded border p-1" {...register(`items.${i}.jumlah_tni`)} /></td>
                <td><input className="w-20 rounded border p-1" {...register(`items.${i}.jumlah_pns`)} /></td>
                <td><input className="w-20 rounded border p-1" {...register(`items.${i}.jumlah_kel`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 rounded-xl bg-primary px-4 py-2 text-white">Simpan & Submit</button>
    </form>
  );
}
