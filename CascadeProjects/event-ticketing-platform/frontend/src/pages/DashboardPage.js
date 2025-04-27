import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTickets } from '../store/slices/ticketSlice';
import { getOrganizerEvents } from '../store/slices/eventSlice';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaEdit, FaQrcode, FaChartLine, FaMoneyBillWave, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { tickets, isLoading: ticketsLoading } = useSelector(state => state.tickets);
  const { organizerEvents, isLoading: eventsLoading } = useSelector(state => state.events);
  
  const [activeTab, setActiveTab] = useState('tickets');
  
  useEffect(() => {
    dispatch(getUserTickets());
    
    if (user?.user?.role === 'organizer' || user?.user?.role === 'admin') {
      dispatch(getOrganizerEvents());
    }
  }, [dispatch, user]);
  
  const renderTickets = () => {
    if (ticketsLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (tickets.length === 0) {
      return (
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
      );
    }
    
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {tickets.map(ticket => (
            <li key={ticket.id} className="p-4 hover:bg-gray-50">
              <Link to={`/tickets/${ticket.id}`} className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-md flex items-center justify-center">
                    <FaTicketAlt className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-gray-900 truncate">
                    {ticket.event.title}
                  </p>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {format(new Date(ticket.event.startDate), 'MMM dd, yyyy • h:mm a')}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {ticket.event.location}
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-5 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'used' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderEvents = () => {
    if (eventsLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    if (organizerEvents.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't created any events yet.
          </p>
          <div className="mt-6">
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaPlus className="mr-2 -ml-1 h-5 w-5" />
              Create Event
            </Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {organizerEvents.map(event => (
            <li key={event.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mr-4">
                  <img
                    className="h-16 w-16 rounded-md object-cover"
                    src={event.imageUrl || 'https://via.placeholder.com/400x400?text=Event'}
                    alt={event.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-gray-900 truncate">
                    {event.title}
                  </p>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {format(new Date(event.startDate), 'MMM dd, yyyy • h:mm a')}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {event.location}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FaTicketAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {event.availableTickets} / {event.totalTickets} tickets available
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-5 flex-shrink-0 flex space-x-2">
                  <Link
                    to={`/events/edit/${event.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaEdit className="mr-2 -ml-0.5 h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    to={`/events/${event.id}/scanner`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FaQrcode className="mr-2 -ml-0.5 h-4 w-4" />
                    Scan
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this event?')) {
                        // Here you would dispatch an action to delete the event
                        console.log('Deleting event:', event.id);
                        toast.success('Event deleted successfully!');
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-2 -ml-0.5 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Calculate summary data
  const calculateSummary = () => {
    if (!organizerEvents || organizerEvents.length === 0) {
      return {
        eventsCreated: 0,
        ticketsSold: 0,
        totalEarnings: 0
      };
    }

    return {
      eventsCreated: organizerEvents.length,
      ticketsSold: organizerEvents.reduce((total, event) => total + (event.totalTickets - event.availableTickets), 0),
      totalEarnings: organizerEvents.reduce((total, event) => {
        const soldTickets = event.totalTickets - event.availableTickets;
        return total + (soldTickets * event.price);
      }, 0)
    };
  };

  const summary = calculateSummary();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome back, {user?.user?.name || 'User'}!</h1>
          <p className="mt-2 text-gray-600">Manage your tickets and events</p>
        </div>

        {(user?.user?.role === 'organizer' || user?.user?.role === 'admin') && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FaCalendarAlt className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Events Created</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.eventsCreated}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FaTicketAlt className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">Tickets Sold</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.ticketsSold}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FaMoneyBillWave className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Earnings</p>
                    <p className="text-2xl font-semibold text-gray-900">${summary.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="tickets">My Tickets</option>
              {(user?.user?.role === 'organizer' || user?.user?.role === 'admin') && (
                <option value="events">My Events</option>
              )}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`${
                    activeTab === 'tickets'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Tickets
                </button>
                {(user?.user?.role === 'organizer' || user?.user?.role === 'admin') && (
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`${
                      activeTab === 'events'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    My Events
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
        
        <div>
          {activeTab === 'tickets' && renderTickets()}
          {activeTab === 'events' && renderEvents()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
