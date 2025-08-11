import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import testService from '../../services/testService'; // Import our service

const adminName = "Admin";

// --- ICONS ---
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /> </svg> );
const ViewDetailsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;

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

const ManageTestsPage = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('You must be logged in to view tests.');
                }
                const data = await testService.getTests(user.token);
                setTests(data);
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };
        fetchTests();
    }, []);

    const handleCreateTest = () => {
        navigate('/admin/create-test');
    };

    if (isLoading) { return <div className="p-8 text-center">Loading tests...</div>; }
    if (error) { return <div className="p-8 text-center text-red-500">Error: {error}</div>; }

    return (
        <div className="flex font-sans bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <AdminHeader adminName={adminName} />
                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Manage Tests</h2>
                            <div className="flex gap-4">
                                <button onClick={handleCreateTest} className="flex items-center rounded-lg bg-blue-600 text-white px-5 py-2 font-semibold transition-transform hover:scale-105 shadow-md">
                                    <PlusIcon /> Create New Test
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Test Name</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Questions</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tests.length > 0 ? (
                                        tests.map((test) => {
                                            const status = getTestStatus(test);
                                            return (
                                                <tr key={test._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900">{test.name}</td>
                                                    <td className="px-6 py-4 text-center text-gray-700">{new Date(test.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-700">{test.questions.length}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                                            status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                                                            status === 'Live' ? 'bg-green-100 text-green-800 animate-pulse' :
                                                            'bg-gray-200 text-gray-800'
                                                        }`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {status === 'Completed' && (
                                                            <Link to={`/admin/tests/${test._id}`}>
                                                                <button className="flex items-center justify-center mx-auto rounded-full bg-indigo-500 text-white px-4 py-2 font-semibold transition-transform hover:scale-105 shadow-md">
                                                                    <ViewDetailsIcon />
                                                                    <span className="ml-2">Details</span>
                                                                </button>
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-gray-500">No tests found. Create one to get started!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default ManageTestsPage;