import React, { useState, useEffect, useRef } from 'react';
import { EventFormData } from '@/types/events';

interface EventFormProps {
  initialData: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  isSubmitting: boolean;
}

export default function EventForm({ initialData, onSubmit, isSubmitting }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    // Default values
    title: '',
    description: '',
    shortDescription: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    imageBase64: '',
    link: '',
    registrationLink: '',
    showRegistrationButton: false,
    status: 'upcoming',
    labels: [],
    isActive: true,
    isPastEvent: false,
    pastEventAction: 'none',
    pastEventMessage: 'Thank you for attending our event!', // Default message
    recapLink: '',
    recapImages: [],
    ...initialData
  });
  
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to set default thank you message when that option is selected
  useEffect(() => {
    if (formData.pastEventAction === 'thankYou' && (!formData.pastEventMessage || formData.pastEventMessage.trim() === '')) {
      setFormData(prev => ({
        ...prev,
        pastEventMessage: 'Thank you for attending our event!'
      }));
    }
    
    // Show upload prompt when viewRecap is selected and no images exist
    if (formData.pastEventAction === 'viewRecap' && (!formData.recapImages || formData.recapImages.length === 0)) {
      setShowUploadPrompt(true);
    } else {
      setShowUploadPrompt(false);
    }
  }, [formData.pastEventAction]);

  // Handle past event action change
  const handlePastEventActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'none' | 'thankYou' | 'viewRecap';
    
    setFormData({
      ...formData,
      pastEventAction: value,
      // Set default thank you message if that option is selected
      pastEventMessage: value === 'thankYou' ? 'Thank you for attending our event!' : formData.pastEventMessage
    });
    
    // If viewRecap is selected, prompt to upload images
    if (value === 'viewRecap') {
      setShowUploadPrompt(true);
    }
  };
  
  // Handle multiple image uploads for recap
  const handleRecapImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const filePromises = Array.from(e.target.files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(filePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        recapImages: [...(prev.recapImages || []), ...images]
      }));
      setShowUploadPrompt(false); // Hide the prompt after upload
    });
  };
  
  // Remove an image from recap images
  const removeRecapImage = (index: number) => {
    const updatedImages = formData.recapImages?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({
      ...prev,
      recapImages: updatedImages
    }));
    
    if (updatedImages.length === 0) {
      setShowUploadPrompt(true);
    }
  };
  
  // Example of the pastEventAction section of the form
  const renderPastEventSection = () => {
    if (!formData.isPastEvent) return null;
    
    return (
      <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <h3 className="text-lg font-medium mb-4">Past Event Options</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            After Event Action
          </label>
          <select
            value={formData.pastEventAction}
            onChange={handlePastEventActionChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
          >
            <option value="none">None</option>
            <option value="thankYou">Show Thank You Message</option>
            <option value="viewRecap">Show Event Recap</option>
          </select>
        </div>
        
        {formData.pastEventAction === 'thankYou' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thank You Message
            </label>
            <textarea
              value={formData.pastEventMessage || ''}
              onChange={(e) => setFormData({...formData, pastEventMessage: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
              placeholder="Thank you for attending our event!"
            />
          </div>
        )}
        
        {formData.pastEventAction === 'viewRecap' && (
          <>
            {/* Upload prompt - appears as a card when no images are uploaded */}
            {showUploadPrompt && (
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Upload Recap Images
                </h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Please upload images for your event recap gallery. Users will see these when viewing past events.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Select Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleRecapImagesUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
            
            {!showUploadPrompt && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recap Images
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add More
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleRecapImagesUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {formData.recapImages && formData.recapImages.map((img, idx) => (
                    <div key={idx} className="relative h-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden group">
                      <img src={img} alt={`Recap ${idx + 1}`} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeRecapImage(idx)}
                          className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Optional External Recap Link
              </label>
              <input
                type="text"
                value={formData.recapLink || ''}
                onChange={(e) => setFormData({...formData, recapLink: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                placeholder="https://example.com/recap"
              />
              <p className="text-xs text-gray-500 mt-1">External link for additional recap content (optional)</p>
            </div>
          </>
        )}
      </div>
    );
  };
  
  // Rest of your form rendering code...
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData as EventFormData);
    }}>
      {/* Other form fields... */}
      
      {/* Past Event Checkbox */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPastEvent"
            checked={formData.isPastEvent}
            onChange={(e) => setFormData({...formData, isPastEvent: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPastEvent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            This is a past event
          </label>
        </div>
      </div>
      
      {/* Render past event options if it's marked as a past event */}
      {renderPastEventSection()}
      
      {/* Submit button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
}
