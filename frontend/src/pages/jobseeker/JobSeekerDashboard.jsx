import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import { applicationService, parseApiError } from '../../services/api';

import { toTitleCase } from '../../utils/formatters';

export default function JobSeekerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    applicationService
      .getJobSeekerDashboard()
      .then(setData)
      .catch((err) => setError(parseApiError(err)));
  }, []);

  if (!data && !error) return <PageLoader />;
  if (error && !data) return <ErrorAlert message={error} />;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-text font-heading">Job Seeker Dashboard</h1>
          <p className="text-sm text-slate">Track your job search progress</p>
        </div>
        <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        {/* Applications Card */}
        <div className="card border border-slate/10 border-t-4 border-t-coral bg-paper p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate uppercase tracking-wider">Applications Submitted</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="mt-4">
            {data.application_count > 0 ? (
              <p className="font-mono text-4xl font-bold text-amber">{data.application_count}</p>
            ) : (
              <div className="text-slate text-sm">
                Apply to your first job to see it here.
              </div>
            )}
          </div>
        </div>

        {/* Active Jobs Card */}
        <div className="card border border-slate/10 border-t-4 border-t-coral bg-paper p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate uppercase tracking-wider">Active Jobs Available</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="mt-4">
            {data.active_jobs_count > 0 ? (
              <p className="font-mono text-4xl font-bold text-amber">{data.active_jobs_count}</p>
            ) : (
              <div className="text-slate text-sm">
                No active jobs available right now.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card border border-slate/10 bg-paper">
        <h2 className="mb-4 text-lg font-bold text-ink-text font-heading">Recent Applications</h2>
        {data.recent_applications?.length ? (
          <div className="space-y-3">
            {data.recent_applications.map((app) => (
              <div key={app.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate/10 p-4 bg-paper hover:border-slate/20 transition-colors">
                <div>
                  <Link to={`/jobs/${app.job.id}`} className="font-semibold text-ink-text hover:text-coral transition-colors">
                    {toTitleCase(app.job.title)}
                  </Link>
                  <p className="text-sm text-slate">{app.job.company.name}</p>
                </div>
                <StatusBadge status={app.status} label={app.status_display} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate">No applications yet. Start browsing jobs!</p>
        )}
      </div>
    </div>
  );
}
