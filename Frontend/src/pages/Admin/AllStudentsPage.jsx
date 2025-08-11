import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import teacherService from '../../services/teacherService'; // We can reuse this service

const adminName = "Admin";

const AllStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('You must be logged in as a teacher.');
                }
                const data = await teacherService.getStudents(user.token);
                setStudents(data);
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllStudents();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading student data...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-gray-50 font-sans flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <AdminHeader adminName={adminName} />
                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">All Registered Students</h2>

                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">PRN</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.length > 0 ? (
                                        students.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-left text-gray-700 font-mono">{student.prn}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                                        student.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-gray-500">No students have registered yet.</td>
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

export default AllStudentsPage;