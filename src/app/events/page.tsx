"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Event, EventLabel } from '@/types/events';
import EventGallery from '@/components/EventGallery'; // Import the EventGallery component
import OptimizedEventGallery from '@/components/OptimizedEventGallery';

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [labels, setLabels] = useState<Record<string, EventLabel>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [currentGalleryEvent, setCurrentGalleryEvent] = useState<Event | null>(null);
  
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch all events by removing the limit parameter
        const upcomingRes = await fetch('/api/public/events?filter=upcoming');
        const pastRes = await fetch('/api/public/events?filter=past');
        
        if (!upcomingRes.ok || !pastRes.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();
        
        setUpcomingEvents(upcomingData.events);
        setPastEvents(pastData.events);
        
        // Create a map of label id to label object
        const labelsMap: Record<string, EventLabel> = {};
        [...upcomingData.labels, ...pastData.labels].forEach(label => {
          labelsMap[label._id] = label;
        });
        setLabels(labelsMap);
        
        setError("");
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('There was an error loading events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Format date for display
  const formatEventDate = (dateString: string, startTime?: string, endTime?: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (startTime && endTime) {
      return `${formattedDate}, ${startTime} - ${endTime}`;
    } else if (startTime) {
      return `${formattedDate}, ${startTime}`;
    }
    
    return formattedDate;
  };
  
  // Check if event is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  // Array of Google-like colors for rotating through buttons
  const googleColors = [
    'bg-[#4285F4] hover:bg-[#3367d6]', // Google Blue
    'bg-[#34A853] hover:bg-[#2d8d46]', // Google Green
    'bg-[#EA4335] hover:bg-[#d33426]', // Google Red
    'bg-[#FBBC05] hover:bg-[#e9ab04]'  // Google Yellow
  ];

  // Event Card Component
  const EventCard = ({ event }: { event: Event }) => {
    const isPast = new Date(event.date) < new Date();
    const colorIndex = event.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4;
    
    // Array of fancy gradient styles for buttons
    const gradientStyles = [
      'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-blue-500/30', 
      'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-green-500/30',    
      'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-md hover:shadow-orange-500/30',  
      'bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 shadow-md hover:shadow-red-500/30',    
    ];
    
    const secondaryButtonStyles = [
      'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
      'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600',
      'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
      'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    ];
    
    // Color themes for thank you messages
    const thankYouThemes = [
      { border: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-300' },
      { border: 'border-green-400', bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-700 dark:text-green-300' },
      { border: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-700 dark:text-purple-300' },
      { border: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-300' },
    ];
    
    const buttonStyle = gradientStyles[colorIndex];
    const secondaryButtonStyle = secondaryButtonStyles[colorIndex];
    const thankYouTheme = thankYouThemes[colorIndex];
    
    // Check if event has recap
    const hasRecap = event.isPastEvent && (event.pastEventAction === 'viewRecap' || event.pastEventAction === 'both') && 
                    ((event.recapImages && event.recapImages.length > 0) || event.recapLink);
    
    // Function to handle opening the gallery
    const handleOpenGallery = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      setCurrentGalleryEvent(event);
      setShowGallery(true);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
      >
        {/* Event Image */}
        <div className="relative w-full pt-[100%] overflow-hidden"> {/* 1:1 aspect ratio (square) */}
          {event.imageBase64 ? (
            <img 
              src={event.imageBase64} 
              alt={event.title} 
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Event Status Badge */}
          <div className="absolute top-3 left-3">
            {event.status === 'upcoming' && (
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md">
                {isToday(event.date) ? 'Today' : 'Upcoming'}
              </span>
            )}
            {event.status === 'ongoing' && (
              <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-md">
                Ongoing
              </span>
            )}
            {event.status === 'completed' && (
              <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-md">
                Completed
              </span>
            )}
            {event.status === 'cancelled' && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-md">
                Cancelled
              </span>
            )}
          </div>
          
          {/* Updated Event Labels - matching events/[id] page style */}
          {event.labels && event.labels.length > 0 && (
            <div className="absolute top-3 right-3 flex gap-1">
              {event.labels.slice(0, 2).map(labelId => {
                const label = labels[labelId];
                if (!label) return null;
                
                return (
                  <span 
                    key={labelId}
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: label.color + '20',
                      color: label.color,
                      border: `1px solid ${label.color}`
                    }}
                  >
                    {label.name}
                  </span>
                );
              })}
              
              {event.labels.length > 2 && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600">
                  +{event.labels.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Event Content */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start mb-1 font-medium">
              <svg className="w-4 h-4 mr-1.5 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatEventDate(event.date, event.startTime, event.endTime)}
            </div>
            
            {event.location && (
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-1.5 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
            {event.shortDescription}
          </p>
          
          {/* Event Actions */}
          <div className="mt-auto space-y-3">
            {/* Thank You Message - Always shown if it exists and option is selected */}
            {event.isPastEvent && (event.pastEventAction === 'thankYou' || event.pastEventAction === 'both') && event.pastEventMessage && (
              <div className={`text-sm ${thankYouTheme.text} p-3 ${thankYouTheme.bg} rounded-lg border-2 border-dashed ${thankYouTheme.border} flex items-start`}>
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{event.pastEventMessage}</span>
              </div>
            )}
            
            {/* Registration button if event is upcoming */}
            {!isPast && event.showRegistrationButton && event.registrationLink && (
              <a 
                href={event.registrationLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all transform hover:translate-y-[-2px] shadow-md hover:shadow-blue-500/30"
              >
                <span className="flex items-center justify-center">
                  Register Now
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </a>
            )}
            
            {/* Button Container - Either single button or split buttons */}
            <div className={`flex ${hasRecap ? 'gap-2' : ''}`}>
              {/* View Details Button (always shown) */}
              <Link
                href={`/events/${event._id}`}
                className={`block ${hasRecap ? 'flex-1' : 'w-full'} text-center px-4 py-3 text-white text-sm font-semibold rounded-md transition-all transform hover:translate-y-[-2px] ${buttonStyle}`}
              >
                <span className="flex items-center justify-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              
              {/* Event Gallery Button (shown if recap is enabled) */}
              {hasRecap && (
                <button
                  onClick={handleOpenGallery}
                  className={`block flex-1 text-center px-4 py-3 text-white text-sm font-semibold rounded-md transition-all transform hover:translate-y-[-2px] shadow-md ${secondaryButtonStyle}`}
                >
                  <span className="flex items-center justify-center">
                    Gallery
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Update the page structure to list all events without the "Past Events" section
  return (
    <div className="pt-24 mt-4 pb-16">
      {/* Page Header */}
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join us for exciting events, workshops, and meetups organized by QDC.
          </p>
        </motion.div>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 md:px-6 mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-md">
            {error}
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-60">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="w-8 h-8 border-4 border-qwik-blue border-t-transparent rounded-full animate-spin absolute top-1 left-1"></div>
              <div className="w-6 h-6 border-4 border-qwik-green border-t-transparent rounded-full animate-spin absolute top-2 left-2"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Events Sections */}
      {!loading && (
        <div className="container mx-auto px-4 md:px-6">
          {/* Upcoming Events Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => {
                  const eventKey = typeof event._id === 'string' 
                    ? event._id 
                    : event._id?.toString() || `event-${index}`;
                  
                  return (
                    <EventCard 
                      key={eventKey} 
                      event={event} 
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No upcoming events</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for upcoming events.
                </p>
              </div>
            )}
          </div>
          
          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
                Past Events
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => {
                  const eventKey = typeof event._id === 'string' 
                    ? event._id 
                    : event._id?.toString() || `past-event-${index}`;
                  
                  return (
                    <EventCard 
                      key={eventKey} 
                      event={event} 
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Event Gallery Modal */}
      {showGallery && currentGalleryEvent && currentGalleryEvent._id && (
        <OptimizedEventGallery
          eventId={currentGalleryEvent._id.toString()}
          title={currentGalleryEvent.title}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}