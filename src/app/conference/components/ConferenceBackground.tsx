import React from 'react';

const ConferenceBackground: React.FC = () => {
  return (
    <>
      {/* Improved background pattern - lower z-index to prevent overlapping with hero section */}
      <div className="fixed inset-0 -z-10 opacity-5 dark:opacity-10 pointer-events-none">
        {/* Large subtle circles */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full border border-amber-800/10 dark:border-amber-200/10"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 rounded-full border border-amber-800/10 dark:border-amber-200/10"></div>
        
        {/* Subtle wave pattern */}
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="conference-bg-pattern" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(2) rotate(0)">
              <path d="M10,10 Q30,0 50,10 T90,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M10,35 Q30,25 50,35 T90,35" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M10,60 Q30,50 50,60 T90,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M10,85 Q30,75 50,85 T90,85" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#conference-bg-pattern)" />
        </svg>
        
        {/* Abstract shapes - moved further back */}
        <div className="absolute top-1/2 left-1/5 w-32 h-32 border-l-2 border-t-2 border-amber-800/10 dark:border-amber-200/5 rotate-12"></div>
        <div className="absolute bottom-1/4 right-1/5 w-40 h-40 border-r-2 border-b-2 border-amber-800/10 dark:border-amber-200/5 -rotate-12"></div>
      </div>
      
      {/* Enhanced decorative elements - reduced blur sizes for mobile and fixed position issues */}
      <div className="absolute top-40 left-10 w-40 h-40 rounded-full bg-gradient-to-r from-amber-300/10 to-amber-100/5 blur-2xl -z-10"></div>
      <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full bg-gradient-to-r from-amber-200/5 to-amber-400/5 blur-2xl -z-10"></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-amber-100/5 to-amber-300/5 blur-2xl -z-10"></div>
    </>
  );
};

export default ConferenceBackground;
