import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/SignUp';
import MyCab from './components/MyCab';
import AdminDashboard from './components/AdminDashboard';
import UserDetails from './components/UserDetails'; 
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route path="/myCab" 
          element={
            <PrivateRoute>
              <MyCab />
            </PrivateRoute>
          } 
        />
        <Route path="/admin-dashboard" 
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/profile" 
          element={
            <PrivateRoute>
              <UserDetails />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
