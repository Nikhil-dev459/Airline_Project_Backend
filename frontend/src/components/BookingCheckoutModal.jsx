import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, QrCode, CheckCircle2, Plane, Sparkles, Lock, ArrowRight, Download, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFlight } from '../context/FlightContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export default function BookingCheckoutModal() {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedFlight,
    selectedSeats,
    passengers,
    showBoardingPass,
    loadUserBookings,
    setIsReminderModalOpen
  } = useFlight();

  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [passengerName, setPassengerName] = useState('Nikhil Sharma');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || 'nikhil.travels@aeroluxe.com');
  const [passengerPhone, setPassengerPhone] = useState('+91 98765 43210');
  const [passportId, setPassportId] = useState('K7892104');
  const [mealPreference, setMealPreference] = useState('Chef Signature Gourmet');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [hasPriorityBoarding, setHasPriorityBoarding] = useState(true);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [completedBooking, setCompletedBooking] = useState(null);

  if (!isBookingModalOpen || !selectedFlight) return null;

  // Price calculations
  const basePrice = (selectedFlight.price || 4500) * passengers;
  const insurancePrice = hasInsurance ? 299 * passengers : 0;
  const priorityPrice = hasPriorityBoarding ? 499 * passengers : 0;
  const totalAmount = basePrice + insurancePrice + priorityPrice;

  const handlePassengerSubmit = (e) => {
    e.preventDefault();
    if (!passengerName || !passengerEmail) {
      notifyError('Missing Information', 'Please fill in passenger name and email');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step A: Call Booking Service to initiate booking
      const bookingPayload = {
        flightId: selectedFlight.id,
        userId: user?.id || 1,
        noOfSeats: passengers,
        totalCost: totalAmount,
        selectedSeats,
        passengerName,
        passengerEmail,
        passengerPhone
      };

      const bookingRes = await api.createBooking(bookingPayload);
      const bookingData = bookingRes.data;

      // Step B: Call Payment endpoint with Idempotency Key
      await api.makePayment({
        bookingId: bookingData.id,
        userId: user?.id || 1,
        totalCost: totalAmount
      });

      const confirmedBooking = {
        ...bookingData,
        status: 'BOOKED',
        flightDetails: selectedFlight,
        selectedSeats,
        passengerName,
        passengerEmail,
        passengerPhone,
        pnr: `ALX-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setCompletedBooking(confirmedBooking);
      setStep(3);
      loadUserBookings(user?.id || 1);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti effect skipped');
      }

      notifySuccess('Booking Confirmed!', `PNR: ${confirmedBooking.pnr}. Flight ${selectedFlight.flightNumber}`);
    } catch (err) {
      notifyError('Payment Failed', err.message || 'Could not complete transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setStep(1);
    setCompletedBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-white/15 rounded-3xl shadow-luxury overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold font-display text-white">
                {step === 1 && 'Passenger Details & Add-ons'}
                {step === 2 && 'Secure Checkout & Payment Gateway'}
                {step === 3 && 'Booking Confirmed!'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Flight {selectedFlight.flightNumber} • {selectedFlight.departureAirportId} → {selectedFlight.arrivalAirportId} • Seats: {selectedSeats.join(', ')}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          
          {/* STEP 1: PASSENGER DETAILS */}
          {step === 1 && (
            <form onSubmit={handlePassengerSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name (As per Passport)</label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Passport / National ID</label>
                  <input
                    type="text"
                    value={passportId}
                    onChange={(e) => setPassportId(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500 uppercase font-mono"
                    placeholder="P1234567"
                  />
                </div>
              </div>

              {/* Add-ons & Meal */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personalize Your Journey</h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">In-Flight Meal Preference</label>
                  <select
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option>Chef Signature Gourmet Meal (Complimentary)</option>
                    <option>Asian Vegetarian / Hindu Meal</option>
                    <option>Vegan Gourmet Feast</option>
                    <option>Diabetic / Low Calorie Meal</option>
                    <option>Jain Vegetarian Meal</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${hasInsurance ? 'bg-brand-500/10 border-brand-500/40 text-brand-200' : 'bg-slate-950/60 border-white/10 text-slate-300'}`}>
                    <input
                      type="checkbox"
                      checked={hasInsurance}
                      onChange={(e) => setHasInsurance(e.target.checked)}
                      className="mt-0.5 accent-brand-500 rounded"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">AeroLuxe Comprehensive Insurance</span>
                        <span className="text-[11px] font-mono text-brand-300">+₹299</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Medical coverage & baggage delay protection</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${hasPriorityBoarding ? 'bg-amber-500/10 border-amber-500/40 text-amber-200' : 'bg-slate-950/60 border-white/10 text-slate-300'}`}>
                    <input
                      type="checkbox"
                      checked={hasPriorityBoarding}
                      onChange={(e) => setHasPriorityBoarding(e.target.checked)}
                      className="mt-0.5 accent-amber-500 rounded"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Priority Boarding & Lounge</span>
                        <span className="text-[11px] font-mono text-amber-300">+₹499</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Dedicated lane & expedited luggage delivery</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="py-3 px-8 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY SIMULATION */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI / QR Pay', icon: QrCode },
                  { id: 'wallet', label: 'Apple / Google Pay', icon: Lock },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === m.id
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-300 shadow-glow'
                        : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <m.icon className="w-5 h-5" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-900" />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">Scan QR code using GPay, PhonePe, or Paytm</p>
                  <p className="text-[11px] text-slate-500 font-mono">UPI ID: aeroluxe.reserve@icici</p>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 text-center space-y-3">
                  <Lock className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">Instant 1-Click Biometric Payment</p>
                  <p className="text-[11px] text-slate-500">Touch ID or Face ID verification enabled</p>
                </div>
              )}

              {/* Idempotency & Backend Notice */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Microservice Idempotency Key:</span>
                <span className="font-mono text-brand-400 text-[10px]">
                  idemp_{Date.now().toString(36)}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Flight Fare ({passengers} traveller{passengers > 1 ? 's' : ''})</span>
                  <span>₹{basePrice.toLocaleString()}</span>
                </div>
                {hasInsurance && (
                  <div className="flex justify-between text-slate-400">
                    <span>Travel Insurance</span>
                    <span>₹{insurancePrice.toLocaleString()}</span>
                  </div>
                )}
                {hasPriorityBoarding && (
                  <div className="flex justify-between text-slate-400">
                    <span>Priority Boarding & Lounge</span>
                    <span>₹{priorityPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount Payable</span>
                  <span className="text-emerald-400 font-mono font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ← Back to Details
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{totalAmount.toLocaleString()} Securely</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: BOOKING CONFIRMED */}
          {step === 3 && completedBooking && (
            <div className="text-center py-6 space-y-6">
              
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-display text-white">Booking Confirmed & Ticket Issued!</h3>
                <p className="text-sm text-slate-300 mt-1">
                  We've emailed your flight confirmation and itinerary to <span className="font-semibold text-brand-300">{passengerEmail}</span>.
                </p>
              </div>

              {/* PNR & Flight Badge */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">BOOKING REF / PNR</span>
                    <p className="text-xl font-mono font-black text-brand-400">{completedBooking.pnr}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    CONFIRMED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Flight:</span>
                    <p className="font-bold text-white">{selectedFlight.flightNumber} ({selectedFlight.airline || 'AeroLuxe'})</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Seats:</span>
                    <p className="font-bold text-amber-300">{selectedSeats.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Route:</span>
                    <p className="font-bold text-white">{selectedFlight.departureAirportId} → {selectedFlight.arrivalAirportId}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Passenger:</span>
                    <p className="font-bold text-white">{passengerName}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => showBoardingPass(completedBooking)}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-glow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>View & Print Boarding Pass</span>
                </button>

                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2"
                >
                  <Bell className="w-4 h-4 text-brand-400" />
                  <span>Set Email Departure Alert</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
