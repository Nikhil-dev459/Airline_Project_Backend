import React, { useRef } from 'react';
import { X, Plane, Printer, Download, QrCode, Shield, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useFlight } from '../context/FlightContext';

export default function BoardingPassModal() {
  const {
    isBoardingPassOpen,
    setIsBoardingPassOpen,
    activeBoardingPassData
  } = useFlight();

  const printRef = useRef();

  if (!isBoardingPassOpen || !activeBoardingPassData) return null;

  const flight = activeBoardingPassData.flightDetails || activeBoardingPassData;
  const pnr = activeBoardingPassData.pnr || 'ALX-7824';
  const seats = activeBoardingPassData.selectedSeats?.join(', ') || '3A';
  const passenger = activeBoardingPassData.passengerName || 'AeroLuxe Guest';
  const cabinClass = activeBoardingPassData.cabinClass || 'Business Class';

  const formatTime = (iso) => {
    if (!iso) return '11:45 AM';
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '11:45 AM';
    }
  };

  const formatDate = (iso) => {
    if (!iso) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Today';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = `AEROLUXE|PNR:${pnr}|FLIGHT:${flight.flightNumber}|SEATS:${seats}|PASSENGER:${passenger}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Top Header Bar */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-brand-400 transform -rotate-45" />
            <h2 className="text-lg font-bold font-display text-white">Digital Boarding Pass</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10"
            >
              <Printer className="w-3.5 h-3.5 text-brand-400" />
              <span>Print Pass</span>
            </button>

            <button
              onClick={() => setIsBoardingPassOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Body (Aesthetic Perforated Ticket Design) */}
        <div className="p-6 sm:p-8 bg-slate-950 flex justify-center" ref={printRef}>
          
          <div className="w-full max-w-3xl bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            
            {/* Left / Main Section */}
            <div className="flex-1 p-6 sm:p-8 space-y-6">
              
              {/* Airline Branding Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-glow">
                    <Plane className="w-5 h-5 text-white transform -rotate-45" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-white">AEROLUXE AIRWAYS</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Priority Boarding Pass</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">CLASS</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {cabinClass}
                  </span>
                </div>
              </div>

              {/* Route & Times */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black font-display text-white">
                    {flight.departureAirportId || flight.departureAirport?.code || 'DEL'}
                  </span>
                  <p className="text-xs text-slate-400">{flight.departureAirport?.name?.split(' ')[0] || 'Delhi'}</p>
                  <p className="text-sm font-bold text-brand-300 mt-1">{formatTime(flight.departureTime)}</p>
                </div>

                <div className="flex flex-col items-center px-4">
                  <span className="text-[11px] font-mono text-slate-400 font-bold mb-1">{flight.flightNumber}</span>
                  <div className="w-24 sm:w-32 h-[2px] bg-gradient-to-r from-brand-400 via-sky-400 to-amber-400 relative">
                    <Plane className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90" />
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">NON-STOP</span>
                </div>

                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-black font-display text-white">
                    {flight.arrivalAirportId || flight.arrivalAirport?.code || 'BOM'}
                  </span>
                  <p className="text-xs text-slate-400">{flight.arrivalAirport?.name?.split(' ')[0] || 'Mumbai'}</p>
                  <p className="text-sm font-bold text-amber-300 mt-1">{formatTime(flight.arrivalTime)}</p>
                </div>
              </div>

              {/* Passenger & Flight Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">PASSENGER</span>
                  <span className="font-bold text-white truncate block">{passenger}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">DATE</span>
                  <span className="font-bold text-white block">{formatDate(flight.departureTime)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">GATE</span>
                  <span className="font-bold text-brand-300 block">{flight.boardingGate || 'T3-14A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">SEATS</span>
                  <span className="font-bold text-amber-300 font-mono block">{seats}</span>
                </div>
              </div>

              {/* Barcode & Security Badge */}
              <div className="flex items-center justify-between pt-2">
                <div className="font-mono text-[10px] text-slate-500 tracking-widest">
                  ||| | | |||| || | || ||||| | || | |||| ||| ||
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Shield className="w-3 h-3" />
                  <span>TSA PRE-CHECK VERIFIED</span>
                </div>
              </div>

            </div>

            {/* Perforation Cutout Indicator (Desktop) */}
            <div className="hidden md:flex flex-col justify-between py-4 relative">
              <div className="w-6 h-6 rounded-full bg-slate-950 -ml-3" />
              <div className="border-r-2 border-dashed border-white/20 h-full my-2" />
              <div className="w-6 h-6 rounded-full bg-slate-950 -ml-3" />
            </div>

            {/* Right / Tear-off Stub Section */}
            <div className="w-full md:w-64 bg-slate-950/90 p-6 sm:p-8 flex flex-col justify-between items-center text-center border-t md:border-t-0 md:border-l border-white/10">
              
              <div className="w-full">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">PNR REFERENCE</span>
                <span className="text-xl font-black font-mono text-brand-400">{pnr}</span>
              </div>

              {/* QR Code */}
              <div className="p-3 bg-white rounded-2xl shadow-glow my-4">
                <QRCodeSVG value={qrPayload} size={110} level="M" />
              </div>

              <div className="w-full space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Flight:</span>
                  <span className="font-bold text-white">{flight.flightNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Seat:</span>
                  <span className="font-bold text-amber-300 font-mono">{seats}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Boarding:</span>
                  <span className="font-bold text-white">45 mins prior</span>
                </div>
              </div>

              <span className="text-[9px] text-slate-600 mt-2">SHOW AT BOARDING GATE</span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
