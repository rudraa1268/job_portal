import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import { employerService, parseApiError } from '../../services/api';
import { toTitleCase } from '../../utils/formatters';

export default function EmployerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    employerService
      .getDashboard()
      .then(setData)
      .catch((err) => setError(parseApiError(err)));
  }, []);

  if (!data && !error) return <PageLoader />;
  if (error && !data) return <ErrorAlert message={error} />;

  const statItems = [
    {
      label: 'Total Jobs',
      value: data.job_count,
      emptyText: 'Post your first job listing to get started.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Active Jobs',
      value: data.active_job_count,
      emptyText: 'No active job listings currently.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Applications',
      value: data.application_count,
      emptyText: 'No applications received yet.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Companies',
      value: data.companies_count,
      emptyText: 'Create your company profile first.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-text font-heading">Employer Dashboard</h1>
          <p className="text-sm text-slate">Manage your job postings and applicants</p>
        </div>
        <Link to="/employer/jobs/create" className="btn-primary">Post New Job</Link>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => (
          <div key={stat.label} className="card border border-slate/10 border-t-4 border-t-coral bg-paper p-5 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="mt-4">
              {stat.value > 0 ? (
                <p className="font-mono text-3xl font-bold text-amber">{stat.value}</p>
              ) : (
                <p className="text-xs text-slate">{stat.emptyText}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card border border-slate/10 bg-paper">
        <h2 className="mb-4 text-lg font-bold text-ink-text font-heading">Recent Applications</h2>
        {data.recent_applications?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate/10 text-slate">
                  <th className="pb-3 pr-4 font-semibold font-heading uppercase text-xs tracking-wider">Applicant</th>
                  <th className="pb-3 pr-4 font-semibold font-heading uppercase text-xs tracking-wider">Job</th>
                  <th className="pb-3 pr-4 font-semibold font-heading uppercase text-xs tracking-wider">Status</th>
                  <th className="pb-3 font-semibold font-heading uppercase text-xs tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/5">
                {data.recent_applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate/5 transition-colors">
                    <td className="py-3.5 pr-4 text-ink-text font-medium">{app.applicant.username}</td>
                    <td className="py-3.5 pr-4 text-ink-text">{toTitleCase(app.job.title)}</td>
                    <td className="py-3.5 pr-4">
                      <StatusBadge status={app.status} label={app.status_display} />
                    </td>
                    <td className="py-3.5">
                      <Link to={`/employer/jobs/${app.job.id}/applicants`} className="text-coral hover:underline focus:outline-none focus:underline font-medium transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate">No applications yet.</p>
        )}
      </div>
    </div>
  );
}
