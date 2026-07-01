import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';
import { employerService, parseApiError } from '../../services/api';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadJobs = () => {
    employerService
      .getMyJobs()
      .then((data) => setJobs(data.jobs))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(loadJobs, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? All applications will be removed.')) return;
    setDeletingId(id);
    try {
      await employerService.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-navy-800">My Jobs</h1>
        <Link to="/employer/jobs/create" className="btn-primary">Post New Job</Link>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {jobs.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Title</th>
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Location</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">{job.title}</td>
                  <td className="py-3 pr-4">{job.company.name}</td>
                  <td className="py-3 pr-4">{job.location}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge
                      status={job.is_active ? 'accepted' : 'rejected'}
                      label={job.is_active ? 'Active' : 'Inactive'}
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/employer/jobs/${job.id}/edit`} className="text-primary-500 hover:underline">Edit</Link>
                      <Link to={`/employer/jobs/${job.id}/applicants`} className="text-primary-500 hover:underline">Applicants</Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        disabled={deletingId === job.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === job.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-slate-500">No jobs posted yet.</p>
          <Link to="/employer/jobs/create" className="btn-primary mt-4 inline-flex">Post Your First Job</Link>
        </div>
      )}
    </div>
  );
}
