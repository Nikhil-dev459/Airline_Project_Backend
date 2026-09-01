import React from 'react';
import { X, Plane, Luggage, Coffee, ShieldCheck, Wifi, Sparkles, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function FlightDetailsModal() {
  const {
    isFlightDetailsOpen,
    setIsFlightDetailsOpen,
    selectedFlight,
    openSeatSelection
  } = useFlight();

  if (!isFlightDetailsOpen || !selectedFlight) return null;

  const formatTime = (iso) => {
    if (!iso) return '10:00 AM';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:00 AM';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-display font-black">
              {selectedFlight.flightNumber?.substring(0, 2) || 'AL'}
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                {selectedFlight.airline || 'AeroLuxe Air'} • {selectedFlight.flightNumber}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedFlight.departureAirportId} → {selectedFlight.arrivalAirportId} • Gate {selectedFlight.boardingGate || 'T3-14A'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFlightDetailsOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Flight Route Timeline */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold font-display text-white">{selectedFlight.departureAirportId}</span>
                <p className="text-xs text-slate-400">{selectedFlight.departureAirport?.name || 'Delhi International Airport'}</p>
                <p className="text-sm font-bold text-brand-300 mt-0.5">{formatTime(selectedFlight.departureTime)}</p>
              </div>

              <div className="flex flex-col items-center px-4">
                <Plane className="w-5 h-5 text-brand-400 transform rotate-90" />
                <div className="w-24 h-[2px] bg-gradient-to-r from-brand-500 to-amber-500 my-1" />
                <span className="text-[10px] text-slate-500 font-medium">Non-Stop</span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-display text-white">{selectedFlight.arrivalAirportId}</span>
                <p className="text-xs text-slate-400">{selectedFlight.arrivalAirport?.name || 'Mumbai International Airport'}</p>
                <p className="text-sm font-bold text-amber-300 mt-0.5">{formatTime(selectedFlight.arrivalTime)}</p>
              </div>
            </div>
          </div>

          {/* Aircraft Specs */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-semibold">AIRCRAFT MODEL</span>
              <p className="font-bold text-white text-sm">{selectedFlight.airplaneDetail?.modelNumber || 'Airbus A350-900 Ultra'}</p>
              <p className="text-slate-400 text-[11px]">Modern composite airframe with reduced cabin altitude</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-semibold">SEAT CONFIGURATION</span>
              <p className="font-bold text-white text-sm">{selectedFlight.totalSeats} Total Remaining</p>
              <p className="text-slate-400 text-[11px]">First, Business, and Economy Comfort</p>
            </div>
          </div>

          {/* Baggage & Inclusions */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Baggage Allowance & Amenities</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-3">
                <Luggage className="w-4 h-4 text-brand-400 shrink-0" />
                <span><strong>Cabin Baggage:</strong> 1 Piece up to 7kg + 1 Laptop bag</span>
              </div>
              <div className="flex items-center gap-3">
                <Luggage className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Check-in Baggage:</strong> 25kg complimentary per passenger</span>
              </div>
              <div className="flex items-center gap-3">
                <Coffee className="w-4 h-4 text-sky-400 shrink-0" />
                <span><strong>Dining:</strong> Complimentary multi-course hot gourmet meal & beverages</span>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Connectivity:</strong> In-flight high-speed satellite WiFi & USB charging</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <strong className="text-slate-200">Flexible Cancellation Policy:</strong>
            <p>Free cancellation up to 2 hours prior to scheduled departure. Instant seat release handled automatically via Flight-Booking-Service microservice transaction rollback.</p>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-white/10 bg-slate-950/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Fare starting at</span>
            <p className="text-xl font-bold font-display text-white">₹{(selectedFlight.price || 4500).toLocaleString()}</p>
          </div>

          <button
            onClick={() => {
              setIsFlightDetailsOpen(false);
              openSeatSelection(selectedFlight);
            }}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center gap-2"
          >
            <span>Proceed to Seat Selection</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
