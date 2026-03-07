import React, { useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types/events';
import { ObjectId } from 'mongodb'; // Add ObjectId import
import EventGallery from './EventGallery';

interface EventCardProps {
  event: Event;
  colorScheme?: 'blue' | 'red' | 'green' | 'purple' | 'orange';
  index?: number;
}

// Array of Google-inspired gradient color schemes
const COLOR_SCHEMES = {
  blue: 'from-blue-600 via-indigo-500 to-cyan-400',
  red: 'from-red-600 via-pink-500 to-orange-400',
  green: 'from-green-600 via-emerald-500 to-teal-400',
  purple: 'from-purple-600 via-violet-500 to-fuchsia-400',
  orange: 'from-orange-600 via-amber-500 to-yellow-400'
};

export default function EventCard({ event, colorScheme, index = 0 }: EventCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  
  // Determine color scheme - either use provided one, or assign based on index
  const scheme = colorScheme || Object.keys(COLOR_SCHEMES)[index % Object.keys(COLOR_SCHEMES).length] as keyof typeof COLOR_SCHEMES;
  const gradient = COLOR_SCHEMES[scheme];

  // Enhanced format date helper to better handle date ranges
  const formatDate = (dateString: string, endDateString?: string) => {
    try {
      const startDate = new Date(dateString);
      
      // If there's an end date and it's different from the start date
      if (endDateString && endDateString !== dateString) {
        const endDate = new Date(endDateString);
        
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
        const startDay = startDate.toLocaleDateString('en-US', { day: 'numeric' });
        const startYear = startDate.getFullYear();
        
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
        const endDay = endDate.toLocaleDateString('en-US', { day: 'numeric' });
        const endYear = endDate.getFullYear();
        
        if (startYear === endYear) {
          // Same year
          if (startMonth === endMonth) {
            // Same month - show "Aug 10-12, 2023"
            return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
          } else {
            // Different month - show "Aug 10 - Sept 12, 2023"
            return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
          }
        } else {
          // Different years - show "Aug 10, 2023 - Sept 5, 2024"
          return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
        }
      }
      
      // Single day
      return startDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Check if event has recap images
  const hasRecapImages = event.recapImages && event.recapImages.length > 0;

  // Determine action button based on pastEventAction
  const getActionButton = () => {
    if (event.isPastEvent) {
      switch(event.pastEventAction) {
        case 'thankYou':
          return (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900/40">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                {event.pastEventMessage || "Thank you for attending our event!"}
              </p>
            </div>
          );
        case 'viewRecap':
          // Only show recap button if we have images to display
          return hasRecapImages ? (
            <button
              onClick={() => setShowGallery(true)}
              className={`mt-2 w-full inline-flex justify-center items-center px-4 py-2.5 rounded-md 
                bg-gradient-to-r ${gradient}
                text-white font-medium text-sm hover:opacity-90 transition-opacity`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Event Recap
            </button>
          ) : null;
        default:
          return null;
      }
    } else if (event.showRegistrationButton && event.registrationLink) {
      return (
        <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer"
          className={`mt-2 w-full inline-flex justify-center items-center px-4 py-2.5 rounded-md 
            bg-gradient-to-r ${gradient}
            text-white font-medium text-sm hover:opacity-90 transition-opacity`}
        >
          Register Now
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {event.imageBase64 && (
        <div className="relative w-full pb-[100%]"> {/* Using padding-bottom trick for perfect square */}
          <img 
            src={event.imageBase64}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
          />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              event.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
              event.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{event.title}</h3>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {/* Updated date display */}
          <div className="font-medium">{formatDate(event.date, event.endDate)}</div>
          {(event.startTime || event.endTime) && (
            <div className="text-sm">
              {event.startTime && (
                <span>
                  {event.startTime}
                  {event.endTime && (
                    <>
                      {event.endDate && event.endDate !== event.date ? 
                        <span> (start) – {event.endTime} (end)</span> :
                        <span> – {event.endTime}</span>}
                    </>
                  )}
                </span>
              )}
              {!event.startTime && event.endTime && <span>{event.endTime}</span>}
            </div>
          )}
          {event.location && (
            <div className="flex items-center mt-1 text-xs">
              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {event.shortDescription}
        </p>
        
        {/* Display action button (Thank you message or Register button) */}
        {getActionButton()}
        
        {/* View Details button (always displayed) */}
        <Link 
          href={`/events/${typeof event._id === 'string' ? event._id : event._id?.toString() || ''}`} 
          className={`mt-3 w-full inline-flex justify-center items-center px-4 py-2.5 rounded-md 
            bg-gradient-to-r ${gradient}
            text-white font-medium text-sm hover:opacity-90 transition-opacity`}
        >
          View Details
        </Link>
      </div>

      {/* Gallery Modal - only render when needed */}
      {showGallery && hasRecapImages && (
        <EventGallery 
          images={event.recapImages!}
          title={event.title}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}
