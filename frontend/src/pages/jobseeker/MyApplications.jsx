import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import { applicationService, parseApiError } from '../../services/api';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    applicationService
      .getMyApplications()
      .then((data) => setApplications(data.applications))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">My Applications</h1>
      <ErrorAlert message={error} onClose={() => setError('')} />

      {applications.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Job</th>
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Applied</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">{app.job.title}</td>
                  <td className="py-3 pr-4">{app.job.company.name}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={app.status} label={app.status_display} />
                  </td>
                  <td className="py-3 pr-4">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <Link to={`/jobs/${app.job.id}`} className="text-primary-500 hover:underline">
                      View Job
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-slate-500">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn-primary mt-4 inline-flex">Browse Jobs</Link>
        </div>
      )}
    </div>
  );
}
