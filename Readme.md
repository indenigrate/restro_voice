# Restaurant Booking Voice Agent 🎙️

A full-stack voice assistant for restaurant reservations. It uses AI to understand natural language, checks real-time weather for seating suggestions, and sends SMS confirmations.

**Live Demo Video:** [Click Here](https://youtu.be/MSq1deXeAS0)

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
cd client
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

**Step 3: Start Frontend** (Client terminal)

```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in Chrome.

## 🧠 How It Works

1.  **Listen:** Frontend captures user audio and sends text to the backend.
2.  **Parse:** Gemini converts natural language (e.g., "tomorrow at 7") into structured JSON.
3.  **Check:** System validates the date and checks weather forecasts.
4.  **Save & Notify:** Booking is saved to MongoDB, and an SMS is triggered via Twilio.
5.  **Respond:** The browser verbally confirms the booking and seating suggestion.
