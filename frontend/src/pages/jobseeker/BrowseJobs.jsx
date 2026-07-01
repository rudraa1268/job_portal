import { useEffect, useState } from 'react';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import JobCard from '../../components/JobCard';
import { jobService, parseApiError } from '../../services/api';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    jobService
      .getJobs()
      .then((data) => setJobs(data.jobs))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-text font-heading">Browse Jobs</h1>
        <p className="text-sm text-slate">Explore active job opportunities</p>
      </div>

      <input
        type="search"
        placeholder="Search by title, company, or location..."
        className="input-field mb-6 max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ErrorAlert message={error} onClose={() => setError('')} />

      {filtered.length ? (
        <div className="space-y-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} linkTo={`/jobs/${job.id}`} />
          ))}
        </div>
      ) : (
        <div className="card border border-slate/10 bg-paper">
          <p className="text-slate">No jobs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
