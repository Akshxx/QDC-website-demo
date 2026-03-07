import React, { useState } from 'react';

interface EventGalleryProps {
  images: string[];
  title: string;
  onClose: () => void;
}

export default function EventGallery({ images, title, onClose }: EventGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title} - Event Recap
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="relative flex items-center justify-center bg-black h-[50vh] md:h-[60vh]">
          <img 
            src={images[currentIndex]} 
            alt={`Recap image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          
          {images.length > 1 && (
            <>
              {/* Enhanced left arrow button */}
              <button 
                onClick={handlePrevious}
                className="absolute left-4 bg-black/60 hover:bg-black/80 rounded-full p-3 text-white shadow-lg transform transition-transform hover:scale-110"
                aria-label="Previous image"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Enhanced right arrow button */}
              <button 
                onClick={handleNext}
                className="absolute right-4 bg-black/60 hover:bg-black/80 rounded-full p-3 text-white shadow-lg transform transition-transform hover:scale-110"
                aria-label="Next image"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="p-2 flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentIndex(idx)}
                className={`h-16 w-24 flex-shrink-0 ${idx === currentIndex ? 'ring-2 ring-blue-500' : ''}`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
