// File: Frondend/pages/StudentDashboard.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TestCard from '../components/TestCard';
import testService from '../services/testService';
import submissionService from '../services/submissionService'; // Import the submission service

const StudentDashboard = () => {
    const [allTests, setAllTests] = useState([]);
    const [submittedTestIds, setSubmittedTestIds] = useState(new Set()); // To store IDs of submitted tests
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('You must be logged in to view this page.');
                }
                
                setStudentName(user.name);

                // THE FIX: Fetch both tests and submissions in parallel
                const [testsResponse, submissionsResponse] = await Promise.all([
                    testService.getTests(user.token),
                    submissionService.getMySubmissions(user.token)
                ]);

                // Create a Set of submitted test IDs for easy lookup
                const submittedIds = new Set(submissionsResponse.map(sub => sub.testId._id));
                
                setAllTests(testsResponse);
                setSubmittedTestIds(submittedIds);

            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
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
                        {allTests.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {allTests.map(test => (
                                    // THE FIX: Pass the 'isSubmitted' prop to the TestCard
                                    <TestCard 
                                        key={test._id} 
                                        test={test} 
                                        isSubmitted={submittedTestIds.has(test._id)} 
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                 <p className="text-gray-500 text-lg">No tests are available at the moment.</p>
                             </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
