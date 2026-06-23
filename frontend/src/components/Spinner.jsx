import React from 'react';

const Spinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4',
  };

  const spinnerMarkup = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-slate-800 border-t-brand-500`}
      ></div>
      {fullPage && (
        <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">
          Loading HorizonTechX...
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center">
        {spinnerMarkup}
      </div>
    );
  }

  return spinnerMarkup;
};

export default Spinner;
