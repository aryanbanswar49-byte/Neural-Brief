import React, { useState } from 'react';
import { contactApi } from '../../services/api';
import { Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../../components/SEO';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await contactApi.sendMessage({ name, email, subject, message });
      if (res.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError(res.message || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SEO 
        title="Contact Neural Brief Desk | Neural Brief"
        description="Have an inquiry, feedback, or a story pitch? Reach out to our editorial desk."
        slug="contact"
      />

      {/* Page Header */}
      <header className="border-b border-outline-variant/30 dark:border-zinc-800/40 pb-8">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-300 max-w-2xl leading-relaxed">
          Have an inquiry, feedback, or a story pitch? Reach out to our editorial desk.
        </p>
      </header>

      {/* Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left: Contact Form (8 cols on large screens) */}
        <div className="lg:col-span-8 bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800/60 rounded-xl p-6 md:p-8 transition-colors duration-200">
          <h2 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100 mb-6">
            Send an Editorial Inquiry
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error-container text-error text-xs rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-8 bg-primary/10 border border-primary/30 rounded-xl text-center space-y-4">
              <CheckCircle2 size={40} className="text-primary mx-auto" />
              <h3 className="font-sans font-bold text-xl text-on-background dark:text-zinc-100">Message Received</h3>
              <p className="font-serif text-base text-on-surface-variant dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                Thank you for contacting us. Our editorial team will review your submission and get back to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:bg-primary transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Grid: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2" htmlFor="contactName">
                    Your Name
                  </label>
                  <input 
                    id="contactName"
                    type="text" 
                    placeholder="Elena Rostova" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2" htmlFor="contactEmail">
                    Email Address
                  </label>
                  <input 
                    id="contactEmail"
                    type="email" 
                    placeholder="elena@example.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2" htmlFor="contactSubject">
                  Subject
                </label>
                <input 
                  id="contactSubject"
                  type="text" 
                  placeholder="Story pitch, feedback, general inquiry, etc." 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2" htmlFor="contactMessage">
                  Message Details
                </label>
                <textarea 
                  id="contactMessage"
                  placeholder="How can our editorial team assist or collaborate with you?" 
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded-lg p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all leading-relaxed"
                />
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-white font-sans font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right: Info Widget (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-8">

          {/* Card: Hours */}
          <div className="bg-surface dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-xl p-6 transition-colors duration-200">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <span>Desk Hours</span>
            </h3>
            <p className="font-serif text-base text-on-surface-variant dark:text-zinc-300 leading-relaxed mb-4">
              Our press desk accepts inquiries and pitches during regular operations.
            </p>
            <div className="font-sans text-xs text-on-surface-variant dark:text-zinc-400 space-y-2.5 border-t border-outline-variant/30 dark:border-zinc-800/40 pt-4">
              <div className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="font-bold text-on-background dark:text-zinc-200">9:00 AM – 6:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday – Sunday</span>
                <span className="font-bold text-on-background dark:text-zinc-200">Digital Inquiries Only</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
