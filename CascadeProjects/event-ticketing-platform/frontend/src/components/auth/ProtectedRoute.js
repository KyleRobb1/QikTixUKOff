import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If a specific role is required, check if user has that role
  if (requiredRole) {
    const userRole = user?.user?.role;
    
    // For admin routes
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // For organizer routes (allow both organizers and admins)
    if (requiredRole === 'organizer' && userRole !== 'organizer' && userRole !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If user is authenticated and has the required role (if any), render the protected component
  return children;
};

export default ProtectedRoute;
