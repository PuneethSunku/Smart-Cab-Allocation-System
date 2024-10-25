import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import AdminNavbar from './AdminNavbar';
import './AdminDashboard.css';
require('dotenv').config();

const AdminDashboard = () => {
  const [cabDetails, setCabDetails] = useState({
    name: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    pincode: '',
    town: '',
    bookedStatus: 'Available',
    bookedWith: '',
  });

  // Load Google Maps Script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.api,
  });

  const [markerPosition, setMarkerPosition] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCabDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

    if (name === 'latitude' || name === 'longitude') {
      const lat = parseFloat(cabDetails.latitude);
      const lng = parseFloat(cabDetails.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition({ lat, lng });
      }
    }
  };

  // Update marker position on map click
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setCabDetails((prevDetails) => ({
      ...prevDetails,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  // Fetch current location on map load
  useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition({ lat: latitude, lng: longitude });
        setCabDetails((prevDetails) => ({
          ...prevDetails,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
      });
    }
  }, [isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { latitude, longitude } = cabDetails;
    if (!latitude || !longitude) {
      alert('Please make sure the latitude and longitude are set.');
      return;
    }

    try {
      // Fetch postal code and town from backend
      const updatedCabDetails = await getPostalCodeAndTown(cabDetails);
      setCabDetails(updatedCabDetails);

      // Send cab details to backend
      const token = localStorage.getItem('auth-token');
      const response = await axios.post('http://localhost:5000/api/cabs/addCab', updatedCabDetails, {
        headers: {
          'auth-token': token,
        },
      });

      if (response.status === 201) {
        alert('Cab details added successfully!');
        resetForm();
      } else {
        alert('Error adding cab details.');
      }
    } catch (error) {
      console.error('Error adding cab:', error);
    }
  };

  const resetForm = () => {
    setCabDetails({
      name: '',
      phone: '',
      email: '',
      latitude: '',
      longitude: '',
      pincode: '',
      town: '',
      bookedStatus: 'Available',
      bookedWith: '',
    });
    setMarkerPosition(null);
  };

  const getPostalCodeAndTown = async (cabDetails) => {
    // Step to get postal code and town as mentioned in the original code
    // Returning the same cab details for now
    return cabDetails;
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <h2>Add Cab Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={cabDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-container">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={cabDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-container">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={cabDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-container">
              <label>Latitude</label>
              <input
                type="text"
                name="latitude"
                value={cabDetails.latitude}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-container">
              <label>Longitude</label>
              <input
                type="text"
                name="longitude"
                value={cabDetails.longitude}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Add Cab</button>
          </form>
        </div>

        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={13}
            center={markerPosition}
            onClick={handleMapClick}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
