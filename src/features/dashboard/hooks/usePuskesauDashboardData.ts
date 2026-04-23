import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { addDays, formatDistanceToNowStrict, isAfter, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import type { DashboardFilters, HospitalDashboardRecord, BorRisk } from '../types';

const diseaseNormalizationMap: Record<string, string> = {
  hipertensi: 'Hipertensi',
  'hipertensi essensial': 'Hipertensi',
  'dm tipe 2': 'Diabetes Melitus',
  diabetes: 'Diabetes Melitus',
  ispa: 'ISPA',
};

const dummyRecords: HospitalDashboardRecord[] = [
  {
    id: 'rs-1',
    name: 'RSAU dr. Esnawan Antariksa',
    jenis: 'RSAU',
    tingkat: 'Tingkat II',
    wilayah: 'DKI Jakarta',
    kotama: 'Koops Udara I',
    totalBeds: 210,
    bor: 87.32,
    submitStatus: 'submitted',
    reviewStatus: 'need_attention',
    diseaseStatus: 'needs_normalization',
    lastSubmit: '2026-04-20T14:10:00.000Z',
    deadline: '26 Apr 2026',
    dueDate: '2026-04-26T23:59:00.000Z',
    patientComposition: { tni: 220, pns: 110, kel: 174 },
    diseaseItems: [
      { name: 'Hipertensi', normalizedName: 'Hipertensi', tni: 53, pns: 17, kel: 38, total: 108 },
      { name: 'DM tipe 2', normalizedName: 'Diabetes Melitus', tni: 21, pns: 12, kel: 11, total: 44 },
    ],
  },
  {
    id: 'rs-2',
    name: 'RSAU dr. M. Salamun',
    jenis: 'RSAU',
    tingkat: 'Tingkat II',
    wilayah: 'Jawa Barat',
    kotama: 'Koops Udara I',
    totalBeds: 180,
    bor: 68.51,
    submitStatus: 'approved',
    reviewStatus: 'reviewed',
    diseaseStatus: 'ok',
    lastSubmit: '2026-04-21T07:45:00.000Z',
    deadline: '26 Apr 2026',
    dueDate: '2026-04-26T23:59:00.000Z',
    patientComposition: { tni: 190, pns: 80, kel: 167 },
    diseaseItems: [
      { name: 'ISPA', normalizedName: 'ISPA', tni: 45, pns: 19, kel: 21, total: 85 },
      { name: 'Hipertensi essensial', normalizedName: 'Hipertensi', tni: 33, pns: 12, kel: 24, total: 69 },
    ],
  },
  {
    id: 'rs-3',
    name: 'RSAU dr. Sukirman',
    jenis: 'RSAU',
    tingkat: 'Tingkat IV',
    wilayah: 'Kalimantan Selatan',
    kotama: 'Koops Udara II',
    totalBeds: 95,
    bor: 33.78,
    submitStatus: 'draft',
    reviewStatus: 'pending',
    diseaseStatus: 'missing',
    lastSubmit: null,
    deadline: '24 Apr 2026',
    dueDate: '2026-04-24T23:59:00.000Z',
    patientComposition: { tni: 72, pns: 21, kel: 43 },
    diseaseItems: [],
  },
  {
    id: 'rs-4',
    name: 'RSAU dr. Yuniati Wisma Ranai',
    jenis: 'RSAU',
    tingkat: 'Tingkat IV',
    wilayah: 'Kepulauan Riau',
    kotama: 'Koops Udara I',
    totalBeds: 70,
    bor: 18.41,
    submitStatus: 'revision_needed',
    reviewStatus: 'need_attention',
    diseaseStatus: 'ok',
    lastSubmit: '2026-04-19T10:31:00.000Z',
    deadline: '24 Apr 2026',
    dueDate: '2026-04-24T23:59:00.000Z',
    patientComposition: { tni: 31, pns: 16, kel: 26 },
    diseaseItems: [{ name: 'Diare akut', normalizedName: 'Diare', tni: 8, pns: 5, kel: 7, total: 20 }],
  },
  {
    id: 'rs-5',
    name: 'RSPAU dr. S. Hardjolukito',
    jenis: 'RSPAU',
    tingkat: 'Tingkat I',
    wilayah: 'DI Yogyakarta',
    kotama: 'Koops Udara II',
    totalBeds: 300,
    bor: 58.9,
    submitStatus: 'locked',
    reviewStatus: 'reviewed',
    diseaseStatus: 'ok',
    lastSubmit: '2026-04-22T05:22:00.000Z',
    deadline: '26 Apr 2026',
    dueDate: '2026-04-26T23:59:00.000Z',
    patientComposition: { tni: 260, pns: 140, kel: 232 },
    diseaseItems: [{ name: 'Hipertensi', normalizedName: 'Hipertensi', tni: 71, pns: 35, kel: 44, total: 150 }],
  },
];

export function classifyBor(bor: number): BorRisk {
  if (bor >= 85) return 'critical';
  if (bor >= 60) return 'warning';
  if (bor >= 40) return 'normal';
  return 'low';
}

async function fetchDashboardRecords(periodId: string): Promise<HospitalDashboardRecord[]> {
  const { data, error } = await supabase
    .from('bor_reports')
    .select('id,hospital_id,jumlah_tt,nilai_bor,status,updated_at,due_date,hospitals(nama_rs,jenis,tingkat,wilayah,kotama),disease_report_items(nama_penyakit_raw,jumlah_tni,jumlah_pns,jumlah_kel,jumlah_total),review_status')
    .eq('reporting_period_id', periodId);

  if (error || !data?.length) return dummyRecords;

  return data.map((row: any) => {
    const items: HospitalDashboardRecord['diseaseItems'] = (row.disease_report_items ?? []).map((item: any) => {
      const raw = String(item.nama_penyakit_raw ?? '').trim();
      const normalizedName = diseaseNormalizationMap[raw.toLowerCase()];
      return {
        name: raw,
        normalizedName,
        tni: Number(item.jumlah_tni ?? 0),
        pns: Number(item.jumlah_pns ?? 0),
        kel: Number(item.jumlah_kel ?? 0),
        total: Number(item.jumlah_total ?? 0),
      };
    });

    return {
      id: row.hospital_id,
      name: row.hospitals?.nama_rs ?? 'Tanpa Nama',
      jenis: row.hospitals?.jenis ?? 'RSAU',
      tingkat: row.hospitals?.tingkat ?? 'N/A',
      wilayah: row.hospitals?.wilayah ?? 'Tidak diketahui',
      kotama: row.hospitals?.kotama ?? '-',
      totalBeds: Number(row.jumlah_tt ?? 0),
      bor: Number(row.nilai_bor ?? 0),
      submitStatus: row.status,
      reviewStatus: row.review_status ?? 'pending',
      diseaseStatus: items.length ? (items.some((x) => !x.normalizedName) ? 'needs_normalization' : 'ok') : 'missing',
      lastSubmit: row.updated_at,
      deadline: row.due_date ? new Date(row.due_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
      dueDate: row.due_date ?? addDays(new Date(), 3).toISOString(),
      patientComposition: {
        tni: items.reduce((acc, i) => acc + i.tni, 0),
        pns: items.reduce((acc, i) => acc + i.pns, 0),
        kel: items.reduce((acc, i) => acc + i.kel, 0),
      },
      diseaseItems: items,
    } satisfies HospitalDashboardRecord;
  });
}

export function usePuskesauDashboardData(filters: DashboardFilters) {
  const query = useQuery({
    queryKey: ['puskesau-dashboard', filters.periodId],
    queryFn: () => fetchDashboardRecords(filters.periodId),
  });

  const computed = useMemo(() => {
    const rows = query.data ?? [];
    const filtered = rows.filter((row) => {
      if (filters.query && !row.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.submitStatus !== 'all' && row.submitStatus !== filters.submitStatus) return false;
      if (filters.reviewStatus !== 'all' && row.reviewStatus !== filters.reviewStatus) return false;
      if (filters.borRange !== 'all' && classifyBor(row.bor) !== filters.borRange) return false;
      if (filters.wilayah !== 'all' && row.wilayah !== filters.wilayah) return false;
      return true;
    });

    const submittedCount = rows.filter((x) => x.submitStatus !== 'draft').length;
    const notSubmittedCount = rows.length - submittedCount;
    const overdueCount = rows.filter((x) => isAfter(new Date(), parseISO(x.dueDate)) && ['draft', 'revision_needed'].includes(x.submitStatus)).length;
    const sortedBor = [...rows].sort((a, b) => b.bor - a.bor);
    const avgBor = rows.length ? rows.reduce((acc, row) => acc + row.bor, 0) / rows.length : 0;

    const diseasePool = new Map<string, number>();
    rows.forEach((row) => {
      row.diseaseItems.forEach((item) => {
        const name = filters.diseaseMode === 'normalized' ? item.normalizedName ?? item.name : item.name;
        diseasePool.set(name, (diseasePool.get(name) ?? 0) + item.total);
      });
    });

    const diseaseTop = [...diseasePool.entries()]
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const composition = rows.reduce(
      (acc, row) => {
        acc.tni += row.patientComposition.tni;
        acc.pns += row.patientComposition.pns;
        acc.kel += row.patientComposition.kel;
        return acc;
      },
      { tni: 0, pns: 0, kel: 0 },
    );

    const statusCounts = {
      submitted: rows.filter((x) => ['submitted', 'approved', 'locked'].includes(x.submitStatus)).length,
      revision_needed: rows.filter((x) => x.submitStatus === 'revision_needed').length,
      draft: rows.filter((x) => x.submitStatus === 'draft').length,
    };

    const topBor = sortedBor[0];
    const lowBor = sortedBor[sortedBor.length - 1];

    const nearDeadline = rows
      .filter((x) => ['draft', 'revision_needed'].includes(x.submitStatus))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    const insight = [
      topBor ? `${topBor.name} memiliki BOR tertinggi periode ini (${topBor.bor.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%).` : '',
      nearDeadline
        ? `${nearDeadline.name} belum submit final dan tenggat ${formatDistanceToNowStrict(parseISO(nearDeadline.dueDate), { locale: id, addSuffix: true })}.`
        : '',
      diseaseTop[0] ? `${diseaseTop[0].name} mendominasi laporan lintas rumah sakit.` : '',
      rows.some((x) => x.diseaseStatus === 'needs_normalization') ? 'Terdapat variasi penamaan penyakit yang perlu normalisasi.' : '',
      rows.some((x) => classifyBor(x.bor) === 'low') ? 'Beberapa unit memiliki BOR sangat rendah dan perlu evaluasi.' : '',
    ].filter(Boolean);

    return {
      rows,
      filtered,
      metrics: {
        totalHospitals: rows.length,
        submittedCount,
        notSubmittedCount,
        overdueCount,
        avgBor,
        highestBor: topBor,
        lowestBor: lowBor,
        totalDiseaseCases: diseaseTop.reduce((acc, x) => acc + x.total, 0),
      },
      priority: {
        notSubmitted: rows.filter((x) => ['draft', 'revision_needed'].includes(x.submitStatus)).slice(0, 5),
        highBor: rows.filter((x) => classifyBor(x.bor) === 'critical').sort((a, b) => b.bor - a.bor).slice(0, 5),
        lowBor: rows.filter((x) => classifyBor(x.bor) === 'low').sort((a, b) => a.bor - b.bor).slice(0, 5),
      },
      charts: {
        borRanking: sortedBor.map((x) => ({ name: x.name, bor: x.bor })),
        patientComposition: [
          { name: 'TNI', value: composition.tni },
          { name: 'PNS', value: composition.pns },
          { name: 'KEL', value: composition.kel },
        ],
        diseaseTop,
        submissionStatus: [
          { name: 'Submitted/Approved', value: statusCounts.submitted, color: '#10b981' },
          { name: 'Perlu Revisi', value: statusCounts.revision_needed, color: '#f59e0b' },
          { name: 'Belum Submit', value: statusCounts.draft, color: '#f43f5e' },
        ],
      },
      insight,
      wilayahOptions: ['all', ...new Set(rows.map((x) => x.wilayah).filter(Boolean) as string[])],
    };
  }, [filters.borRange, filters.diseaseMode, filters.query, filters.reviewStatus, filters.submitStatus, filters.wilayah, query.data]);

  return { ...query, ...computed };
}
