import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import teacherService from "../../services/teacherService"; // For getting students
import testService from "../../services/testService"; // For getting tests

const adminName = "Admin";

// --- ICONS ---
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197M15 21a9 9 0 00-9-9" /></svg>;
const TestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const StatCard = ({ title, value, icon, color, linkTo }) => (
    <Link to={linkTo}>
        <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-white p-6 rounded-2xl shadow-lg transition-shadow hover:shadow-2xl flex items-center justify-between border-l-4 ${color}`}
        >
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-4xl font-bold text-gray-800">{value}</p>
            </div>
            <div className="text-gray-300">{icon}</div>
        </motion.div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        pendingApprovals: 0,
        totalStudents: 0,
        totalTests: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error("You must be logged in as a teacher.");
                }

                // Use Promise.all to fetch students and tests at the same time
                const [studentsData, testsData] = await Promise.all([
                    teacherService.getStudents(user.token),
                    testService.getTests(user.token)
                ]);

                // Calculate the stats from the fetched data
                const pendingCount = studentsData.filter(s => s.status === 'pending').length;
                const totalStudentCount = studentsData.length;
                const totalTestCount = testsData.length;

                setStats({
                    pendingApprovals: pendingCount,
                    totalStudents: totalStudentCount,
                    totalTests: totalTestCount,
                });

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
        <div className="bg-gray-50 font-sans flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <AdminHeader adminName={adminName} />
                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={<ClockIcon />} color="border-yellow-500" linkTo="/admin/StudentApprovalsPage" />
                            {/* --- THIS IS THE ONLY CHANGE --- */}
                            <StatCard title="Total Students" value={stats.totalStudents} icon={<UsersIcon />} color="border-green-500" linkTo="/admin/all-students" />
                            <StatCard title="Total Tests Created" value={stats.totalTests} icon={<TestIcon />} color="border-blue-500" linkTo="/admin/manage-tests" />
                        </div>

                        {/* Recent Activity can be a future feature */}
                        <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="text-center py-8 text-gray-500">
                                Recent activity feed will be implemented in a future update.
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;