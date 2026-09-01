import React, { useMemo } from 'react';
import { Plane, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { useFlight } from '../context/FlightContext';
import FlightCard from './FlightCard';
import FlightFilters from './FlightFilters';

export default function FlightResults() {
  const {
    flights,
    loadingFlights,
    originAirport,
    destinationAirport,
    departureDate,
    passengers,
    maxPriceFilter,
    selectedAirlines,
    sortBy
  } = useFlight();

  // Apply filters and sorting
  const processedFlights = useMemo(() => {
    let result = [...flights];

    // Filter by max price
    result = result.filter(f => (f.price || 4500) <= maxPriceFilter);

    // Filter by selected airlines
    if (selectedAirlines.length > 0) {
      result = result.filter(f => selectedAirlines.includes(f.airline));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'time_asc') return new Date(a.departureTime) - new Date(b.departureTime);
      return 0;
    });

    return result;
  }, [flights, maxPriceFilter, selectedAirlines, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Route & Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {originAirport}
            </span>
            <Plane className="w-5 h-5 text-brand-400 transform rotate-90" />
            <span className="text-xl sm:text-2xl font-display font-extrabold text-white">
              {destinationAirport}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {passengers} {passengers === 1 ? 'Traveller' : 'Travellers'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300">
            {processedFlights.length} {processedFlights.length === 1 ? 'Flight' : 'Flights'} Available
          </span>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Flight List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-3 sticky top-24">
          <FlightFilters />
        </div>

        {/* Right Flight List */}
        <div className="lg:col-span-9 space-y-4">
          
          {loadingFlights ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="glass-panel rounded-3xl p-8 border border-white/10 animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="w-32 h-6 bg-slate-800 rounded-lg" />
                    <div className="w-20 h-6 bg-slate-800 rounded-lg" />
                  </div>
                  <div className="h-12 bg-slate-800/60 rounded-xl" />
                  <div className="w-48 h-4 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : processedFlights.length > 0 ? (
            processedFlights.map(flight => (
              <FlightCard key={flight.id || flight.flightNumber} flight={flight} />
            ))
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <Plane className="w-8 h-8 transform -rotate-45" />
              </div>
              <h3 className="text-lg font-bold text-white">No Flights Found for this Route or Filter</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Try widening your budget filter or choosing a popular hub such as DEL, BOM, BLR, DXB, LHR, or JFK.
              </p>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
