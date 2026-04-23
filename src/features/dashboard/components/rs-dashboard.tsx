import { useMemo, useState, type ComponentType } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  ClipboardList,
  FileEdit,
  FileUp,
  Flame,
  Hospital,
  Info,
  LineChart as LineChartIcon,
  Lock,
  Save,
  Send,
  Stethoscope,
  Syringe,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { ReportStatus } from '@/types/domain';
import { getMonthlySummary } from '@/features/reports/monthly/report-summary';

export type RsWorkflowState =
  | 'not_started'
  | 'partial_draft'
  | 'complete_unsubmitted'
  | 'submitted'
  | 'revision_needed'
  | 'approved'
  | 'locked';

interface ActivePeriod {
  id: string;
  label: string;
  due_date: string | null;
}

interface HospitalInfo {
  id: string;
  nama_rs: string;
}

interface BorReport {
  id: string;
  jumlah_tt: number;
  nilai_bor: number;
  status: ReportStatus;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

interface DiseaseReport {
  id: string;
  status: ReportStatus;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

interface DiseaseItem {
  nama_penyakit_raw: string;
  jumlah_tni: number;
  jumlah_pns: number;
  jumlah_kel: number;
  jumlah_total: number;
}

interface HistoryItem {
  period: string;
  bor: number | null;
  status: ReportStatus;
  submitDate: string | null;
  reviewDate: string | null;
}

interface DashboardData {
  hospital: HospitalInfo;
  activePeriod: ActivePeriod;
  borReport: BorReport | null;
  diseaseReport: DiseaseReport | null;
  diseaseItems: DiseaseItem[];
  history: HistoryItem[];
  latestReviewer: string;
}

const statusConfig: Record<
  RsWorkflowState,
  {
    label: string;
    headline: string;
    message: string;
    cta: string;
    tone: string;
    icon: ComponentType<{ className?: string }>;
  }
> = {
  not_started: {
    label: 'Belum dimulai',
    headline: 'Pelaporan periode ini belum dimulai',
    message: 'Anda belum mengisi laporan periode aktif.',
    cta: 'Mulai isi laporan',
    tone: 'border-slate-200 bg-white text-slate-700',
    icon: CircleDashed,
  },
  partial_draft: {
    label: 'Draft sebagian',
    headline: 'Laporan Anda masih draft',
    message: 'Lengkapi BOR dan 10 besar penyakit agar siap dikirim.',
    cta: 'Lanjutkan pengisian',
    tone: 'border-cyan-200 bg-cyan-50 text-cyan-900',
    icon: FileEdit,
  },
  complete_unsubmitted: {
    label: 'Siap submit',
    headline: 'Data sudah lengkap, belum disubmit',
    message: 'Silakan submit laporan agar dapat direview Puskesau.',
    cta: 'Submit laporan',
    tone: 'border-blue-200 bg-blue-50 text-blue-900',
    icon: ClipboardCheck,
  },
  submitted: {
    label: 'Menunggu review',
    headline: 'Laporan sudah disubmit dan menunggu review',
    message: 'Data Anda sedang diproses oleh reviewer Puskesau.',
    cta: 'Lihat status',
    tone: 'border-indigo-200 bg-indigo-50 text-indigo-900',
    icon: Send,
  },
  revision_needed: {
    label: 'Perlu revisi',
    headline: 'Laporan perlu revisi',
    message: 'Baca catatan dan lakukan perbaikan sebelum deadline.',
    cta: 'Baca catatan dan perbaiki',
    tone: 'border-amber-300 bg-amber-50 text-amber-900',
    icon: AlertTriangle,
  },
  approved: {
    label: 'Disetujui',
    headline: 'Laporan telah disetujui',
    message: 'Pelaporan periode aktif sudah selesai dengan baik.',
    cta: 'Lihat ringkasan final',
    tone: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    icon: CheckCircle2,
  },
  locked: {
    label: 'Terkunci',
    headline: 'Laporan telah dikunci',
    message: 'Periode aktif sudah ditutup, data tidak dapat diubah.',
    cta: 'Unduh rekap',
    tone: 'border-primary/30 bg-primary/5 text-primary',
    icon: Lock,
  },
};

const statusLabelMap: Record<ReportStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  revision_needed: 'Perlu Revisi',
  approved: 'Disetujui',
  locked: 'Terkunci',
};

const statusClassMap: Record<ReportStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-blue-100 text-blue-700',
  revision_needed: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-700',
  locked: 'bg-primary text-white',
};

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function safeFormatDateTime(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getWorkflowState(bor: BorReport | null, disease: DiseaseReport | null): RsWorkflowState {
  const statuses = [bor?.status, disease?.status].filter(Boolean) as ReportStatus[];
  if (!bor && !disease) return 'not_started';
  if (statuses.includes('locked')) return 'locked';
  if (statuses.includes('revision_needed')) return 'revision_needed';
  if (statuses.includes('approved') && statuses.every((s) => s === 'approved')) return 'approved';
  if (statuses.includes('submitted') && statuses.every((s) => s === 'submitted')) return 'submitted';
  if (bor && disease && statuses.every((s) => s === 'draft')) return 'complete_unsubmitted';
  return 'partial_draft';
}

function canEdit(state: RsWorkflowState) {
  return ['not_started', 'partial_draft', 'complete_unsubmitted', 'revision_needed'].includes(state);
}

async function fetchRsDashboardData(): Promise<DashboardData> {
  const activePeriodRes = await supabase
    .from('reporting_periods')
    .select('id, label, due_date')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  const period = activePeriodRes.data;

  const hospitalId = localStorage.getItem('silaras_hospital_id');
  const hospitalRes = hospitalId
    ? await supabase.from('hospitals').select('id, nama_rs').eq('id', hospitalId).maybeSingle()
    : await supabase.from('hospitals').select('id, nama_rs').limit(1).maybeSingle();

  const hospital = hospitalRes.data;
  if (!period || !hospital) {
    throw new Error('Data rumah sakit atau periode aktif belum tersedia.');
  }

  const [borRes, diseaseRes, historyRes] = await Promise.all([
    supabase
      .from('bor_reports')
      .select('id, jumlah_tt, nilai_bor, status, updated_at, submitted_at, reviewed_at, review_notes')
      .eq('hospital_id', hospital.id)
      .eq('reporting_period_id', period.id)
      .maybeSingle(),
    supabase
      .from('disease_reports')
      .select('id, status, updated_at, submitted_at, reviewed_at, review_notes')
      .eq('hospital_id', hospital.id)
      .eq('reporting_period_id', period.id)
      .maybeSingle(),
    supabase
      .from('bor_reports')
      .select('nilai_bor, status, submitted_at, reviewed_at, reporting_periods(label)')
      .eq('hospital_id', hospital.id)
      .neq('reporting_period_id', period.id)
      .order('submitted_at', { ascending: false })
      .limit(6),
  ]);

  const diseaseItemsRes = diseaseRes.data
    ? await supabase
        .from('disease_report_items')
        .select('nama_penyakit_raw, jumlah_tni, jumlah_pns, jumlah_kel, jumlah_total')
        .eq('disease_report_id', diseaseRes.data.id)
        .order('ranking', { ascending: true })
    : { data: [] as DiseaseItem[] };

  return {
    hospital,
    activePeriod: period,
    borReport: borRes.data,
    diseaseReport: diseaseRes.data,
    diseaseItems: diseaseItemsRes.data ?? [],
    history:
      historyRes.data?.map((item: any) => ({
        period: item.reporting_periods?.label ?? 'Periode',
        bor: item.nilai_bor,
        status: item.status,
        submitDate: item.submitted_at,
        reviewDate: item.reviewed_at,
      })) ?? [],
    latestReviewer: 'Reviewer Puskesau',
  };
}

export function useRsDashboardData() {
  return useQuery({
    queryKey: ['rs-dashboard'],
    queryFn: fetchRsDashboardData,
  });
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', statusClassMap[status])}>{statusLabelMap[status]}</span>;
}

export function DeadlineCard({ dueDate }: { dueDate: string | null }) {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">Deadline</p>
      <p className="mt-1 text-sm font-semibold text-cyan-900">{formatDate(dueDate)}</p>
    </div>
  );
}

