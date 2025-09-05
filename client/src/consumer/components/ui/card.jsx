import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`rounded-2xl border border-slate-200/60 bg-white/90 backdrop-blur-sm text-slate-900 shadow-xl shadow-slate-100/50 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-2 p-6 sm:p-8 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl sm:text-2xl font-bold leading-tight tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm sm:text-base text-slate-600 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 sm:p-8 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
