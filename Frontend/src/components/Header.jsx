import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- ICONS ---
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const Header = ({ studentName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleProfile = () => {
        navigate('/profile'); // Redirect to profile page
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        // Example: Clear user session
        localStorage.removeItem('studentToken');
        navigate('/'); // Redirect to login/home
    };

    return (
        <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-20 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm px-10 z-40">
            {/* Page Title */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>
            </div>

            {/* Right-side actions */}
            <div className="flex items-center gap-6">
                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3"
                    >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                            {studentName ? studentName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="font-semibold text-gray-800 text-sm">{studentName}</p>
                            <p className="text-xs text-gray-500">Student</p>
                        </div>
                        <ChevronDownIcon />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                            >
                                <button 
                                    onClick={handleProfile}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                >
                                    My Profile
                                </button>
                                <button 
                                    onClick={() => console.log("Settings clicked")} 
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                                >
                                    Settings
                                </button>
                                <div className="border-t my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
