const twilio = require('twilio');

const sendSMS = async (booking) => {  
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken) {
      console.warn("⚠️ [Notification Service] Twilio credentials missing. Skipping SMS.");
      return;
    }

    const client = twilio(accountSid, authToken);
    const dateStr = new Date(booking.bookingDate).toLocaleDateString();
    
    const message = `
      🍽️ Booking Confirmed!
      Hi ${booking.customerName}, table for ${booking.numberOfGuests} at The Grand Bistro.
      📅 ${dateStr} @ ${booking.bookingTime}
      
      See you soon!
    `;

    // Use the customer's phone, or fallback to the env variable (for testing)
    const recipient = booking.customerPhone || process.env.MY_PHONE_NUMBER;

    if (!recipient) {
      console.warn("⚠️ [Notification Service] No recipient phone number found.");
      return;
    }

    
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: recipient
    });

    console.log(`[Notification Service] SMS Sent!`);

  } catch (error) {
    console.error("[Notification Service] Failed:", error.message);
  }
};

module.exports = { sendSMS };