import React, { useState } from 'react';
import { X, Server, Database, Shield, Plane, BookOpen, Bell, ArrowRight, CheckCircle2, Cpu, Globe, Lock } from 'lucide-react';
import { useFlight } from '../context/FlightContext';

export default function ArchitectureModal() {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen, servicesHealth } = useFlight();
  const [selectedService, setSelectedService] = useState('gateway');

  if (!isArchitectureModalOpen) return null;

  const services = [
    {
      id: 'gateway',
      name: 'API Gateway',
      port: 5000,
      badge: 'Reverse Proxy & Security',
      color: 'from-blue-600 to-cyan-500',
      description: 'Single unified entry point for all frontend traffic. Manages request routing, reverse proxying, rate limiting, and centralized JWT authentication token checks.',
      endpoints: [
        'GET /home - Gateway health & service mesh map',
        'USE /authservice - Proxy to Auth Service (:3001)',
        'USE /flightservice - Proxy to Flight Search (:3000)',
        'USE /bookingservice - Protected proxy to Booking (:4000)',
        'USE /reminderservice - Proxy to Reminder Service (:3004)'
      ],
      tech: ['Express.js', 'http-proxy-middleware', 'express-rate-limit', 'Morgan', 'Axios']
    },
    {
      id: 'auth',
      name: 'Authentication Service',
      port: 3001,
      badge: 'Security & Role Management',
      color: 'from-indigo-600 to-purple-500',
      description: 'Handles user signup, credential hashing with bcrypt, JWT token signing & verification, and administrator role validation.',
      endpoints: [
        'POST /api/v1/signup - User registration',
        'POST /api/v1/signin - Authenticate & return JWT',
        'GET /api/v1/isAuthenticated - Validate x-access-token',
        'GET /api/v1/isAdmin - Verify admin privileges'
      ],
      tech: ['Express.js', 'JWT', 'Bcrypt', 'Sequelize ORM', 'MySQL (Auth_DB_Dev)']
    },
    {
      id: 'flights',
      name: 'Flight Search Service',
      port: 3000,
      badge: 'Inventory & Routing',
      color: 'from-sky-600 to-teal-500',
      description: 'Manages airplanes, airports, cities, and live flight schedules with filtering by price, date, and origin/destination.',
      endpoints: [
        'GET /api/v1/flights?trips=DEL-BOM - Search flights with filters',
        'GET /api/v1/flights/:id - Single flight details',
        'POST /api/v1/flights - Create new flight schedule',
        'PATCH /api/v1/flights/:id/seats - Reserve/release seats',
        'GET & POST /api/v1/airports - Airports catalog',
        'GET & POST /api/v1/cities - City destinations'
      ],
      tech: ['Express.js', 'Sequelize ORM', 'MySQL (Flights)', 'CRUD Repositories']
    },
    {
      id: 'booking',
      name: 'Flight Booking Service',
      port: 4000,
      badge: 'ACID Transactions & Payments',
      color: 'from-amber-600 to-orange-500',
      description: 'Coordinates bookings using ACID transactions with database row locking, prevents race conditions, handles payments with idempotency keys, and schedules auto-cancellations.',
      endpoints: [
        'POST /api/v1/booking - Initiate booking transaction & lock seats',
        'POST /api/v1/booking/payment - Verify idempotency & confirm payment',
        'GET /api/v1/booking/user/:userId - Retrieve customer bookings',
        'POST /api/v1/booking/:id/cancel - Cancel & rollback seats',
        'POST /api/v1/booking/publish - Queue message to RabbitMQ'
      ],
      tech: ['Express.js', 'Sequelize Transactions', 'AMQPLib (RabbitMQ)', 'Cron Engine']
    },
    {
      id: 'reminder',
      name: 'Reminder & Notification Service',
      port: 3004,
      badge: 'Async Queue & Email Dispatch',
      color: 'from-rose-600 to-pink-500',
      description: 'Subscribes to RabbitMQ message broker queues and executes cron jobs to dispatch email notifications & reminders to travellers.',
      endpoints: [
        'POST /api/v1/tickets - Create reminder ticket in DB',
        'GET /api/v1/tickets - Fetch notification history',
        'CONSUME messageQueue - Subscribe to CREATE_TICKET & SEND_MAIL'
      ],
      tech: ['Express.js', 'Nodemailer (SMTP)', 'RabbitMQ (amqplib)', 'Node-Cron', 'MySQL']
    }
  ];

  const active = services.find(s => s.id === selectedService) || services[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Distributed Microservices Architecture</h2>
              <p className="text-xs text-slate-400">Complete service topology, ports, and inter-service communications</p>
            </div>
          </div>

          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topology Diagram Overview */}
        <div className="p-6 border-b border-white/10 bg-slate-950/40">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {services.map(s => {
              const isSelected = selectedService === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-brand-500 shadow-glow'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${s.color} text-white`}>
                    Port {s.port}
                  </span>
                  <h4 className="font-bold text-xs text-white mt-2 truncate">{s.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{s.badge}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Service Detailed Inspector */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold font-display text-white">{active.name}</h3>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-brand-300 font-semibold">
                  Port :{active.port}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{active.description}</p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>CORS & API Ready</span>
            </div>
          </div>

          {/* Endpoints & Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Endpoints */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-brand-400" />
                <span>REST API Routes</span>
              </h4>
              <div className="space-y-2">
                {active.endpoints.map((ep, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px] text-slate-200">
                    {ep}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Stack & Data Layer</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {active.tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Frontend Integration:</strong> Automatically routed either directly via CORS or through Vite proxy (<code className="text-brand-300">/api/v1/*</code>) and API Gateway (<code className="text-brand-300">:5000</code>).
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
