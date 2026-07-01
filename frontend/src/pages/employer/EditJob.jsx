import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { employerService, parseApiError } from '../../services/api';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', location: '', salary: '', is_active: true });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    employerService
      .getJob(id)
      .then((data) => {
        setJob(data.job);
        setForm({
          title: data.job.title,
          description: data.job.description,
          location: data.job.location,
          salary: data.job.salary || '',
          is_active: data.job.is_active,
        });
      })
      .catch((err) => setError(parseApiError(err)));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await employerService.updateJob(id, { ...form, salary: form.salary || null });
      navigate('/employer/jobs');
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!job && !error) return <PageLoader />;
  if (error && !job) return <ErrorAlert message={error} />;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-navy-800">Edit Job</h1>
      <p className="mb-6 text-sm text-slate-500">Company: {job.company.name}</p>
      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label-field">Job Title</label>
          <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea className="input-field" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Location</label>
            <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div>
            <label className="label-field">Salary</label>
            <input className="input-field" type="number" step="0.01" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active listing
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <LoadingSpinner size="sm" /> : 'Save Changes'}
          </button>
          <Link to="/employer/jobs" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
