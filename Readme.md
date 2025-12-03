# Restaurant Booking Voice Agent

A full-stack voice assistant for restaurant reservations. It uses AI to understand natural language, checks real-time weather for seating suggestions, and sends SMS confirmations.

**Live Demo Video:** [Click Here](https://youtu.be/MSq1deXeAS0)

**Twilio_SMS:** [Click Here](Twilio_Texts.jpg)

> **🚀 Highlights**
>
> **✨ Bonus Features Implemented:**
> * **Admin Dashboard:** A functional React dashboard to view, search, and export booking data (Bonus #5).
> * **SMS Confirmation:** Integrated **Twilio** to send instant text receipts to users (Bonus #4).
> * **Natural Language Processing:** Uses **Google Gemini** for intent classification and entity extraction (Bonus #1).
> * **Smart Seating:** Automatically suggests "Indoor" vs "Outdoor" based on real-time rain forecasts.
>
> **🛡️ Edge Case Handling:**
> * **Time Travel Prevention:** Rejects bookings for dates in the past.
> * **Forecast Limits:** Restricts bookings to a 5-day window to ensure weather data accuracy.
> * **Missing Data Fallback:** Interactive AI prompts if the user forgets to mention the time or date.
> * **Contact Fallback:** Uses a default environment variable phone number for testing if none is provided in voice.

## ⚡ Features
- **Voice Interaction:** Browser-native Speech-to-Text & Text-to-Speech (Web Speech API).
- **AI Powered:** Google Gemini extracts structured data (Date, Time, Guests) from voice commands.
- **Smart Weather:** Suggests "Indoor" or "Outdoor" seating based on OpenWeatherMap forecasts.
- **Notifications:** Sends instant booking confirmations via Twilio SMS.
- **Admin Dashboard:** View bookings, search records, and track analytics.

## 🛠️ Tech Stack
- **Frontend:** React + Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Docker)
- **APIs:** Google Gemini, OpenWeatherMap, Twilio

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js (v14+)
- Docker Desktop (for MongoDB)
- Google Chrome (Required for Voice API)

### 2. Installation
```bash
# Clone repo
git clone <your-repo-url>
cd restaurant-voice-agent

# Install Backend Deps
npm install

# Install Frontend Deps
cd frontend
npm install
```

### 3\. Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant_agent

# API Keys
OPENWEATHER_API_KEY=your_key
GEMINI_API_KEY=your_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_twilio_number
MY_PHONE_NUMBER=your_verified_number # For testing fallback
```

### 4\. Run Application

**Step 1: Start Database**

```bash
docker-compose up -d
```

**Step 2: Start Backend** (Root terminal)

```bash
npx nodemon src/index.js
```

**Step 3: Start Frontend** (Frontend terminal)

```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in Chrome(Does not support Firefox currently due to Web Speech API Limitations).

## 🧠 How It Works

1.  **Listen:** Frontend captures user audio and sends text to the backend.
2.  **Parse:** Gemini converts natural language (e.g., "tomorrow at 7") into structured JSON.
3.  **Check:** System validates the date and checks weather forecasts.
4.  **Save & Notify:** Booking is saved to MongoDB, and an SMS is triggered via Twilio.
5.  **Respond:** The browser verbally confirms the booking and seating suggestion.
