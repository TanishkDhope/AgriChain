import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GiWheat } from "react-icons/gi";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `Hi! I'm your AgriBot 👋

You can ask me about:

"Find tomatoes from Maharashtra"
"Show me premium quality rice"
"What sugarcane is available?"
"Search for produce from Karnataka"`,
    },
  ]);

  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const chatboxRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🌍 Supported Languages
  const languages = [
    { code: "en-US", name: "English", flag: "🇺🇸" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
    { code: "ta-IN", name: "Tamil", flag: "🇮🇳" },
    { code: "te-IN", name: "Telugu", flag: "🇮🇳" },
    { code: "mr-IN", name: "Marathi", flag: "🇮🇳" },
    { code: "bn-BD", name: "Bengali", flag: "🇧🇩" },
  ];

  // Auto-scroll chat
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  // 🎤 Setup Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setIsMicOn(false);

        // Auto-send voice message
        setTimeout(() => sendMessage(transcript), 500);
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setIsMicOn(false);
        setMessages((prev) => [
          ...prev,
          {
            sender: "System",
            text: `Speech error: ${event.error}`,
            isUser: false,
          },
        ]);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsMicOn(false);
      };
    }
  }, [selectedLanguage]);

  // 🎤 Toggle Mic
  const toggleMic = () => {
    if (!recognitionRef.current) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "System",
          text: "⚠️ Speech recognition not supported in your browser.",
          isUser: false,
        },
      ]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsListening(true);
      setIsMicOn(true);

      setMessages((prev) => [
        ...prev,
        {
          sender: "System",
          text: `🎤 Listening in ${selectedLanguage}`,
          isUser: false,
        },
      ]);
    }
  };

  // ✍️ Send Message
  const sendMessage = async (voiceText = null) => {
    const messageText = voiceText || input;
    if (!messageText.trim()) return;

    const userMessage = { sender: "You", text: messageText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    if (!voiceText) setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5003/chat", {
        text: messageText,
        sessionId: sessionId,
      });
      setMessages((prev) => [
        ...prev,
        { sender: "AgriBot", text: res.data.reply, isUser: false },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AgriBot",
          text: "❌ Server error. Try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 📥 Enter Key
  const handleKeyPress = (e) => e.key === "Enter" && sendMessage();

  // 🔄 Minimize Chatbot
  const toggleChatbot = () => setIsMinimized(!isMinimized);

  // 🖼️ Format Messages (supports tables)
  const formatMessage = (text) => {
    if (!text) return text;
    return text.split("\n").map((line, i) => (
      <div key={i} className="mb-1.5 leading-6">
        {line}
      </div>
    ));
  };

  // ➕ Minimized Floating Button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChatbot}
          className="w-26 h-26 cursor-pointer bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <GiWheat className="w-15 h-15 text-white" />
        </button>
      </div>
    );
  }

  // 🖼️ Expanded Chatbot UI
  return (
    <div className="fixed bottom-6 right-6 z-50 w-160 h-[35rem] font-sans rounded-2xl shadow-2xl bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-emerald-800 text-white flex items-center justify-between py-4 px-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <div>
            <h3 className="font-semibold text-lg">AgriChain Bot</h3>
            <p className="text-xs text-emerald-200">
              Ask about produce & prices
            </p>
          </div>
        </div>
        <button
          onClick={toggleChatbot}
          className="w-8 h-8 bg-emerald-700 hover:bg-emerald-600 rounded-full flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Language Selector */}
      <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
        <span className="text-xs text-emerald-700">Language:</span>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="text-xs border border-emerald-200 rounded-md px-2 py-1 bg-white"
          disabled={isListening}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
        {isListening && (
          <span className="ml-auto text-xs text-red-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{" "}
            Listening...
          </span>
        )}
      </div>

      {/* Chat Messages */}
      <div
        ref={chatboxRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col gap-3"
      >
        {messages.length === 0 ? (
          <div className="text-gray-600 text-center py-8 px-4 text-sm">
            <p className="font-medium mb-2">Hi! I'm your AgriBot 👋</p>
            <p className="text-xs text-gray-500 italic">
              Ask me about crops, prices, availability
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col mb-3 ${
                  msg.isUser ? "items-end" : "items-start"
                }`}
              >
                {msg.role === "bot" ? (
                  <div className="bg-emerald-50 text-emerald-800 text-sm p-3 rounded-lg border border-emerald-200 max-w-[85%]">
                    {formatMessage(msg.text)}
                  </div>
                ) : (
                  <>
                    <div className="font-medium mb-1 text-xs text-gray-600 px-2">
                      {msg.sender}:
                    </div>
                    <div
                      className={`py-2.5 px-3 max-w-[85%] shadow-sm whitespace-pre-wrap break-words text-sm leading-5 ${
                        msg.isUser
                          ? "bg-emerald-100 rounded-lg rounded-br-sm"
                          : "bg-white rounded-lg rounded-bl-sm"
                      }`}
                    >
                      {formatMessage(msg.text)}
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start mb-3">
                <div className="bg-white rounded-lg rounded-bl-sm shadow-sm py-2.5 px-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex p-3 border-t border-gray-200 bg-white items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 py-2.5 px-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-emerald-500"
          placeholder="Ask about crops, prices..."
          disabled={isTyping}
        />

        {/* Mic Button */}
        <button
          onClick={toggleMic}
          className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : isMicOn
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
          disabled={isTyping}
          title={isListening ? "Listening..." : "Start Voice Command"}
        >
          🎤
        </button>

        {/* Send Button */}
        <button
          onClick={() => sendMessage()}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm disabled:opacity-50"
          disabled={!input.trim() || isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
