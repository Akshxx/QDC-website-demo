"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

// Make sure the contact message interface is consistent
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  subject?: string; // Make subject optional to match page.tsx
  status: 'read' | 'unread' | 'archived';
  createdAt: string;
}

// Ensure prop types match exactly
interface ContactMessageCardProps {
  message: ContactMessage;
  onStatusChange: (messageId: string, newStatus: 'read' | 'unread' | 'archived') => Promise<void>; // Change return type to Promise<void>
  onDelete: (messageId: string) => void;
}

export default function ContactMessageCard({ message, onStatusChange, onDelete }: ContactMessageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Format date for display with error handling
  const formattedDate = useMemo(() => {
    try {
      if (!message.createdAt) return 'Unknown date';
      
      // Try to parse the date string
      const date = new Date(message.createdAt);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", message.createdAt);
        return 'Invalid date';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      console.error("Error formatting date:", err, "Date string:", message.createdAt);
      return 'Date error';
    }
  }, [message.createdAt]);

  // Update handleStatusChange to properly handle the type signature
  const handleStatusChange = (status: 'read' | 'unread' | 'archived') => {
    setIsUpdating(true);
    
    // Call the onStatusChange prop function
    onStatusChange(message._id, status)
      .catch((error) => {
        console.error("Failed to update status:", error);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  // Handle message deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      onDelete(message._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${
        message.status === 'unread' 
          ? 'border-yellow-500' 
          : message.status === 'archived' 
          ? 'border-gray-400'
          : 'border-green-500'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {message.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message.email}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              message.status === 'unread' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                : message.status === 'archived' 
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            }`}>
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {formattedDate}
            </span>
          </div>
        </div>
        
        {message.subject && (
          <div className="mb-2">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
              {message.subject}
            </h4>
          </div>
        )}
        
        <div className="text-gray-700 dark:text-gray-300">
          <p className={`${isExpanded ? '' : 'line-clamp-3'}`}>
            {message.message}
          </p>
          {message.message.length > 150 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-end space-x-2">
          {message.status !== 'read' && (
            <button
              onClick={() => handleStatusChange('read')}
              disabled={isUpdating}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
            >
              Mark Read
            </button>
          )}
          
          {message.status !== 'unread' && (
            <button
              onClick={() => handleStatusChange('unread')}
              disabled={isUpdating}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Mark Unread
            </button>
          )}
          
          {message.status !== 'archived' && (
            <button
              onClick={() => handleStatusChange('archived')}
              disabled={isUpdating}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Archive
            </button>
          )}
          
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
