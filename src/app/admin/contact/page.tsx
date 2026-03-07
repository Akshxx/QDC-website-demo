"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ContactMessageCard from './ContactMessageCard';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  status: 'read' | 'unread' | 'archived';
  createdAt: string;
}

export default function ContactManagementPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdateError, setStatusUpdateError] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState('');
  
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Fetch contact messages with improved debugging
  useEffect(() => {
    const fetchMessages = async () => {
      if (status !== 'authenticated') return;
      
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching contact messages...');
        const res = await fetch('/api/admin/contact', {
          // Add cache: 'no-store' to prevent caching issues
          cache: 'no-store',
          // Add a timestamp to bust any cache
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
        
        // Log HTTP status for debugging
        console.log('API response status:', res.status);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(errorData.message || `Failed to fetch contact messages (Status: ${res.status})`);
        }
        
        const data = await res.json();
        console.log(`Received ${data.messages?.length || 0} messages from API`);
        
        if (data.messages?.length > 0) {
          console.log("First message sample:", data.messages[0]);
        }
        
        // Make sure we have an array of messages
        const receivedMessages = Array.isArray(data.messages) ? data.messages : [];
        setMessages(receivedMessages);
        
        // If no messages, log a clearer message
        if (receivedMessages.length === 0) {
          console.log('No messages found in the database');
        }
      } catch (err) {
        console.error('Error fetching contact messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load contact messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [status]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...messages];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(msg => msg.status === filter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(msg => 
        msg.name.toLowerCase().includes(query) || 
        msg.email.toLowerCase().includes(query) || 
        msg.message.toLowerCase().includes(query) ||
        (msg.subject && msg.subject.toLowerCase().includes(query))
      );
    }
    
    setFilteredMessages(result);
  }, [messages, filter, searchQuery]);
  
  // Handle message status change
  const handleStatusChange = async (messageId: string, newStatus: 'read' | 'unread' | 'archived'): Promise<void> => {
    setStatusUpdateError('');
    setStatusUpdateSuccess('');
    
    try {
      const res = await fetch('/api/admin/contact/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId,
          status: newStatus
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update message status');
      }
      
      // Update the local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === messageId ? { ...msg, status: newStatus } : msg
        )
      );
      
      setStatusUpdateSuccess(`Message marked as ${newStatus} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('Error updating message status:', err);
      setStatusUpdateError(err instanceof Error ? err.message : 'Failed to update message status');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatusUpdateError('');
      }, 5000);
      
      // Re-throw the error so it can be caught by the calling function
      throw err;
    }
  };
  
  // Handle message deletion
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/admin/contact/${messageId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete message');
      }
      
      // Remove the deleted message from state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== messageId)
      );
      
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete message');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage contact form submissions
              </p>
            </div>
            <Link
              href="/admin/home"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Status update notifications */}
        {statusUpdateError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
            {statusUpdateError}
          </div>
        )}
        
        {statusUpdateSuccess && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md">
            {statusUpdateSuccess}
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        {/* Filters and search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                type="search"
                placeholder="Search by name, email, or message content"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="filter" className="sr-only">Filter by status</label>
            <select
              id="filter"
              name="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-white"
            >
              <option value="all">All messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Messages list */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {messages.length === 0
                ? "No contact messages have been received yet."
                : "No messages match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <ContactMessageCard
                key={message._id}
                message={message}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
