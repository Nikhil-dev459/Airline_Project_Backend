import React, { useState } from 'react';
import { Plane, Calendar, Users, ArrowRightLeft, Search, Sparkles, MapPin, Check, ChevronDown } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function HeroSearch() {
  const {
    airports,
    tripType,
    setTripType,
    originAirport,
    setOriginAirport,
    destinationAirport,
    setDestinationAirport,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    passengers,
    setPassengers,
    cabinClass,
    setCabinClass,
    swapAirports,
    searchFlights,
    loadingFlights
  } = useFlight();

  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);

  const popularRoutes = [
    { from: 'DEL', to: 'BOM', label: 'Delhi ⇄ Mumbai' },
    { from: 'BOM', to: 'DXB', label: 'Mumbai ⇄ Dubai' },
    { from: 'BLR', to: 'SIN', label: 'Bengaluru ⇄ Singapore' },
    { from: 'DEL', to: 'LHR', label: 'Delhi ⇄ London' },
    { from: 'DEL', to: 'JFK', label: 'Delhi ⇄ New York' },
  ];

  const handleSelectRoute = (from, to) => {
    setOriginAirport(from);
    setDestinationAirport(to);
    searchFlights({ trips: `${from}-${to}` });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFlights();
  };

  const getAirportDisplay = (code) => {
    const found = airports.find(a => a.code === code);
    if (!found) return { code, name: code, city: code };
    return {
      code: found.code,
      name: found.name,
      city: found.City?.name || found.name.split(' ')[0]
    };
  };

  const originDetails = getAirportDisplay(originAirport);
  const destDetails = getAirportDisplay(destinationAirport);

  return (
    <div className="relative pt-6 pb-12 overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-brand-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Microservice-Powered Cloud Flight Reservation System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white mb-4">
            Where Elegance Takes <span className="gradient-text">Flight</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Experience next-generation aviation booking. Seamlessly search worldwide flights, select premium seats, and confirm bookings in milliseconds.
          </p>
        </div>

        {/* Search Engine Glass Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-luxury border border-white/15 backdrop-blur-2xl">
          
          {/* Top Options Bar: Trip Types & Cabin Classes */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
            <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setTripType('oneway')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tripType === 'oneway'
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                One-Way Flight
              </button>
              <button
                type="button"
                onClick={() => setTripType('roundtrip')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tripType === 'roundtrip'
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* Quick Class & Passenger selector */}
            <div className="flex items-center gap-3">
              {/* Passenger count */}
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-slate-400">Travellers:</span>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num} className="bg-slate-900 text-white">
                      {num} {num === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cabin Class Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsClassOpen(!isClassOpen)}
                  className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-200 hover:border-brand-500/50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cabinClass}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isClassOpen && (
                  <div 
                    onMouseLeave={() => setIsClassOpen(false)}
                    className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-white/15 shadow-luxury p-1.5 z-30"
                  >
                    {['Economy', 'Business', 'First Class'].map(tier => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setCabinClass(tier);
                          setIsClassOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                          cabinClass === tier ? 'bg-brand-500/20 text-brand-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{tier}</span>
                        {cabinClass === tier && <Check className="w-3.5 h-3.5 text-brand-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Search Inputs Grid */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Origin Airport */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                From (Departure)
              </label>
              <div
                onClick={() => setIsOriginOpen(!isOriginOpen)}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-brand-500/50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-display text-white">{originDetails.code}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[110px]">{originDetails.city}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{originDetails.name}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-brand-400" />
              </div>

              {/* Origin Dropdown */}
              {isOriginOpen && (
                <div 
                  onMouseLeave={() => setIsOriginOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-white/15 shadow-luxury p-2 z-40 max-h-60 overflow-y-auto"
                >
                  <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">Select Departure Airport</p>
                  {airports.map(airport => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setOriginAirport(airport.code);
                        setIsOriginOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800 text-slate-200 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-brand-300 mr-2">{airport.code}</span>
                        <span>{airport.City?.name || airport.name.split(' ')[0]}</span>
                        <p className="text-[10px] text-slate-500 truncate">{airport.name}</p>
                      </div>
                      {originAirport === airport.code && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={swapAirports}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-brand-500 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 hover:rotate-180 shadow-md"
                title="Swap Origin and Destination"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Airport */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                To (Destination)
              </label>
              <div
                onClick={() => setIsDestOpen(!isDestOpen)}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-brand-500/50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-display text-white">{destDetails.code}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[110px]">{destDetails.city}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{destDetails.name}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-brand-400" />
              </div>

              {/* Destination Dropdown */}
              {isDestOpen && (
                <div 
                  onMouseLeave={() => setIsDestOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-white/15 shadow-luxury p-2 z-40 max-h-60 overflow-y-auto"
                >
                  <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase">Select Arrival Airport</p>
                  {airports.map(airport => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setDestinationAirport(airport.code);
                        setIsDestOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800 text-slate-200 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-amber-300 mr-2">{airport.code}</span>
                        <span>{airport.City?.name || airport.name.split(' ')[0]}</span>
                        <p className="text-[10px] text-slate-500 truncate">{airport.name}</p>
                      </div>
                      {destinationAirport === airport.code && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Departure Date */}
            <div className={`${tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                Departure Date
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="bg-transparent text-white font-semibold text-sm w-full outline-none cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Return Date (if Round-trip) */}
            {tripType === 'roundtrip' && (
              <div className="md:col-span-2">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Return Date
                </label>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-transparent text-white font-semibold text-sm w-full outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>
            )}

            {/* Search Submit Button */}
            <div className={`${tripType === 'roundtrip' ? 'md:col-span-1' : 'md:col-span-2'} flex items-end pt-5 md:pt-0`}>
              <button
                type="submit"
                disabled={loadingFlights}
                className="w-full h-[54px] rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-sky-400 hover:from-brand-500 hover:to-sky-300 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 disabled:opacity-50"
              >
                {loadingFlights ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span className="hidden xl:inline">Find Flights</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Quick Popular Routes Badges */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-400" />
              Trending Destinations:
            </span>
            {popularRoutes.map((route, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectRoute(route.from, route.to)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  originAirport === route.from && destinationAirport === route.to
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 font-bold'
                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border-white/5 hover:border-white/20'
                }`}
              >
                {route.label}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
