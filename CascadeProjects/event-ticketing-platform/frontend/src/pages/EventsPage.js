import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../store/slices/eventSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, pagination, isLoading } = useSelector(state => state.events);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
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
    // Get events on initial load
    dispatch(getEvents({ page: currentPage, limit: 9 }));
  }, [dispatch, currentPage]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build filter parameters
    const params = { 
      page: 1,
      limit: 9
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    
    if (startDate) {
      params.startDate = startDate;
    }
    
    if (endDate) {
      params.endDate = endDate;
    }
    
    // Reset to first page when searching/filtering
    setCurrentPage(1);
    dispatch(getEvents(params));
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setCurrentPage(newPage);
    
    // Build filter parameters
    const params = { 
      page: newPage,
      limit: 9
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    
    if (startDate) {
      params.startDate = startDate;
    }
    
    if (endDate) {
      params.endDate = endDate;
    }
    
    dispatch(getEvents(params));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    dispatch(getEvents({ page: 1, limit: 9 }));
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Discover Events
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Find and book tickets to events happening around you
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="Search events, venues, or artists"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <select
                  className="block w-full py-3 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    category !== 'All' && (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  ))}
                </select>
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={toggleFilters}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Search
                </button>
              </div>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full transform transition duration-300 hover:shadow-lg">
                <div className="relative pb-48 overflow-hidden">
                  <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={event.imageUrl || 'https://via.placeholder.com/800x600?text=Event+Image'}
                    alt={event.title}
                  />
                  {event.isFeatured && (
                    <div className="absolute top-0 right-0 bg-accent-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                      Featured
                    </div>
                  )}
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
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && events.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {[...Array(pagination.totalPages).keys()].map(number => {
                const pageNumber = number + 1;
                // Show current page, first page, last page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNumber === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                
                // Show ellipsis for gaps
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === pagination.totalPages - 1 && currentPage < pagination.totalPages - 2)
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === pagination.totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
