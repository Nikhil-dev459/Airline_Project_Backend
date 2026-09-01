import React, { useState } from 'react';
import { Plane, User, Bell, Server, Shield, LogOut, CheckCircle2, ChevronDown, Menu, X, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFlight } from '../context/FlightContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { servicesHealth, setIsArchitectureModalOpen, setIsReminderModalOpen } = useFlight();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);

  const onlineServicesCount = servicesHealth 
    ? Object.values(servicesHealth).filter(s => s.status === 'online' || s.status === 'simulated').length 
    : 5;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070b14]/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Plane className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl tracking-wider gradient-text">AEROLUXE</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Global
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider">PREMIER AIRWAYS</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'search'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plane className="w-4 h-4" />
              Book Flights
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'status'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Flight Status
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              My Trips
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Architecture / Microservices Badge */}
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-all group"
              title="View Microservices Architecture"
            >
              <Server className="w-3.5 h-3.5 text-brand-400 group-hover:animate-pulse" />
              <span>Microservices</span>
            </button>

            {/* Reminder Alert Modal Trigger */}
            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-brand-300 transition-all relative group"
              title="Schedule Flight Email Reminder"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full" />
            </button>

            {/* Backend Services Live Status Indicator */}
            <div className="relative">
              <button
                onClick={() => setIsHealthDropdownOpen(!isHealthDropdownOpen)}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 hover:bg-emerald-950/60 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Backend: {onlineServicesCount}/5 Live</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Health Dropdown */}
              {isHealthDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsHealthDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-72 p-3 rounded-2xl bg-slate-900 border border-white/15 shadow-luxury backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Service Mesh Status</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">100% Active</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {servicesHealth && Object.entries(servicesHealth).map(([key, s]) => (
                      <div key={key} className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-800/50">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-slate-300">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-500">:{s.port}</span>
                          <span className="text-emerald-400 font-semibold">{s.latency}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>API Gateway: 5000</span>
                    <button 
                      onClick={() => setIsArchitectureModalOpen(true)}
                      className="text-brand-400 hover:underline"
                    >
                      View Topology →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth / User Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/80 border border-white/10 hover:border-brand-500/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileMenuOpen && (
                  <div 
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-white/15 shadow-luxury p-2 z-50 animate-in fade-in duration-150"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-100 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('bookings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                      My Bookings & Tickets
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      Admin Dashboard
                    </button>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 shadow-glow transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setActiveTab('search'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${activeTab === 'search' ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Book Flights
            </button>
            <button
              onClick={() => { setActiveTab('status'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${activeTab === 'status' ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Flight Status
            </button>
            <button
              onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${activeTab === 'bookings' ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              My Trips
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${activeTab === 'admin' ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              Admin Portal
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-slate-300 font-medium">{user?.email}</span>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => { openAuthModal('signin'); setIsMobileMenuOpen(false); }}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}
                  className="w-1/2 py-2.5 rounded-xl text-xs font-semibold bg-brand-500 text-white shadow-glow"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
