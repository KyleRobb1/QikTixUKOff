import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaImage } from 'react-icons/fa';

const EditEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch the event data from your API
    // For now, we'll simulate loading event data
    const fetchEvent = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock event data
        const eventData = {
          title: 'Sample Conference 2025',
          description: 'Join us for an amazing conference experience with industry experts and networking opportunities.',
          date: '2025-06-15T09:00',
          location: 'Tech Convention Center, San Francisco',
          price: 99.99,
          capacity: 500,
          category: 'conference',
          image: null
        };
        
        // Set form values
        Object.entries(eventData).forEach(([key, value]) => {
          setValue(key, value);
        });
        
        // Set image preview if available
        if (eventData.image) {
          setImagePreview(eventData.image);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event data');
        navigate('/dashboard');
      }
    };
    
    fetchEvent();
  }, [id, setValue, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful update
      console.log('Updating event with data:', data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Event updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            <option value="music">Music</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts & Theater</option>
            <option value="food">Food & Drink</option>
            <option value="other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            <FaImage className="inline mr-2" />
            Event Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            onChange={handleImageChange}
            {...register('image')}
          />
          
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

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Updating...' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
