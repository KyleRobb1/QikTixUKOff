import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaChartBar, FaQrcode } from 'react-icons/fa';

// Admin sub-pages
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching users from API
    const fetchUsers = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'organizer', status: 'active' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'suspended' },
          { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'admin', status: 'active' },
          { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'organizer', status: 'active' },
        ];
        
        setUsers(mockUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'organizer' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.status === 'active' ? (
                    <button 
                      onClick={() => handleStatusChange(user.id, 'suspended')}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusChange(user.id, 'active')}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching events from API
    const fetchEvents = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock event data
        const mockEvents = [
          { id: 1, title: 'Summer Music Festival', organizer: 'Jane Smith', date: '2025-07-15', status: 'upcoming', tickets_sold: 245, capacity: 500 },
          { id: 2, title: 'Tech Conference 2025', organizer: 'Charlie Brown', date: '2025-06-10', status: 'upcoming', tickets_sold: 320, capacity: 400 },
          { id: 3, title: 'Charity Gala Dinner', organizer: 'Alice Williams', date: '2025-05-20', status: 'upcoming', tickets_sold: 150, capacity: 200 },
          { id: 4, title: 'Startup Networking Event', organizer: 'Bob Johnson', date: '2025-04-05', status: 'completed', tickets_sold: 180, capacity: 200 },
          { id: 5, title: 'Art Exhibition Opening', organizer: 'Jane Smith', date: '2025-03-15', status: 'completed', tickets_sold: 120, capacity: 150 },
        ];
        
        setEvents(mockEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Event Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map(event => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{event.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.organizer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.tickets_sold} / {event.capacity}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(event.tickets_sold / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/events/${event.id}`} className="text-blue-600 hover:text-blue-900 text-sm mr-3">
                    View
                  </Link>
                  {event.status === 'upcoming' && (
                    <button className="text-red-600 hover:text-red-900 text-sm">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SalesReports = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sales Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">$24,850.00</p>
          <p className="text-sm text-gray-500 mt-1">+12.5% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Tickets Sold</h3>
          <p className="text-3xl font-bold text-green-600">1,245</p>
          <p className="text-sm text-gray-500 mt-1">+8.3% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Events</h3>
          <p className="text-3xl font-bold text-purple-600">18</p>
          <p className="text-sm text-gray-500 mt-1">+2 from last month</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue (2025)</h3>
        <div className="h-64 flex items-end space-x-2">
          {[65, 59, 80, 81, 56, 55, 40, 0, 0, 0, 0, 0].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t-sm" 
                style={{ height: `${value}%` }}
              ></div>
              <span className="text-xs mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Top Selling Events</h3>
        <div className="space-y-4">
          {[
            { name: 'Summer Music Festival', sales: 245, revenue: 12250 },
            { name: 'Tech Conference 2025', sales: 320, revenue: 6400 },
            { name: 'Charity Gala Dinner', sales: 150, revenue: 3750 },
            { name: 'Startup Networking Event', sales: 180, revenue: 1800 },
            { name: 'Art Exhibition Opening', sales: 120, revenue: 600 }
          ].map((event, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{event.name}</h4>
                <p className="text-sm text-gray-500">{event.sales} tickets</p>
              </div>
              <span className="font-semibold">${event.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TicketScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      // Mock successful scan
      setScanResult('success');
      setTicketInfo({
        id: 'TIX-1234-5678-90AB',
        event: 'Summer Music Festival',
        purchaser: 'John Doe',
        purchaseDate: '2025-04-15',
        status: 'valid'
      });
      setIsScanning(false);
    }, 2000);
  };

  const resetScan = () => {
    setScanResult(null);
    setTicketInfo(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ticket Scanner</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-center">
          {!scanResult && (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-4">
                {isScanning ? (
                  <div className="animate-pulse">
                    <FaQrcode className="mx-auto text-6xl text-gray-400" />
                    <p className="mt-4 text-gray-500">Scanning...</p>
                  </div>
                ) : (
                  <>
                    <FaQrcode className="mx-auto text-6xl text-gray-400" />
                    <p className="mt-4 text-gray-500">QR code scanner will appear here</p>
                  </>
                )}
              </div>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isScanning ? 'Scanning...' : 'Scan Ticket QR Code'}
              </button>
            </>
          )}
          
          {scanResult === 'success' && ticketInfo && (
            <div className="text-left">
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Valid Ticket</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Ticket ID</p>
                  <p className="font-medium">{ticketInfo.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event</p>
                  <p className="font-medium">{ticketInfo.event}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchaser</p>
                  <p className="font-medium">{ticketInfo.purchaser}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="font-medium">{ticketInfo.purchaseDate}</p>
                </div>
              </div>
              
              <button
                onClick={resetScan}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Scan Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
          <nav className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul>
              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 ${
                    currentPath === '/admin/users' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <FaUsers className="mr-3 text-gray-600" />
                  <span>User Management</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/events"
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 ${
                    currentPath === '/admin/events' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <FaCalendarAlt className="mr-3 text-gray-600" />
                  <span>Event Management</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reports"
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 ${
                    currentPath === '/admin/reports' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <FaChartBar className="mr-3 text-gray-600" />
                  <span>Sales Reports</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/scanner"
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 ${
                    currentPath === '/admin/scanner' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <FaTicketAlt className="mr-3 text-gray-600" />
                  <span>Ticket Scanner</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <Routes>
            <Route path="/" element={<UserManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/events" element={<EventManagement />} />
            <Route path="/reports" element={<SalesReports />} />
            <Route path="/scanner" element={<TicketScanner />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
