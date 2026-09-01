import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, User, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    loading
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (authModalTab === 'signin') {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  const handleQuickDemo = (type = 'user') => {
    if (type === 'admin') {
      setEmail('admin@aeroluxe.com');
      setPassword('AdminPass@123');
    } else {
      setEmail('nikhil.travels@aeroluxe.com');
      setPassword('Passenger@123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold font-display text-white">
              {authModalTab === 'signin' ? 'Welcome Back' : 'Create AeroLuxe Account'}
            </h2>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setAuthModalTab('signin')}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                authModalTab === 'signin'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthModalTab('signup')}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                authModalTab === 'signup'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-brand-500"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:border-brand-500"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Fill */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Quick Demo Auto-Fill:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-white/5 truncate"
              >
                👤 Passenger Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-white/5 truncate"
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authModalTab === 'signin' ? 'Sign In to AeroLuxe' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 text-center pt-2">
            Powered by Microservice Auth Service on Port 3001 with JWT Tokens.
          </p>

        </form>

      </div>
    </div>
  );
}
