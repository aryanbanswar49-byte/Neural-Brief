import React, { useState } from 'react';
import { Clock, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header className="border-b border-outline-variant/30 dark:border-zinc-800/40 pb-8">
        <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-on-background dark:text-zinc-100 tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="font-serif text-lg text-on-surface-variant dark:text-zinc-350 max-w-2xl leading-relaxed">
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

          {submitted ? (
            <div className="p-6 bg-primary/10 border border-primary/30 rounded-lg text-center space-y-3">
              <CheckCircle2 size={36} className="text-primary mx-auto" />
              <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100">Message Received</h3>
              <p className="font-serif text-sm text-on-surface-variant dark:text-zinc-300 max-w-sm mx-auto">
                Thank you for contacting us. Our editorial team will review your submission and get back to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-primary dark:text-primary-container hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Grid: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Elena Rostova" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="elena@example.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">
                  Subject
                </label>
                <input 
                  type="text" 
                  placeholder="Story pitch, feedback, advertising, etc." 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-sans text-xs font-bold text-on-surface-variant dark:text-zinc-400 mb-2">
                  Message Details
                </label>
                <textarea 
                  placeholder="How can we collaborate or assist you?" 
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-800 rounded p-3 bg-background dark:bg-zinc-950 text-on-background dark:text-zinc-100 font-serif text-base focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all leading-relaxed"
                />
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-white font-sans font-semibold py-3 px-6 rounded transition-colors focus:outline-none shadow-sm disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Sending...</span>
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
          <div className="bg-surface dark:bg-zinc-900 border border-outline-variant dark:border-zinc-800 rounded-lg p-6 transition-colors duration-200">
            <h3 className="font-sans font-bold text-lg text-on-background dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <span>Desk Hours</span>
            </h3>
            <p className="font-serif text-base text-on-surface-variant dark:text-zinc-350 leading-relaxed mb-4">
              Our press desk accepts inquiries and pitches during regular operations.
            </p>
            <div className="font-sans text-xs text-on-surface-variant dark:text-zinc-400 space-y-2 border-t border-outline-variant/30 dark:border-zinc-800/40 pt-4">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-bold text-on-background dark:text-zinc-200">9:00 AM – 6:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span className="font-bold text-on-background dark:text-zinc-200">Closed (Digital Submission Only)</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
