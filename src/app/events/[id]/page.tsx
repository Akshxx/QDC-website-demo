'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Event as EventType } from '@/types/events'; // Rename to avoid conflict with DOM Event
import OptimizedEventGallery from '@/components/OptimizedEventGallery';

export default function EventDetailPage() {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  
  const params = useParams();
  const id = params?.id as string;
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Add a check to see if the ID is valid
        if (typeof id !== 'string' || id.trim() === '') {
          throw new Error('Invalid event ID');
        }
        
        const res = await fetch(`/api/public/events/${id}`);
        
        if (!res.ok) {
          // Check specific status codes for better error messages
          if (res.status === 404) {
            throw new Error('Event not found');
          } else {
            throw new Error(`Failed to fetch event: ${res.status} ${res.statusText}`);
          }
        }
        
        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the event');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string, endDateString?: string) => {
    try {
      const startDate = new Date(dateString);
      
      // If there's an end date and it's different from the start date
      if (endDateString && endDateString !== dateString) {
        const endDate = new Date(endDateString);
        
        // Get formatted versions of the start and end dates
        const startFormatted = startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const endFormatted = endDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Format for multi-day events
        return `${startFormatted} – ${endFormatted}`;
      }
      
      // Single day event
      return startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };
  
  // Format time range properly for multi-day events
  const formatTimeRange = (startTime?: string, endTime?: string, isMultiDay?: boolean) => {
    if (!startTime && !endTime) return null;
    
    if (isMultiDay) {
      let timeText = '';
      if (startTime) timeText += `Starts at ${startTime}`;
      if (startTime && endTime) timeText += ' and ';
      if (endTime) timeText += `Ends at ${endTime}`;
      return timeText;
    } else {
      if (startTime && endTime) {
        return `${startTime} – ${endTime}`;
      } else if (startTime) {
        return `Starts at ${startTime}`;
      } else {
        return `Ends at ${endTime}`;
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link href="/events" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // No event found
  if (!event) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find the event you're looking for.</p>
          <Link href="/events" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Check if event has recap images
  const hasRecapImages = event.recapImages && event.recapImages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Event details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {event.imageBase64 && (
            <div className="w-full h-72 lg:h-96 relative">
              <img
                src={event.imageBase64}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(event.date, event.endDate)}</span>
                </div>
                
                {(event.startTime || event.endTime) && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {formatTimeRange(
                        event.startTime, 
                        event.endTime, 
                        Boolean(event.endDate && event.endDate !== event.date)
                      )}
                    </span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-start text-gray-600 dark:text-gray-400">
                    <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 lg:mt-0">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  event.status === 'upcoming' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  event.status === 'ongoing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Event description */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/events" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center">
                Back to Events
              </Link>
              
              {event.showRegistrationButton && event.registrationLink && (
                <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                >
                  Register Now
                </Link>
              )}
              
              {event.isPastEvent && (event.pastEventAction === 'viewRecap' || event.pastEventAction === 'both') && hasRecapImages && (
                <button
                  onClick={() => setShowGallery(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-opacity text-center"
                >
                  View Event Gallery
                </button>
              )}
            </div>
            
            {/* Thank you message */}
            {event.isPastEvent && event.pastEventAction === 'thankYou' && event.pastEventMessage && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
                <p className="text-blue-700 dark:text-blue-300 text-lg">
                  {event.pastEventMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Updated event gallery modal - only passing eventId instead of all images */}
      {showGallery && event._id && (
        <OptimizedEventGallery 
          eventId={event._id.toString()} 
          title={event.title}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}
