import React from 'react';
import { Plane, Clock, ShieldCheck, Wifi, Coffee, Luggage, ChevronRight, AlertCircle } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function FlightCard({ flight }) {
  const { openSeatSelection, passengers, setSelectedFlight, setIsFlightDetailsOpen } = useFlight();

  // Helper formatting for dates and times
  const formatTime = (iso) => {
    if (!iso) return '10:00 AM';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  const calculateDuration = (depIso, arrIso) => {
    try {
      const diffMs = new Date(arrIso) - new Date(depIso);
      if (isNaN(diffMs) || diffMs <= 0) return '2h 15m';
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${mins}m`;
    } catch {
      return '2h 15m';
    }
  };

  const getAirlineBadge = (name = 'Air India') => {
    if (name.includes('Emirates')) {
      return { bg: 'bg-rose-950/40 text-rose-300 border-rose-500/30', code: 'EK', logoColor: 'text-rose-400' };
    }
    if (name.includes('IndiGo')) {
      return { bg: 'bg-blue-950/40 text-blue-300 border-blue-500/30', code: '6E', logoColor: 'text-blue-400' };
    }
    if (name.includes('British')) {
      return { bg: 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30', code: 'BA', logoColor: 'text-indigo-400' };
    }
    if (name.includes('Singapore')) {
      return { bg: 'bg-amber-950/40 text-amber-300 border-amber-500/30', code: 'SQ', logoColor: 'text-amber-400' };
    }
    return { bg: 'bg-brand-950/40 text-brand-300 border-brand-500/30', code: 'AI', logoColor: 'text-brand-400' };
  };

  const badge = getAirlineBadge(flight.airline || flight.flightNumber);
  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
  const totalPrice = (flight.price || 4500) * passengers;
  const isSeatsLow = (flight.totalSeats || 50) < 30;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-brand-500/40 transition-all duration-300 hover:shadow-glow group relative overflow-hidden">
      
      {/* Top Banner: Airline, Flight No, Aircraft & Urgency Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-sm border ${badge.bg}`}>
            {badge.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-base">{flight.airline || 'AeroLuxe Air'}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {flight.flightNumber}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {flight.airplaneDetail?.modelNumber || 'Airbus A350-900'} • Gate {flight.boardingGate || 'T3-08'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSeatsLow && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              Only {flight.totalSeats} seats left
            </span>
          )}
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {flight.status || 'ON TIME'}
          </span>
        </div>
      </div>

      {/* Main Flight Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
        
        {/* Departure Details */}
        <div className="md:col-span-3">
          <div className="text-2xl sm:text-3xl font-bold font-display text-white">
            {formatTime(flight.departureTime)}
          </div>
          <div className="text-sm font-semibold text-brand-300 mt-0.5">
            {flight.departureAirportId || flight.departureAirport?.code || 'DEL'}
          </div>
          <p className="text-xs text-slate-400 truncate">
            {flight.departureAirport?.name || 'Delhi International Airport'}
          </p>
        </div>

        {/* Flight Trajectory Indicator */}
        <div className="md:col-span-4 flex flex-col items-center justify-center px-2">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-400" />
            <span>{duration}</span>
          </div>

          <div className="w-full flex items-center gap-2 relative">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-400 shrink-0 ring-4 ring-brand-500/20" />
            <div className="flex-1 h-[2px] bg-gradient-to-r from-brand-500 via-sky-400 to-amber-400 relative">
              <Plane className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 ring-4 ring-amber-500/20" />
          </div>

          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-medium">
            Non-Stop • Direct Flight
          </span>
        </div>

        {/* Arrival Details */}
        <div className="md:col-span-2">
          <div className="text-2xl sm:text-3xl font-bold font-display text-white">
            {formatTime(flight.arrivalTime)}
          </div>
          <div className="text-sm font-semibold text-amber-300 mt-0.5">
            {flight.arrivalAirportId || flight.arrivalAirport?.code || 'BOM'}
          </div>
          <p className="text-xs text-slate-400 truncate">
            {flight.arrivalAirport?.name || 'Mumbai International Airport'}
          </p>
        </div>

        {/* Price & Booking Call-to-Action */}
        <div className="md:col-span-3 flex flex-col md:items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Starting from</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              ₹{totalPrice.toLocaleString()}
            </div>
            {passengers > 1 && (
              <span className="text-[10px] text-slate-400">
                ₹{(flight.price || 4500).toLocaleString()} / adult ({passengers} travellers)
              </span>
            )}
          </div>

          <button
            onClick={() => openSeatSelection(flight)}
            className="mt-3 w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 transition-all duration-200 transform group-hover:scale-[1.02]"
          >
            <span>Select Seat & Book</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bottom Amenities & Details Bar */}
      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 hover:text-slate-200">
            <Luggage className="w-3.5 h-3.5 text-brand-400" />
            7kg Cabin + 25kg Check-in
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-200">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            Complimentary Dining
          </span>
          <span className="hidden sm:flex items-center gap-1.5 hover:text-slate-200">
            <Wifi className="w-3.5 h-3.5 text-sky-400" />
            High-Speed WiFi
          </span>
        </div>

        <button
          onClick={() => {
            setSelectedFlight(flight);
            setIsFlightDetailsOpen(true);
          }}
          className="text-brand-300 hover:text-white font-medium hover:underline text-xs flex items-center gap-1"
        >
          Flight Details & Baggage
        </button>
      </div>

    </div>
  );
}
