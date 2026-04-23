import { useMemo, useState } from 'react';
import { userLogService } from '@/services/user-log-service';

export function UserLogsPage() {
  const [version, setVersion] = useState(0);

  const logs = useMemo(() => userLogService.getLogs(), [version]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Log Aktivitas User</h1>
            <p className="text-sm text-slate-500">Audit trail lokal untuk aktivitas pengguna pada aplikasi.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              userLogService.clearLogs();
              setVersion((v) => v + 1);
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Hapus Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="px-2 py-2">Waktu</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Action</th>
                <th className="px-2 py-2">Path</th>
                <th className="px-2 py-2">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-2 py-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString('id-ID')}</td>
                  <td className="px-2 py-2">{log.userRole}</td>
                  <td className="px-2 py-2">{log.action}</td>
                  <td className="px-2 py-2">{log.path}</td>
                  <td className="px-2 py-2">{log.description}</td>
                </tr>
              ))}
              {!logs.length && (
                <tr>
                  <td className="px-2 py-6 text-center text-slate-500" colSpan={5}>
                    Belum ada log aktivitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
