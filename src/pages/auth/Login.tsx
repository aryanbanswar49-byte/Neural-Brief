import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle2, Lock, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resetMessage, setResetMessage] = useState('');

  const { login, resetPassword, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('loading');
    setResetMessage('');

    try {
      const res = await resetPassword(resetEmail);
      if (res.success) {
        setResetStatus('success');
        setResetMessage('Password reset instructions have been sent to your email.');
      } else {
        setResetStatus('error');
        setResetMessage(res.error || 'Failed to send password reset email.');
      }
    } catch (err: any) {
      setResetStatus('error');
      setResetMessage(err.message || 'Failed to process request.');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-8 shadow-sm transition-colors duration-200">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Lock size={22} />
            </div>
          </div>

          <h1 className="font-sans font-extrabold text-2xl text-center mb-2 text-on-background dark:text-zinc-100">
            Administrator Access
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-zinc-400 text-center mb-6">
            Sign in with your verified Supabase credentials.
          </p>

          {error && (
            <div className="mb-4 p-3.5 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100 placeholder:text-outline" 
                id="email" 
                name="email" 
                placeholder="editor@theeditorial.com" 
                required 
                type="email"
                autoComplete="email"
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
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-primary dark:text-primary-container hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input 
                className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded-lg focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-serif text-base text-on-surface dark:text-zinc-100" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button 
              className="w-full py-3.5 px-6 mt-4 bg-primary-container text-white font-sans font-semibold rounded-lg hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container/50 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="font-sans text-xs text-on-surface-variant dark:text-zinc-400">
            Protected CMS area &bull; All authentication attempts are encrypted and audited.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 dark:border-zinc-800 pb-3">
              <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 flex items-center gap-2">
                <KeyRound size={18} className="text-primary" />
                Reset Password
              </h3>
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setResetStatus('idle');
                  setResetMessage('');
                }}
                className="text-xs text-on-surface-variant dark:text-zinc-400 hover:text-primary"
              >
                Close
              </button>
            </div>

            <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 leading-relaxed">
              Enter your administrator email address. If an account exists, a secure recovery link will be sent to your inbox.
            </p>

            {resetStatus === 'success' ? (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-primary text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{resetMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {resetStatus === 'error' && (
                  <div className="p-3 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{resetMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-1.5" htmlFor="resetEmail">
                    Account Email
                  </label>
                  <input 
                    type="email" 
                    id="resetEmail"
                    required
                    placeholder="editor@theeditorial.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest dark:bg-zinc-950 border border-outline-variant dark:border-zinc-850 rounded-lg font-serif text-sm text-on-surface dark:text-zinc-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container dark:hover:bg-zinc-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={resetStatus === 'loading'}
                    className="px-4 py-2 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary disabled:opacity-70 flex items-center gap-1.5"
                  >
                    {resetStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : null}
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
