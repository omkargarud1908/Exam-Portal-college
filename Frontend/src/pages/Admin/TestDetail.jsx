// File: Frondend/pages/Admin/TestDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, ListChecks, ArrowLeft, Trash, Edit, Users } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import testService from '../../services/testService';

const TestDetail = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    const [test, setTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null); // State to hold user info

    useEffect(() => {
        // Get user info from localStorage when the component mounts
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const fetchTest = async () => {
            if (!loggedInUser || !loggedInUser.token) {
                setError('You must be logged in to view this page.');
                setIsLoading(false);
                return;
            }
            try {
                const data = await testService.getTestById(testId, loggedInUser.token);
                setTest(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch test details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, [testId]);

    const handleDeleteTest = async () => {
        if (window.confirm('Are you sure you want to delete this test? This action is permanent.')) {
            try {
                if (!user || !user.token) throw new Error("Authentication error");
                await testService.deleteTestById(testId, user.token);
                alert('Test deleted successfully!');
                navigate('/admin/manage-tests'); // Navigate back to the list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete the test.');
            }
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-600 text-lg">Loading test details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500 font-medium">Error: {error}</div>;
    }

    if (!test) return null;

    return (
        <div className="bg-gray-100 font-sans flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <AdminHeader adminName={user?.name || 'Admin'} />

                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back to Tests
                                </button>
                                <h2 className="text-4xl font-extrabold text-gray-800 mt-2">Test Details</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Test Info & Actions */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
                                    <h3 className="text-2xl font-bold text-gray-900 truncate">{test.name}</h3>
                                    <div className="mt-6 space-y-4 border-t pt-6">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <CalendarDays className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold">Date</p>
                                                <p>{new Date(test.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <Clock className="w-6 h-6 text-green-600 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold">Time</p>
                                                <p>{test.startTime} - {test.endTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <ListChecks className="w-6 h-6 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold">Total Questions</p>
                                                <p>{test.questions.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 border-t pt-6 space-y-3">
                                    <button onClick={() => navigate(`/admin/test-results/${testId}`)} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition font-semibold">
                                            <Users className="w-5 h-5" /> View Student Results
                                        </button>
                                        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition font-semibold">
                                            <Edit className="w-5 h-5" /> Edit Test
                                        </button>
                                        <button onClick={handleDeleteTest} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition font-semibold">
                                            <Trash className="w-5 h-5" /> Delete Test
                                        </button>
                                        {/*get total students per test*/}
                                         
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Questions List */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Questions & Answers</h3>
                                    <div className="space-y-6">
                                        {test.questions.map((q, idx) => (
                                            <div key={q._id || idx} className="bg-gray-50 p-5 rounded-xl border">
                                                <p className="font-semibold text-lg text-gray-800">Q{idx + 1}: {q.question}</p>
                                                <ul className="mt-4 space-y-2">
                                                    {q.options.map((opt, i) => (
                                                        <li key={i} className={`flex items-center p-2 rounded-md text-gray-700 ${opt === q.correctAnswer ? 'bg-green-100 text-green-800 font-medium' : ''}`}>
                                                            <span className="mr-3">{String.fromCharCode(65 + i)}.</span>
                                                            <span>{opt}</span>
                                                            {opt === q.correctAnswer && <span className="ml-auto text-xs font-bold">(Correct)</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default TestDetail;
