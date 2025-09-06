import React, { useState, useCallback, useRef, useEffect } from "react";
import { timelineData } from "../lib/data";

const InfoRow = ({ label, value }) => (
  <div className="py-3 px-4 text-sm flex items-center justify-between bg-gradient-to-r from-sky-50/80 to-blue-50/80 rounded-xl mb-3 hover:from-sky-100/90 hover:to-blue-100/90 border border-sky-200/50 transition-all duration-300 shadow-sm">
    <span className="font-semibold text-sky-800">{label}:</span>
    <span className="text-slate-900 font-mono text-xs bg-white px-3 py-1.5 rounded-lg shadow-md border border-sky-200/50 font-medium">
      {value}
    </span>
  </div>
);

const StepIndicator = ({ stepNumber, isActive, isCompleted, icon, title }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold border-4 transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-sky-400 to-blue-500 border-sky-300 text-white shadow-lg shadow-sky-300/50 transform scale-110"
          : isCompleted
          ? "bg-gradient-to-r from-sky-300 to-blue-400 border-sky-200 text-white shadow-lg shadow-sky-300/50"
          : "bg-gradient-to-r from-slate-100 to-gray-100 border-slate-300 text-slate-600"
      }`}
    >
      {icon}
    </div>
    <div className="mt-2 text-center">
      <div className="text-xs md:text-sm font-bold text-slate-800">
        Step {stepNumber}
      </div>
      <div className="text-xs text-slate-600 max-w-16 md:max-w-20 leading-tight">
        {title}
      </div>
    </div>
  </div>
);

const ConnectionLine = ({ isActive }) => (
  <div className="flex-1 h-1 mx-2 md:mx-4 mt-6 md:mt-8">
    <div
      className={`h-full rounded-full transition-all duration-500 ${
        isActive
          ? "bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 shadow-sm"
          : "bg-gradient-to-r from-slate-300 to-gray-300"
      }`}
    ></div>
  </div>
);

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

export default function SupplyChainTimeline({ data = timelineData }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleSwipeLeft = useCallback(() => {
    setActiveStep((prev) => Math.min(data.length - 1, prev + 1));
  }, [data.length]);

  const handleSwipeRight = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const swipeHandlers = useSwipe(handleSwipeLeft, handleSwipeRight);

  // Keyboard navigation functionality
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setActiveStep((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setActiveStep((prev) => Math.min(data.length - 1, prev + 1));
          break;
        case 'Home':
          event.preventDefault();
          setActiveStep(0);
          break;
        case 'End':
          event.preventDefault();
          setActiveStep(data.length - 1);
          break;
        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [data.length]);

  const currentStep = data[activeStep];

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-4 bg-gradient-to-br from-sky-50/70 via-blue-50/50 to-cyan-50/70 py-6">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 via-blue-700 to-cyan-800 bg-clip-text text-transparent mb-2 md:mb-3 tracking-tight">
          Product Journey
        </h1>
        <p className="text-sm md:text-lg text-slate-700 leading-relaxed font-medium">
          Complete transparency from farm to your table
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center pb-4">
          {data.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className="cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
                onClick={() => setActiveStep(index)}
              >
                <StepIndicator
                  stepNumber={index + 1}
                  isActive={activeStep === index}
                  isCompleted={index < activeStep}
                  icon={step.icon}
                  title={step.title}
                />
              </div>
              {index < data.length - 1 && (
                <ConnectionLine isActive={index < activeStep} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Details with Swipe Support */}
      <div
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-300/20 border border-sky-200/50 overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50"
        {...swipeHandlers}
        tabIndex={0}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-300/90 via-sky-400/90 to-blue-500/90 px-4 md:px-6 py-3 md:py-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-200/30 to-blue-400/30"></div>
          <div className="relative flex items-center text-white">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl md:text-2xl mr-3 md:mr-4 shadow-lg border border-white/20">
              {currentStep.icon}
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold tracking-wide">
                Step {activeStep + 1}: {currentStep.title}
              </h2>
              <p className="text-white/90 text-xs md:text-base mt-1 font-medium">
                {currentStep.date} • {currentStep.location}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-6 bg-gradient-to-br from-sky-50/40 via-blue-50/30 to-cyan-50/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Basic Information - Always shown */}
            <div>
              <div className="space-y-2">
                {Object.entries(currentStep.basicInfo).map(
                  ([label, value], idx) => (
                    <InfoRow key={idx} label={label} value={value} />
                  )
                )}
              </div>
            </div>

            {/* Detailed Information - Hidden on mobile */}
            <div className="hidden lg:block">
              <div className="space-y-2">
                {Object.entries(currentStep.detailedInfo).map(
                  ([label, value], idx) => (
                    <InfoRow key={idx} label={label} value={value} />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Navigation hints */}
          <div className="text-center mt-4">
            <div className="block md:hidden">
              <p className="text-slate-600 text-sm font-medium">
                ← Swipe to navigate →
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex justify-between items-center mt-4 md:mt-6">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="flex items-center px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl hover:from-sky-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              ⬅️ Previous Step
            </button>

            <div className="flex space-x-2">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    index === activeStep
                      ? "bg-gradient-to-r from-sky-400 to-blue-500 shadow-md scale-125 focus:ring-sky-400"
                      : "bg-slate-300 hover:bg-sky-300 focus:ring-sky-400"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setActiveStep(Math.min(data.length - 1, activeStep + 1))
              }
              disabled={activeStep === data.length - 1}
              className="flex items-center px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl hover:from-sky-500 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Next Step ➡️
            </button>
          </div>

          {/* Mobile-only pagination */}
          <div className="flex md:hidden justify-center items-center mt-4">
            <div className="flex space-x-4">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    index === activeStep
                      ? "bg-gradient-to-r from-sky-400 to-blue-500 shadow-md scale-125 focus:ring-sky-400"
                      : "bg-slate-300 hover:bg-sky-300 focus:ring-sky-400"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
