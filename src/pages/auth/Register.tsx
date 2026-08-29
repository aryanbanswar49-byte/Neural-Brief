import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await register(name, email, password);
      if (res.success) {
        setSuccess('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Register Card */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-8 shadow-sm transition-colors duration-200">
          <h2 className="font-sans font-extrabold text-2xl text-center mb-2 text-on-background dark:text-zinc-100">Create Admin Account</h2>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 text-center mb-6">
            Register a new administrator profile to manage the site.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error-container/20 border border-error-container text-error text-xs rounded flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold rounded flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="name">
                Full Name
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100 placeholder:text-outline" 
                id="name" 
                name="name" 
                placeholder="Elena Rostova" 
                required 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100 placeholder:text-outline" 
                id="email" 
                name="email" 
                placeholder="editor@theeditorial.com" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="password">
                Password
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100" 
                id="password" 
                name="password" 
                placeholder="At least 6 characters" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="••••••••" 
                required 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              className="w-full py-3 px-6 mt-4 bg-primary-container text-white font-sans font-semibold rounded hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container/50 flex items-center justify-center gap-2"
              type="submit"
              disabled={submitting || !!success}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                'Register Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center">
            <span className="font-sans text-xs text-on-surface-variant dark:text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary dark:text-primary-container font-semibold hover:underline">
                Log In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
