import React, { useState } from 'react';
import { Shield, Plus, Plane, Building2, MapPin, Server, Trash2, CheckCircle2, RefreshCw, Sparkles, Layers } from 'lucide-react';
import { useFlight } from '../context/FlightContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function AdminPortal() {
  const {
    flights,
    airports,
    cities,
    airplanes,
    servicesHealth,
    checkHealth,
    loadMasterData,
    searchFlights
  } = useFlight();

  const { notifySuccess, notifyError } = useNotification();
  const [adminTab, setAdminTab] = useState('flights'); // 'flights', 'airports', 'airplanes', 'health'
  const [loading, setLoading] = useState(false);

  // Form State: New Flight
  const [flightForm, setFlightForm] = useState({
    flightNumber: 'AI 992',
    airline: 'Air India',
    airplaneId: 1,
    departureAirportId: 'DEL',
    arrivalAirportId: 'BOM',
    departureTime: new Date(Date.now() + 3600000 * 6).toISOString().slice(0, 16),
    arrivalTime: new Date(Date.now() + 3600000 * 8.5).toISOString().slice(0, 16),
    price: 4999,
    boardingGate: 'T3-09',
    totalSeats: 180
  });

  // Form State: New Airport
  const [airportForm, setAirportForm] = useState({
    name: 'San Francisco International Airport',
    code: 'SFO',
    address: 'San Francisco, California',
    city_id: 1
  });

  // Form State: New City
  const [cityName, setCityName] = useState('');

  // Form State: New Airplane
  const [airplaneForm, setAirplaneForm] = useState({
    modelNumber: 'Boeing 777X Luxury',
    capacity: 350
  });

  // Handlers
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createFlight(flightForm);
      notifySuccess('Flight Created', `Flight ${flightForm.flightNumber} successfully added to database`);
      searchFlights();
      // Reset form
      setFlightForm({
        ...flightForm,
        flightNumber: `AI ${Math.floor(100 + Math.random() * 900)}`
      });
    } catch (err) {
      notifyError('Failed to Create Flight', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAirport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createAirport(airportForm);
      notifySuccess('Airport Added', `${airportForm.name} (${airportForm.code}) created`);
      loadMasterData();
    } catch (err) {
      notifyError('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async (e) => {
    e.preventDefault();
    if (!cityName) return;
    setLoading(true);
    try {
      await api.createCity({ name: cityName });
      notifySuccess('City Added', `${cityName} successfully saved`);
      setCityName('');
      loadMasterData();
    } catch (err) {
      notifyError('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAirplane = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createAirplane(airplaneForm);
      notifySuccess('Aircraft Fleet Updated', `${airplaneForm.modelNumber} added to fleet`);
      loadMasterData();
    } catch (err) {
      notifyError('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAirport = async (id) => {
    if (!window.confirm('Delete this airport?')) return;
    try {
      await api.deleteAirport(id);
      notifySuccess('Deleted', 'Airport removed');
      loadMasterData();
    } catch (err) {
      notifyError('Error', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <h2 className="text-3xl font-bold font-display text-white">Airline Operations Control Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage airline schedules, aircraft fleets, airport databases, and microservices telemetry.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'flights', label: 'Flights', icon: Plane },
            { id: 'airports', label: 'Airports & Cities', icon: Building2 },
            { id: 'airplanes', label: 'Fleet / Airplanes', icon: Layers },
            { id: 'health', label: 'Service Mesh Health', icon: Server },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                adminTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: MANAGE FLIGHTS */}
      {adminTab === 'flights' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Flight Form */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Plus className="w-4 h-4 text-brand-400" />
              <h3 className="font-bold text-sm text-white">Schedule New Flight</h3>
            </div>

            <form onSubmit={handleCreateFlight} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={flightForm.flightNumber}
                    onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Airline Carrier</label>
                  <input
                    type="text"
                    required
                    value={flightForm.airline}
                    onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Departure Airport</label>
                  <select
                    value={flightForm.departureAirportId}
                    onChange={(e) => setFlightForm({ ...flightForm, departureAirportId: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {airports.map(a => (
                      <option key={a.code} value={a.code}>{a.code} - {a.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Arrival Airport</label>
                  <select
                    value={flightForm.arrivalAirportId}
                    onChange={(e) => setFlightForm({ ...flightForm, arrivalAirportId: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {airports.map(a => (
                      <option key={a.code} value={a.code}>{a.code} - {a.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightForm.departureTime}
                    onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Arrival Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightForm.arrivalTime}
                    onChange={(e) => setFlightForm({ ...flightForm, arrivalTime: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={flightForm.price}
                    onChange={(e) => setFlightForm({ ...flightForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Boarding Gate</label>
                  <input
                    type="text"
                    value={flightForm.boardingGate}
                    onChange={(e) => setFlightForm({ ...flightForm, boardingGate: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Seats</label>
                  <input
                    type="number"
                    required
                    value={flightForm.totalSeats}
                    onChange={(e) => setFlightForm({ ...flightForm, totalSeats: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-glow-gold transition-all"
              >
                {loading ? 'Publishing Flight...' : 'Publish & Broadcast Flight Schedule'}
              </button>
            </form>
          </div>

          {/* Active Flight Table */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white pb-3 border-b border-white/10">Active Flight Schedules ({flights.length})</h3>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                    <th className="pb-2">Flight</th>
                    <th className="pb-2">Route</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Seats</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {flights.map(f => (
                    <tr key={f.id || f.flightNumber} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold font-mono text-brand-300">{f.flightNumber}</td>
                      <td className="py-2.5 text-slate-200">{f.departureAirportId} → {f.arrivalAirportId}</td>
                      <td className="py-2.5 font-mono text-white">₹{f.price?.toLocaleString()}</td>
                      <td className="py-2.5 text-slate-400">{f.totalSeats}</td>
                      <td className="py-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {f.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AIRPORTS & CITIES */}
      {adminTab === 'airports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Airport Add & List */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white pb-3 border-b border-white/10">Registered Airports</h3>
            <form onSubmit={handleCreateAirport} className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Airport Name"
                value={airportForm.name}
                onChange={(e) => setAirportForm({ ...airportForm, name: e.target.value })}
                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
              />
              <input
                type="text"
                placeholder="IATA Code (e.g. SFO)"
                value={airportForm.code}
                onChange={(e) => setAirportForm({ ...airportForm, code: e.target.value.toUpperCase() })}
                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none"
              />
              <button
                type="submit"
                className="col-span-2 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold"
              >
                + Add Airport
              </button>
            </form>

            <div className="space-y-2 max-h-72 overflow-y-auto pt-2">
              {airports.map(a => (
                <div key={a.code} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-brand-300 font-mono mr-2">{a.code}</span>
                    <span className="text-slate-200">{a.name}</span>
                  </div>
                  <button onClick={() => handleDeleteAirport(a.id)} className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cities Add & List */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white pb-3 border-b border-white/10">Registered Destinations / Cities</h3>
            <form onSubmit={handleCreateCity} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="City Name (e.g. Amsterdam)"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold"
              >
                + Add City
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pt-2">
              {cities.map(c => (
                <div key={c.id || c.name} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-200 flex items-center justify-between">
                  <span>{c.name}</span>
                  <MapPin className="w-3 h-3 text-brand-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AIRPLANES & FLEET */}
      {adminTab === 'airplanes' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 max-w-2xl mx-auto">
          <h3 className="font-bold text-base text-white pb-3 border-b border-white/10">AeroLuxe Aircraft Fleet Master</h3>
          <form onSubmit={handleCreateAirplane} className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Model Name</label>
              <input
                type="text"
                value={airplaneForm.modelNumber}
                onChange={(e) => setAirplaneForm({ ...airplaneForm, modelNumber: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Passenger Capacity</label>
              <input
                type="number"
                value={airplaneForm.capacity}
                onChange={(e) => setAirplaneForm({ ...airplaneForm, capacity: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>
            <button
              type="submit"
              className="col-span-2 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold"
            >
              + Register New Aircraft Model
            </button>
          </form>

          <div className="space-y-2">
            {airplanes.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs">
                <span className="font-bold text-white">{p.modelNumber}</span>
                <span className="text-slate-400 font-mono">{p.capacity} Total Seats</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE MESH TELEMETRY */}
      {adminTab === 'health' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-base text-white">Microservice Mesh Real-Time Connectivity</h3>
            <button
              onClick={checkHealth}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping Services</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesHealth && Object.entries(servicesHealth).map(([key, s]) => (
              <div key={key} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{s.name}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Port:</span>
                    <span className="text-white">:{s.port}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Latency:</span>
                    <span className="text-emerald-400 font-semibold">{s.latency} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Protocol:</span>
                    <span className="text-brand-300">HTTP/REST</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
