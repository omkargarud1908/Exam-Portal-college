import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TestCard from '../components/TestCard';
import testService from '../services/testService';

// Helper function to determine test status
const getTestStatus = (test) => {
    const now = new Date();
    const [startHour, startMinute] = test.startTime.split(':').map(Number);
    const [endHour, endMinute] = test.endTime.split(':').map(Number);
    const testDate = new Date(test.date);
    const startTime = new Date(testDate.getUTCFullYear(), testDate.getUTCMonth(), testDate.getUTCDate(), startHour, startMinute);
    const endTime = new Date(testDate.getUTCFullYear(), testDate.getUTCMonth(), testDate.getUTCDate(), endHour, endMinute);

    if (now < startTime) {
        return 'Upcoming';
    } else if (now >= startTime && now <= endTime) {
        return 'Live';
    } else {
        return 'Completed';
    }
};

const StudentDashboard = () => {
    const [availableTests, setAvailableTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        const fetchTestsAndUser = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('You must be logged in to view this page.');
                }
                
                setStudentName(user.name);

                const allTests = await testService.getTests(user.token);

                // --- DEBUGGING LOGS ---
                console.log("--- DEBUGGING TEST STATUS ---");
                console.log("Current Time (Your Local):", new Date().toLocaleString());
                allTests.forEach(test => {
                    const status = getTestStatus(test);
                    console.log(`Test: "${test.name}" | Calculated Status: ${status}`);
                });
                console.log("-----------------------------");
                // --- END DEBUGGING ---

                const upcomingOrLiveTests = allTests.filter(test => getTestStatus(test) !== 'Completed');
                
                setAvailableTests(upcomingOrLiveTests);

            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestsAndUser();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading available tests...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="font-sans bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="ml-64">
                <Header studentName={studentName} />
                <main className="mt-20 p-10">
                    <div className="w-full max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                            Available Tests
                        </h2>
                        {availableTests.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {availableTests.map(test => (
                                    <TestCard key={test._id} test={test} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                <p className="text-gray-500 text-lg">No tests are available at the moment.</p>
                                <p className="text-gray-400 text-sm mt-2">(Completed tests are hidden)</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;