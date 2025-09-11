import React, { useState, useRef, useCallback } from "react";
import { productData } from "../lib/data";

const InfoCard = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
    <span className="text-gray-700 text-sm font-medium flex items-center gap-2">
      <span>{icon}</span>
      {label}
    </span>
    <span className="text-gray-900 font-semibold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">
      {value}
    </span>
  </div>
);

const StepButton = ({ stepNumber, isActive, icon, title, onClick, isCompleted }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-3 rounded-lg transition-all text-center min-w-20 ${
      isActive
        ? "bg-green-500 text-white shadow-lg scale-105"
        : isCompleted
        ? "bg-green-400 text-white shadow-md"
        : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200 shadow-sm"
    }`}
  >
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-xs font-bold">Step {stepNumber}</div>
    <div className="text-xs leading-tight">{title}</div>
  </button>
);

const PriceChart = ({ data }) => {
  const priceData = [
    { step: "Farmer", price: 20, icon: "🌾" },
    { step: "Distributor", price: 25, icon: "🚚" },
    { step: "Market", price: 30, icon: "🏬" },
    { step: "Retailer", price: 45, icon: "🏪" }
  ];

  const maxPrice = Math.max(...priceData.map(d => d.price));

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Price at Each Stage</h3>
      
      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>₹{maxPrice}</span>
          <span>₹{Math.round(maxPrice * 0.75)}</span>
          <span>₹{Math.round(maxPrice * 0.5)}</span>
          <span>₹{Math.round(maxPrice * 0.25)}</span>
          <span>₹0</span>
        </div>

        {/* Chart area */}
        <div className="ml-6 relative h-64 bg-gradient-to-t from-green-50 to-transparent rounded-lg border border-gray-200">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0.25, 0.5, 0.75].map((percentage, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-gray-200 border-dashed"
                style={{ bottom: `${percentage * 100}%` }}
              />
            ))}
          </div>

          {/* Price points and connecting line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Connecting line */}
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth="0.8"
              points={priceData.map((d, i) => `${(i / (priceData.length - 1)) * 100},${100 - (d.price / maxPrice) * 100}`).join(' ')}
            />
            
            {/* Price points */}
            {priceData.map((d, i) => (
              <circle
                key={i}
                cx={(i / (priceData.length - 1)) * 100}
                cy={100 - (d.price / maxPrice) * 100}
                r="1.5"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* Price labels */}
          {priceData.map((d, i) => (
            <div
              key={i}
              className="absolute transform -translate-x-1/2"
              style={{
                left: `${(i / (priceData.length - 1)) * 100}%`,
                bottom: `${(d.price / maxPrice) * 100 + 5}%`
              }}
            >
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-md">
                ₹{d.price}
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="ml-6 flex justify-between mt-4">
          {priceData.map((d, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{d.icon}</div>
              <div className="text-sm font-semibold text-gray-700">{d.step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-bold text-blue-800 mb-2">Price Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-blue-700 font-medium">Farmer Share:</span>
            <span className="ml-1 font-bold">{Math.round((20/45) * 100)}%</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Total Markup:</span>
            <span className="ml-1 font-bold">₹{45-20} (+{Math.round(((45-20)/20) * 100)}%)</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Highest Jump:</span>
            <span className="ml-1 font-bold">Market → Retail (₹15)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom hook for swipe gestures
const useSwipe = (onSwipedLeft, onSwipedRight) => {
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipedLeft) {
      onSwipedLeft();
    } else if (isRightSwipe && onSwipedRight) {
      onSwipedRight();
    }
  }, [onSwipedLeft, onSwipedRight]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default function Timeline({ data }) {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = data[activeStep];

  const nextStep = () => setActiveStep(prev => Math.min(data.length - 1, prev + 1));
  const prevStep = () => setActiveStep(prev => Math.max(0, prev - 1));

  const handleSwipeLeft = useCallback(() => {
    setActiveStep((prev) => Math.min(data.length - 1, prev + 1));
  }, [data.length]);

  const handleSwipeRight = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  return (
    <div className="w-full p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{productData.name} Journey</h1>
        <p className="text-gray-600 text-sm">Complete transparency from farm to table</p>
      </div>

      {/* Timeline Navigation - Hidden on mobile */}
      <div className="mb-8 hidden md:block">
        <div className="flex items-center justify-center overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-max">
            {data.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepButton
                  stepNumber={index + 1}
                  isActive={activeStep === index}
                  isCompleted={index < activeStep}
                  icon={step.icon}
                  title={step.title}
                  onClick={() => setActiveStep(index)}
                />
                {index < data.length - 1 && (
                  <div className={`h-0.5 w-8 rounded ${index < activeStep ? "bg-green-400" : "bg-gray-300"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Step Details */}
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        {...swipeHandlers}
      >
        <div className="bg-green-500 text-white p-5">
          <div className="flex items-center">
            <div className="text-2xl mr-4 bg-white/20 p-2 rounded-lg">{currentStep.icon}</div>
            <div>
              <h2 className="text-lg font-bold">Step {activeStep + 1}: {currentStep.title}</h2>
              <p className="text-green-100 text-sm">{currentStep.date} • {currentStep.location}</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-green-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                {Object.entries(currentStep.basicInfo).map(([label, value], idx) => {
                  const icon = label.includes('Date') ? '📅' : 
                              label.includes('Location') ? '📍' : 
                              label.includes('Name') ? '👤' : '📋';
                  return (
                    <InfoCard
                      key={idx}
                      label={label.replace(/📅|📍|👤/, '').trim()}
                      value={value}
                      icon={icon}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <div className="space-y-3">
                {Object.entries(currentStep.detailedInfo).map(([label, value], idx) => {
                  const icon = label.includes('Quantity') ? '📦' : 
                              label.includes('Price') || label.includes('Cost') ? '💰' : 
                              label.includes('Storage') || label.includes('Temperature') ? '🌡️' : 
                              label.includes('Hash') ? '🔗' : '📊';
                  return (
                    <InfoCard
                      key={idx}
                      label={label.replace(/📦|💰|🌡️|🔗|📊/, '').trim()}
                      value={value}
                      icon={icon}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile swipe indicator */}
          <div className="md:hidden text-center mt-4">
            <p className="text-gray-600 text-sm">← Swipe to navigate →</p>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex justify-between items-center mt-6">
            <button
              onClick={prevStep}
              disabled={activeStep === 0}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              ← Previous
            </button>

            <div className="flex space-x-2">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeStep ? "bg-green-500" : index < activeStep ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={activeStep === data.length - 1}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Next →
            </button>
          </div>

          {/* Mobile-only pagination dots */}
          <div className="md:hidden flex justify-center items-center mt-4">
            <div className="flex space-x-2">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeStep ? "bg-green-500" : index < activeStep ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <PriceChart data={data} />
    </div>
  );
}
