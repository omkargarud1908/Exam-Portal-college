// File: Frondend/pages/Admin/AddTeacherPage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
// 1. Import the teacher service
import teacherService from '../../services/teacherService';

const AddTeacherPage = () => {
    const [formData, setFormData] = useState({
        name: '', // THE FIX: Changed from fullName to name
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            // 2. Get the logged-in teacher's token from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                throw new Error('Authentication error. Please log in again.');
            }

            // 3. Call the addTeacher function from the service
            await teacherService.addTeacher(formData, user.token);
            
            setSuccess(`Teacher "${formData.name}" created successfully!`);
            setFormData({ name: '', email: '', password: '' }); // Clear form
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create teacher.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 font-sans flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <AdminHeader adminName={"Admin"} />

                <main className="flex-1 mt-20 p-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-10">Add New Teacher</h2>

                        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name" // THE FIX: Changed from fullName to name
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 px-0.5 focus:outline-none focus:ring-0 focus:border-blue-600 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 px-0.5 focus:outline-none focus:ring-0 focus:border-blue-600 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-transparent border-0 border-b-2 border-gray-300 px-0.5 focus:outline-none focus:ring-0 focus:border-blue-600 sm:text-sm"
                                    />
                                </div>

                                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                                {success && <div className="text-green-600 text-sm text-center">{success}</div>}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Teacher Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AddTeacherPage;
