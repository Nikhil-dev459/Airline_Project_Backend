import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function FlightFilters() {
  const {
    maxPriceFilter,
    setMaxPriceFilter,
    selectedAirlines,
    setSelectedAirlines,
    selectedStops,
    setSelectedStops,
    sortBy,
    setSortBy
  } = useFlight();

  const airlinesList = [
    { name: 'Air India', code: 'AI' },
    { name: 'Emirates', code: 'EK' },
    { name: 'Singapore Airlines', code: 'SQ' },
    { name: 'IndiGo', code: '6E' },
    { name: 'British Airways', code: 'BA' },
    { name: 'Air France', code: 'AF' },
    { name: 'Vistara', code: 'UK' }
  ];

  const toggleAirline = (name) => {
    if (selectedAirlines.includes(name)) {
      setSelectedAirlines(selectedAirlines.filter(a => a !== name));
    } else {
      setSelectedAirlines([...selectedAirlines, name]);
    }
  };

  const handleReset = () => {
    setMaxPriceFilter(80000);
    setSelectedAirlines([]);
    setSelectedStops('all');
    setSortBy('price_asc');
  };

  return (
    <aside className="glass-panel p-5 rounded-3xl border border-white/10 space-y-6">
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-400" />
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">Filters</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort Option */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-400" />
          Sort Flights By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="duration_asc">Fastest Duration</option>
          <option value="time_asc">Earliest Departure</option>
        </select>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-300">Max Budget</span>
          <span className="font-bold text-brand-300 font-mono">₹{maxPriceFilter.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="3000"
          max="80000"
          step="1000"
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>₹3,000</span>
          <span>₹80,000+</span>
        </div>
      </div>

      {/* Stops */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2.5">Flight Stops</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'All Flights' },
            { id: 'direct', label: 'Non-Stop Only' },
          ].map(stop => (
            <button
              key={stop.id}
              type="button"
              onClick={() => setSelectedStops(stop.id)}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                selectedStops === stop.id
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/15'
              }`}
            >
              {stop.label}
            </button>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2.5">Airlines</label>
        <div className="space-y-2">
          {airlinesList.map((airline) => {
            const isChecked = selectedAirlines.length === 0 || selectedAirlines.includes(airline.name);
            return (
              <label
                key={airline.code}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer text-xs text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAirline(airline.name)}
                    className="accent-brand-500 rounded cursor-pointer"
                  />
                  <span>{airline.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{airline.code}</span>
              </label>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
