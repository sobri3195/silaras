import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const chartCard = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900';

export function BorTrendChart({ data }: { data: { month: string; bor: number }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Tren BOR Nasional RS TNI AU (6 bulan)</h3><div className="h-72"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis unit="%" /><Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} /><Line dataKey="bor" stroke="#0E254A" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></div>;
}

export function SubmissionStatusChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Status Pengumpulan Laporan</h3><div className="h-72"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" innerRadius={55} outerRadius={90}>{data.map((x) => <Cell key={x.name} fill={x.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>;
}

export function BorRankingChart({ data }: { data: { name: string; bor: number }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Ranking BOR Rumah Sakit</h3><div className="h-72"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis unit="%" /><Tooltip formatter={(v: number) => `${Number(v).toFixed(2)}%`} /><Bar dataKey="bor" fill="#1e3a70" radius={8} /></BarChart></ResponsiveContainer></div></div>;
}

export function PatientDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Distribusi Pasien</h3><div className="h-72"><ResponsiveContainer><BarChart data={[data.reduce((acc: any, cur) => ({ ...acc, [cur.name]: cur.value }), {})]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="TNI" stackId="a" fill="#0E254A" /><Bar dataKey="PNS" stackId="a" fill="#0ea5e9" /><Bar dataKey="KEL" stackId="a" fill="#14b8a6" /></BarChart></ResponsiveContainer></div></div>;
}

export function NationalDiseaseChart({ data, mode }: { data: { name: string; total: number }[]; mode: 'raw' | 'normalized' }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Top Penyakit Nasional ({mode === 'raw' ? 'Raw' : 'Normalized'})</h3><div className="h-72"><ResponsiveContainer><BarChart layout="vertical" data={data.slice(0, 10)}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" width={140} dataKey="name" /><Tooltip /><Bar dataKey="total" fill="#06b6d4" radius={6} /></BarChart></ResponsiveContainer></div></div>;
}
