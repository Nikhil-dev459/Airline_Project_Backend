import React, { useState } from 'react';
import { X, Check, Armchair, Shield, Sparkles, ChevronRight, Info } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function SeatMapModal() {
  const {
    isSeatMapOpen,
    setIsSeatMapOpen,
    selectedFlight,
    selectedSeats,
    setSelectedSeats,
    passengers,
    proceedToCheckout
  } = useFlight();

  if (!isSeatMapOpen || !selectedFlight) return null;

  // Occupied seats for realism
  const occupiedSeats = ['1B', '2A', '4C', '5B', '8A', '9D', '11B', '12E', '14C'];

  const cabinLayout = [
    {
      tier: 'First Class Suites',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      priceExtra: 12000,
      rows: [
        { rowNumber: '1', seats: [{ id: '1A', type: 'window' }, { id: '1B', type: 'aisle' }, null, { id: '1C', type: 'aisle' }, { id: '1D', type: 'window' }] },
        { rowNumber: '2', seats: [{ id: '2A', type: 'window' }, { id: '2B', type: 'aisle' }, null, { id: '2C', type: 'aisle' }, { id: '2D', type: 'window' }] },
      ]
    },
    {
      tier: 'Business Class Lie-Flat',
      badge: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
      priceExtra: 5500,
      rows: [
        { rowNumber: '3', seats: [{ id: '3A', type: 'window' }, { id: '3B', type: 'aisle' }, null, { id: '3C', type: 'aisle' }, { id: '3D', type: 'window' }] },
        { rowNumber: '4', seats: [{ id: '4A', type: 'window' }, { id: '4B', type: 'aisle' }, null, { id: '4C', type: 'aisle' }, { id: '4D', type: 'window' }] },
        { rowNumber: '5', seats: [{ id: '5A', type: 'window' }, { id: '5B', type: 'aisle' }, null, { id: '5C', type: 'aisle' }, { id: '5D', type: 'window' }] },
        { rowNumber: '6', seats: [{ id: '6A', type: 'window' }, { id: '6B', type: 'aisle' }, null, { id: '6C', type: 'aisle' }, { id: '6D', type: 'window' }] },
      ]
    },
    {
      tier: 'Economy Comfort',
      badge: 'bg-slate-800 text-slate-300 border-white/10',
      priceExtra: 0,
      rows: [
        { rowNumber: '7', seats: [{ id: '7A', type: 'window' }, { id: '7B', type: 'middle' }, { id: '7C', type: 'aisle' }, null, { id: '7D', type: 'aisle' }, { id: '7E', type: 'middle' }, { id: '7F', type: 'window' }] },
        { rowNumber: '8', seats: [{ id: '8A', type: 'window' }, { id: '8B', type: 'middle' }, { id: '8C', type: 'aisle' }, null, { id: '8D', type: 'aisle' }, { id: '8E', type: 'middle' }, { id: '8F', type: 'window' }] },
        { rowNumber: '9', seats: [{ id: '9A', type: 'window' }, { id: '9B', type: 'middle' }, { id: '9C', type: 'aisle' }, null, { id: '9D', type: 'aisle' }, { id: '9E', type: 'middle' }, { id: '9F', type: 'window' }] },
        { rowNumber: '10', seats: [{ id: '10A', type: 'window' }, { id: '10B', type: 'middle' }, { id: '10C', type: 'aisle' }, null, { id: '10D', type: 'aisle' }, { id: '10E', type: 'middle' }, { id: '10F', type: 'window' }] },
        { rowNumber: '11', seats: [{ id: '11A', type: 'window' }, { id: '11B', type: 'middle' }, { id: '11C', type: 'aisle' }, null, { id: '11D', type: 'aisle' }, { id: '11E', type: 'middle' }, { id: '11F', type: 'window' }] },
        { rowNumber: '12', seats: [{ id: '12A', type: 'window' }, { id: '12B', type: 'middle' }, { id: '12C', type: 'aisle' }, null, { id: '12D', type: 'aisle' }, { id: '12E', type: 'middle' }, { id: '12F', type: 'window' }] },
      ]
    }
  ];

  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < passengers) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        // Replace first selected seat
        const updated = [...selectedSeats.slice(1), seatId];
        setSelectedSeats(updated);
      }
    }
  };

  const getSeatExtraPrice = (seatId) => {
    const row = parseInt(seatId);
    if (row <= 2) return 12000;
    if (row <= 6) return 5500;
    return 0;
  };

  const totalSeatExtra = selectedSeats.reduce((sum, seat) => sum + getSeatExtraPrice(seat), 0);
  const totalBasePrice = (selectedFlight.price || 4500) * passengers;
  const finalPrice = totalBasePrice + totalSeatExtra;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold font-display text-white">Select Your Cabin Seats</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Flight {selectedFlight.flightNumber} • {selectedFlight.departureAirportId} → {selectedFlight.arrivalAirportId} • Select {passengers} {passengers === 1 ? 'seat' : 'seats'}
            </p>
          </div>

          <button
            onClick={() => setIsSeatMapOpen(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Cabin Legend & Interactive Map */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8">
          
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-800 border border-white/20" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-[10px] shadow-glow">
                ✓
              </div>
              <span className="font-semibold text-brand-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-900/40 border border-white/5 opacity-40 flex items-center justify-center text-[10px] text-slate-600">
                ✕
              </div>
              <span className="text-slate-500">Occupied</span>
            </div>
          </div>

          {/* Aircraft Fuselage Outline */}
          <div className="max-w-md mx-auto bg-slate-950/90 rounded-t-[100px] rounded-b-3xl border-2 border-white/10 p-6 pt-12 shadow-2xl relative">
            
            {/* Cockpit Indicator */}
            <div className="text-center pb-8">
              <div className="w-16 h-3 bg-brand-500/30 rounded-full mx-auto mb-2" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                AIRCRAFT NOSE • PILOT CABIN
              </span>
            </div>

            {/* Cabins Sections */}
            <div className="space-y-8">
              {cabinLayout.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  
                  {/* Tier Title */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${section.badge}`}>
                      {section.tier}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {section.priceExtra > 0 ? `+₹${section.priceExtra.toLocaleString()}` : 'Included'}
                    </span>
                  </div>

                  {/* Seat Rows Grid */}
                  <div className="space-y-2">
                    {section.rows.map((row) => (
                      <div key={row.rowNumber} className="flex items-center justify-center gap-2">
                        
                        {/* Row number left */}
                        <span className="w-4 text-[10px] font-mono text-slate-500 text-right">{row.rowNumber}</span>

                        {/* Seats */}
                        <div className="flex items-center gap-1.5">
                          {row.seats.map((seat, seatIdx) => {
                            if (!seat) {
                              return <div key={`aisle-${seatIdx}`} className="w-6 text-center text-[10px] text-slate-600 font-mono">||</div>;
                            }

                            const isOccupied = occupiedSeats.includes(seat.id);
                            const isSelected = selectedSeats.includes(seat.id);

                            return (
                              <button
                                key={seat.id}
                                type="button"
                                disabled={isOccupied}
                                onClick={() => handleSeatClick(seat.id)}
                                className={`w-8 h-8 rounded-lg text-[11px] font-bold font-mono transition-all flex items-center justify-center ${
                                  isOccupied
                                    ? 'bg-slate-900 text-slate-600 border border-white/5 cursor-not-allowed opacity-30'
                                    : isSelected
                                    ? 'bg-brand-500 text-white shadow-glow ring-2 ring-brand-400 scale-105'
                                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 hover:border-brand-500/50'
                                }`}
                                title={`${seat.id} (${seat.type}) - ${section.tier}`}
                              >
                                {isSelected ? '✓' : seat.id.slice(-1)}
                              </button>
                            );
                          })}
                        </div>

                        {/* Row number right */}
                        <span className="w-4 text-[10px] font-mono text-slate-500 text-left">{row.rowNumber}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            {/* Aircraft Tail Indicator */}
            <div className="text-center pt-8 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              REAR GALLEY & RESTROOMS
            </div>

          </div>

        </div>

        {/* Modal Footer & Price Bar */}
        <div className="p-6 border-t border-white/10 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Selected Seats:</span>
              <div className="flex gap-1.5">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold font-mono">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-amber-400 font-medium">Please select {passengers} seat(s)</span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Base Price: ₹{totalBasePrice.toLocaleString()} {totalSeatExtra > 0 && `+ Cabin Upgrade: ₹${totalSeatExtra.toLocaleString()}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Total Price</span>
              <div className="text-2xl font-bold font-display text-white">
                ₹{finalPrice.toLocaleString()}
              </div>
            </div>

            <button
              onClick={proceedToCheckout}
              disabled={selectedSeats.length < passengers}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Confirm & Passenger Info</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
