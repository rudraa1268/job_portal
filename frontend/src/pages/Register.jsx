import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert, { SuccessAlert } from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { parseApiError } from '../services/api';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'jobseeker',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setError('');
  };

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = 'Username is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirm_password) next.confirm_password = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setError(parseApiError(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name) => errors[name] && (
    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
  );

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate/10 bg-paper shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side (Form) */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-paper">
          <h1 className="mb-1 text-2xl font-bold text-ink-text font-heading">Create account</h1>
          <p className="mb-6 text-sm text-slate">Register as an Employer or Job Seeker</p>

          <ErrorAlert message={error} onClose={() => setError('')} />
          <SuccessAlert message={success} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="label-field">Username</label>
              <input id="username" name="username" className="input-field" value={form.username} onChange={handleChange} />
              {fieldError('username')}
            </div>
            <div>
              <label htmlFor="email" className="label-field">Email</label>
              <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} />
              {fieldError('email')}
            </div>
            <div>
              <label htmlFor="role" className="label-field">I am a</label>
              <select id="role" name="role" className="input-field bg-paper" value={form.role} onChange={handleChange}>
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="label-field">Phone (optional)</label>
                <input id="phone" name="phone" className="input-field" value={form.phone} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="location" className="label-field">Location (optional)</label>
                <input id="location" name="location" className="input-field" value={form.location} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="label-field">Password</label>
              <input id="password" name="password" type="password" className="input-field" value={form.password} onChange={handleChange} />
              {fieldError('password')}
            </div>
            <div>
              <label htmlFor="confirm_password" className="label-field">Confirm Password</label>
              <input id="confirm_password" name="confirm_password" type="password" className="input-field" value={form.confirm_password} onChange={handleChange} />
              {fieldError('confirm_password')}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? <LoadingSpinner size="sm" /> : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-coral hover:underline focus:outline-none focus:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right Side (Decorative) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-ink text-white relative dot-grid-dark overflow-hidden min-h-[600px]">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold font-heading leading-tight text-white">
              Start your journey with us.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Create an account to explore thousands of available jobs, submit quick applications, or post your company's open roles to hire top talent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
