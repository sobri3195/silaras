import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const chartCard = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900';
const formatter = (v: number) => v.toLocaleString('id-ID');

export function SubmissionStatusDonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Komposisi Status Pelaporan</h3><div className="h-64"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" innerRadius={55} outerRadius={90}>{data.map((x) => <Cell key={x.name} fill={x.color} />)}</Pie><Tooltip formatter={(v: number) => formatter(v)} /></PieChart></ResponsiveContainer></div></div>;
}

export function BorRankingChart({ data }: { data: { name: string; bor: number }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Ranking BOR Seluruh Rumah Sakit</h3><div className="h-72"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis unit="%" /><Tooltip formatter={(v: number) => `${v.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`} /><Bar dataKey="bor" fill="#1e3a70" radius={8} /></BarChart></ResponsiveContainer></div></div>;
}

export function PatientCompositionChart({ data }: { data: { name: string; value: number }[] }) {
  const colors = ['#1e3a70', '#0891b2', '#10b981'];
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Distribusi TNI / PNS / KEL</h3><div className="h-72"><ResponsiveContainer><BarChart data={[data.reduce((acc: any, cur) => ({ ...acc, [cur.name]: cur.value }), {})]}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip formatter={(v: number) => formatter(v)} /><Bar dataKey="TNI" stackId="a" fill={colors[0]} /><Bar dataKey="PNS" stackId="a" fill={colors[1]} /><Bar dataKey="KEL" stackId="a" fill={colors[2]} /></BarChart></ResponsiveContainer></div></div>;
}

export function DiseaseAggregateChart({ data }: { data: { name: string; total: number }[] }) {
  return <div className={chartCard}><h3 className="mb-3 font-semibold">Top Penyakit Terstandarisasi</h3><div className="h-72"><ResponsiveContainer><BarChart layout="vertical" data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" width={120} dataKey="name" /><Tooltip formatter={(v: number) => formatter(v)} /><Bar dataKey="total" fill="#06b6d4" radius={6} /></BarChart></ResponsiveContainer></div></div>;
}
