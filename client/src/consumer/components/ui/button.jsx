import React from 'react';

export const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 shadow-lg';
  
  const variants = {
    default: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-green-200',
    ghost: 'hover:bg-green-100 hover:text-green-800 shadow-none',
    outline: 'border-2 border-green-300 hover:bg-green-50 hover:text-green-800 hover:border-green-400 bg-white/80'
  };
  
  const sizes = {
    default: 'h-11 px-6 py-3 text-sm',
    sm: 'h-9 rounded-lg px-4 text-sm',
    lg: 'h-14 rounded-xl px-8 text-base font-bold',
    icon: 'h-11 w-11'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
