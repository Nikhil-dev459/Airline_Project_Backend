import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const { notifyError, notifyInfo } = useNotification();

  // Master Data
  const [airports, setAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [servicesHealth, setServicesHealth] = useState(null);

  // Search State
  const [tripType, setTripType] = useState('oneway'); // oneway, roundtrip
  const [originAirport, setOriginAirport] = useState('DEL');
  const [destinationAirport, setDestinationAirport] = useState('BOM');
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000 * 3);
    return tomorrow.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy'); // Economy, Business, First

  // Results & Filters
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState(80000);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedStops, setSelectedStops] = useState('all'); // all, direct, 1stop
  const [sortBy, setSortBy] = useState('price_asc'); // price_asc, price_desc, duration_asc, time_asc

  // Active Selections & Modals
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [isFlightDetailsOpen, setIsFlightDetailsOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [activeBoardingPassData, setActiveBoardingPassData] = useState(null);

  // User Bookings Cache
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Initial Data Load
  useEffect(() => {
    loadMasterData();
    checkHealth();
    searchFlights();
  }, []);

  const loadMasterData = async () => {
    try {
      const [airportsData, citiesData, planesData] = await Promise.all([
        api.getAirports(),
        api.getCities(),
        api.getAirplanes()
      ]);
      setAirports(airportsData || []);
      setCities(citiesData || []);
      setAirplanes(planesData || []);
    } catch (err) {
      console.error('Error loading master data:', err);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await api.checkServicesHealth();
      setServicesHealth(health);
    } catch (err) {
      console.error('Error checking health:', err);
    }
  };

  const searchFlights = useCallback(async (customParams = {}) => {
    setLoadingFlights(true);
    try {
      const params = {
        trips: `${originAirport}-${destinationAirport}`,
        travellers: passengers,
        tripDate: departureDate,
        ...customParams
      };
      const data = await api.getAllFlights(params);
      setFlights(data || []);
    } catch (err) {
      notifyError('Flight Search Failed', err.message);
    } finally {
      setLoadingFlights(false);
    }
  }, [originAirport, destinationAirport, passengers, departureDate, notifyError]);

  const loadUserBookings = async (userId = 1) => {
    setLoadingBookings(true);
    try {
      const bookings = await api.getUserBookings(userId);
      setUserBookings(bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const swapAirports = () => {
    const temp = originAirport;
    setOriginAirport(destinationAirport);
    setDestinationAirport(temp);
  };

  const openSeatSelection = (flight) => {
    setSelectedFlight(flight);
    // Initialize default seats based on passenger count
    const defaultSeats = [];
    const rows = ['3', '4', '5'];
    const cols = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < passengers; i++) {
      defaultSeats.push(`${rows[i % rows.length]}${cols[i % cols.length]}`);
    }
    setSelectedSeats(defaultSeats);
    setIsSeatMapOpen(true);
  };

  const proceedToCheckout = () => {
    setIsSeatMapOpen(false);
    setIsBookingModalOpen(true);
  };

  const showBoardingPass = (bookingOrFlight) => {
    setActiveBoardingPassData(bookingOrFlight);
    setIsBoardingPassOpen(true);
  };

  return (
    <FlightContext.Provider value={{
      // Data
      airports,
      cities,
      airplanes,
      servicesHealth,
      flights,
      loadingFlights,
      userBookings,
      loadingBookings,

      // Search Inputs
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
      loadUserBookings,
      checkHealth,
      loadMasterData,

      // Filters
      maxPriceFilter,
      setMaxPriceFilter,
      selectedAirlines,
      setSelectedAirlines,
      selectedStops,
      setSelectedStops,
      sortBy,
      setSortBy,

      // Modals & Active State
      selectedFlight,
      setSelectedFlight,
      selectedSeats,
      setSelectedSeats,
      isSeatMapOpen,
      setIsSeatMapOpen,
      isBookingModalOpen,
      setIsBookingModalOpen,
      isBoardingPassOpen,
      setIsBoardingPassOpen,
      isFlightDetailsOpen,
      setIsFlightDetailsOpen,
      isReminderModalOpen,
      setIsReminderModalOpen,
      isArchitectureModalOpen,
      setIsArchitectureModalOpen,
      activeBoardingPassData,
      setActiveBoardingPassData,
      openSeatSelection,
      proceedToCheckout,
      showBoardingPass
    }}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlight must be used within a FlightProvider');
  }
  return context;
};
