import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorAlert, { PageLoader } from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { jobService, parseApiError } from '../../services/api';
import { toTitleCase } from '../../utils/formatters';

export default function ApplyJob() {
  const id = useParams().id;
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    jobService
      .getJob(id)
      .then((data) => {
        if (data.has_applied) {
          navigate(`/jobs/${id}`, { replace: true });
        } else {
          setJob(data.job);
        }
      })
      .catch((err) => setError(parseApiError(err)));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      setError('Please write a cover letter.');
      return;
    }
    setSubmitting(true);
    try {
      await jobService.apply(id, coverLetter);
      navigate('/jobseeker/applications');
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!job && !error) return <PageLoader />;
  if (error && !job) return <ErrorAlert message={error} />;

  const title = job ? toTitleCase(job.title) : '';

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate/10 bg-paper shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side (Form + Summary) */}
        <div className="p-8 sm:p-12 flex flex-col bg-paper">
          {/* Summary Card */}
          <div className="mb-6 rounded-xl border border-slate/10 bg-slate/5 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">Applying For</span>
            <h2 className="text-lg font-bold text-ink-text font-heading mt-1">{title}</h2>
            <p className="text-sm text-slate">{job.company.name} · {job.location}</p>
          </div>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cover_letter" className="label-field">Cover Letter</label>
              <textarea
                id="cover_letter"
                className="input-field min-h-[200px] resize-none"
                rows={8}
                placeholder="Tell the employer why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-primary flex-1 py-3"
              >
                {submitting ? <LoadingSpinner size="sm" /> : 'Submit Application'}
              </button>
              <Link 
                to={`/jobs/${id}`} 
                className="inline-flex items-center justify-center rounded-lg border border-coral text-coral bg-transparent px-4 py-3 text-sm font-semibold transition-all duration-150 ease-in-out hover:bg-coral/5 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 flex-1 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Right Side (Decorative) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-ink text-white relative dot-grid-dark overflow-hidden min-h-[500px]">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold font-heading leading-tight text-white">
              Tell your story.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Use your cover letter to highlight your relevant experience, key achievements, and explain why you're excited about joining the company.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