export function LoadingState() {
  return <div className="rounded-2xl border bg-white p-6">Memuat dashboard rumah sakit...</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{message}</div>;
}

export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed bg-white p-8 text-slate-500">{message}</div>;
}

export function HospitalHeroSummary({
  state,
  progress,
  dueDate,
  status,
}: {
  state: RsWorkflowState;
  progress: number;
  dueDate: string | null;
  status: ReportStatus;
}) {
  const meta = statusConfig[state];
  const Icon = meta.icon;

  return (
    <section className={cn('rounded-3xl border p-6 shadow-soft', meta.tone)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide">Status utama</p>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{meta.headline}</h2>
          </div>
          <p className="text-sm">{meta.message}</p>
        </div>
        <div className="grid w-full max-w-sm grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/80 p-4">
            <p className="text-xs text-slate-500">Progress</p>
            <p className="text-2xl font-bold text-primary">{progress}%</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-4">
            <p className="text-xs text-slate-500">Status akhir</p>
            <div className="mt-1"><StatusBadge status={status} /></div>
          </div>
          <div className="col-span-2"><DeadlineCard dueDate={dueDate} /></div>
        </div>
      </div>
    </section>
  );
}

export function ReportingProgressCard({
  title,
  icon: Icon,
  status,
  updatedAt,
  actionLabel,
  onAction,
  disabled,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  status: ReportStatus;
  updatedAt?: string | null;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /><p className="font-semibold">{title}</p></div>
        <StatusBadge status={status} />
      </div>
      <p className="text-xs text-slate-500">Last updated: {safeFormatDateTime(updatedAt)}</p>
      <Button onClick={onAction} disabled={disabled} className="mt-4 w-full">{actionLabel}</Button>
    </article>
  );
}

export function ReportingChecklist({ items }: { items: { label: string; done: boolean; cta: string; onClick: () => void }[] }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-semibold">Yang perlu Anda lakukan</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2 rounded-xl border p-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {item.done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <CircleDashed className="h-5 w-5 text-amber-500" />}
              <p className={cn('text-sm', item.done && 'text-slate-500 line-through')}>{item.label}</p>
            </div>
            {!item.done && <Button variant="outline" onClick={item.onClick}>{item.cta}</Button>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function LatestReportSummary({ data }: { data: DashboardData }) {
  if (!data.borReport && !data.diseaseReport) {
    return <EmptyState message="Belum ada data laporan untuk periode aktif." />;
  }
  const topDiseases = [...data.diseaseItems].sort((a, b) => b.jumlah_total - a.jumlah_total).slice(0, 3);
  const totalCases = data.diseaseItems.reduce((sum, item) => sum + item.jumlah_total, 0);
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-lg font-semibold">Ringkasan laporan rumah sakit</h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Jumlah TT</p><p className="text-xl font-bold">{data.borReport?.jumlah_tt ?? '-'}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Nilai BOR</p><p className="text-xl font-bold">{data.borReport?.nilai_bor ? `${data.borReport.nilai_bor}%` : '-'}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Total Kasus</p><p className="text-xl font-bold">{totalCases}</p></div>
        <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Submit terakhir</p><p className="text-sm font-semibold">{formatDate(data.borReport?.submitted_at ?? data.diseaseReport?.submitted_at)}</p></div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-semibold">3 penyakit tertinggi</p>
          <ul className="space-y-1 text-sm text-slate-600">{topDiseases.map((d) => <li key={d.nama_penyakit_raw}>• {d.nama_penyakit_raw} ({d.jumlah_total})</li>)}</ul>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">Status review</p>
          <StatusBadge status={data.diseaseReport?.status ?? data.borReport?.status ?? 'draft'} />
          <p className="mt-2 text-sm text-slate-500">Catatan terakhir: {data.diseaseReport?.review_notes ?? data.borReport?.review_notes ?? '-'}</p>
        </div>
      </div>
    </section>
  );
}

export function RevisionNotesPanel({
  isVisible,
  reviewer,
  reviewedAt,
  notes,
  onFixNow,
}: {
  isVisible: boolean;
  reviewer: string;
  reviewedAt?: string | null;
  notes?: string | null;
  onFixNow: () => void;
}) {
  if (!isVisible) return null;
  return (
    <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-soft">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-amber-900"><AlertTriangle className="h-5 w-5" />Catatan revisi dari Puskesau</h3>
      <p className="text-sm text-amber-900">Reviewer: {reviewer}</p>
      <p className="text-sm text-amber-900">Waktu review: {safeFormatDateTime(reviewedAt)}</p>
      <p className="mt-3 rounded-xl bg-white/70 p-3 text-sm">{notes || 'Mohon tinjau ulang data dan sinkronkan dengan SIMRS.'}</p>
      <Button className="mt-3" onClick={onFixNow}>Perbaiki sekarang</Button>
    </section>
  );
}

export function QuickActionButtons({
  onBor,
  onDisease,
  onSubmit,
  onRevision,
  canSubmit,
}: {
  onBor: () => void;
  onDisease: () => void;
  onSubmit: () => void;
  onRevision: () => void;
  canSubmit: boolean;
}) {
  return (
    <div className="grid gap-2 rounded-2xl border bg-white p-3 shadow-soft md:grid-cols-4">
      <Button onClick={onBor}><ClipboardList className="mr-2 h-4 w-4" />Isi BOR</Button>
      <Button onClick={onDisease} variant="outline"><Stethoscope className="mr-2 h-4 w-4" />Isi 10 Besar Penyakit</Button>
      <Button onClick={onSubmit} disabled={!canSubmit}><Send className="mr-2 h-4 w-4" />Submit Laporan</Button>
      <Button onClick={onRevision} variant="outline"><Info className="mr-2 h-4 w-4" />Lihat Catatan Revisi</Button>
    </div>
  );
}

export function MiniBorTrendChart({ items }: { items: HistoryItem[] }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-3 flex items-center gap-2 font-semibold"><LineChartIcon className="h-4 w-4" />Tren BOR antar periode</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={items}>
            <XAxis dataKey="period" hide />
            <YAxis domain={[0, 100]} width={28} />
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Line dataKey="bor" stroke="#102a56" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function TopDiseasesCard({ items }: { items: DiseaseItem[] }) {
  const top = [...items].sort((a, b) => b.jumlah_total - a.jumlah_total).slice(0, 5);
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-3 flex items-center gap-2 font-semibold"><Flame className="h-4 w-4" />Top penyakit rumah sakit</h3>
      <div className="space-y-2">
        {top.map((item, idx) => (
          <div key={item.nama_penyakit_raw} className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-sm">
            <span>{idx + 1}. {item.nama_penyakit_raw}</span>
            <strong>{item.jumlah_total}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PatientCompositionMiniChart({ items }: { items: DiseaseItem[] }) {
  const composition = items.reduce(
    (acc, item) => {
      acc.tni += item.jumlah_tni;
      acc.pns += item.jumlah_pns;
      acc.kel += item.jumlah_kel;
      return acc;
    },
    { tni: 0, pns: 0, kel: 0 },
  );

  const data = [
    { name: 'TNI', value: composition.tni, color: '#102a56' },
    { name: 'PNS', value: composition.pns, color: '#06b6d4' },
    { name: 'KEL', value: composition.kel, color: '#10b981' },
  ];

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-3 flex items-center gap-2 font-semibold"><Syringe className="h-4 w-4" />Komposisi pasien TNI/PNS/KEL</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={68}>
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">{data.map((item) => <div key={item.name}><p>{item.name}</p><p className="font-semibold">{item.value}</p></div>)}</div>
    </section>
  );
}

export function SubmissionTimeline({ data }: { data: DashboardData }) {
  const timelines = [
    { label: 'Draft BOR', time: data.borReport?.updated_at, icon: FileEdit },
    { label: 'Draft Penyakit', time: data.diseaseReport?.updated_at, icon: FileEdit },
    { label: 'Submit', time: data.borReport?.submitted_at ?? data.diseaseReport?.submitted_at, icon: FileUp },
    { label: 'Review', time: data.borReport?.reviewed_at ?? data.diseaseReport?.reviewed_at, icon: UserCheck },
  ];

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-3 font-semibold">Timeline submit & review</h3>
      <div className="space-y-2">
        {timelines.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-lg border p-2">
            <item.icon className="h-4 w-4 text-primary" />
            <p className="text-sm">{item.label}</p>
            <p className="ml-auto text-xs text-slate-500">{safeFormatDateTime(item.time)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReportHistoryTable({ items }: { items: HistoryItem[] }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-soft">
      <h3 className="mb-3 font-semibold">Riwayat pelaporan</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2">Periode</th><th>BOR</th><th>Status</th><th>Submit Date</th><th>Review Date</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.period}-${item.submitDate}`} className="border-t">
                <td className="py-2">{item.period}</td>
                <td>{item.bor ? `${item.bor}%` : '-'}</td>
                <td><StatusBadge status={item.status} /></td>
                <td>{formatDate(item.submitDate)}</td>
                <td>{formatDate(item.reviewDate)}</td>
                <td><Button variant="outline" className="px-2 py-1 text-xs">Lihat detail</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function RsDashboardContent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useRsDashboardData();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  const dashboardState = useMemo(() => getWorkflowState(data?.borReport ?? null, data?.diseaseReport ?? null), [data]);

  const progress = useMemo(() => {
    if (!data) return 0;
    const done = [!!data.borReport, !!data.diseaseReport].filter(Boolean).length;
    return done * 50;
  }, [data]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!data?.borReport || !data.diseaseReport) throw new Error('Data belum lengkap');
      await Promise.all([
        supabase.from('bor_reports').update({ status: 'submitted', submitted_at: new Date().toISOString() }).eq('id', data.borReport.id),
        supabase.from('disease_reports').update({ status: 'submitted', submitted_at: new Date().toISOString() }).eq('id', data.diseaseReport.id),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rs-dashboard'] });
      setToast({ type: 'success', message: 'Laporan berhasil disubmit.' });
      setSubmitOpen(false);
    },
    onError: () => setToast({ type: 'error', message: 'Gagal submit laporan.' }),
  });

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      localStorage.setItem('silaras_autosave', new Date().toISOString());
    },
    onSuccess: () => setToast({ type: 'success', message: 'Draft tersimpan otomatis.' }),
    onError: () => setToast({ type: 'error', message: 'Auto-save draft gagal.' }),
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <ErrorState message={error instanceof Error ? error.message : 'Gagal memuat data dashboard.'} />;

  const mergedStatus = data.diseaseReport?.status ?? data.borReport?.status ?? 'draft';
  const editable = canEdit(dashboardState);
  const monthly = getMonthlySummary(data.hospital.id);
  const checklist = [
    { label: 'Isi laporan BOR', done: !!data.borReport, cta: 'Isi BOR', onClick: () => (window.location.href = '/reports/bor') },
    { label: 'Isi 10 besar penyakit', done: !!data.diseaseReport, cta: 'Isi Penyakit', onClick: () => (window.location.href = '/reports/diseases') },
    { label: 'Submit laporan periode aktif', done: dashboardState === 'submitted' || dashboardState === 'approved' || dashboardState === 'locked', cta: 'Submit', onClick: () => setSubmitOpen(true) },
    { label: 'Revisi berdasarkan catatan', done: dashboardState !== 'revision_needed', cta: 'Lihat revisi', onClick: () => document.getElementById('revision-panel')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Lihat histori submit', done: data.history.length > 0, cta: 'Lihat histori', onClick: () => document.getElementById('history-panel')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  return (
    <div className="space-y-4 pb-24 md:pb-8">
      <header className="rounded-2xl border bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">SiLaras</p>
            <h1 className="text-2xl font-bold text-primary">Dashboard Rumah Sakit</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium"><Hospital className="h-3.5 w-3.5" />{data.hospital.nama_rs}</span>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">{data.activePeriod.label}</span>
              <StatusBadge status={mergedStatus} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Lihat Panduan</Button>
            <Button onClick={() => (window.location.href = '/reports/bor')}>Buka Laporan</Button>
          </div>
        </div>
      </header>

      <HospitalHeroSummary state={dashboardState} progress={progress} dueDate={data.activePeriod.due_date} status={mergedStatus} />
      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <article className="rounded-2xl border bg-white p-3 shadow-soft"><p className="text-xs text-slate-500">Wajib</p><p className="text-lg font-bold">{monthly.wajib}</p></article>
        <article className="rounded-2xl border bg-white p-3 shadow-soft"><p className="text-xs text-slate-500">Selesai</p><p className="text-lg font-bold">{monthly.masuk}</p></article>
        <article className="rounded-2xl border bg-white p-3 shadow-soft"><p className="text-xs text-slate-500">Draft</p><p className="text-lg font-bold">{monthly.draft}</p></article>
        <article className="rounded-2xl border bg-white p-3 shadow-soft"><p className="text-xs text-slate-500">Revisi</p><p className="text-lg font-bold">{monthly.revisi}</p></article>
        <article className="rounded-2xl border bg-white p-3 shadow-soft"><p className="text-xs text-slate-500">Approved</p><p className="text-lg font-bold">{monthly.approved}</p></article>
        <article className="rounded-2xl border bg-white p-3 shadow-soft"><p className="text-xs text-slate-500">Belum Masuk</p><p className="text-lg font-bold">{monthly.belumMasuk}</p></article>
      </section>

      <QuickActionButtons
        onBor={() => (window.location.href = '/reports/bor')}
        onDisease={() => (window.location.href = '/reports/diseases')}
        onSubmit={() => setSubmitOpen(true)}
        onRevision={() => document.getElementById('revision-panel')?.scrollIntoView({ behavior: 'smooth' })}
        canSubmit={!!data.borReport && !!data.diseaseReport && editable}
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ReportingProgressCard title="BOR report" icon={ClipboardList} status={data.borReport?.status ?? 'draft'} updatedAt={data.borReport?.updated_at} actionLabel={data.borReport ? 'Edit' : 'Isi'} onAction={() => (window.location.href = '/reports/bor')} disabled={!editable} />
        <ReportingProgressCard title="Disease report" icon={Stethoscope} status={data.diseaseReport?.status ?? 'draft'} updatedAt={data.diseaseReport?.updated_at} actionLabel={data.diseaseReport ? 'Lanjutkan draft' : 'Isi'} onAction={() => (window.location.href = '/reports/diseases')} disabled={!editable} />
        <ReportingProgressCard title="Submit status" icon={Send} status={mergedStatus} updatedAt={data.borReport?.submitted_at ?? data.diseaseReport?.submitted_at} actionLabel="Submit laporan" onAction={() => setSubmitOpen(true)} disabled={!editable || !data.borReport || !data.diseaseReport} />
        <ReportingProgressCard title="Review result" icon={UserCheck} status={mergedStatus} updatedAt={data.borReport?.reviewed_at ?? data.diseaseReport?.reviewed_at} actionLabel={dashboardState === 'revision_needed' ? 'Lihat catatan revisi' : 'Lihat final'} onAction={() => document.getElementById('revision-panel')?.scrollIntoView({ behavior: 'smooth' })} />
      </section>

      <ReportingChecklist items={checklist} />
      <LatestReportSummary data={data} />

      <div id="revision-panel">
        <RevisionNotesPanel
          isVisible={dashboardState === 'revision_needed'}
          reviewer={data.latestReviewer}
          reviewedAt={data.borReport?.reviewed_at ?? data.diseaseReport?.reviewed_at}
          notes={data.borReport?.review_notes ?? data.diseaseReport?.review_notes}
          onFixNow={() => (window.location.href = '/reports/bor')}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <MiniBorTrendChart items={data.history} />
        <TopDiseasesCard items={data.diseaseItems} />
        <PatientCompositionMiniChart items={data.diseaseItems} />
      </div>

      <SubmissionTimeline data={data} />

      <div id="history-panel">
        <ReportHistoryTable items={data.history} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => saveDraftMutation.mutate()} variant="outline"><Save className="mr-2 h-4 w-4" />Simpan draft</Button>
          <Button onClick={() => setSubmitOpen(true)} disabled={!data.borReport || !data.diseaseReport || !editable}><Send className="mr-2 h-4 w-4" />Submit</Button>
        </div>
      </div>

      <Dialog.Root open={submitOpen} onOpenChange={setSubmitOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-soft">
            <Dialog.Title className="text-lg font-semibold">Konfirmasi submit laporan</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-slate-600">Setelah submit, data menjadi read-only sampai ada revisi dari reviewer. Lanjutkan?</Dialog.Description>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSubmitOpen(false)}>Batal</Button>
              <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>Ya, submit</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {toast && (
        <div className={cn('fixed right-4 top-4 z-30 rounded-xl px-4 py-3 text-sm text-white shadow-soft', toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600')}>
          <div className="flex items-center gap-2">{toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {toast.message}</div>
        </div>
      )}

      <div className="hidden md:block">
        <Button variant="outline" onClick={() => saveDraftMutation.mutate()}><CalendarClock className="mr-2 h-4 w-4" />Simpan draft otomatis</Button>
      </div>
    </div>
  );
}
