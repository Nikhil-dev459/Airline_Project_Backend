import React from 'react';
import { Plane, Server, Shield, Heart, Sparkles, Globe2, PhoneCall, Mail } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function Footer({ setActiveTab }) {
  const { setIsArchitectureModalOpen, setIsReminderModalOpen } = useFlight();

  return (
    <footer className="w-full bg-[#05080f] border-t border-white/10 pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Brand & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-glow">
                <Plane className="w-5 h-5 text-white transform -rotate-45" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider gradient-text">AEROLUXE</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The world's premier digital airline platform. Engineering ultra-reliable flight reservations powered by an autonomous, distributed microservice architecture.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsArchitectureModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Server className="w-3.5 h-3.5 text-brand-400" />
                <span>Microservice Topology</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Reservations</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActiveTab('search')} className="hover:text-brand-300 transition-colors">
                  Search & Book Flights
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('status')} className="hover:text-brand-300 transition-colors">
                  Live Flight Radar & Gate Status
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bookings')} className="hover:text-brand-300 transition-colors">
                  My Trips & Boarding Passes
                </button>
              </li>
              <li>
                <button onClick={() => setIsReminderModalOpen(true)} className="hover:text-brand-300 transition-colors">
                  Flight Departure Email Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Global Hubs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Global Hubs</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-brand-400 font-mono font-bold mr-1.5">DEL</span> Delhi Indira Gandhi Int'l</li>
              <li><span className="text-brand-400 font-mono font-bold mr-1.5">BOM</span> Mumbai Chhatrapati Shivaji</li>
              <li><span className="text-brand-400 font-mono font-bold mr-1.5">BLR</span> Bengaluru Kempegowda</li>
              <li><span className="text-brand-400 font-mono font-bold mr-1.5">DXB</span> Dubai International</li>
              <li><span className="text-brand-400 font-mono font-bold mr-1.5">LHR</span> London Heathrow</li>
              <li><span className="text-brand-400 font-mono font-bold mr-1.5">JFK</span> New York JFK</li>
            </ul>
          </div>

          {/* Microservice Specs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">System Architecture</h4>
            <div className="space-y-2 text-[11px] font-mono text-slate-400">
              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                <span>Gateway:</span>
                <span className="text-emerald-400 font-bold">Port 5000</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                <span>Auth Service:</span>
                <span className="text-emerald-400 font-bold">Port 3001</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                <span>Flight Search:</span>
                <span className="text-emerald-400 font-bold">Port 3000</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                <span>Booking Service:</span>
                <span className="text-emerald-400 font-bold">Port 4000</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                <span>Reminder Queue:</span>
                <span className="text-emerald-400 font-bold">Port 3004</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AeroLuxe Airways Corporation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-brand-400" />
              5/5 Microservices Connected
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
