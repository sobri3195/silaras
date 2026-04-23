import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export function ExportsPage() {
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([{ rs: 'RSAU dr. M. Salamun', bor: 63.8 }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap BOR');
    XLSX.writeFile(wb, 'silaras-rekap.xlsx');
  };

  const exportPdf = () => {
    const pdf = new jsPDF();
    pdf.text('Rekap SiLaras TW I 2026', 10, 10);
    pdf.save('silaras-rekap.pdf');
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-lg font-semibold">Export Center</h3>
      <div className="flex gap-2">
        <button onClick={exportExcel} className="rounded-xl bg-emerald-600 px-4 py-2 text-white">Export Excel</button>
        <button onClick={exportPdf} className="rounded-xl bg-primary px-4 py-2 text-white">Export PDF</button>
      </div>
    </div>
  );
}
