import { NavLink } from 'react-router-dom';
import { Activity, ClipboardList, Hospital, ShieldCheck, FileOutput, ScrollText, Files, Shield, Database } from 'lucide-react';
import silarasLogo from '@/assets/silaras-logo.svg';

type SidebarProps = {
  onNavigate?: () => void;
};

const links = [
  { to: '/dashboard/puskesau', label: 'Dashboard Pusat', icon: Activity },
  { to: '/dashboard/rs', label: 'Dashboard RS', icon: Hospital },
  { to: '/verification', label: 'Verifikasi', icon: ShieldCheck },
  { to: '/reports/monthly', label: 'Laporan Bulanan', icon: Files },
  { to: '/reports/monthly/narrative', label: 'Bulanan Satkes Naratif', icon: Files },
  { to: '/reports/monthly/attachments', label: 'Bulanan Satkes Lampiran', icon: Files },
  { to: '/reports/monthly/review', label: 'Bulanan Satkes Review', icon: Shield },
  { to: '/verification/monthly', label: 'Review Bulanan', icon: Shield },
  { to: '/master/report-types', label: 'Master Report Types', icon: Database },
  { to: '/analytics', label: 'Analytics', icon: ClipboardList },
  { to: '/exports', label: 'Export', icon: FileOutput },
  { to: '/logs', label: 'User Logs', icon: ScrollText },
];

export function Sidebar({ onNavigate }: SidebarProps) {
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
        {links.map((link) => (
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
