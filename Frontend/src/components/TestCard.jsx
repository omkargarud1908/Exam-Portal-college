import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- ICONS ---
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;

// Helper function to get the real-time status
const getTestStatus = (test) => {
    const now = new Date();
    const [startHour, startMinute] = test.startTime.split(':').map(Number);
    const [endHour, endMinute] = test.endTime.split(':').map(Number);
    const testDate = new Date(test.date);
    const startTime = new Date(testDate.getUTCFullYear(), testDate.getUTCMonth(), testDate.getUTCDate(), startHour, startMinute);
    const endTime = new Date(testDate.getUTCFullYear(), testDate.getUTCMonth(), testDate.getUTCDate(), endHour, endMinute);

    if (now < startTime) return 'Upcoming';
    if (now >= startTime && now <= endTime) return 'Live';
    return 'Completed';
};

const TestCard = ({ test }) => {
    const navigate = useNavigate();
    
    // Get the real-time status
    const status = getTestStatus(test);
    const isTestActive = status === 'Live';

    // Correctly format the date and time for display
    const testDate = new Date(test.date).toLocaleDateString();
    const testStartTime = new Date(`1970-01-01T${test.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const testEndTime = new Date(`1970-01-01T${test.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleStartTest = () => {
        if (isTestActive) {
            navigate(`/test/${test._id}`); // Use the correct MongoDB _id
        }
    };

    const getButtonClass = () => {
        if (status === 'Live') return 'bg-green-600 hover:bg-green-700';
        if (status === 'Upcoming') return 'bg-blue-600 cursor-not-allowed';
        return 'bg-gray-400 cursor-not-allowed';
    };

    return (
        <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2"
            whileHover={{ scale: 1.03 }}
        >
            <div className={`h-2 ${status === 'Live' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{test.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Created by: {test.createdBy?.name || 'Admin'}</p>
                <div className="mt-6 space-y-3 text-gray-600">
                    <div className="flex items-center"><CalendarIcon /><span>Date: {testDate}</span></div>
                    <div className="flex items-center"><ClockIcon /><span>Time: {testStartTime} - {testEndTime}</span></div>
                </div>
                <div className="mt-6">
                    <button 
                        onClick={handleStartTest}
                        disabled={!isTestActive}
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md ${getButtonClass()}`}
                    >
                        {status === 'Live' ? 'Start Test' : status}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TestCard;