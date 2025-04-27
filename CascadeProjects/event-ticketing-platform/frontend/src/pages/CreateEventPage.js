import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaImage, FaTag, FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { user } = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [richDescription, setRichDescription] = useState('');
  
  // SEO optimization
  useEffect(() => {
    document.title = "Create Event | EventNest";
  }, []);
  
  // Redirect if not logged in or not an organizer/admin
  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      navigate('/login');
    } else if (user?.user?.role !== 'organizer' && user?.user?.role !== 'admin') {
      toast.error('You do not have permission to create events');
      navigate('/');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error('Only image files are allowed');
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle rich text description changes
  const handleDescriptionChange = (e) => {
    setRichDescription(e.target.value);
  };

  const uploadImageToS3 = async (file) => {
    // In a real implementation, you would get a pre-signed URL from your backend
    // and then upload the file directly to S3
    try {
      // Simulate S3 upload
      console.log('Uploading image to S3:', file.name);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a fake S3 URL
      return `https://eventnest-images.s3.amazonaws.com/${Date.now()}-${file.name}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image to S3 if one was selected
      if (imageFile) {
        imageUrl = await uploadImageToS3(imageFile);
      }
      
      // Prepare event data
      const eventData = {
        ...data,
        description: richDescription || data.description,
        price: parseFloat(data.price),
        capacity: parseInt(data.capacity),
        imageUrl,
        organizerId: user?.user?.id,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Here you would normally send the data to your API
      console.log('Creating event with data:', eventData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Event successfully created!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-600">Fill out the form below to create your event</p>
        </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            className={`w-full px-3 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter event title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Describe your event"
            rows="4"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              <FaCalendarAlt className="inline mr-2" />
              Date & Time
            </label>
            <input
              id="date"
              type="datetime-local"
              className={`w-full px-3 py-2 border rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              {...register('date', { required: 'Date and time are required' })}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              <FaMapMarkerAlt className="inline mr-2" />
              Location
            </label>
            <input
              id="location"
              type="text"
              className={`w-full px-3 py-2 border rounded-lg ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Event location"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              <FaMoneyBillWave className="inline mr-2" />
              Ticket Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="0.00"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be at least 0' }
              })}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
              Available Tickets
            </label>
            <input
              id="capacity"
              type="number"
              min="1"
              className={`w-full px-3 py-2 border rounded-lg ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="100"
              {...register('capacity', { 
                required: 'Capacity is required',
                min: { value: 1, message: 'Capacity must be at least 1' }
              })}
            />
            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            <FaTag className="inline mr-2" />
            Category
          </label>
          <select
            id="category"
            className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            <option value="music">Music</option>
            <option value="arts">Arts</option>
            <option value="sports">Sports</option>
            <option value="networking">Networking</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="food">Food & Drink</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            <FaImage className="inline mr-2" />
            Event Image (Will be stored on AWS S3)
          </label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </span>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onChange={handleImageChange}
              {...register('image')}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Recommended: 1200 x 630 pixels, JPEG or PNG, max 5MB
          </p>
          
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Event preview" 
                className="w-full max-h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Event'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
