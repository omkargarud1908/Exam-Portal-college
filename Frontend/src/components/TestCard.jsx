// File: Frondend/components/TestCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- ICONS (No changes needed) ---
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;

// This function now consistently uses local time.
const getTestStatus = (test) => {
    const now = new Date();
    // The backend provides a full date string (e.g., "2025-08-12T00:00:00.000Z")
    // We can combine this with the time strings to create accurate local date objects.
    const datePart = new Date(test.date).toISOString().split('T')[0];
    
    const startTime = new Date(`${datePart}T${test.startTime}`);
    const endTime = new Date(`${datePart}T${test.endTime}`);

    if (now < startTime) return 'Upcoming';
    if (now >= startTime && now <= endTime) return 'Live';
    return 'Completed';
};

const TestCard = ({ test, isSubmitted }) => {
    const navigate = useNavigate();
    
    const status = getTestStatus(test);

    const handleButtonClick = () => {
        if (isSubmitted) {
            // If submitted, navigate to the results page
            navigate(`/results/${test._id}`);
        } else if (status === 'Live') {
            // If live and not submitted, navigate to the test page
            navigate(`/test/${test._id}`);
        }
    };

    const getButtonDetails = () => {
        if (isSubmitted) {
            // THE FIX: The button is now disabled and visually indicates it.
            return { text: 'Submitted', style: 'bg-purple-600 cursor-not-allowed', disabled: true };
        }
        switch (status) {
            case 'Live':
                return { text: 'Start Test', style: 'bg-green-600 hover:bg-green-700', disabled: false };
            case 'Upcoming':
                return { text: 'Upcoming', style: 'bg-blue-600 cursor-not-allowed', disabled: true };
            case 'Completed':
                return { text: 'Missed', style: 'bg-gray-400 cursor-not-allowed', disabled: true };
            default:
                return { text: 'Status Unknown', style: 'bg-gray-400', disabled: true };
        }
    };

    const buttonDetails = getButtonDetails();
    const testDate = new Date(test.date).toLocaleDateString();
    const testStartTime = new Date(`1970-01-01T${test.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const testEndTime = new Date(`1970-01-01T${test.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2"
            whileHover={{ scale: 1.03 }}
        >
            <div className={`h-2 ${isSubmitted ? 'bg-purple-500' : status === 'Live' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{test.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Created by: {test.createdBy?.name || 'Admin'}</p>
                <div className="mt-6 space-y-3 text-gray-600">
                    <div className="flex items-center"><CalendarIcon /><span>Date: {testDate}</span></div>
                    <div className="flex items-center"><ClockIcon /><span>Time: {testStartTime} - {testEndTime}</span></div>
                </div>
                <div className="mt-6">
                    <button 
                        onClick={handleButtonClick}
                        disabled={buttonDetails.disabled}
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md ${buttonDetails.style}`}
                    >
                        {buttonDetails.text}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TestCard;
