"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedEventGalleryProps {
  eventId: string;
  title: string;
  onClose: () => void;
}

const OptimizedEventGallery: React.FC<OptimizedEventGalleryProps> = ({ 
  eventId, 
  title, 
  onClose 
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch images when the gallery opens
  useEffect(() => {
    const fetchEventImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the event images only when needed
        const res = await fetch(`/api/public/events/${eventId}/gallery`);
        
        if (!res.ok) {
          throw new Error('Failed to load event images');
        }
        
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        console.error('Error loading gallery images:', err);
        setError(err instanceof Error ? err.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventImages();
  }, [eventId]);
  
  // Navigate through images
  const goToNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);
  
  const goToPrev = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'ArrowLeft') goToPrev();
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 z-10">
        <button 
          className="text-white bg-gray-800/60 hover:bg-gray-700/60 rounded-full p-2"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white text-xl font-semibold mb-3 text-center">
          {title}
        </h3>
        
        <div className="relative flex-grow bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-white">Loading gallery images...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && !loading && (
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white mb-2">Failed to load gallery images</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          )}
          
          {/* No images message */}
          {!loading && !error && images.length === 0 && (
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white">No images available for this event</p>
            </div>
          )}
          
          {/* Image gallery */}
          {!loading && !error && images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center"
              >
                <img 
                  src={images[currentIndex]} 
                  alt={`${title} - Image ${currentIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain"
                  loading="lazy" // Use native lazy loading
                />
              </motion.div>
            </AnimatePresence>
          )}
          
          {/* Navigation buttons - Only shown when there are images */}
          {!loading && !error && images.length > 1 && (
            <>
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-2 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 rounded-full p-2 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Image counter */}
        {!loading && !error && images.length > 0 && (
          <div className="text-white text-center mt-4">
            Image {currentIndex + 1} of {images.length}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OptimizedEventGallery;
