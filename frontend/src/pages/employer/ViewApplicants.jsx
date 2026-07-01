import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { employerService, parseApiError } from '../../services/api';

const STATUS_OPTIONS = [
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' },
];

export default function ViewApplicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadApplicants = () => {
    employerService
      .getApplicants(id)
      .then(setData)
      .catch((err) => setError(parseApiError(err)));
  };

  useEffect(loadApplicants, [id]);

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await employerService.updateApplicationStatus(applicationId, status);
      loadApplicants();
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setUpdatingId(null);
    }
  };

  if (!data && !error) return <PageLoader />;
  if (error && !data) return <ErrorAlert message={error} />;

  return (
    <div>
      <Link to="/employer/jobs" className="mb-4 inline-block text-sm text-primary-500 hover:underline">
        ← Back to My Jobs
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-navy-800">Applicants</h1>
      <p className="mb-6 text-sm text-slate-500">{data.job.title} · {data.job.company.name}</p>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {data.applications.length ? (
        <div className="space-y-4">
          {data.applications.map((app) => (
            <div key={app.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-navy-800">{app.applicant.username}</h3>
                  <p className="text-sm text-slate-500">{app.applicant.email}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Applied {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={app.status} label={app.status_display} />
              </div>

              {app.cover_letter && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-500"
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                  >
                    {expandedId === app.id ? 'Hide' : 'View'} Cover Letter
                  </button>
                  {expandedId === app.id && (
                    <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-line">
                      {app.cover_letter}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">Update status:</span>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={updatingId === app.id || app.status === opt.value}
                    onClick={() => handleStatusUpdate(app.id, opt.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                  >
                    {updatingId === app.id ? <LoadingSpinner size="sm" /> : opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p className="text-slate-500">No applications received yet.</p>
        </div>
      )}
    </div>
  );
}
