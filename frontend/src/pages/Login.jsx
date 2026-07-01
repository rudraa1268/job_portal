import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ErrorAlert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { parseApiError } from '../services/api';

export default function Login() {
  const { login, isAuthenticated, isEmployer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to={from || (isEmployer ? '/employer/dashboard' : '/jobseeker/dashboard')}
        replace
      />
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Username and password are required.');
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(form);
      const dest =
        from ||
        (user.role === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate/10 bg-paper shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side (Form) */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-paper">
          <h1 className="mb-1 text-2xl font-bold text-ink-text font-heading">Welcome back</h1>
          <p className="mb-6 text-sm text-slate">Sign in to your account</p>

          <ErrorAlert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="label-field">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="input-field"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-field">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? <LoadingSpinner size="sm" /> : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-coral hover:underline focus:outline-none focus:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Right Side (Decorative) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-ink text-white relative dot-grid-dark overflow-hidden min-h-[450px]">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold font-heading leading-tight text-white">
              Find your next opportunity.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Join thousands of professionals finding work, connecting with top companies, and advancing their careers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
