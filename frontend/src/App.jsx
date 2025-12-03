import React, { useRef, useEffect } from 'react';
import useVoiceAgent from './hooks/useVoiceAgent';
import { Mic, Loader2, ChefHat, AlertCircle } from 'lucide-react'; // Import AlertCircle

function App() {
  // Destructure 'error' from the hook
  const { isListening, isProcessing, messages, startListening, error } = useVoiceAgent();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-center gap-2 py-6 border-b border-gray-800">
        <ChefHat className="text-orange-500 w-8 h-8" />
        <h1 className="text-2xl font-bold tracking-wide">Restaurant AI</h1>
      </div>

      {/* --- NEW: Error Banner for Firefox/Safari --- */}
      {error && (
        <div className="mt-4 w-full max-w-md bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
          <p className="text-red-200 text-sm">
            {error} <br/>
            <span className="text-xs opacity-75">Voice features work best in <b>Chrome</b> or <b>Edge</b>.</span>
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 w-full max-w-md mt-6 space-y-4 overflow-y-auto mb-32 px-2 scrollbar-hide">
        {messages.length === 0 && !error && (
          <div className="text-gray-500 text-center mt-20">
            <p className="mb-2">Tap the microphone and say:</p>
            <p className="italic text-gray-400">"Book a table for 2 this Friday at 7 PM"</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
              <span className="text-sm text-gray-300">Checking availability...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Controls */}
      <div className="fixed bottom-10 flex flex-col items-center z-10">
        <button
          onClick={startListening}
          // Disable button if there is a browser error
          disabled={isListening || isProcessing || !!error}
          className={`
            relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-2xl
            ${!!error ? 'bg-gray-700 cursor-not-allowed opacity-50' : 
              isListening ? 'bg-red-500 scale-110 ring-8 ring-red-500/20' : 'bg-orange-500 hover:bg-orange-600 hover:scale-105'}
          `}
        >
          <Mic className={`w-8 h-8 text-white ${isListening ? 'animate-pulse' : ''}`} />
        </button>
        
        <p className="mt-4 text-gray-400 text-sm font-medium tracking-wide">
          {!!error ? 'Microphone Unavailable' : isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to Speak'}
        </p>
      </div>

    </div>
  );
}

export default App;