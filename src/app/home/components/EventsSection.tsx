"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Event, EventLabel } from '@/types/events';

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [labels, setLabels] = useState<Record<string, EventLabel>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming events first
        const upcomingRes = await fetch('/api/public/events?filter=upcoming&limit=3');
        
        if (!upcomingRes.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const upcomingData = await upcomingRes.json();
        let finalEvents = upcomingData.events || [];
        
        // Create a map of label id to label object
        const labelsMap: Record<string, EventLabel> = {};
        upcomingData.labels.forEach((label: EventLabel) => {
          labelsMap[label._id.toString()] = label;
        });
        
        // If we don't have 3 upcoming events, fetch past events to fill in
        if (finalEvents.length < 3) {
          const pastRes = await fetch(`/api/public/events?filter=past&limit=${3 - finalEvents.length}`);
          
          if (pastRes.ok) {
            const pastData = await pastRes.json();
            // Mark past events
            pastData.events.forEach((event: Event) => {
              event.isPastEvent = true;
            });
            
            // Add past events to our collection
            finalEvents = [...finalEvents, ...pastData.events];
            
            // Add any new labels to the labels map
            pastData.labels.forEach((label: EventLabel) => {
              labelsMap[label._id.toString()] = label;
            });
          }
        }
        
        setEvents(finalEvents);
        setLabels(labelsMap);
        setError("");
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Could not load events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Generate color based on event data
  const getEventColor = (event: Event): string => {
    // Use first label color if available
    if (event.labels && event.labels.length > 0 && labels[event.labels[0]]) {
      const label = labels[event.labels[0]];
      return `border-l-[${label.color}]`;
    }
    
    // Fallback colors based on title's first character code
    const colorClasses = [
      "border-l-qwik-blue", 
      "border-l-qwik-green", 
      "border-l-qwik-red", 
      "border-l-purple-500",
      "border-l-amber-500"
    ];
    
    const index = event.title.charCodeAt(0) % colorClasses.length;
    return colorClasses[index];
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join our exciting events and enhance your cloud skills
            </p>
          </div>
          <Link href="/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 px-5 py-2 border border-qwik-blue text-qwik-blue hover:bg-qwik-blue/10 rounded-md transition duration-300"
            >
              View All Events
            </motion.button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-qwik-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">No events scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id ? event._id.toString() : index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white dark:bg-gray-900 p-6 rounded-lg border-l-4 ${getEventColor(event)} hover:shadow-md transition-shadow`}
              >
                {/* Event status indicator */}
                {event.isPastEvent && (
                  <div className="mb-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium rounded-md">
                      Past Event
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatEventDate(event.date)}</span>
                  </div>
                  {(event.startTime || event.endTime) && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : event.startTime || event.endTime}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {event.showRegistrationButton && event.registrationLink ? (
                  <Link href={event.registrationLink} target="_blank">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 px-5 py-2 w-full bg-qwik-blue hover:bg-qwik-blue-dark text-white rounded-md transition duration-300"
                    >
                      {event.isPastEvent ? "View Details" : "Register Now"}
                    </motion.button>
                  </Link>
                ) : (
                  <Link href={`/events/${event._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 px-5 py-2 w-full bg-qwik-blue hover:bg-qwik-blue-dark text-white rounded-md transition duration-300"
                    >
                      View Details
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
