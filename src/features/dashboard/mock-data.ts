export const hospitals = [
  ['RSPAU dr. S. Hardjolukito', 53],
  ['RSAU dr. Esnawan Antariksa', 53.6],
  ['RSAU dr. M. Salamun', 63.8],
  ['RSAU dr. M. Sutomo', 71.79],
  ['RSAU dr. Yuniati Wisma Ranai', 7.38],
  ['RSAU dr. M. Hassan Toto', 48.2],
  ['RSAU dr. Efram Harsana', 58.4],
  ['RSAU dr. Sukirman', 34.3],
];

export const composition = [
  { name: 'TNI', value: 583 },
  { name: 'PNS', value: 267 },
  { name: 'KEL', value: 491 },
  { name: 'UMUM', value: 318 },
];

export const monthlyBorTrend = [
  { month: 'Jan', bor: 42.1, target: 60 },
  { month: 'Feb', bor: 44.8, target: 60 },
  { month: 'Mar', bor: 47.2, target: 60 },
  { month: 'Apr', bor: 45.9, target: 60 },
  { month: 'Mei', bor: 48.3, target: 60 },
  { month: 'Jun', bor: 50.1, target: 60 },
];

export const submissionStatus = [
  { name: 'Sudah Submit', value: 14, color: '#10b981' },
  { name: 'Menunggu Verifikasi', value: 2, color: '#f59e0b' },
  { name: 'Belum Submit', value: 2, color: '#ef4444' },
];

export const puskesauAlerts = [
  {
    hospital: 'RSAU dr. Yuniati Wisma Ranai',
    issue: 'BOR sangat rendah (<10%) selama 2 bulan',
    severity: 'Tinggi',
  },
  {
    hospital: 'RSAU dr. M. Sutomo',
    issue: 'BOR mendekati batas ideal (>70%)',
    severity: 'Sedang',
  },
  {
    hospital: 'RSAU dr. Sukirman',
    issue: 'Belum kirim laporan TW I 2026',
    severity: 'Tinggi',
  },
];

export const rsBorHistory = [
  { month: 'Okt 2025', bor: 61.2 },
  { month: 'Nov 2025', bor: 59.8 },
  { month: 'Des 2025', bor: 58.4 },
  { month: 'Jan 2026', bor: 56.2 },
  { month: 'Feb 2026', bor: 54.3 },
  { month: 'Mar 2026', bor: 53.6 },
];

export const rsTasks = [
  {
    name: 'Laporan BOR',
    dueDate: '30 Apr 2026',
    owner: 'Instalasi Rekam Medis',
    status: 'revision_needed' as const,
  },
  {
    name: 'Laporan 10 Penyakit',
    dueDate: '30 Apr 2026',
    owner: 'Komite Medik',
    status: 'submitted' as const,
  },
  {
    name: 'Verifikasi TT & SDM',
    dueDate: '26 Apr 2026',
    owner: 'Wakil Kepala Yankes',
    status: 'draft' as const,
  },
];

export const rsNotifications = [
  {
    title: 'Catatan revisi dari Puskesau',
    description: 'Mohon verifikasi ulang BOR karena tren menurun tajam dibanding TW IV 2025.',
    time: '2 jam lalu',
  },
  {
    title: 'Reminder deadline',
    description: 'Laporan semester ditutup pada 30 April 2026 pukul 23.59 WIB.',
    time: 'Kemarin',
  },
  {
    title: 'Sinkronisasi data tempat tidur',
    description: 'Pastikan data TT aktif sudah sinkron dengan SIMRS sebelum submit.',
    time: '2 hari lalu',
  },
];
