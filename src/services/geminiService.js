const { GoogleGenAI } = require("@google/genai");

// Initialize with the new Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractBookingDetails = async (userText) => {
  const currentDateTime = new Date().toISOString();

  // 1. Define the System Instruction (The Rules)
  // We move the "System Role" here as per the new syntax
  const systemInstruction = `
    You are a strict JSON extraction API for a restaurant booking agent.
    
    Rules:
    1. Current Date Reference: ${currentDateTime}
    2. If the user mentions a relative date (e.g., "next Friday"), calculate the YYYY-MM-DD.
    3. Default 'customerName' to "Guest" if not provided.
    4. Return ONLY raw JSON.
    
    Required Fields:
    - customerName (String)
    - customerPhone (String or null)
    - numberOfGuests (Number)
    - bookingDate (YYYY-MM-DD)
    - bookingTime (HH:MM 24hr format)
    - cuisinePreference (String or null)
    - specialRequests (String or null)
  `;

  try {
    // 2. Call the Model with the new syntax
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: userText }]
        }
      ],
      config: {
        systemInstruction: systemInstruction, // Injecting the persona here
        responseMimeType: "application/json", // FORCE JSON output (New Feature)
        temperature: 0.1 // Low temperature for more deterministic results
      }
    });

    // 3. Extract Text
    const responseText = response.text;
    console.log("DEBUG: Gemini JSON Response:", responseText);

    // 4. Parse directly (The MIME type ensures it is valid JSON)
    return JSON.parse(responseText);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

module.exports = { extractBookingDetails };