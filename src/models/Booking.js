const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
  bookingDate: { type: Date, required: true }, // Stores full date object
  bookingTime: { type: String, required: true }, // e.g., "19:00"
  cuisinePreference: { type: String },
  specialRequests: { type: String },
  
  weatherInfo: { type: Object }, // Storing full weather object or summary
  seatingPreference: { type: String, enum: ['indoor', 'outdoor'] },
  status: { type: String, default: 'pending', enum: ['confirmed', 'pending', 'cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);