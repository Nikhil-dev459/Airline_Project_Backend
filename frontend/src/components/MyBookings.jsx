import React, { useEffect } from 'react';
import { Plane, Calendar, QrCode, AlertCircle, Ban, CheckCircle2, RefreshCw, Sparkles, BookOpen, Download, Bell } from 'lucide-react';
import { useFlight } from '../context/FlightContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function MyBookings({ setActiveTab }) {
  const { userBookings, loadingBookings, loadUserBookings, showBoardingPass, setIsReminderModalOpen } = useFlight();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  useEffect(() => {
    loadUserBookings(user?.id || 1);
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released.')) return;

    try {
      await api.cancelBooking(bookingId);
      notifySuccess('Booking Cancelled', 'Seats released and refund processed');
      loadUserBookings(user?.id || 1);
    } catch (err) {
      notifyError('Cancellation Failed', err.message);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '10:00 AM';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '10:00 AM';
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'Dec 15, 2026';
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Dec 15, 2026';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            <h2 className="text-3xl font-bold font-display text-white">My Trips & Bookings</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your airline reservations, boarding passes, and cancellations.
          </p>
        </div>

        <button
          onClick={() => loadUserBookings(user?.id || 1)}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loadingBookings ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Bookings List */}
      {loadingBookings ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="glass-panel p-6 rounded-3xl animate-pulse space-y-4 border border-white/10">
              <div className="h-6 w-32 bg-slate-800 rounded" />
              <div className="h-16 bg-slate-800/60 rounded-xl" />
            </div>
          ))}
        </div>
      ) : userBookings.length > 0 ? (
        <div className="space-y-6">
          {userBookings.map((booking) => {
            const flight = booking.flightDetails || {};
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className={`glass-panel rounded-3xl p-6 sm:p-8 border transition-all ${
                  isCancelled
                    ? 'border-rose-500/20 opacity-75'
                    : 'border-white/15 hover:border-brand-500/40 shadow-card'
                }`}
              >
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-500/30 text-brand-300 font-black font-display flex items-center justify-center text-sm">
                      {booking.flightDetails?.flightNumber?.substring(0, 2) || 'AL'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-white">PNR: {booking.pnr || `ALX-${booking.id}`}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isCancelled
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {booking.status || 'BOOKED'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Booked on {formatDate(booking.createdAt)} • Passenger: {booking.passengerName || 'AeroLuxe Guest'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TOTAL FARE</span>
                    <span className="text-xl font-bold font-display text-white">₹{(booking.totalCost || 4500).toLocaleString()}</span>
                  </div>
                </div>

                {/* Route & Times */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
                  
                  <div className="md:col-span-4">
                    <div className="text-2xl font-bold text-white font-display">
                      {flight.departureAirportId || 'DEL'}
                    </div>
                    <p className="text-xs text-slate-400">{flight.departureAirport?.name || 'Delhi International'}</p>
                    <p className="text-sm font-bold text-brand-300 mt-1">{formatTime(flight.departureTime)}</p>
                  </div>

                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-mono font-bold text-slate-300 mb-1">{flight.flightNumber || 'AI 101'}</span>
                    <div className="w-32 h-[2px] bg-gradient-to-r from-brand-500 to-amber-500 relative">
                      <Plane className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90" />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 uppercase">Direct Flight</span>
                  </div>

                  <div className="md:col-span-4 md:text-right">
                    <div className="text-2xl font-bold text-white font-display">
                      {flight.arrivalAirportId || 'BOM'}
                    </div>
                    <p className="text-xs text-slate-400">{flight.arrivalAirport?.name || 'Mumbai International'}</p>
                    <p className="text-sm font-bold text-amber-300 mt-1">{formatTime(flight.arrivalTime)}</p>
                  </div>

                </div>

                {/* Seats & Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Assigned Seats:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-300 font-bold font-mono">
                      {booking.selectedSeats?.join(', ') || '3A'}
                    </span>
                    <span className="text-slate-400 ml-2">Gate:</span>
                    <span className="font-bold text-white font-mono">{flight.boardingGate || 'T3-14A'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isCancelled && (
                      <>
                        <button
                          onClick={() => showBoardingPass(booking)}
                          className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Boarding Pass</span>
                        </button>

                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="py-2 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Flight</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Plane className="w-8 h-8 transform -rotate-45" />
          </div>
          <h3 className="text-lg font-bold text-white">No Flights Booked Yet</h3>
          <p className="text-xs text-slate-400">
            Start planning your next getaway. Browse luxury flights, choose your preferred cabin, and enjoy seamless travel.
          </p>
          <button
            onClick={() => setActiveTab('search')}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow inline-flex items-center gap-2"
          >
            <Plane className="w-4 h-4" />
            <span>Search & Book Flights Now</span>
          </button>
        </div>
      )}

    </div>
  );
}
