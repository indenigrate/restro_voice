import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Calendar, Filter, Download, Sun, CloudRain, CloudSun, Moon, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data on Mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Helper: Export to CSV
  const downloadCSV = () => {
    if (bookings.length === 0) return;
    
    const headers = ["Booking ID,Customer,Guests,Date,Time,Status,Weather\n"];
    const rows = bookings.map(b => 
      `${b.bookingId},${b.customerName},${b.numberOfGuests},${new Date(b.bookingDate).toLocaleDateString()},${b.bookingTime},${b.status},${b.weatherInfo?.condition || 'N/A'}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "restaurant_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Helper: Style Status Chips
  const getStatusStyles = (status) => {
    // Normalize string to handle case sensitivity
    const s = status?.toLowerCase() || '';
    if (s === 'confirmed') return 'bg-green-100 text-green-700';
    if (s === 'seated') return 'bg-blue-100 text-blue-700';
    if (s === 'pending') return 'bg-orange-100 text-orange-700';
    if (s === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  // 4. Helper: Render Weather Icon based on API data
  const renderWeatherIcon = (weatherInfo) => {
    if (!weatherInfo) return <Sun className="w-5 h-5 text-gray-400" />;
    
    const condition = weatherInfo.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
    if (condition.includes('cloud')) {
      return <CloudSun className="w-5 h-5 text-gray-500" />;
    }
    if (condition.includes('clear') || condition.includes('sun')) {
      return <Sun className="w-5 h-5 text-orange-500" />;
    }
    return <Sun className="w-5 h-5 text-gray-400" />;
  };

  // 5. Filter Logic (Search)
  const filteredBookings = bookings.filter(booking => 
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format Date for Display
  const formatDate = (isoDate, time) => {
    const d = new Date(isoDate);
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} @ ${time}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500 transition">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Bookings</h1>
            </div>
            <p className="text-gray-500 text-lg ml-12">View and manage all restaurant bookings.</p>
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
              placeholder="Search by customer name or booking ID"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition">
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={downloadCSV}
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition"
              title="Export CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center items-center text-gray-500 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading data...
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F9FA]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Weather
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {/* Actions */}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                        No bookings found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.bookingId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 font-mono">
                          #{booking.bookingId.slice(0, 6)}...
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {booking.customerName}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                          {booking.numberOfGuests}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(booking.bookingDate, booking.bookingTime)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <div className="flex justify-center" title={booking.weatherInfo?.condition || 'Unknown'}>
                            {renderWeatherIcon(booking.weatherInfo)}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-[#00C853] hover:text-[#009624] font-semibold transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}