import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEventById } from '../store/slices/eventSlice';
import { purchaseTickets } from '../store/slices/ticketSlice';
import { PayPalButton } from 'react-paypal-button-v2';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { event, isLoading: eventLoading } = useSelector(state => state.events);
  const { isLoading: purchaseLoading, success } = useSelector(state => state.tickets);
  const { user } = useSelector(state => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  // Get quantity and total price from location state if available
  useEffect(() => {
    if (location.state) {
      if (location.state.quantity) {
        setQuantity(location.state.quantity);
      }
      if (location.state.totalPrice) {
        setTotalPrice(location.state.totalPrice);
      }
    }
  }, [location.state]);
  
  // Fetch event details
  useEffect(() => {
    if (eventId) {
      dispatch(getEventById(eventId));
    }
  }, [dispatch, eventId]);
  
  // Calculate total price if not set from location state
  useEffect(() => {
    if (event && !location.state?.totalPrice) {
      setTotalPrice(parseFloat(event.price) * quantity);
    }
  }, [event, quantity, location.state]);
  
  // Handle successful purchase
  useEffect(() => {
    if (success) {
      toast.success('Tickets purchased successfully!');
      navigate('/tickets');
    }
  }, [success, navigate]);
  
  // Load PayPal script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'}&currency=USD`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Handle PayPal success
  const handlePayPalSuccess = (details, data) => {
    const paymentData = {
      eventId,
      quantity,
      paymentId: details.id
    };
    
    dispatch(purchaseTickets(paymentData));
  };
  
  // Handle PayPal error
  const handlePayPalError = (err) => {
    console.error('PayPal Error:', err);
    toast.error('Payment failed. Please try again.');
  };
  
  if (eventLoading) {
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
  
  // Check if event is past or sold out
  const eventDate = new Date(event.startDate);
  const isPastEvent = eventDate < new Date();
  const isSoldOut = event.availableTickets === 0;
  
  if (isPastEvent || isSoldOut) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {isPastEvent ? 'This event has already taken place' : 'This event is sold out'}
        </h2>
        <p className="mt-2 text-gray-600">
          {isPastEvent 
            ? 'You cannot purchase tickets for past events.' 
            : 'There are no more tickets available for this event.'}
        </p>
        <button
          onClick={() => navigate('/events')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaArrowLeft className="mr-2" />
          Browse other events
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase to receive your tickets</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={event.imageUrl || 'https://via.placeholder.com/400x400?text=Event'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{event.title}</h3>
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {format(new Date(event.startDate), 'MMM dd, yyyy • h:mm a')}
                </div>
                <div className="mt-1 text-sm text-gray-500 flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  {event.location}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Ticket Price</span>
                <span>${parseFloat(event.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${(parseFloat(event.price) * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service Fee</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Payment</h2>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Your tickets will be sent to: <span className="font-medium">{user?.user?.email}</span>
              </p>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You will receive your tickets via email immediately after payment.
                </p>
              </div>
            </div>
            
            {purchaseLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="ml-3 text-gray-600">Processing your payment...</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Pay with:</h3>
                  {paypalLoaded ? (
                    <PayPalButton
                      amount={totalPrice.toFixed(2)}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                      options={{
                        clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb',
                        currency: 'USD',
                      }}
                      style={{
                        layout: 'horizontal',
                        color: 'blue',
                        shape: 'rect',
                        label: 'pay',
                      }}
                    />
                  ) : (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <p className="ml-3 text-gray-600">Loading payment options...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate(`/events/${eventId}`)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
