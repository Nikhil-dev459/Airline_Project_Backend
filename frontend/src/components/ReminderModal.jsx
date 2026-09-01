import React, { useState } from 'react';
import { X, Bell, Send, CheckCircle2, Clock, Mail, Sparkles } from 'lucide-react';
import { useFlight } from '../context/FlightContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function ReminderModal() {
  const { isReminderModalOpen, setIsReminderModalOpen, selectedFlight } = useFlight();
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [email, setEmail] = useState(user?.email || 'nikhil.travels@aeroluxe.com');
  const [subject, setSubject] = useState(
    selectedFlight
      ? `Departure Notification for Flight ${selectedFlight.flightNumber}`
      : 'AeroLuxe Flight Departure & Gate Reminder'
  );
  const [reminderHours, setReminderHours] = useState('2');
  const [loading, setLoading] = useState(false);

  if (!isReminderModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const flightInfo = selectedFlight 
        ? `${selectedFlight.flightNumber} (${selectedFlight.departureAirportId} → ${selectedFlight.arrivalAirportId})`
        : 'your upcoming scheduled flight';

      const content = `AeroLuxe Priority Alert: Your flight ${flightInfo} will begin boarding soon at Gate ${selectedFlight?.boardingGate || 'T3-14A'}. Please arrive at the gate 45 minutes prior.`;

      await api.createReminder({
        subject,
        content,
        recepientEmail: email,
        notificationTime: new Date(Date.now() + Number(reminderHours) * 3600000).toISOString()
      });

      notifySuccess('Reminder Queued!', `Alert scheduled to be sent to ${email} via Reminder Service.`);
      setIsReminderModalOpen(false);
    } catch (err) {
      notifyError('Failed to Schedule Reminder', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Flight Departure Alerts</h2>
              <p className="text-[11px] text-slate-400">Powered by Reminder Microservice & RabbitMQ</p>
            </div>
          </div>

          <button
            onClick={() => setIsReminderModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              Recipient Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
              placeholder="passenger@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Notification Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Send Reminder Schedule
            </label>
            <select
              value={reminderHours}
              onChange={(e) => setReminderHours(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none cursor-pointer"
            >
              <option value="1">1 hour before departure</option>
              <option value="2">2 hours before departure (Recommended)</option>
              <option value="4">4 hours before departure</option>
              <option value="24">24 hours before departure (Check-in Reminder)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-brand-300 block mb-1">Microservice Ticket Dispatch:</span>
            Submits a payload to Reminder Service on Port 3004 via the RabbitMQ message queue broker with cron schedule execution.
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Queue Flight Reminder</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
