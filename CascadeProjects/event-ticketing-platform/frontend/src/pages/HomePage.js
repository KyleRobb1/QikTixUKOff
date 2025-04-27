import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../store/slices/eventSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch } from 'react-icons/fa';
import { format } from 'date-fns';

const HomePage = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector(state => state.events);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Categories for filter
  const categories = [
    'All',
    'Music',
    'Sports',
    'Arts',
    'Business',
    'Food',
    'Technology'
  ];

  useEffect(() => {
    // Get featured events for homepage
    dispatch(getEvents({ limit: 6, sort: 'startDate', order: 'ASC' }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = { search: searchTerm };
    if (selectedCategory && selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    dispatch(getEvents(params));
  };

  // Filter featured events
  const featuredEvents = events.filter(event => event.isFeatured).slice(0, 3);
  // Get upcoming events
  const upcomingEvents = events
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Find and Book Amazing Events
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Discover concerts, sports, arts, and more. Get tickets to the events you love.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="sm:flex">
                <div className="flex-1 min-w-0">
                  <label htmlFor="search" className="sr-only">
                    Search events
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 text-gray-900"
                      placeholder="Search events, venues, or artists"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <select
                    className="block w-full py-3 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="block w-full py-3 px-4 rounded-md shadow bg-accent-600 text-white font-medium hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Featured Events
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                Don't miss these popular events happening soon
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {featuredEvents.map(event => (
                <div key={event.id} className="card overflow-hidden flex flex-col h-full transform transition duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="relative pb-48 overflow-hidden">
                    <img
                      className="absolute inset-0 h-full w-full object-cover"
                      src={event.imageUrl || 'https://via.placeholder.com/800x600?text=Event+Image'}
                      alt={event.title}
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <span className="inline-block px-2 py-1 leading-none bg-primary-100 text-primary-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                      {event.category}
                    </span>
                    <h3 className="mt-2 mb-2 font-bold text-xl">
                      {event.title}
                    </h3>
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-primary-500" />
                      {format(new Date(event.startDate), 'MMM dd, yyyy • h:mm a')}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-primary-500" />
                      {event.location}
                    </div>
                    <p className="mt-4 text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-primary-600">
                        ${parseFloat(event.price).toFixed(2)}
                      </span>
                      <Link
                        to={`/events/${event.id}`}
                        className="btn-primary flex items-center"
                      >
                        <FaTicketAlt className="mr-2" />
                        Get Tickets
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Discover events happening soon in your area
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-3 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="card flex flex-col h-full">
                  <div className="p-6 flex-grow">
                    <span className="inline-block px-2 py-1 leading-none bg-primary-100 text-primary-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                      {event.category}
                    </span>
                    <h3 className="mt-2 mb-2 font-bold">
                      {event.title}
                    </h3>
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-primary-500" />
                      {format(new Date(event.startDate), 'MMM dd, yyyy • h:mm a')}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-primary-500" />
                      {event.location}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary-600">
                        ${parseFloat(event.price).toFixed(2)}
                      </span>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No upcoming events found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Simple steps to find and book your next event
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold">
                1
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Find Events
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Search for events by category, date, or location to find what interests you.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold">
                2
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Book Tickets
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Select your tickets and securely checkout with PayPal or credit card.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold">
                3
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">
                Attend Event
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Receive your tickets by email with QR codes for easy entry at the event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to host your own event?
            </h2>
            <p className="mt-4 text-lg">
              Create and manage events, sell tickets, and grow your audience.
            </p>
            <div className="mt-8">
              <Link
                to="/events/create"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-100"
              >
                Create an Event
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
