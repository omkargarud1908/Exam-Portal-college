// File: Frondend/pages/Admin/TestResultsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, User } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
// import teacherService from '../../services/teacherService'; // Use the new service file
import testService from '../../services/testService';
const TestResultsPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    const [results, setResults] = useState({ submitted: [], notSubmitted: [] });
    const [testDetails, setTestDetails] = useState({ name: '', totalMarks: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const fetchResults = async () => {
            if (!loggedInUser || !loggedInUser.token) {
                setError('Authentication required.');
                setIsLoading(false);
                return;
            }
            try {
                // This now calls the correct service function
                const data = await testService.getTestResults(testId, loggedInUser.token);
                setResults({
                    submitted: data.submittedStudents || [],
                    notSubmitted: data.notSubmittedStudents || []
                });
                // THE FIX: Store test details in a separate state
                setTestDetails({
                    name: data.testName || 'Test Results',
                    totalMarks: data.totalMarks || 0
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch test results.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [testId]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading results...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-100 font-sans flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <AdminHeader adminName={user?.name || 'Admin'} />

                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Header */}
                        <div>
                            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Test Details
                            </button>
                            <h2 className="text-4xl font-extrabold text-gray-800">{testDetails.name}</h2>
                            <p className="text-lg text-gray-600 mt-1">Student Submission Status</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                            {/* Submitted Students Column */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                    <h3 className="text-2xl font-bold text-gray-800">Submitted ({results.submitted.length})</h3>
                                </div>
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {results.submitted.length > 0 ? results.submitted.map(sub => (
                                        <div key={sub._id} className="bg-green-50 p-4 rounded-lg flex justify-between items-center border border-green-200">
                                            <div>
                                                <p className="font-semibold text-green-800">{sub.studentId.name}</p>
                                                <p className="text-sm text-gray-600">PRN: {sub.studentId.prn}</p>
                                            </div>
                                            <div className="text-right">
                                                {/* THE FIX: Use totalMarks from the testDetails state */}
                                                <p className="font-bold text-lg text-green-700">{sub.score} / {testDetails.totalMarks}</p>
                                                <p className="text-xs text-gray-500">Score</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-gray-500 text-center py-8">No students have submitted this test yet.</p>}
                                </div>
                            </div>

                            {/* Not Submitted Students Column */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                    <h3 className="text-2xl font-bold text-gray-800">Not Submitted ({results.notSubmitted.length})</h3>
                                </div>
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {results.notSubmitted.length > 0 ? results.notSubmitted.map(student => (
                                        <div key={student._id} className="bg-red-50 p-4 rounded-lg flex items-center border border-red-200">
                                            <User className="w-5 h-5 text-red-700 mr-3" />
                                            <div>
                                                <p className="font-semibold text-red-800">{student.name}</p>
                                                <p className="text-sm text-gray-600">PRN: {student.prn}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-gray-500 text-center py-8">All eligible students have submitted the test.</p>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default TestResultsPage;
