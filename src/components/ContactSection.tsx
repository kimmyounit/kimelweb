import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { soundEngine } from '../utils/soundEffects';
import {
  Send,
  CheckCircle2,
  Mail,
  Building2,
  Calendar,
  Globe,
  Instagram,
  Music,
  Youtube,
  Twitter
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { profile, submitInquiry } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'Business' as 'Business' | 'Collaboration' | 'Partnership' | 'Event Invitation' | 'Press',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inquiryTypes: ('Business' | 'Collaboration' | 'Partnership' | 'Event Invitation' | 'Press')[] = [
    'Business',
    'Collaboration',
    'Partnership',
    'Event Invitation',
    'Press'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    soundEngine.playClick();
    submitInquiry({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      inquiryType: formData.inquiryType,
      message: formData.message
    });

    setSubmitted(true);
    setErrorMsg('');
    setFormData({
      name: '',
      email: '',
      company: '',
      inquiryType: 'Business',
      message: ''
    });
  };

  return (
    <section id="contact" className="relative w-full py-28 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono-code text-neutral-400 uppercase tracking-widest mb-3">
              <span>Section 06</span>
              <span aria-hidden="true">·</span>
              <span>Liaison & Engagement</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              Official Contact
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-400 font-light leading-relaxed">
            Direct channels for global commercial engagements, artistic collaborations, brand partnerships, and headline invitations.
          </p>
        </div>

        {/* 2-Column Split: Representation & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Management & Official Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-neutral-950 border border-white/10 space-y-6">
              <span className="text-xs uppercase font-mono-code tracking-widest text-neutral-400 block">
                Executive Agency Representation
              </span>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                {profile.management.agency}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {profile.management.division}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-500 block font-mono-code">General & Management:</span>
                    <a href={`mailto:${profile.management.email}`} className="text-neutral-200 hover:text-white underline">
                      {profile.management.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-500 block font-mono-code">Booking & Touring:</span>
                    <a href={`mailto:${profile.management.bookingEmail}`} className="text-neutral-200 hover:text-white underline">
                      {profile.management.bookingEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-neutral-500 block font-mono-code">Press & Editorial:</span>
                    <a href={`mailto:${profile.management.pressEmail}`} className="text-neutral-200 hover:text-white underline">
                      {profile.management.pressEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social Channels */}
            <div className="p-8 bg-neutral-950 border border-white/10 space-y-4">
              <span className="text-xs uppercase font-mono-code tracking-widest text-neutral-400 block">
                Verified Social Channels
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a
                  href={profile.socials.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Music className="w-4 h-4" />
                  <span>Spotify</span>
                </a>
                <a
                  href={profile.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </a>
                <a
                  href={profile.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-white/5 hover:border-white/20 text-neutral-300 hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>X / Twitter</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 p-8 md:p-10 bg-neutral-950 border border-white/10">
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                  Transmission Received
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
                  Thank you for your dispatch. Your inquiry has been logged into the executive management system and our liaison team will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors"
                >
                  Send Another Dispatch
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400 mb-3">
                    Nature of Inquiry *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inquiryTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          soundEngine.playClick();
                          setFormData({ ...formData, inquiryType: type });
                        }}
                        className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded transition-all cursor-pointer ${
                          formData.inquiryType === type
                            ? 'bg-white text-black shadow-sm'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marc Jacobs / Elena Rostova"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400 mb-2">
                      Corporate / Agency Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/15 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400 mb-2">
                    Organization / Entity (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Universal Music, Vogue International, Festival Organizers"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400 mb-2">
                    Proposal / Project Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Outline your timeline, scope, budget parameters, and venue / broadcast details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 font-mono-code">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Official Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
