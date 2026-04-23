import { useMemo, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';
import type { HospitalDashboardRecord } from '../types';
import { classifyBor } from '../hooks/usePuskesauDashboardData';
import { StatusBadge } from './StatusBadge';
import { DeadlineBadge } from './DeadlineBadge';

function borLabel(bor: number) {
  const risk = classifyBor(bor);
  if (risk === 'critical') return 'Critical';
  if (risk === 'warning') return 'Warning';
  if (risk === 'normal') return 'Normal';
  return 'Low';
}

export function HospitalMonitoringTable({ data, onRowClick }: { data: HospitalDashboardRecord[]; onRowClick: (row: HospitalDashboardRecord) => void; }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'bor', desc: true }]);
  const columns = useMemo<ColumnDef<HospitalDashboardRecord>[]>(() => [
    { accessorKey: 'name', header: 'Nama Rumah Sakit' },
    { id: 'jenis_tingkat', header: 'Jenis / Tingkat', cell: ({ row }) => `${row.original.jenis} / ${row.original.tingkat}` },
    { accessorKey: 'totalBeds', header: 'Jumlah TT' },
    { accessorKey: 'bor', header: 'BOR', cell: ({ getValue }) => `${Number(getValue()).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%` },
    { id: 'bor_status', header: 'Status BOR', cell: ({ row }) => borLabel(row.original.bor) },
    { accessorKey: 'diseaseStatus', header: 'Status Penyakit' },
    { accessorKey: 'lastSubmit', header: 'Last Submit', cell: ({ row }) => row.original.lastSubmit ? new Date(row.original.lastSubmit).toLocaleString('id-ID') : '-' },
    { accessorKey: 'submitStatus', header: 'Review Status', cell: ({ row }) => <StatusBadge status={row.original.submitStatus} /> },
    { accessorKey: 'deadline', header: 'Deadline', cell: ({ row }) => <DeadlineBadge dueDate={row.original.dueDate} text={row.original.deadline} /> },
    { id: 'action', header: 'Aksi', cell: () => <button className="inline-flex items-center text-primary">Detail <ChevronRight className="h-4 w-4" /></button> },
  ], []);

  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 font-semibold">Status Pelaporan Rumah Sakit</h3>
      <div className="max-h-[520px] overflow-auto rounded-xl border dark:border-slate-700">
        <table className="w-full min-w-[1150px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>{group.headers.map((h) => <th key={h.id} className="px-3 py-2 text-left">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="cursor-pointer border-t hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60" onClick={() => onRowClick(row.original)}>
                {row.getVisibleCells().map((cell) => <td key={cell.id} className="px-3 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button className="rounded-lg border px-3 py-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</button>
        <button className="rounded-lg border px-3 py-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
      </div>
    </section>
  );
}
