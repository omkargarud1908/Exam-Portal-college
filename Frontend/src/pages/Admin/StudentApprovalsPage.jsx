import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';
import teacherService from '../../services/teacherService';

const adminName = "Admin";

// --- ICONS ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

const StudentApprovalCard = ({ student, onApprove, onReject }) => (
    <motion.div layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }} className="bg-white rounded-2xl shadow-lg flex items-center justify-between p-6 border border-gray-200" >
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">{student.name.charAt(0)}</div>
            <div>
                <p className="font-bold text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
                <p className="text-sm text-gray-500 font-mono">{student.prn}</p>
            </div>
        </div>
        <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onReject(student._id)} className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"> <XIcon /> </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onApprove(student._id)} className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"> <CheckIcon /> </motion.button>
        </div>
    </motion.div>
);

const StudentApprovalsPage = () => {
    const [pendingStudents, setPendingStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user info from localStorage on component load
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
        }

        const fetchPendingStudents = async () => {
            if (!loggedInUser || !loggedInUser.token) {
                setError('You must be logged in as a teacher.');
                setIsLoading(false);
                return;
            }
            try {
                const allStudents = await teacherService.getStudents(loggedInUser.token);
                console.log('Data received from backend:', allStudents); 
                const filtered = allStudents.filter(student => student.status === 'pending');
                setPendingStudents(filtered);
            } catch (err) {
                setError((err.response?.data?.message) || err.message || err.toString());
            } finally {
                setIsLoading(false);
            }
        };

        fetchPendingStudents();
    }, []);

    // --- THIS IS THE NEW LOGIC ---
    const handleApprove = async (studentId) => {
        try {
            await teacherService.updateStudentStatus(studentId, 'approved', user.token);
            // If successful, remove the student from the list on the UI
            setPendingStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
        } catch (err) {
            alert('Failed to approve student. Please try again.');
            console.error(err);
        }
    };

    // --- THIS IS THE NEW LOGIC ---
    const handleReject = async (studentId) => {
        try {
            await teacherService.updateStudentStatus(studentId, 'rejected', user.token);
            // If successful, remove the student from the list on the UI
            setPendingStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
        } catch (err) {
            alert('Failed to reject student. Please try again.');
            console.error(err);
        }
    };

    // The rest of the component handles displaying the data
    if (isLoading) { return <div className="p-8 text-center">Loading...</div>; }
    if (error) { return <div className="p-8 text-center text-red-500">Error: {error}</div>; }

    return (
        <div className="bg-gray-50 font-sans flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <AdminHeader adminName={adminName} />
                <main className="flex-1 mt-20 p-8 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Student Approval Requests</h2>
                                <p className="text-gray-500 mt-1">Review and manage new student sign-ups.</p>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 font-bold text-lg px-4 py-2 rounded-full">{pendingStudents.length} Pending</div>
                        </div>
                        <div className="space-y-4">
                            <AnimatePresence>
                                {pendingStudents.length > 0 ? (
                                    pendingStudents.map((student) => (
                                        <StudentApprovalCard key={student._id} student={student} onApprove={handleApprove} onReject={handleReject} />
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg"><p className="text-gray-500 text-lg">No pending approvals.</p></div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default StudentApprovalsPage;