import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { soundEngine } from '../utils/soundEffects';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  Sparkles,
  ArrowRight,
  KeyRound
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { setIsAdminOpen } = useData();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    soundEngine.playClick();

    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);

      if (result.success) {
        // Automatically open the admin dashboard upon successful login
        setIsAdminOpen(true);
        setUsername('');
        setPassword('');
      } else {
        setErrorMsg(result.error || 'Autentikasi gagal. Periksa username dan password.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-950 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle decorative top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-white/10 via-white to-white/10" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-neutral-400" />
                <span>Executive Management</span>
              </div>
              <h2 className="font-display text-lg font-bold text-white tracking-wide uppercase">
                Admin Portal Login
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              closeLoginModal();
            }}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Masuk untuk mengakses sistem pengelolaan konten resmi, media visual, agenda proyek, dan rilisan berita KIM EL.
          </p>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/30 rounded flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-mono-code tracking-wider text-neutral-400">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-white cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-black border-t border-white/10 flex items-center justify-between text-[10px] font-mono-code text-neutral-500">
          <span>KIM EL CMS SECURE ACCESS</span>
          <span>RESTRICTED PERSONNEL ONLY</span>
        </div>
      </div>
    </div>
  );
};
