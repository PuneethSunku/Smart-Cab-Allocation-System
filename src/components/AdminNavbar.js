    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import './Navbar.css';

    const Navbar = () => {
        let navigate = useNavigate();

        const handleLogOut = () => {
            localStorage.removeItem('auth-token'); // Remove token from localStorage on logout
            navigate('/login'); // Navigate to login page
        };

        return (
            <nav className="navbar">
                <div className="navbar-content">
                    {/* Smart Cabs logo aligned to the left */}
                    <div className="navbar-brand">Smart Cabs</div>

                    {/* Render logout button and user icon aligned to the right */}
                    {localStorage.getItem('auth-token') && (
                        <div className="navbar-right">
                            <button className="logout-btn" onClick={() => navigate('/profile')}>
                                Profile
                            </button>
                            <button className="logout-btn" onClick={handleLogOut}>
                                LogOut
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        );
    };

    export default Navbar;
    
