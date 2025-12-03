import React, { useRef, useEffect } from 'react';
import useVoiceAgent from './hooks/useVoiceAgent';
import { Mic, Sun, CloudRain } from 'lucide-react';

// --- 1. Logo Component ---
const Logo = () => (
  <div className="text-[#00E676]">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2L18 2L12 10L6 2Z" />
      <path d="M6 22L18 22L12 14L6 22Z" />
    </svg>
  </div>
);

// --- 2. Booking Card Component ---
const BookingCard = ({ booking }) => {
  if (!booking) return null;

  const dateObj = new Date(booking.bookingDate);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const details = [
    { label: 'Restaurant', value: 'The Grand Bistro' },
    { label: 'Date', value: dateStr },
    { label: 'Time', value: booking.bookingTime },
    { label: 'Party Size', value: `${booking.numberOfGuests} guests` },
  ];

  return (
    <div className="w-full bg-[#EEF0F3] rounded-3xl p-6 md:p-8 animate-fade-in mb-6">
      <p className="text-lg text-gray-800 mb-8 leading-relaxed">
        Great! Here are the details for your booking. Please confirm if everything looks correct.
      </p>

      <div className="space-y-0 border-t border-gray-300">
        {details.map((item, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center py-4 border-gray-300 ${
              index !== details.length - 1 ? 'border-b' : ''
            }`}
          >
            <span className="text-gray-500 font-medium text-lg">{item.label}</span>
            <span className="text-black font-medium text-lg text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3. Weather Component ---
const WeatherCard = ({ weather }) => {
  if (!weather) return null;
  const isRain = weather.condition.toLowerCase().includes('rain');

  return (
    <div className="w-full bg-[#EEF0F3] rounded-2xl p-6 flex items-start md:items-center gap-5 animate-fade-in mb-8">
      <div className="flex-shrink-0">
        {isRain ? (
           <CloudRain className="w-8 h-8 text-blue-500 fill-current" />
        ) : (
           <Sun className="w-8 h-8 text-yellow-500 fill-current" />
        )}
      </div>
      <p className="text-lg text-gray-800 leading-snug">
        It looks like it will be {weather.condition} on Friday! You might enjoy sitting {weather.suggestedSeating === 'outdoor' ? 'on the patio' : 'inside'}.
      </p>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const { isListening, isProcessing, messages, startListening, error } = useVoiceAgent();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center font-sans text-gray-800 relative pb-48">
      
      {/* Container */}
      <div className="w-full max-w-3xl flex flex-col items-center pt-10 px-4">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-10">
          <Logo />
          <h1 className="text-2xl font-extrabold tracking-tight text-black">Voice Booking Assistant</h1>
        </header>

        {/* Content Area */}
        <div className="w-full flex flex-col gap-6">

          {/* Empty State */}
          {messages.length === 0 && !isListening && !isProcessing && (
            <div className="text-gray-400 text-center mt-10 text-lg">
              Tap the microphone to start booking...
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div key={index} className="w-full flex flex-col animate-slide-up">
              
              {/* User: The Green Line */}
              {msg.sender === 'user' && (
                <div className="w-full bg-[#1FE573] text-black px-8 py-5 rounded-2xl shadow-sm text-lg md:text-xl font-medium text-center leading-relaxed mb-8">
                  "{msg.text}"
                </div>
              )}

              {/* Agent */}
              {msg.sender === 'agent' && (
                <>
                  {msg.booking ? (
                    <BookingCard booking={msg.booking} />
                  ) : (
                    <div className="w-full bg-[#EEF0F3] rounded-3xl p-8 mb-6 text-lg text-gray-800 leading-relaxed">
                      {msg.text}
                    </div>
                  )}

                  {msg.booking && msg.booking.weatherInfo && (
                    <WeatherCard weather={msg.booking.weatherInfo} />
                  )}
                </>
              )}
            </div>
          ))}

          {/* Loading */}
          {isProcessing && (
            <div className="w-full bg-[#EEF0F3] rounded-2xl p-6 flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-75" />
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-150" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="w-full bg-red-50 text-red-600 px-6 py-4 rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Footer / Mic Button (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent flex flex-col items-center gap-4 z-50">
        <button 
          onClick={startListening}
          disabled={isProcessing}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center 
            transition-all duration-300 ease-in-out shadow-lg
            ${isListening 
              ? 'bg-red-500 scale-110' 
              : 'bg-[#1FE573] hover:scale-105 hover:-translate-y-1'}
          `}
        >
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping"></div>
          )}
          <Mic 
            className={`w-8 h-8 ${isListening ? 'text-white' : 'text-black'}`} 
            fill={isListening ? "currentColor" : "black"} 
          />
        </button>
        
        <span className="text-gray-600 font-medium text-lg">
          {isListening ? "Listening..." : "Tap to Speak"}
        </span>
      </div>

    </div>
  );
}