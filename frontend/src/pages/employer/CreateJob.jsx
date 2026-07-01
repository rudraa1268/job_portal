import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { employerService, parseApiError } from '../../services/api';

export default function CreateJob() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [needsCompany, setNeedsCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const [companyId, setCompanyId] = useState('');
  const [company, setCompany] = useState({ name: '', description: '', website: '' });
  const [job, setJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    is_active: true,
  });

  useEffect(() => {
    employerService
      .getCompanies()
      .then((data) => {
        setCompanies(data.companies);
        setNeedsCompany(data.companies.length === 0);
        if (data.companies.length) setCompanyId(String(data.companies[0].id));
      })
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setErrors({});

    const payload = needsCompany
      ? { company: { ...company }, job: { ...job, salary: job.salary || null } }
      : { company_id: Number(companyId), job: { ...job, salary: job.salary || null } };

    try {
      await employerService.createJob(payload);
      navigate('/employer/jobs');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-800">Post a New Job</h1>
      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="card space-y-6">
        {needsCompany && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-navy-800">Company Information</h2>
            <p className="mb-4 text-sm text-slate-500">Create your company profile before posting your first job.</p>
            <div className="space-y-4">
              <div>
                <label className="label-field">Company Name</label>
                <input className="input-field" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} required />
                {errors.company?.name && <p className="mt-1 text-xs text-red-600">{errors.company.name}</p>}
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea className="input-field" rows={4} value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} required />
              </div>
              <div>
                <label className="label-field">Website (optional)</label>
                <input className="input-field" type="url" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {!needsCompany && (
          <div>
            <label className="label-field">Select Company</label>
            <select className="input-field" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold text-navy-800">Job Details</h2>
          <div className="space-y-4">
            <div>
              <label className="label-field">Job Title</label>
              <input className="input-field" value={job.title} onChange={(e) => setJob({ ...job, title: e.target.value })} required />
              {errors.job?.title && <p className="mt-1 text-xs text-red-600">{errors.job.title}</p>}
            </div>
            <div>
              <label className="label-field">Description</label>
              <textarea className="input-field" rows={6} value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field">Location</label>
                <input className="input-field" value={job.location} onChange={(e) => setJob({ ...job, location: e.target.value })} required />
              </div>
              <div>
                <label className="label-field">Salary (optional)</label>
                <input className="input-field" type="number" step="0.01" value={job.salary} onChange={(e) => setJob({ ...job, salary: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={job.is_active} onChange={(e) => setJob({ ...job, is_active: e.target.checked })} />
              Active listing
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <LoadingSpinner size="sm" /> : 'Create Job'}
          </button>
          <Link to="/employer/jobs" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
