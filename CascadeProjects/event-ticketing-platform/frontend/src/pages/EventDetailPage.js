import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById } from '../store/slices/eventSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaClock, FaUser, FaMinus, FaPlus, FaShare } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { event, isLoading } = useSelector(state => state.events);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    if (id) {
      dispatch(getEventById(id));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (event) {
      setTotalPrice(parseFloat(event.price) * quantity);
    }
  }, [event, quantity]);
  
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + value));
    setQuantity(newQuantity);
  };
  
  const handlePurchase = () => {
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    // Check if there are enough tickets available
    if (event.availableTickets < quantity) {
      toast.error(`Sorry, only ${event.availableTickets} tickets available.`);
      return;
    }
    
    // Navigate to checkout page with event and quantity info
    navigate(`/checkout/${id}`, { 
      state: { 
        quantity,
        totalPrice
      } 
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Event URL copied to clipboard!'))
        .catch(() => toast.error('Failed to copy URL'));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const eventDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);
  const isPastEvent = eventDate < new Date();
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-80">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={event.imageUrl || 'https://via.placeholder.com/1200x600?text=Event+Image'}
              alt={event.title}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="flex items-center mb-2">
                <span className="inline-block px-2 py-1 leading-none bg-primary-600 text-white rounded-md font-semibold uppercase tracking-wide text-xs">
                  {event.category}
                </span>
                {event.isFeatured && (
                  <span className="ml-2 inline-block px-2 py-1 leading-none bg-accent-600 text-white rounded-md font-semibold uppercase tracking-wide text-xs">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">{event.title}</h1>
              <div className="mt-2 flex items-center text-sm">
                <FaUser className="mr-2" />
                Organized by {event.organizer?.firstName} {event.organizer?.lastName}
              </div>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-0">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-primary-500" />
                  <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2 text-primary-500" />
                  <span>{format(eventDate, 'h:mm a')} - {format(eventEndDate, 'h:mm a')}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaShare className="mr-2" />
                Share Event
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-primary-500" />
                    <div>
                      <p className="text-lg font-medium">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ticket Purchase Section */}
              <div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Tickets</h3>
                  
                  {isPastEvent ? (
                    <div className="text-center py-4">
                      <p className="text-red-600 font-medium">This event has already taken place.</p>
                    </div>
                  ) : event.availableTickets === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-red-600 font-medium">Sold Out</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-700">Price per ticket</span>
                        <span className="font-bold text-xl">${parseFloat(event.price).toFixed(2)}</span>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(-1)}
                            className="p-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          >
                            <FaMinus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            id="quantity"
                            min="1"
                            max={Math.min(10, event.availableTickets)}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="p-2 w-16 text-center border-t border-b border-gray-300 focus:ring-0 focus:border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(1)}
                            className="p-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          >
                            <FaPlus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.availableTickets} tickets available
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-6">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <button
                        onClick={handlePurchase}
                        className="w-full btn-primary py-3 flex items-center justify-center"
                      >
                        <FaTicketAlt className="mr-2" />
                        Get Tickets
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
