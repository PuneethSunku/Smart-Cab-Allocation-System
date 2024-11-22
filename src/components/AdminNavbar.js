import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ hideProfileButton }) => {
    let navigate = useNavigate();
    const location = useLocation();

    const handleLogOut = () => {
        localStorage.removeItem('auth-token'); 
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link className="navbar-brand" to="/admin-dashboard">Smart Cabs</Link>
                {localStorage.getItem('auth-token') && (
                    <div className="navbar-right">
                        {!hideProfileButton && location.pathname !== '/profile' && (
                            <button className="logout-btn" onClick={() => navigate('/profile')}>
                                Profile
                            </button>
                        )}
                        <button className="logout-btn" onClick={handleLogOut}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
