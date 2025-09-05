import React from 'react';

export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200/50',
    secondary: 'border-transparent bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-md hover:shadow-lg'
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
