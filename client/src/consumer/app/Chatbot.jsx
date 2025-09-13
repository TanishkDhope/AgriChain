import React, { useState, useEffect, useRef } from "react";
// import axios from "axios"; // Backend dependency commented out

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false); // Simple mic toggle state
  // Commented out sessionId as it's backend-related
  // const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const chatboxRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to format text with tables and line breaks
  const formatMessage = (text) => {
    if (!text) return text;
    
    // Regular text with line breaks
    return text.split('\n').map((line, i) => (
      <div key={i} className="mb-1.5 leading-6">{line}</div>
    ));
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message locally
    const userMessage = { sender: "You", text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Frontend-only response simulation
    const responses = [
      "I understand you're asking about agricultural products. In a full implementation, I would connect to a backend API to fetch real data.",
      "Your query about '" + currentInput + "' would be processed by our agricultural database to find matching products.",
      "For demonstration purposes, this is a frontend-only version. A backend would provide actual product information.",
      "I'd be happy to help you find information about crops, prices, and availability if this were connected to our database."
    ];
    
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botMessage = { sender: "AgriBot", text: randomResponse, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsMinimized(!isMinimized);
  };

  // Minimized floating button view
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChatbot}
          className="w-16 h-16 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <span className="text-2xl">🌾</span>
        </button>
      </div>
    );
  }

  // Maximized chatbot view
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] font-sans rounded-2xl shadow-2xl bg-white overflow-hidden flex flex-col">
      {/* Header with minimize button */}
      <div className="bg-emerald-800 text-white flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <div>
            <h3 className="font-semibold text-lg">AgriChain Bot</h3>
            <p className="text-xs text-emerald-200">Ask about produce & prices</p>
          </div>
        </div>
        <button
          onClick={toggleChatbot}
          className="w-8 h-8 bg-emerald-700 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <span className="text-sm">✕</span>
        </button>
      </div>
      
      <div ref={chatboxRef} className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-gray-600 text-center py-8 px-4 text-sm">
            <p className="font-medium mb-2">Hi! I'm your AgriBot 👋</p>
            <p className="text-xs text-gray-500 italic">Start a conversation...</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col mb-3 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <div className="font-medium mb-1 text-xs text-gray-600 px-2">
                  {msg.sender}:
                </div>
                <div className={`py-2.5 px-3 max-w-[85%] shadow-sm whitespace-pre-wrap break-words text-sm leading-5 ${
                  msg.isUser 
                    ? 'bg-emerald-100 rounded-lg rounded-br-sm' 
                    : 'bg-white rounded-lg rounded-bl-sm'
                }`}>
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start mb-3">
                <div className="font-medium mb-1 text-xs text-gray-600 px-2">
                  AgriBot:
                </div>
                <div className="bg-white rounded-lg rounded-bl-sm shadow-sm py-2.5 px-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex p-3 border-t border-gray-200 bg-white items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 py-2.5 px-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
          placeholder="Ask about crops, prices..."
          disabled={isTyping}
        />
        
        {/* Simple Microphone Toggle Button */}
        <button
          onClick={toggleMic}
          className={`py-2.5 px-3 rounded-xl border-none font-medium text-sm transition-all duration-200 ${
            isMicOn 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          disabled={isTyping}
          title={isMicOn ? "Microphone On" : "Microphone Off"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </button>
        
        <button 
          onClick={sendMessage} 
          className="py-2.5 px-4 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={!input.trim() || isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
