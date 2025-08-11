import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import authService from '../services/authService'; // Import our service

const ProfilePage = () => {
    const [profileDetails, setProfileDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // The edit functionality is a future step, so we'll leave this for now.
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error('You must be logged in to view your profile.');
                }
                const data = await authService.getProfile(user.token);
                setProfileDetails(data);
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving profile details:", profileDetails);
        setIsEditing(false);
        // We will build the API call to update the profile later.
        alert("Functionality to update the profile will be built next!");
    };
    
    // Show loading state
    if (isLoading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    // Show error state
    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    // Show main content once data is loaded
    return (
        <div className="flex font-sans bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header studentName={profileDetails?.name || 'Student'} />
                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-2xl p-6 text-center">
                                    <div className="mx-auto h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                                        {profileDetails?.name.charAt(0)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">{profileDetails?.name}</h3>
                                    <p className="text-gray-500">{profileDetails?.email}</p>
                                    <p className="mt-2 text-sm font-semibold text-blue-600">
                                        PRN: {profileDetails?.prn}
                                    </p>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSave} className="bg-white rounded-xl shadow-2xl p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                                        {/* Edit button is disabled for now */}
                                        <button type="button" disabled className="text-sm font-semibold text-gray-400 cursor-not-allowed">
                                            Edit Profile
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
                                            <input type="text" id="name" defaultValue={profileDetails?.name} disabled className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
                                            <input type="email" id="email" defaultValue={profileDetails?.email} disabled className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                                        </div>
                                        <div>
                                            <label htmlFor="prn" className="block text-sm font-medium text-gray-600">PRN</label>
                                            <input type="text" id="prn" defaultValue={profileDetails?.prn} disabled className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;