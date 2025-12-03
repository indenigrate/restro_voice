const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const { getWeatherForecast } = require('../services/weatherService');
const { extractBookingDetails } = require('../services/geminiService');
const { sendSMS } = require('../services/notificationService');

router.post('/', async (req, res) => {
  try {
    const { userText } = req.body;
    
    // 1. AI Extraction
    const details = await extractBookingDetails(userText);
    
    if (!details) {
      return res.json({ 
        success: false, 
        agentResponse: "I'm sorry, I didn't catch that. Could you please repeat?" 
      });
    }

    console.log("DEBUG: Extracted Details:", details);

    // 2. MISSING DATA CHECKS 
    
    // Case A: User didn't specify a Date
    if (!details.bookingDate) {
      return res.json({
        success: false,
        agentResponse: "What date would you like to book for?"
      });
    }

    // Case B: User didn't specify a Time
    if (!details.bookingTime) {
      return res.json({
        success: false,
        agentResponse: "What time should I book the table for?"
      });
    }

    // Case C: User didn't specify Guests (Optional - default used in Gemini, but safe to check)
    if (!details.numberOfGuests) {
      return res.json({
        success: false,
        agentResponse: "How many people will be joining?"
      });
    }

    // 3. Logic & Weather Check

    // Construct Date Object safely
    const combinedDateString = `${details.bookingDate}T${details.bookingTime}:00`;
    const bookingDateObj = new Date(combinedDateString);

    // Check for Invalid Date (Double safety)
    if (isNaN(bookingDateObj.getTime())) {
      return res.json({
        success: false,
        agentResponse: "I understood the date, but it seems invalid. Could you say it again?"
      });
    }

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 4); // 4-day forecast limit

    // Past Date Check
    if (bookingDateObj < today) {
      return res.json({ 
        success: false, 
        agentResponse: "I cannot book a table in the past. Please choose a future time." 
      });
    }

    // Future Limit Check
    if (bookingDateObj > maxDate) {
      return res.json({ 
        success: false, 
        agentResponse: "I can only book up to 4 days in advance due to weather forecast limits." 
      });
    }

    // 4. Fetch Weather
    const weatherData = await getWeatherForecast(bookingDateObj);

    // 5. Save to Database
    const newBooking = new Booking({
      bookingId: uuidv4(),
      customerName: details.customerName || "Guest",
      customerPhone: process.env.MY_PHONE_NUMBER,
      numberOfGuests: details.numberOfGuests,
      bookingDate: bookingDateObj,
      bookingTime: details.bookingTime,
      cuisinePreference: details.cuisinePreference,
      specialRequests: details.specialRequests,
      weatherInfo: weatherData,
      seatingPreference: weatherData.suggestedSeating,
      status: 'confirmed'
    });

    await newBooking.save();

    sendSMS(newBooking)
    // 6. Success Response
    res.status(201).json({
      success: true,
      booking: newBooking,
      agentResponse: `Confirmed. Table for ${details.numberOfGuests} on ${details.bookingDate} at ${details.bookingTime}. The forecast is ${weatherData.condition}, so I've assigned ${weatherData.suggestedSeating} seating.`
    });

  } catch (err) {
    console.error("Create Error:", err);
    res.json({ 
      success: false, 
      agentResponse: "I encountered a server error. Please try again." 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // We search by 'bookingId' (UUID)'
    const booking = await Booking.findOne({ bookingId: req.params.id });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ bookingId: req.params.id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully', cancelledBookingId: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;