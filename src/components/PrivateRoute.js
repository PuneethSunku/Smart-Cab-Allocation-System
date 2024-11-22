import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('auth-token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  try {
    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken?.isAdmin;

    if (adminOnly && !isAdmin) {
      // If the route is admin-only and user is not an admin, redirect to Home
      return <Navigate to="/" />;
    }
    return children;
  } catch (error) {
    // In case of token parsing errors, log the user out (optional)
    localStorage.removeItem('auth-token');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
