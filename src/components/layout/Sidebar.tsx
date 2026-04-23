import { NavLink } from 'react-router-dom';
import { Activity, ClipboardList, Hospital, ShieldCheck, FileOutput } from 'lucide-react';

const links = [
  { to: '/dashboard/puskesau', label: 'Dashboard Pusat', icon: Activity },
  { to: '/dashboard/rs', label: 'Dashboard RS', icon: Hospital },
  { to: '/verification', label: 'Verifikasi', icon: ShieldCheck },
  { to: '/analytics', label: 'Analytics', icon: ClipboardList },
  { to: '/exports', label: 'Export', icon: FileOutput },
];

export function Sidebar() {
  return (
    <aside className="min-h-screen w-72 bg-gradient-to-b from-primary to-slate-900 p-5 text-white">
      <h1 className="mb-8 text-2xl font-bold">SiLaras</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
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
