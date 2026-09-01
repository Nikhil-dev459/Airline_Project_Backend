import React, { useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { FlightProvider } from './context/FlightContext';

import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import FlightResults from './components/FlightResults';
import FlightStatusTracker from './components/FlightStatusTracker';
import MyBookings from './components/MyBookings';
import AdminPortal from './components/AdminPortal';

import SeatMapModal from './components/SeatMapModal';
import BookingCheckoutModal from './components/BookingCheckoutModal';
import BoardingPassModal from './components/BoardingPassModal';
import AuthModal from './components/AuthModal';
import ReminderModal from './components/ReminderModal';
import ArchitectureModal from './components/ArchitectureModal';
import FlightDetailsModal from './components/FlightDetailsModal';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'status' | 'bookings' | 'admin'

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'search' && (
          <>
            <HeroSearch />
            <FlightResults />
          </>
        )}

        {activeTab === 'status' && (
          <FlightStatusTracker />
        )}

        {activeTab === 'bookings' && (
          <MyBookings setActiveTab={setActiveTab} />
        )}

        {activeTab === 'admin' && (
          <AdminPortal />
        )}
      </main>

      {/* Modals & Overlays */}
      <SeatMapModal />
      <BookingCheckoutModal />
      <BoardingPassModal />
      <AuthModal />
      <ReminderModal />
      <ArchitectureModal />
      <FlightDetailsModal />

      {/* Luxury Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <FlightProvider>
          <MainLayout />
        </FlightProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
