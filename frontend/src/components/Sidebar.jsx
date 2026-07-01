import { NavLink } from 'react-router-dom';

export default function Sidebar({ links }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-coral ${
      isActive
        ? 'bg-coral text-white shadow-sm font-semibold'
        : 'text-slate hover:bg-slate/5 hover:text-ink-text'
    }`;

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1 rounded-xl border border-slate/10 bg-paper p-3 shadow-sm">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export const employerLinks = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/employer/jobs', label: 'My Jobs', icon: '💼' },
  { to: '/employer/jobs/create', label: 'Post Job', icon: '➕' },
];

export const jobSeekerLinks = [
  { to: '/jobseeker/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/jobs', label: 'Browse Jobs', icon: '🔍' },
  { to: '/jobseeker/applications', label: 'My Applications', icon: '📋' },
];
