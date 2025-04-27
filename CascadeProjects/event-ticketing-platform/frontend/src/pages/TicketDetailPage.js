import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTicketById } from '../store/slices/ticketSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaArrowLeft, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';

const TicketDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ticket, isLoading } = useSelector(state => state.tickets);
  
  useEffect(() => {
    if (id) {
      dispatch(getTicketById(id));
    }
  }, [dispatch, id]);
  
  const handleDownloadQR = () => {
    const canvas = document.getElementById('ticket-qr-code');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `ticket-${ticket.ticketNumber}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ticket not found</h2>
        <p className="mt-2 text-gray-600">The ticket you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/tickets"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FaArrowLeft className="mr-2" />
          Back to My Tickets
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/tickets"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Back to My Tickets
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-primary-600 text-white px-6 py-4">
            <h1 className="text-xl font-bold">E-Ticket</h1>
            <p className="text-primary-100">
              {ticket.event.title}
            </p>
          </div>
          
          {/* Ticket Status */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
              ticket.status === 'used' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
          </div>
          
          {/* QR Code */}
          <div className="px-6 py-8 flex flex-col items-center border-b border-gray-200">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCode
                id="ticket-qr-code"
                value={ticket.qrCode}
                size={200}
                level="H"
                includeMargin={true}
                renderAs="canvas"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Present this QR code at the event entrance for admission
            </p>
            <button
              onClick={handleDownloadQR}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaDownload className="mr-2 -ml-1 h-5 w-5" />
              Download QR Code
            </button>
          </div>
          
          {/* Ticket Details */}
          <div className="px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ticket #</span>
                <span className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Order Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(ticket.purchaseDate), 'MMMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-sm font-medium text-gray-900">
                  ${parseFloat(ticket.price).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Event Information</h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Event</span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{ticket.event.title}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <div className="mt-1">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(ticket.event.startDate), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(ticket.event.startDate), 'h:mm a')} - {format(new Date(ticket.event.endDate), 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="mt-1 text-sm font-medium text-gray-900">{ticket.event.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
