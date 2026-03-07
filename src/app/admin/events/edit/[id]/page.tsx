"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { EventFormData, EventLabel } from "@/types/events";
import { ObjectId } from "mongodb";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const initialFormData: EventFormData = {
    title: "",
    description: "",
    shortDescription: "",
    date: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    imageBase64: "",
    link: "",
    registrationLink: "",
    showRegistrationButton: false,
    status: "upcoming",
    labels: [],
    isActive: true,
    isPastEvent: false,
    pastEventAction: "none",
    pastEventMessage: "",
    recapLink: "",
    recapImages: []
  };

  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableLabels, setAvailableLabels] = useState<EventLabel[]>([]);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#3B82F6" });
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [showRecapUploadPrompt, setShowRecapUploadPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recapFileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (status !== "authenticated" || !eventId) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/events/${eventId}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }
        
        const data = await res.json();
        
        // Format the data to match our form structure
        const eventData = {
          ...data.event,
          // Convert string array of labels to proper format if needed
          labels: Array.isArray(data.event.labels) ? data.event.labels : [],
          // Ensure arrays are initialized
          recapImages: data.event.recapImages || []
        };
        
        setFormData(eventData);
        
        // Set image preview if there's an image
        if (eventData.imageBase64) {
          setImagePreview(eventData.imageBase64);
        }
        
        // Check if we need to show recap upload prompt
        if (eventData.pastEventAction === 'viewRecap' && (!eventData.recapImages || eventData.recapImages.length === 0)) {
          setShowRecapUploadPrompt(true);
        }
      } catch (err) {
        setError("Failed to load event data. Please try again.");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch available labels
    const fetchLabels = async () => {
      if (status !== "authenticated") return;
      
      try {
        const res = await fetch("/api/admin/event-labels");
        
        if (!res.ok) {
          throw new Error("Failed to fetch event labels");
        }
        
        const data = await res.json();
        setAvailableLabels(data.labels || []);
      } catch (err) {
        console.error("Error fetching event labels:", err);
      }
    };
    
    fetchEvent();
    fetchLabels();
  }, [eventId, status]);
  
  // Handle image upload and conversion to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image is too large. Maximum size is 2MB.");
      e.target.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, imageBase64: base64String });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Special handling for pastEventAction
    if (name === 'pastEventAction') {
      const actionValue = value as 'thankYou' | 'viewRecap' | 'none';
      
      setFormData(prev => ({ 
        ...prev,
        pastEventAction: actionValue,
        // Set default thank you message if that option is selected
        pastEventMessage: actionValue === 'thankYou' && (!prev.pastEventMessage || prev.pastEventMessage.trim() === '') 
          ? 'Thank you for attending our event!' 
          : prev.pastEventMessage
      }));
      
      // If viewRecap is selected, prompt to upload images
      if (actionValue === 'viewRecap' && (!formData.recapImages || formData.recapImages.length === 0)) {
        setShowRecapUploadPrompt(true);
      } else {
        setShowRecapUploadPrompt(false);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    
    // Special case for isPastEvent - reset related fields
    if (name === 'isPastEvent') {
      if (checked) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: checked,
          status: 'completed'
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          [name]: checked,
          status: 'upcoming',
          pastEventAction: 'none',
          pastEventMessage: '',
          recapLink: ''
        }));
      }
    }
  };
  
  // Handle label toggle
  const toggleLabel = (labelId: string | ObjectId) => {
    // Convert ObjectId to string if needed
    const labelIdString = typeof labelId === 'string' ? labelId : labelId.toString();
    
    setFormData(prev => {
      // If label already selected, remove it
      if (prev.labels.some(id => id === labelIdString)) {
        return {
          ...prev,
          labels: prev.labels.filter(id => id !== labelIdString)
        };
      }
      // Otherwise add it
      return {
        ...prev,
        labels: [...prev.labels, labelIdString]
      };
    });
  };
  
  // Create new label
  const handleCreateLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLabel.name.trim()) {
      setError("Label name is required");
      return;
    }
    
    try {
      const res = await fetch("/api/admin/event-labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLabel),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create label");
      }
      
      const data = await res.json();
      
      setAvailableLabels(prev => [...prev, { 
        _id: data.labelId,
        name: newLabel.name,
        color: newLabel.color
      }]);
      
      // Reset form
      setNewLabel({ name: "", color: "#3B82F6" });
      setShowLabelForm(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  // Add a function to compress images
  const compressImage = (base64String: string, maxSizeKB = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create an image element
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        // Create a canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 1200; // Max width or height
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the compressed base64 string
        // Start with high quality and reduce until size is acceptable
        let quality = 0.8;
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Check size and compress further if needed
        while (compressedBase64.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  };

  // Modify handleRecapImagesUpload to compress images
  const handleRecapImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Show a loading state
    setShowRecapUploadPrompt(false);
    setError("");
    
    // Create a temporary loading indicator
    const tempLoadingElement = document.createElement('div');
    tempLoadingElement.innerHTML = 'Processing images...';
    tempLoadingElement.className = 'text-center my-2 text-sm text-gray-600';
    e.target.parentElement?.appendChild(tempLoadingElement);
    
    const filePromises = Array.from(e.target.files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          // Compress the image before adding it to the form data
          compressImage(base64String)
            .then(compressedImage => resolve(compressedImage))
            .catch(() => resolve(base64String)); // Fallback to original if compression fails
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(filePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        recapImages: [...(prev.recapImages || []), ...images]
      }));
      
      // Remove the loading indicator
      if (tempLoadingElement.parentNode) {
        tempLoadingElement.parentNode.removeChild(tempLoadingElement);
      }
    });
  };

  // Remove recap image
  const removeRecapImage = (index: number) => {
    // Ensure recapImages is not undefined before filtering
    const currentImages = formData.recapImages || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      recapImages: updatedImages
    }));
    
    if (updatedImages.length === 0) {
      setShowRecapUploadPrompt(true);
    }
  };

  // Modify the handleSubmit function to improve error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    // Validation
    if (!formData.title || !formData.description || !formData.shortDescription || !formData.date) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }
    
    // Check if endDate is after date if provided
    if (formData.endDate && formData.date > formData.endDate) {
      setError("End date cannot be before start date");
      setSubmitting(false);
      return;
    }
    
    // Check if times are valid
    if (formData.startTime && formData.endTime) {
      if (formData.startTime > formData.endTime) {
        setError("End time cannot be before start time");
        setSubmitting(false);
        return;
      }
    }
    
    try {
      // Check if we have recap images and warn if there are many
      if (formData.recapImages && formData.recapImages.length > 5) {
        console.warn(`Submitting ${formData.recapImages.length} recap images might take some time`);
      }
      
      // Make the API request with improved error handling
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      // Get the response data
      const data = await res.json();
      
      if (!res.ok) {
        // More detailed error message
        throw new Error(
          data.message || 
          `Failed to update event (Status ${res.status}: ${res.statusText})`
        );
      }
      
      setSuccess("Event updated successfully!");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/admin/events");
      }, 2000);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err instanceof Error 
        ? err.message 
        : "An unknown error occurred. The image files might be too large."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  // Loading state for initial data fetch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Event</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Make changes to the event information
            </p>
          </div>
          <Link
            href="/admin/events"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Back to Events
          </Link>
        </div>

        {/* Form card */}
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            {/* Success/Error messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md">
                {success}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}
            
            {/* Edit Event Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Event Information
                </h3>
                
                <div className="space-y-4">
                  {/* Event title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                    />
                  </div>
                  
                  {/* Event short description */}
                  <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shortDescription"
                      name="shortDescription"
                      type="text"
                      required
                      value={formData.shortDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      placeholder="Brief description for event cards (max 100 characters)"
                      maxLength={100}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This shorter description will be used on event cards and previews.
                    </p>
                  </div>
                  
                  {/* Event full description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                    ></textarea>
                  </div>
                  
                  {/* Event labels/categories */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Event Labels/Categories
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowLabelForm(!showLabelForm)}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        + Add New Label
                      </button>
                    </div>
                    
                    {/* Show label form */}
                    {showLabelForm && (
                      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Create New Label</h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newLabel.name}
                            onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
                            placeholder="Label name"
                            className="flex-grow px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                          />
                          <input
                            type="color"
                            value={newLabel.color}
                            onChange={(e) => setNewLabel({...newLabel, color: e.target.value})}
                            className="w-10 h-8 p-0 border border-gray-300 dark:border-gray-600 rounded-md"
                          />
                          <button
                            type="button"
                            onClick={handleCreateLabel}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableLabels.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No labels available. Create one to get started.</p>
                      ) : (
                        availableLabels.map(label => {
                          const labelIdString = typeof label._id === 'string' ? label._id : label._id.toString();
                          
                          return (
                            <button
                              key={labelIdString}
                              type="button"
                              onClick={() => toggleLabel(labelIdString)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                formData.labels.includes(labelIdString)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                              style={formData.labels.includes(labelIdString) ? {} : {
                                backgroundColor: `${label.color}20`,
                                color: label.color,
                                borderColor: label.color
                              }}
                            >
                              {label.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                  
                  {/* Image upload */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Image
                    </label>
                    
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        dark:file:bg-blue-900/20 dark:file:text-blue-300
                        hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formData.imageBase64 ? "Replace existing image or leave as is." : "Recommended image size: 1:1 ratio (square). Maximum file size: 2MB."}
                    </p>
                    
                    {/* Image preview */}
                    {imagePreview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Current Image:</p>
                        <div className="relative w-40 h-40 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                          <img
                            src={imagePreview}
                            alt="Event preview"
                            className="h-full w-full object-cover"
                            onError={(e) => { e.currentTarget.src = "/images/placeholder.png" }}
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, imageBase64: "" });
                            }}
                          >
                            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Date and Time Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Event Date & Time
                </h3>
                
                <div className="space-y-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Event Date Range <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</div>
                        <input
                          id="date"
                          name="date"
                          type="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        />
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</div>
                        <input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Leave blank for single-day events
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Event Time Range
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Start Time</div>
                        <input
                          id="startTime"
                          name="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Time on start date
                        </p>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">End Time</div>
                        <input
                          id="endTime"
                          name="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Time on end date (or start date for single-day events)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Time Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">About Event Timing</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      For multi-day events, specify the start time on the first day and end time on the last day.
                      For example, a conference from August 10th at 9 AM until August 12th at 5 PM.
                    </p>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                      placeholder="e.g., Room 101, Building A or Virtual"
                    />
                  </div>
                </div>
              </div>
              
              {/* Status and Past Event */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Event Status
                </h3>
                
                <div className="space-y-4">
                  {/* Event Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {/* Is Past Event */}
                  <div className="flex items-center">
                    <input
                      id="isPastEvent"
                      name="isPastEvent"
                      type="checkbox"
                      checked={formData.isPastEvent}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPastEvent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      This is a past event
                    </label>
                  </div>
                  
                  {/* Replace the pastEventAction dropdown with checkboxes */}
                  {formData.isPastEvent && (
                    <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Past Event Options
                      </div>
                      
                      {/* Thank You Message Option */}
                      <div className="flex items-start mb-2">
                        <input
                          id="showThankYouMessage"
                          name="showThankYouMessage"
                          type="checkbox"
                          checked={formData.pastEventAction === 'thankYou' || formData.pastEventAction === 'both'}
                          onChange={(e) => {
                            const showRecap = formData.pastEventAction === 'viewRecap' || formData.pastEventAction === 'both';
                            const newValue = e.target.checked 
                              ? (showRecap ? 'both' : 'thankYou') 
                              : (showRecap ? 'viewRecap' : 'none');
                            setFormData({...formData, pastEventAction: newValue as 'thankYou' | 'viewRecap' | 'none' | 'both'});
                          }}
                          className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-2">
                          <label htmlFor="showThankYouMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Show Thank You Message
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Display a thank you message for attendees
                          </p>
                        </div>
                      </div>
                      
                      {/* Recap Gallery Option */}
                      <div className="flex items-start mb-4">
                        <input
                          id="showRecapGallery"
                          name="showRecapGallery"
                          type="checkbox"
                          checked={formData.pastEventAction === 'viewRecap' || formData.pastEventAction === 'both'}
                          onChange={(e) => {
                            const showThankYou = formData.pastEventAction === 'thankYou' || formData.pastEventAction === 'both';
                            const newValue = e.target.checked 
                              ? (showThankYou ? 'both' : 'viewRecap') 
                              : (showThankYou ? 'thankYou' : 'none');
                            setFormData({...formData, pastEventAction: newValue as 'thankYou' | 'viewRecap' | 'none' | 'both'});
                            
                            if (e.target.checked && (!formData.recapImages || formData.recapImages.length === 0)) {
                              setShowRecapUploadPrompt(true);
                            } else {
                              setShowRecapUploadPrompt(false);
                            }
                          }}
                          className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-2">
                          <label htmlFor="showRecapGallery" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Show Event Gallery
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Allow users to view a gallery of event photos
                          </p>
                        </div>
                      </div>

                      {/* Thank You Message Input - show when thankYou or both is selected */}
                      {(formData.pastEventAction === 'thankYou' || formData.pastEventAction === 'both') && (
                        <div>
                          <label htmlFor="pastEventMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Thank You Message
                          </label>
                          <input
                            id="pastEventMessage"
                            name="pastEventMessage"
                            type="text"
                            value={formData.pastEventMessage}
                            onChange={handleChange}
                            placeholder="e.g., Thank you for attending our event!"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                          />
                        </div>
                      )}
                      
                      {/* Recap Gallery Options - show when viewRecap or both is selected */}
                      {(formData.pastEventAction === 'viewRecap' || formData.pastEventAction === 'both') && (
                        <>
                          {/* The existing recap upload UI */}
                          {showRecapUploadPrompt && (
                            <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <h4 className="mt-2 font-medium text-gray-900 dark:text-white">
                                Upload Recap Images
                              </h4>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Please upload images for your event recap gallery
                              </p>
                              <button
                                type="button"
                                onClick={() => recapFileInputRef.current?.click()}
                                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                              >
                                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                                </svg>
                                Select Images
                              </button>
                            </div>
                          )}
                          
                          <input
                            ref={recapFileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleRecapImagesUpload}
                            className="hidden"
                          />
                          
                          {/* Show uploaded images if any */}
                          {formData.recapImages && formData.recapImages.length > 0 && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Recap Images
                                </label>
                                <button
                                  type="button"
                                  onClick={() => recapFileInputRef.current?.click()}
                                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  + Add More
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {formData.recapImages.map((img, idx) => (
                                  <div key={idx} className="relative h-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                                    <img src={img} alt={`Recap ${idx + 1}`} className="h-full w-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeRecapImage(idx)}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <label htmlFor="recapLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              External Recap Link (Optional)
                            </label>
                            <input
                              id="recapLink"
                              name="recapLink"
                              type="url"
                              value={formData.recapLink}
                              onChange={handleChange}
                              placeholder="https://example.com/event-recap"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Registration Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Registration Information
                </h3>
                
                <div className="space-y-4">
                  {/* Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Event Link
                      </label>
                      <input
                        id="link"
                        name="link"
                        type="url"
                        value={formData.link}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        placeholder="https://example.com"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Link to event website or additional information
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Registration Link
                      </label>
                      <input
                        id="registrationLink"
                        name="registrationLink"
                        type="url"
                        value={formData.registrationLink}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600"
                        placeholder="https://registration.example.com"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Link for event registration
                      </p>
                    </div>
                  </div>
                  
                  {/* Show registration button */}
                  <div className="flex items-center">
                    <input
                      id="showRegistrationButton"
                      name="showRegistrationButton"
                      type="checkbox"
                      checked={formData.showRegistrationButton}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showRegistrationButton" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Show "Register Now" button on event page
                    </label>
                  </div>
                  
                  {/* Active status */}
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Active (visible on website)
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Form submission buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Link
                  href="/admin/events"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 transition-colors flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
