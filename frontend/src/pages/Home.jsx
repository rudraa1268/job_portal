import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isEmployer, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={isEmployer ? '/employer/dashboard' : '/jobseeker/dashboard'} replace />;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Hero card with dot grid background */}
      <div className="card mx-auto max-w-4xl border-0 bg-gradient-to-br from-ink via-surface to-ink p-10 text-white shadow-xl sm:p-16 dot-grid-dark relative overflow-hidden">
        <div className="relative z-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral font-heading">
            Find your next opportunity
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl font-heading text-white">
            Welcome to Job Portal
          </h1>
          <p className="mb-8 max-w-2xl text-base text-slate-300">
            Connect employers with talented job seekers. Post jobs, apply with ease, and track
            applications — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {/* Employers path card */}
        <div className="card border border-slate/10 hover:border-coral hover:-translate-y-1 hover:shadow-lg transition-all duration-150 ease-in-out bg-paper">
          <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-8 w-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 className="mb-2 text-xl font-bold text-ink-text font-heading">For Employers</h2>
          <p className="text-sm text-slate leading-relaxed">
            Post jobs, manage listings, review applicants, and update application statuses.
          </p>
        </div>
        
        {/* Job Seekers path card */}
        <div className="card border border-slate/10 hover:border-coral hover:-translate-y-1 hover:shadow-lg transition-all duration-150 ease-in-out bg-paper">
          <svg xmlns="http://www.w3.org/2000/svg" className="mb-3 h-8 w-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="mb-2 text-xl font-bold text-ink-text font-heading">For Job Seekers</h2>
          <p className="text-sm text-slate leading-relaxed">
            Browse active jobs, apply with a cover letter, and track your application progress.
          </p>
        </div>
      </div>
    </div>
  );
}
