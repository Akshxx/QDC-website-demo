import React from 'react';
import { Event } from '@/types/events';
import EventCard from './EventCard';
import { ObjectId } from 'mongodb'; // Add ObjectId import

interface EventsGridProps {
  events: Event[];
  title?: string;
  description?: string;
}

export default function EventsGrid({ events, title, description }: EventsGridProps) {
  if (!events || events.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h2>
        <p className="text-gray-600 dark:text-gray-400">Check back later for upcoming events!</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      {title && (
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">{title}</h2>
      )}
      {description && (
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">{description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={typeof event._id === 'string' ? event._id : event._id?.toString() || index.toString()}>
            <EventCard event={event} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
