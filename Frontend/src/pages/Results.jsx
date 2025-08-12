import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import submissionService from '../services/submissionService'; // Import the new service

const ResultsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.token) {
                    throw new Error("You must be logged in to view results.");
                }
                setStudentName(user.name);
                const data = await submissionService.getMySubmissions(user.token);
                setSubmissions(data);
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (isLoading) return <div className="p-8 text-center">Loading results...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="font-sans bg-gray-50">
            <Sidebar />
            <div className="ml-64">
                <Header studentName={studentName} />
                <main className="mt-20 p-10 min-h-[calc(100vh-5rem)] overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Test Results</h2>
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Test Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date Completed</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {submissions.length > 0 ? (
                                        submissions.map((sub) => {
                                            const totalQuestions = sub.testId.totalMarks / 1; // Assuming 2 marks per question
                                            const percentage = Math.round((sub.score / totalQuestions) * 100);
                                            let scoreColor = 'text-green-600';
                                            if (percentage < 50) scoreColor = 'text-red-600';
                                            else if (percentage < 75) scoreColor = 'text-orange-500';

                                            return (
                                                <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4"><span className="font-bold text-gray-900">{sub.testId.name}</span></td>
                                                    <td className="px-6 py-4"><span className="text-gray-700">{new Date(sub.submittedAt).toLocaleDateString()}</span></td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font-extrabold ${scoreColor}`}>
                                                            {sub.score} / {totalQuestions} ({percentage}%)
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-gray-500">You have not completed any tests yet.</td>
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

export default ResultsPage;