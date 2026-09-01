import React, { useState } from 'react';
import { Plane, Search, Clock, MapPin, Sparkles, CheckCircle2, AlertCircle, Bell, ArrowRight } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function FlightStatusTracker() {
  const { flights, setIsReminderModalOpen } = useFlight();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlights = flights.filter(f => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.flightNumber?.toLowerCase().includes(q) ||
      f.airline?.toLowerCase().includes(q) ||
      f.departureAirportId?.toLowerCase().includes(q) ||
      f.arrivalAirportId?.toLowerCase().includes(q)
    );
  });

  const getStatusColor = (status = 'ON TIME') => {
    switch (status) {
      case 'BOARDING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse';
      case 'DEPARTED':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'LANDED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '10:30 AM';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:30 AM';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Fleet Telemetry & Gate Status</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
          Live Flight <span className="gradient-text">Tracker</span>
        </h2>
        <p className="text-sm text-slate-400">
          Track active flights across international and domestic corridors with minute-by-minute updates.
        </p>

        {/* Search Input */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white outline-none focus:border-brand-500 shadow-luxury"
            placeholder="Search by Flight Number (e.g. AI 101, EK 512) or Airport (DEL, BOM, DXB)..."
          />
        </div>
      </div>

      {/* Flight Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFlights.map((flight) => {
          const status = flight.status || 'ON TIME';
          return (
            <div
              key={flight.id || flight.flightNumber}
              className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-brand-500/30 transition-all shadow-card space-y-5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-300 font-display font-black text-sm flex items-center justify-center">
                    {flight.flightNumber?.substring(0, 2) || 'AL'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{flight.airline || 'AeroLuxe Air'}</h3>
                    <p className="text-xs font-mono text-brand-300 font-semibold">{flight.flightNumber}</p>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>

              {/* Flight Route & Timeline */}
              <div className="grid grid-cols-3 gap-2 items-center text-center">
                <div>
                  <span className="text-2xl font-black font-display text-white">{flight.departureAirportId}</span>
                  <p className="text-[11px] text-slate-400 truncate">{flight.departureAirport?.name?.split(' ')[0] || 'Departure'}</p>
                  <p className="text-xs font-bold text-brand-300 mt-1">{formatTime(flight.departureTime)}</p>
                </div>

                <div className="flex flex-col items-center">
                  <Plane className="w-5 h-5 text-brand-400 transform rotate-90" />
                  <div className="w-full h-[2px] bg-gradient-to-r from-brand-500 to-amber-500 my-1" />
                  <span className="text-[10px] text-slate-500">Gate {flight.boardingGate || 'T3-12'}</span>
                </div>

                <div>
                  <span className="text-2xl font-black font-display text-white">{flight.arrivalAirportId}</span>
                  <p className="text-[11px] text-slate-400 truncate">{flight.arrivalAirport?.name?.split(' ')[0] || 'Arrival'}</p>
                  <p className="text-xs font-bold text-amber-300 mt-1">{formatTime(flight.arrivalTime)}</p>
                </div>
              </div>

              {/* Gate & Carousel Info */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-white/5 text-[11px] text-center">
                <div>
                  <span className="text-slate-500 block">TERMINAL</span>
                  <span className="font-bold text-white">T3</span>
                </div>
                <div>
                  <span className="text-slate-500 block">BOARDING GATE</span>
                  <span className="font-bold text-brand-300">{flight.boardingGate || 'Gate 14'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">BAGGAGE BELT</span>
                  <span className="font-bold text-amber-300">Carousel 4</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Aircraft: {flight.airplaneDetail?.modelNumber || 'Airbus A350'}</span>
                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
