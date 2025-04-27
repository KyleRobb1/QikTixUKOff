import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTickets } from '../store/slices/ticketSlice';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaQrcode } from 'react-icons/fa';
import { format } from 'date-fns';

const TicketsPage = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading } = useSelector(state => state.tickets);
  
  useEffect(() => {
    dispatch(getUserTickets());
  }, [dispatch]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Tickets</h1>
          <p className="mt-2 text-gray-600">View and manage your purchased tickets</p>
        </div>
        
        {tickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't purchased any tickets yet.
            </p>
            <div className="mt-6">
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.event.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'used' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-primary-500" />
                      {format(new Date(ticket.event.startDate), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-primary-500" />
                      {format(new Date(ticket.event.startDate), 'h:mm a')} - {format(new Date(ticket.event.endDate), 'h:mm a')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-primary-500" />
                      {ticket.event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaTicketAlt className="mr-2 text-primary-500" />
                      Ticket #{ticket.ticketNumber}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <Link
                    to={`/tickets/${ticket.id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaQrcode className="mr-2" />
                    View Ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
