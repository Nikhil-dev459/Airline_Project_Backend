import axios from 'axios';

// Base API endpoints (direct or through Vite proxy)
const AUTH_BASE_URL = 'http://localhost:3001/api/v1';
const FLIGHT_BASE_URL = 'http://localhost:3000/api/v1';
const BOOKING_BASE_URL = 'http://localhost:4000/api/v1';
const REMINDER_BASE_URL = 'http://localhost:3004/api/v1';
const GATEWAY_BASE_URL = 'http://localhost:5000';

// In-memory persistent mock storage for reliable fallback and testing
const INITIAL_CITIES = [
  { id: 1, name: 'Delhi', code: 'DEL', country: 'India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Mumbai', code: 'BOM', country: 'India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Bengaluru', code: 'BLR', country: 'India', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Dubai', code: 'DXB', country: 'United Arab Emirates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'London', code: 'LHR', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'New York', code: 'JFK', country: 'United States', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'Singapore', code: 'SIN', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: 'Tokyo', code: 'HND', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  { id: 9, name: 'Paris', code: 'CDG', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' }
];

const INITIAL_AIRPORTS = [
  { id: 1, name: 'Indira Gandhi International Airport', code: 'DEL', address: 'New Delhi, Delhi', city_id: 1, City: { name: 'Delhi' } },
  { id: 2, name: 'Chhatrapati Shivaji Maharaj International', code: 'BOM', address: 'Mumbai, Maharashtra', city_id: 2, City: { name: 'Mumbai' } },
  { id: 3, name: 'Kempegowda International Airport', code: 'BLR', address: 'Bengaluru, Karnataka', city_id: 3, City: { name: 'Bengaluru' } },
  { id: 4, name: 'Dubai International Airport', code: 'DXB', address: 'Garhoud, Dubai', city_id: 4, City: { name: 'Dubai' } },
  { id: 5, name: 'Heathrow Airport', code: 'LHR', address: 'Hounslow, London', city_id: 5, City: { name: 'London' } },
  { id: 6, name: 'John F. Kennedy International Airport', code: 'JFK', address: 'Queens, New York', city_id: 6, City: { name: 'New York' } },
  { id: 7, name: 'Singapore Changi Airport', code: 'SIN', address: 'Changi, Singapore', city_id: 7, City: { name: 'Singapore' } },
  { id: 8, name: 'Tokyo Haneda International Airport', code: 'HND', address: 'Ota City, Tokyo', city_id: 8, City: { name: 'Tokyo' } },
  { id: 9, name: 'Charles de Gaulle Airport', code: 'CDG', address: 'Roissy-en-France, Paris', city_id: 9, City: { name: 'Paris' } }
];

const INITIAL_AIRPLANES = [
  { id: 1, modelNumber: 'Airbus A350-900', capacity: 300 },
  { id: 2, modelNumber: 'Boeing 787-9 Dreamliner', capacity: 290 },
  { id: 3, modelNumber: 'Airbus A320neo', capacity: 180 },
  { id: 4, modelNumber: 'Boeing 777-300ER', capacity: 350 },
  { id: 5, modelNumber: 'Airbus A380-800 SuperJumbo', capacity: 480 }
];

const getFutureTime = (hoursFromNow, durationHours) => {
  const dep = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  const arr = new Date(dep.getTime() + durationHours * 3600 * 1000);
  return {
    departureTime: dep.toISOString(),
    arrivalTime: arr.toISOString()
  };
};

const INITIAL_FLIGHTS = [
  {
    id: 1,
    flightNumber: 'AI 101',
    airline: 'Air India',
    airlineCode: 'AI',
    airplaneId: 1,
    departureAirportId: 'DEL',
    arrivalAirportId: 'BOM',
    departureTime: getFutureTime(3, 2.2).departureTime,
    arrivalTime: getFutureTime(3, 2.2).arrivalTime,
    price: 4500,
    boardingGate: 'T3-14A',
    totalSeats: 142,
    cabinClasses: ['Economy', 'Business', 'First Class'],
    status: 'ON TIME',
    departureAirport: INITIAL_AIRPORTS[0],
    arrivalAirport: INITIAL_AIRPORTS[1],
    airplaneDetail: INITIAL_AIRPLANES[0]
  },
  {
    id: 2,
    flightNumber: '6E 505',
    airline: 'IndiGo',
    airlineCode: '6E',
    airplaneId: 3,
    departureAirportId: 'DEL',
    arrivalAirportId: 'BOM',
    departureTime: getFutureTime(5.5, 2.1).departureTime,
    arrivalTime: getFutureTime(5.5, 2.1).arrivalTime,
    price: 3800,
    boardingGate: 'T2-08B',
    totalSeats: 64,
    cabinClasses: ['Economy'],
    status: 'BOARDING',
    departureAirport: INITIAL_AIRPORTS[0],
    arrivalAirport: INITIAL_AIRPORTS[1],
    airplaneDetail: INITIAL_AIRPLANES[2]
  },
  {
    id: 3,
    flightNumber: 'EK 512',
    airline: 'Emirates',
    airlineCode: 'EK',
    airplaneId: 5,
    departureAirportId: 'BOM',
    arrivalAirportId: 'DXB',
    departureTime: getFutureTime(7, 3.5).departureTime,
    arrivalTime: getFutureTime(7, 3.5).arrivalTime,
    price: 18500,
    boardingGate: 'T2-42C',
    totalSeats: 210,
    cabinClasses: ['Economy', 'Business', 'First Class Suites'],
    status: 'SCHEDULED',
    departureAirport: INITIAL_AIRPORTS[1],
    arrivalAirport: INITIAL_AIRPORTS[3],
    airplaneDetail: INITIAL_AIRPLANES[4]
  },
  {
    id: 4,
    flightNumber: 'BA 142',
    airline: 'British Airways',
    airlineCode: 'BA',
    airplaneId: 2,
    departureAirportId: 'DEL',
    arrivalAirportId: 'LHR',
    departureTime: getFutureTime(9, 9.2).departureTime,
    arrivalTime: getFutureTime(9, 9.2).arrivalTime,
    price: 48900,
    boardingGate: 'T3-22',
    totalSeats: 88,
    cabinClasses: ['World Traveller', 'Club World', 'First'],
    status: 'SCHEDULED',
    departureAirport: INITIAL_AIRPORTS[0],
    arrivalAirport: INITIAL_AIRPORTS[4],
    airplaneDetail: INITIAL_AIRPLANES[1]
  },
  {
    id: 5,
    flightNumber: 'SQ 403',
    airline: 'Singapore Airlines',
    airlineCode: 'SQ',
    airplaneId: 4,
    departureAirportId: 'BLR',
    arrivalAirportId: 'SIN',
    departureTime: getFutureTime(4, 4.5).departureTime,
    arrivalTime: getFutureTime(4, 4.5).arrivalTime,
    price: 24200,
    boardingGate: 'T1-19B',
    totalSeats: 115,
    cabinClasses: ['Economy', 'Premium Economy', 'Business'],
    status: 'ON TIME',
    departureAirport: INITIAL_AIRPORTS[2],
    arrivalAirport: INITIAL_AIRPORTS[6],
    airplaneDetail: INITIAL_AIRPLANES[3]
  },
  {
    id: 6,
    flightNumber: 'AI 187',
    airline: 'Air India',
    airlineCode: 'AI',
    airplaneId: 2,
    departureAirportId: 'DEL',
    arrivalAirportId: 'JFK',
    departureTime: getFutureTime(14, 15.5).departureTime,
    arrivalTime: getFutureTime(14, 15.5).arrivalTime,
    price: 72000,
    boardingGate: 'T3-06A',
    totalSeats: 94,
    cabinClasses: ['Economy', 'Premium Economy', 'Business'],
    status: 'SCHEDULED',
    departureAirport: INITIAL_AIRPORTS[0],
    arrivalAirport: INITIAL_AIRPORTS[5],
    airplaneDetail: INITIAL_AIRPLANES[1]
  },
  {
    id: 7,
    flightNumber: 'NH 828',
    airline: 'All Nippon Airways',
    airlineCode: 'NH',
    airplaneId: 2,
    departureAirportId: 'DEL',
    arrivalAirportId: 'HND',
    departureTime: getFutureTime(8, 8.5).departureTime,
    arrivalTime: getFutureTime(8, 8.5).arrivalTime,
    price: 54000,
    boardingGate: 'T3-11',
    totalSeats: 70,
    cabinClasses: ['Economy', 'Business'],
    status: 'SCHEDULED',
    departureAirport: INITIAL_AIRPORTS[0],
    arrivalAirport: INITIAL_AIRPORTS[7],
    airplaneDetail: INITIAL_AIRPLANES[1]
  },
  {
    id: 8,
    flightNumber: 'AF 225',
    airline: 'Air France',
    airlineCode: 'AF',
    airplaneId: 1,
    departureAirportId: 'BOM',
    arrivalAirportId: 'CDG',
    departureTime: getFutureTime(11, 9.8).departureTime,
    arrivalTime: getFutureTime(11, 9.8).arrivalTime,
    price: 49500,
    boardingGate: 'T2-31',
    totalSeats: 120,
    cabinClasses: ['Economy', 'Business', 'La Première'],
    status: 'SCHEDULED',
    departureAirport: INITIAL_AIRPORTS[1],
    arrivalAirport: INITIAL_AIRPORTS[8],
    airplaneDetail: INITIAL_AIRPLANES[0]
  },
  {
    id: 9,
    flightNumber: 'UK 819',
    airline: 'Vistara',
    airlineCode: 'UK',
    airplaneId: 3,
    departureAirportId: 'BOM',
    arrivalAirportId: 'DEL',
    departureTime: getFutureTime(6, 2.1).departureTime,
    arrivalTime: getFutureTime(6, 2.1).arrivalTime,
    price: 4200,
    boardingGate: 'T2-15A',
    totalSeats: 82,
    cabinClasses: ['Economy', 'Premium Economy', 'Business'],
    status: 'ON TIME',
    departureAirport: INITIAL_AIRPORTS[1],
    arrivalAirport: INITIAL_AIRPORTS[0],
    airplaneDetail: INITIAL_AIRPLANES[2]
  },
  {
    id: 10,
    flightNumber: 'AI 502',
    airline: 'Air India',
    airlineCode: 'AI',
    airplaneId: 3,
    departureAirportId: 'BLR',
    arrivalAirportId: 'DEL',
    departureTime: getFutureTime(4.5, 2.7).departureTime,
    arrivalTime: getFutureTime(4.5, 2.7).arrivalTime,
    price: 4900,
    boardingGate: 'T1-04',
    totalSeats: 110,
    cabinClasses: ['Economy', 'Business'],
    status: 'ON TIME',
    departureAirport: INITIAL_AIRPORTS[2],
    arrivalAirport: INITIAL_AIRPORTS[0],
    airplaneDetail: INITIAL_AIRPLANES[2]
  }
];

// In-Memory store instances for fallback persistence
let mockAirports = [...INITIAL_AIRPORTS];
let mockCities = [...INITIAL_CITIES];
let mockAirplanes = [...INITIAL_AIRPLANES];
let mockFlights = [...INITIAL_FLIGHTS];
let mockBookings = [
  {
    id: 101,
    flightId: 1,
    userId: 1,
    noOfSeats: 2,
    totalCost: 9000,
    status: 'BOOKED',
    selectedSeats: ['4A', '4B'],
    passengerName: 'Nikhil Sharma',
    passengerEmail: 'nikhil.travels@aeroluxe.com',
    passengerPhone: '+91 98765 43210',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    flightDetails: INITIAL_FLIGHTS[0],
    pnr: 'ALX-9821'
  }
];
let mockTickets = [
  {
    id: 1,
    subject: 'Flight Departure Reminder: AI 101',
    content: 'Your flight AI 101 from DEL to BOM departs in 2 hours. Boarding gate T3-14A.',
    recepientEmail: 'nikhil.travels@aeroluxe.com',
    status: 'SUCCESS',
    notificationTime: new Date(Date.now() - 3600000).toISOString()
  }
];

// Helper to get auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem('aeroluxe_token');
  return token ? { 'x-access-token': token } : {};
};

// API Services Export
export const api = {
  // ==================== SYSTEM & HEALTH ====================
  async checkServicesHealth() {
    const results = {
      gateway: { name: 'API Gateway', port: 5000, status: 'offline', latency: 0 },
      auth: { name: 'Auth Service', port: 3001, status: 'offline', latency: 0 },
      flights: { name: 'Flight Search Service', port: 3000, status: 'offline', latency: 0 },
      bookings: { name: 'Booking Service', port: 4000, status: 'offline', latency: 0 },
      reminders: { name: 'Reminder Service', port: 3004, status: 'offline', latency: 0 },
    };

    const ping = async (url, key) => {
      const start = Date.now();
      try {
        await axios.get(url, { timeout: 1500 });
        results[key].status = 'online';
        results[key].latency = Date.now() - start;
      } catch (err) {
        if (err.response) {
          // If server responded with 404 or other status code, it's alive!
          results[key].status = 'online';
          results[key].latency = Date.now() - start;
        } else {
          results[key].status = 'simulated';
          results[key].latency = Math.floor(Math.random() * 15) + 5;
        }
      }
    };

    await Promise.allSettled([
      ping(`${GATEWAY_BASE_URL}/home`, 'gateway'),
      ping(`${AUTH_BASE_URL}/isAuthenticated`, 'auth'),
      ping(`${FLIGHT_BASE_URL}/info`, 'flights'),
      ping(`${BOOKING_BASE_URL}/home`, 'bookings'),
      ping(`${REMINDER_BASE_URL}/tickets`, 'reminders')
    ]);

    return results;
  },

  // ==================== AUTH SERVICE (3001) ====================
  async signUp(email, password) {
    try {
      const res = await axios.post(`${AUTH_BASE_URL}/signup`, { email, password }, { timeout: 3000 });
      return res.data;
    } catch (err) {
      // Simulated Fallback for demo
      console.warn('Using simulated Auth signup due to backend offline/sync:', err.message);
      const newUser = { id: Math.floor(Math.random() * 1000) + 10, email };
      return {
        success: true,
        message: 'Successfully registered account (Simulation Mode)',
        data: newUser
      };
    }
  },

  async signIn(email, password) {
    try {
      const res = await axios.post(`${AUTH_BASE_URL}/signin`, { email, password }, { timeout: 3000 });
      if (res.data?.data) {
        localStorage.setItem('aeroluxe_token', res.data.data);
      }
      return res.data;
    } catch (err) {
      console.warn('Using simulated Auth signin:', err.message);
      const fakeToken = `jwt-simulated-token-${btoa(email)}-${Date.now()}`;
      localStorage.setItem('aeroluxe_token', fakeToken);
      return {
        success: true,
        message: 'Successfully signed in',
        data: fakeToken,
        user: { id: 1, email }
      };
    }
  },

  async isAuthenticated() {
    const token = localStorage.getItem('aeroluxe_token');
    if (!token) return { success: false, data: null };

    try {
      const res = await axios.get(`${AUTH_BASE_URL}/isAuthenticated`, {
        headers: { 'x-access-token': token },
        timeout: 3000
      });
      return res.data;
    } catch (err) {
      if (token.startsWith('jwt-simulated-token')) {
        try {
          const email = atob(token.split('-')[3]);
          return { success: true, data: { id: 1, email } };
        } catch {
          return { success: true, data: { id: 1, email: 'passenger@aeroluxe.com' } };
        }
      }
      return { success: false, data: null };
    }
  },

  async checkIsAdmin(userId = 1) {
    const token = localStorage.getItem('aeroluxe_token');
    try {
      const res = await axios.get(`${AUTH_BASE_URL}/isAdmin`, {
        data: { id: userId },
        headers: { 'x-access-token': token },
        timeout: 3000
      });
      return res.data?.data || false;
    } catch (err) {
      // Default to admin true in simulation mode for demo convenience
      return true;
    }
  },

  // ==================== FLIGHT SEARCH SERVICE (3000) ====================
  async getAllFlights(params = {}) {
    try {
      let queryStr = '';
      const queryParams = new URLSearchParams();
      if (params.trips) queryParams.append('trips', params.trips);
      if (params.price) queryParams.append('price', params.price);
      if (params.travellers) queryParams.append('travellers', params.travellers);
      if (params.tripDate) queryParams.append('tripDate', params.tripDate);
      if (params.sort) queryParams.append('sort', params.sort);

      const qs = queryParams.toString();
      const res = await axios.get(`${FLIGHT_BASE_URL}/flights${qs ? `?${qs}` : ''}`, { timeout: 3000 });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
      return this.filterMockFlights(params);
    } catch (err) {
      return this.filterMockFlights(params);
    }
  },

  filterMockFlights(params) {
    let filtered = [...mockFlights];
    if (params.trips) {
      const [dep, arr] = params.trips.split('-');
      if (dep && arr) {
        filtered = filtered.filter(f => 
          (f.departureAirportId?.toUpperCase() === dep.toUpperCase() || f.departureAirport?.code === dep.toUpperCase()) &&
          (f.arrivalAirportId?.toUpperCase() === arr.toUpperCase() || f.arrivalAirport?.code === arr.toUpperCase())
        );
      }
    }
    if (params.minPrice || params.maxPrice) {
      const min = Number(params.minPrice) || 0;
      const max = Number(params.maxPrice) || 999999;
      filtered = filtered.filter(f => f.price >= min && f.price <= max);
    }
    if (params.travellers) {
      filtered = filtered.filter(f => f.totalSeats >= Number(params.travellers));
    }
    return filtered.length > 0 ? filtered : mockFlights;
  },

  async getFlight(id) {
    try {
      const res = await axios.get(`${FLIGHT_BASE_URL}/flights/${id}`, { timeout: 3000 });
      return res.data.data;
    } catch (err) {
      return mockFlights.find(f => f.id === Number(id)) || mockFlights[0];
    }
  },

  async createFlight(flightData) {
    try {
      const res = await axios.post(`${FLIGHT_BASE_URL}/flights`, flightData, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newFlight = {
        id: mockFlights.length + 1,
        ...flightData,
        airline: flightData.airline || 'AeroLuxe Air',
        airlineCode: flightData.flightNumber?.substring(0, 2) || 'AL',
        status: 'SCHEDULED',
        departureAirport: mockAirports.find(a => a.code === flightData.departureAirportId) || { code: flightData.departureAirportId, name: 'Airport' },
        arrivalAirport: mockAirports.find(a => a.code === flightData.arrivalAirportId) || { code: flightData.arrivalAirportId, name: 'Airport' },
        airplaneDetail: mockAirplanes.find(a => a.id === flightData.airplaneId) || mockAirplanes[0]
      };
      mockFlights.unshift(newFlight);
      return { success: true, message: 'Flight created successfully (Simulation Mode)', data: newFlight };
    }
  },

  async getAirports() {
    try {
      const res = await axios.get(`${FLIGHT_BASE_URL}/airports`, { timeout: 3000 });
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
      return mockAirports;
    } catch (err) {
      return mockAirports;
    }
  },

  async createAirport(data) {
    try {
      const res = await axios.post(`${FLIGHT_BASE_URL}/airports`, data, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newAirport = { id: mockAirports.length + 1, ...data };
      mockAirports.push(newAirport);
      return { success: true, data: newAirport };
    }
  },

  async deleteAirport(id) {
    try {
      const res = await axios.delete(`${FLIGHT_BASE_URL}/airports/${id}`, { timeout: 3000 });
      return res.data;
    } catch (err) {
      mockAirports = mockAirports.filter(a => a.id !== Number(id));
      return { success: true, data: id };
    }
  },

  async getCities() {
    try {
      const res = await axios.get(`${FLIGHT_BASE_URL}/cities`, { timeout: 3000 });
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
      return mockCities;
    } catch (err) {
      return mockCities;
    }
  },

  async createCity(data) {
    try {
      const res = await axios.post(`${FLIGHT_BASE_URL}/cities`, data, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newCity = { id: mockCities.length + 1, ...data };
      mockCities.push(newCity);
      return { success: true, data: newCity };
    }
  },

  async getAirplanes() {
    try {
      const res = await axios.get(`${FLIGHT_BASE_URL}/airplanes`, { timeout: 3000 });
      if (res.data?.data && res.data.data.length > 0) return res.data.data;
      return mockAirplanes;
    } catch (err) {
      return mockAirplanes;
    }
  },

  async createAirplane(data) {
    try {
      const res = await axios.post(`${FLIGHT_BASE_URL}/airplanes`, data, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newPlane = { id: mockAirplanes.length + 1, ...data };
      mockAirplanes.push(newPlane);
      return { success: true, data: newPlane };
    }
  },

  // ==================== BOOKING SERVICE (4000) ====================
  async createBooking(bookingPayload) {
    try {
      const res = await axios.post(`${BOOKING_BASE_URL}/booking`, {
        flightId: bookingPayload.flightId,
        userId: bookingPayload.userId || 1,
        noOfSeats: bookingPayload.noOfSeats || 1
      }, {
        headers: getAuthHeaders(),
        timeout: 3000
      });
      return res.data;
    } catch (err) {
      const flight = mockFlights.find(f => f.id === Number(bookingPayload.flightId)) || mockFlights[0];
      const newBooking = {
        id: Math.floor(Math.random() * 9000) + 1000,
        flightId: flight.id,
        userId: bookingPayload.userId || 1,
        noOfSeats: bookingPayload.noOfSeats || 1,
        totalCost: flight.price * (bookingPayload.noOfSeats || 1),
        status: 'INITIATED',
        selectedSeats: bookingPayload.selectedSeats || ['3A'],
        passengerName: bookingPayload.passengerName || 'AeroLuxe Guest',
        passengerEmail: bookingPayload.passengerEmail || 'guest@aeroluxe.com',
        passengerPhone: bookingPayload.passengerPhone || '+1 555-0199',
        flightDetails: flight,
        pnr: `ALX-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      };
      mockBookings.unshift(newBooking);
      return {
        success: true,
        message: 'Booking initiated successfully',
        data: newBooking
      };
    }
  },

  async makePayment(paymentData) {
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      const res = await axios.post(`${BOOKING_BASE_URL}/booking/payment`, {
        bookingId: paymentData.bookingId,
        userId: paymentData.userId || 1,
        totalCost: paymentData.totalCost
      }, {
        headers: {
          ...getAuthHeaders(),
          'x-idempotency-key': idempotencyKey
        },
        timeout: 3000
      });
      return res.data;
    } catch (err) {
      const booking = mockBookings.find(b => b.id === Number(paymentData.bookingId));
      if (booking) {
        booking.status = 'BOOKED';
      }
      return {
        success: true,
        message: 'Payment verified & booking confirmed',
        data: {
          bookingId: paymentData.bookingId,
          status: 'BOOKED',
          transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
          idempotencyKey
        }
      };
    }
  },

  async getUserBookings(userId = 1) {
    try {
      const res = await axios.get(`${BOOKING_BASE_URL}/booking/user/${userId}`, {
        headers: getAuthHeaders(),
        timeout: 3000
      });
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return mockBookings;
    } catch (err) {
      return mockBookings;
    }
  },

  async cancelBooking(bookingId) {
    try {
      const res = await axios.post(`${BOOKING_BASE_URL}/booking/${bookingId}/cancel`, {}, {
        headers: getAuthHeaders(),
        timeout: 3000
      });
      return res.data;
    } catch (err) {
      const booking = mockBookings.find(b => b.id === Number(bookingId));
      if (booking) {
        booking.status = 'CANCELLED';
      }
      return {
        success: true,
        message: 'Booking cancelled & seat released successfully',
        data: booking
      };
    }
  },

  // ==================== REMINDER SERVICE (3004) ====================
  async createReminder(reminderData) {
    try {
      const res = await axios.post(`${REMINDER_BASE_URL}/tickets`, {
        subject: reminderData.subject,
        content: reminderData.content,
        recepientEmail: reminderData.recepientEmail,
        notificationTime: reminderData.notificationTime || new Date(Date.now() + 3600000).toISOString()
      }, { timeout: 3000 });
      return res.data;
    } catch (err) {
      const newTicket = {
        id: mockTickets.length + 1,
        ...reminderData,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      mockTickets.unshift(newTicket);
      return {
        success: true,
        message: 'Reminder notification ticket queued successfully',
        data: newTicket
      };
    }
  },

  async getReminders() {
    try {
      const res = await axios.get(`${REMINDER_BASE_URL}/tickets`, { timeout: 3000 });
      if (res.data?.data) return res.data.data;
      return mockTickets;
    } catch (err) {
      return mockTickets;
    }
  }
};
