import { useMemo, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { ChevronRight } from 'lucide-react';
import type { HospitalDashboardRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { DeadlineBadge } from './DeadlineBadge';

export function MonitoringTable({ data, onRowClick }: { data: HospitalDashboardRecord[]; onRowClick: (row: HospitalDashboardRecord) => void }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'bor', desc: true }]);
  const columns = useMemo<ColumnDef<HospitalDashboardRecord>[]>(() => [
    { accessorKey: 'name', header: 'Nama RS' },
    { accessorKey: 'totalBeds', header: 'TT' },
    { accessorKey: 'bor', header: 'BOR', cell: ({ getValue }) => `${Number(getValue()).toFixed(2)}%` },
    { accessorKey: 'submitStatus', header: 'Status Submit', cell: ({ row }) => <StatusBadge status={row.original.submitStatus} /> },
    { accessorKey: 'reviewStatus', header: 'Status Verifikasi' },
    { accessorKey: 'lastSubmit', header: 'Last Update', cell: ({ row }) => row.original.lastSubmit ? new Date(row.original.lastSubmit).toLocaleString('id-ID') : '-' },
    { accessorKey: 'deadline', header: 'Deadline', cell: ({ row }) => <DeadlineBadge dueDate={row.original.dueDate} text={row.original.deadline} /> },
    { id: 'aksi', header: 'Aksi', cell: () => <button className="inline-flex items-center text-primary">Detail <ChevronRight className="h-4 w-4" /></button> },
  ], []);

  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 font-semibold">Monitoring Table Rumah Sakit</h3>
      <div className="max-h-[520px] overflow-auto rounded-xl border dark:border-slate-700">
        <table className="w-full min-w-[1080px] text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
            {table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((h) => <th key={h.id} className="px-3 py-2 text-left">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => <tr key={row.id} className="cursor-pointer border-t hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60" onClick={() => onRowClick(row.original)}>{row.getVisibleCells().map((cell) => <td key={cell.id} className="px-3 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export const HospitalMonitoringTable = MonitoringTable;
