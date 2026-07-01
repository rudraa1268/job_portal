import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import { useAuth } from '../../hooks/useAuth';
import { jobService, parseApiError } from '../../services/api';
import { formatSalary, toTitleCase } from '../../utils/formatters';

export default function JobDetails() {
  const id = useParams().id;
  const { isJobSeeker } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    jobService
      .getJob(id)
      .then(setData)
      .catch((err) => setError(parseApiError(err)));
  }, [id]);

  if (!data && !error) return <PageLoader />;
  if (error && !data) return <ErrorAlert message={error} />;

  const { job, has_applied } = data;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <Link to="/jobs" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline focus:outline-none focus:underline">
        ← Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (65% width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card border border-slate/10 bg-paper p-8 shadow-sm">
            <h1 className="mb-2 text-3xl font-bold text-ink-text font-heading leading-tight">{toTitleCase(job.title)}</h1>
            <p className="text-xl text-slate font-medium">{job.company.name}</p>
            
            {job.company.website && (
              <a 
                href={job.company.website} 
                target="_blank" 
                rel="noreferrer" 
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-coral hover:underline focus:outline-none focus:underline"
              >
                Visit Company Website →
              </a>
            )}
          </div>

          {job.company.description && (
            <div className="card border border-slate/10 bg-paper p-8 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-ink-text font-heading">About the Company</h2>
              <p className="text-sm text-slate leading-relaxed whitespace-pre-line">{job.company.description}</p>
            </div>
          )}

          <div className="card border border-slate/10 bg-paper p-8 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-ink-text font-heading">Job Description</h2>
            <p className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Right Column (35% width, Sticky) */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <div className="card border border-slate/10 bg-paper p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-ink-text font-heading pb-2 border-b border-slate/10">Job Summary</h2>
            
            <div className="space-y-4">
              {/* Salary */}
              {job.salary && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate">Salary Offered</span>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-3 py-1.5 text-sm font-semibold text-amber w-fit">
                    <span className="font-bold">₹</span>
                    <span className="font-mono">{formatSalary(job.salary).replace('₹', '')}</span>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate">Location</span>
                  <span className="text-sm font-medium text-ink-text">{job.location}</span>
                </div>
              </div>

              {/* Posted Date */}
              <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate">Date Posted</span>
                  <span className="text-sm font-mono font-medium text-ink-text">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isJobSeeker && (
              <div className="pt-4 border-t border-slate/10 flex flex-col gap-3">
                {has_applied ? (
                  <>
                    <span className="w-full text-center rounded-lg bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-600">
                      Already Applied
                    </span>
                    <Link to="/jobseeker/applications" className="btn-secondary w-full text-center py-2.5">
                      View My Applications
                    </Link>
                  </>
                ) : (
                  <Link to={`/jobs/${job.id}/apply`} className="btn-primary w-full text-center py-2.5">
                    Apply Now
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
