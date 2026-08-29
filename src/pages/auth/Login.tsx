import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email address or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Login Card */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-8 shadow-sm transition-colors duration-200">
          <h2 className="font-sans font-extrabold text-2xl text-center mb-2 text-on-background dark:text-zinc-100">Admin Login</h2>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 text-center mb-6">
            Log in to manage articles, categories, and review stats.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error-container/20 border border-error-container text-error text-xs rounded flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100 placeholder:text-outline" 
                id="email" 
                name="email" 
                placeholder="admin@theeditorial.com" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400" htmlFor="password">
                  Password
                </label>
              </div>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              className="w-full py-3 px-6 mt-4 bg-primary-container text-white font-sans font-semibold rounded hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container/50 flex items-center justify-center gap-2"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-5 text-center">
            <span className="font-sans text-xs text-on-surface-variant dark:text-zinc-400">
              Need an admin account?{' '}
              <Link to="/register" className="text-primary dark:text-primary-container font-semibold hover:underline">
                Register here
              </Link>
            </span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="font-sans text-xs text-on-surface-variant dark:text-zinc-400">
            Secure administrative access only. Use <code className="bg-surface-container dark:bg-zinc-900 px-1 py-0.5 rounded">admin@theeditorial.com</code> / <code className="bg-surface-container dark:bg-zinc-900 px-1 py-0.5 rounded">admin123</code> to test.
          </p>
        </div>
      </div>
    </div>
  );
};
