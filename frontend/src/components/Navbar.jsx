import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout, isEmployer, isJobSeeker } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition nav-link-anim pb-1 focus:ring-2 focus:ring-coral focus:outline-none rounded-sm ${
      isActive ? 'text-coral active' : 'text-slate-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-ink text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight text-white hover:opacity-90 transition focus:ring-2 focus:ring-coral focus:outline-none rounded px-1">
          Job<span className="text-coral">Portal</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/jobs" className={linkClass}>
              Browse Jobs
            </NavLink>
          )}
          {isEmployer && (
            <>
              <NavLink to="/employer/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/employer/jobs" className={linkClass}>
                My Jobs
              </NavLink>
            </>
          )}
          {isJobSeeker && (
            <>
              <NavLink to="/jobseeker/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/jobseeker/applications" className={linkClass}>
                My Applications
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-coral text-white font-heading font-bold text-sm select-none border border-white/10 hover:scale-105 transition-transform"
                title={`Logged in as ${user?.username}`}
              >
                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
              <button 
                type="button" 
                onClick={handleLogout} 
                className="btn-primary text-sm focus:ring-offset-ink"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 ease-in-out hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 focus:ring-offset-ink"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary text-sm focus:ring-offset-ink"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
