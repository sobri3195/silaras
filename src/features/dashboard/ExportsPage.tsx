import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const statusRows = [
  'MILITER',
  'SIPIL',
  'KELUARGA',
  'TNI LAIN',
  'BPJS NON TNI',
  'YANMASUM',
  'JUMLAH',
];

function buildMonthlyDeathWorksheet() {
  const rows: (string | number)[][] = [
    ['', '', '', '', 'LAPORAN BULANAN', '', '', ''],
    ['', '', '', '', 'JUMLAH KEMATIAN', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', 'BULAN: ....................', '', '', 'TAHUN ..............', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['NO', 'STATUS', 'JENIS KEL', 'SEBAB KEMATIAN', '', '', 'JUMLAH', 'KETERANGAN'],
    ['', '', '', 'SAKIT UMUM', 'KECELAKAAN', 'LAIN-LAIN', '', ''],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ];

  statusRows.forEach((status, index) => {
    rows.push([index + 1, status, 'L', '', '', '', '', '']);
    rows.push(['', '', 'P', '', '', '', '', '']);
  });

  rows.push(['', '', '', '', '', '', '', '']);
  rows.push(['Catatan:', '', '', '', '', '', '', '']);
  rows.push(['L', ': Laki-laki', '', '', '', '', '', '']);
  rows.push(['P', ': Perempuan', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '.................., ........................', '', '']);
  rows.push(['', '', '', '', '', '', '', '']);
  rows.push(['', '', '', '', '', '............................................', '', '']);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!merges'] = [
    XLSX.utils.decode_range('E1:F1'),
    XLSX.utils.decode_range('E2:F2'),
    XLSX.utils.decode_range('C4:E4'),
    XLSX.utils.decode_range('F4:H4'),
    XLSX.utils.decode_range('A6:A7'),
    XLSX.utils.decode_range('B6:B7'),
    XLSX.utils.decode_range('C6:C7'),
    XLSX.utils.decode_range('D6:F6'),
    XLSX.utils.decode_range('G6:G7'),
    XLSX.utils.decode_range('H6:H7'),
    XLSX.utils.decode_range('F29:H29'),
    XLSX.utils.decode_range('F31:H31'),
  ];

  ws['!cols'] = [
    { wch: 7 },
    { wch: 18 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 18 },
  ];

  ws['!rows'] = rows.map((_, index) => ({ hpt: index < 8 ? 22 : 20 }));

  return ws;
}

export function ExportsPage() {
  const exportExcel = () => {
    const ws = buildMonthlyDeathWorksheet();
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Kematian');
    XLSX.writeFile(wb, 'laporan-bulanan-jumlah-kematian.xls', { bookType: 'biff8' });
  };

  const exportPdf = () => {
    const pdf = new jsPDF();
    pdf.text('Rekap SiLaras TW I 2026', 10, 10);
    pdf.save('silaras-rekap.pdf');
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-lg font-semibold">Export Center</h3>
      <p className="mb-4 text-sm text-slate-500">
        Export XLS menggunakan template Laporan Bulanan Jumlah Kematian sesuai format lembar kerja.
      </p>
      <div className="flex gap-2">
        <button onClick={exportExcel} className="rounded-xl bg-emerald-600 px-4 py-2 text-white">Export XLS</button>
        <button onClick={exportPdf} className="rounded-xl bg-primary px-4 py-2 text-white">Export PDF</button>
      </div>
    </div>
  );
}
