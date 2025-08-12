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
    const [deleteConfirm, setDeleteConfirm] = useState(null);

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

    const handleDeleteStudent = async (studentId, studentName) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                throw new Error('You must be logged in as a teacher.');
            }
            
            await teacherService.deleteStudent(studentId, user.token);
            
            // Remove the student from the local state
            setStudents(students.filter(student => student._id !== studentId));
            
            // Close the confirmation dialog
            setDeleteConfirm(null);
        } catch (err) {
            setError((err.response?.data?.message) || err.message || err.toString());
        }
    };

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
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
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
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setDeleteConfirm({ id: student._id, name: student.name })}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-gray-500">No students have registered yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Delete Confirmation Modal */}
                        {deleteConfirm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                                    <p className="text-gray-600 mb-6">
                                        Are you sure you want to delete student <span className="font-semibold">{deleteConfirm.name}</span>? 
                                        This action cannot be undone.
                                    </p>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStudent(deleteConfirm.id, deleteConfirm.name)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AllStudentsPage;