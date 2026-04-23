import { NavLink } from 'react-router-dom';
import { Activity, ClipboardList, Hospital, ShieldCheck, FileOutput, ScrollText, Files, Shield, Database } from 'lucide-react';
import silarasLogo from '@/assets/silaras-logo.svg';
import { useCurrentRole } from '@/hooks/useCurrentRole';
import { ACCESS_CONTROL, hasAccess } from '@/features/auth/access-control';

type SidebarProps = {
  onNavigate?: () => void;
};

const links = [
  { to: '/dashboard/puskesau', label: 'Dashboard Pusat', icon: Activity, allow: ACCESS_CONTROL.dashboardPuskesau },
  { to: '/dashboard/rs', label: 'Dashboard RS', icon: Hospital, allow: ACCESS_CONTROL.dashboardRs },
  { to: '/verification', label: 'Verifikasi', icon: ShieldCheck, allow: ACCESS_CONTROL.verification },
  { to: '/reports/monthly', label: 'Laporan Bulanan', icon: Files, allow: ACCESS_CONTROL.monthlyReports },
  { to: '/reports/monthly/narrative', label: 'Bulanan Satkes Naratif', icon: Files, allow: ACCESS_CONTROL.monthlyNarrative },
  { to: '/reports/monthly/attachments', label: 'Bulanan Satkes Lampiran', icon: Files, allow: ACCESS_CONTROL.monthlyAttachments },
  { to: '/reports/monthly/review', label: 'Bulanan Satkes Review', icon: Shield, allow: ACCESS_CONTROL.monthlyReview },
  { to: '/verification/monthly', label: 'Review Bulanan', icon: Shield, allow: ACCESS_CONTROL.monthlyVerification },
  { to: '/master/report-types', label: 'Master Report Types', icon: Database, allow: ACCESS_CONTROL.masterReportTypes },
  { to: '/analytics', label: 'Analytics', icon: ClipboardList, allow: ACCESS_CONTROL.analytics },
  { to: '/exports', label: 'Export', icon: FileOutput, allow: ACCESS_CONTROL.exports },
  { to: '/logs', label: 'User Logs', icon: ScrollText, allow: ACCESS_CONTROL.logs },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const role = useCurrentRole();
  const visibleLinks = links.filter((link) => hasAccess(role, link.allow));

  return (
    <aside className="h-full w-72 overflow-y-auto bg-gradient-to-b from-primary to-slate-900 p-5 text-white">
      <div className="mb-8 flex items-center gap-3">
        <img src={silarasLogo} alt="Logo SiLaras" className="h-10 w-10 rounded-xl bg-white/10 p-1" />
        <div>
          <h1 className="text-2xl font-bold leading-tight">SiLaras</h1>
          <p className="text-xs text-white/80">Sistem Laporan RSAU</p>
        </div>
      </div>

      <nav className="space-y-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
