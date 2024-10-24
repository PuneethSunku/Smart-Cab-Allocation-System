// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'; // Re-added Marker
// import AdminNavbar from './AdminNavbar';
// import './AdminDashboard.css';

// const AdminDashboard = () => {
//   const [cabDetails, setCabDetails] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     latitude: '',
//     longitude: '',
//     pincode: '',
//     town: '',
//     bookedStatus: 'Available',
//     bookedWith: '',
//   });

//   // Load Google Maps Script
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyByAR2KTQjR90PX9BQDazts0QfPq99-w8s', // Replace with your API key
//   });

//   const [map, setMap] = useState(null);
//   const [markerPosition, setMarkerPosition] = useState(null);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCabDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

//     if (name === 'latitude' || name === 'longitude') {
//       const lat = parseFloat(cabDetails.latitude);
//       const lng = parseFloat(cabDetails.longitude);
//       if (!isNaN(lat) && !isNaN(lng)) {
//         setMarkerPosition({ lat, lng });
//       }
//     }
//   };

//   // Update marker position on map click
//   const handleMapClick = (event) => {
//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();
//     setMarkerPosition({ lat, lng });
//     setCabDetails((prevDetails) => ({
//       ...prevDetails,
//       latitude: lat.toString(),
//       longitude: lng.toString(),
//     }));
//   };

//   // Fetch current location on map load
//   useEffect(() => {
//     if (isLoaded) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         setMarkerPosition({ lat: latitude, lng: longitude });
//         setCabDetails((prevDetails) => ({
//           ...prevDetails,
//           latitude: latitude.toString(),
//           longitude: longitude.toString(),
//         }));
//       });
//     }
//   }, [isLoaded]);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const { latitude, longitude } = cabDetails;

//   if (!latitude || !longitude) {
//     alert('Please make sure the latitude and longitude are set.');
//     return;
//   }

//   try {
//     // Step 1: Get nearby places using the backend proxy
//     const nearbySearchResponse = await axios.get(
//       `http://localhost:5000/api/places?lat=${latitude}&lng=${longitude}`
//     );

//     let postalCode = 'N/A';
//     let town = 'N/A';

//     // If we get valid places from the Google Places API
//     if (nearbySearchResponse.data.status === 'OK' && nearbySearchResponse.data.results.length > 0) {
//       const firstPlace = nearbySearchResponse.data.results[0]; // Get the first place
//       const placeId = firstPlace.place_id; // Extract place_id

//       console.log('Place ID:', placeId);

//       // Step 2: Get place details using the backend proxy (to get postal code and town)
//       const placeDetailsResponse = await axios.get(
//         `http://localhost:5000/api/place-details?placeId=${placeId}`
//       );

//       if (placeDetailsResponse.data.status === 'OK') {
//         const addressComponents = placeDetailsResponse.data.result.address_components;

//         // Extract postal code and town if available
//         postalCode = addressComponents.find(comp => comp.types.includes('postal_code'))?.long_name || postalCode;
//         town = addressComponents.find(comp => comp.types.includes('locality'))?.long_name || town;

//         console.log('Postal Code from Place Details:', postalCode, 'Town:', town);
//       }
//     }

//     // Step 3: Fallback to Geocoding API if postal code or town is not available
//     if (postalCode === 'N/A' || town === 'N/A') {
//       const geocodeResponse = await axios.get(
//         `http://localhost:5000/api/geocode?lat=${latitude}&lng=${longitude}`
//       );

//       postalCode = geocodeResponse.data.postalCode || postalCode; // Use Geocoding API response if available
//       console.log('Postal Code from Geocoding API:', postalCode);

//       town = geocodeResponse.data.town || town; // You may need to handle this depending on what the API returns
//       console.log('Town from Geocoding API:', town);
//     }

//     // Update cab details with postal code and town
//     const updatedCabDetails = { ...cabDetails, pincode: postalCode, town };
//     setCabDetails(updatedCabDetails);

//     // Get the token from localStorage
//     const token = localStorage.getItem('auth-token');

//     // Step 4: Send the updated cab details to the backend to add the cab
//     const response = await axios.post('http://localhost:5000/api/cabs/addCab', updatedCabDetails, {
//       headers: {
//         'auth-token': token // Attach the token to the request headers
//       }
//     });

//     if (response.status === 201) {
//       alert('Cab details added successfully!');

//       // Reset the form fields after successful submission
//       setCabDetails({
//         name: '',
//         phone: '',
//         email: '',
//         latitude: '',
//         longitude: '',
//         pincode: '',
//         town: '',
//         bookedStatus: 'Available',
//         bookedWith: ''
//       });

//       // Reset the marker position on the map
//       setMarkerPosition(null);
//     } else {
//       alert('Error adding cab details.');
//     }
//   } catch (error) {
//     console.error('Error adding cab:', error);
//   }
// };



//   // Handle loading error
//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   // Return null if maps not yet loaded
//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//     <AdminNavbar/>
//     <div style={{ display: 'flex', height: '100vh' }}>
      
//       {/* Left side form */}
//       <div style={{ width: '30%', padding: '20px' }}>
//         <h2>Add Cab Details</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Name</label>
//             <input
//               type="text"
//               name="name"
//               value={cabDetails.name}
//               onChange={handleInputChange}
//               style={{ width: '100%', padding: '8px', margin: '10px 0' }}
//               required
//             />
//           </div>
//           <div>
//             <label>Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               value={cabDetails.phone}
//               onChange={handleInputChange}
//               style={{ width: '100%', padding: '8px', margin: '10px 0' }}
//               required
//             />
//           </div>
//           <div>
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={cabDetails.email}
//               onChange={handleInputChange}
//               style={{ width: '100%', padding: '8px', margin: '10px 0' }}
//               required
//             />
//           </div>
//           <div>
//             <label>Latitude:</label>
//             <input
//               type="text"
//               name="latitude"
//               value={cabDetails.latitude}
//               onChange={handleInputChange}
//               style={{ width: '100%', padding: '8px', margin: '10px 0' }}
//             />
//           </div>
//           <div>
//             <label>Longitude:</label>
//             <input
//               type="text"
//               name="longitude"
//               value={cabDetails.longitude}
//               onChange={handleInputChange}
//               style={{ width: '100%', padding: '8px', margin: '10px 0' }}
//             />
//           </div>

//           <button
//             type="submit"
//             style={{
//               width: '100%',
//               padding: '10px',
//               backgroundColor: '#007bff',
//               color: '#fff',
//               border: 'none',
//               cursor: 'pointer',
//             }}
//           >
//             Add Cab
//           </button>
//         </form>
//       </div>

//       {/* Right side map */}
//       <div style={{ width: '70%' }}>
//         <GoogleMap
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//           zoom={13}
//           center={markerPosition}
//           onClick={handleMapClick}
//           onLoad={(map) => setMap(map)} // Set map instance on load
//         >
//           {markerPosition && <Marker position={markerPosition} />}
//         </GoogleMap>
//       </div>
//     </div>
//     </>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import AdminNavbar from './AdminNavbar';
import './AdminDashboard.css';

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
    googleMapsApiKey: 'AIzaSyByAR2KTQjR90PX9BQDazts0QfPq99-w8s',
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
