import { useState, useEffect } from 'react';
import axios from 'axios';

const useVoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Helper: Speak Text
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech to avoid overlap
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Browser not supported. Please use Chrome/Edge.");
      return;
    }

    // CREATE NEW INSTANCE EVERY TIME 
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    // Start UI State
    setIsListening(true);
    setError(null);

    recognition.onstart = () => {
      console.log("Microphone started");
    };

    recognition.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      console.log("Heard:", userText);
      
      setIsListening(false);
      setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
      setIsProcessing(true);

      try {
        const response = await axios.post('http://localhost:5000/api/bookings', {
          userText: userText
        });

        const data = response.data;
        if (data.success) {
          setMessages((prev) => [...prev, { sender: 'agent', text: data.agentResponse, booking: data.booking }]);
          speak(data.agentResponse);
        } else {
          const errorText = data.agentResponse || "Issue processing request.";
          setMessages((prev) => [...prev, { sender: 'agent', text: errorText }]);
          speak(errorText);
        }
      } catch (error) {
        console.error("API Error:", error);
        const errorMsg = "Could not reach the server.";
        setMessages((prev) => [...prev, { sender: 'agent', text: errorMsg }]);
        speak(errorMsg);
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError("Microphone permission denied.");
      } else if (event.error === 'no-speech') {
        // Just ignore silence
      } else {
        setError("Microphone error. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Actually start
    try {
      recognition.start();
    } catch (err) {
      console.error("Start failed:", err);
      setIsListening(false);
    }
  };

  return { isListening, isProcessing, messages, startListening, error };
};

export default useVoiceAgent;