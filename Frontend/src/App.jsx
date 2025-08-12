 
 
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import your page components
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import MCQTestPage from './pages/MCQTestPage'; // Import the test page
import ResultsPage from './pages/Results'; // Make sure to import this
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentApprovalsPage from "./pages/Admin/StudentApprovalsPage";
import ManageTestsPage from "./pages/Admin/ManageTestsPage";
import CreateTestPage from "./pages/Admin/CreateTestPage";
import Profile from "./pages/ProfilePage";
import ProfilePage from "./pages/ProfilePage";
import AllStudentsPage from "./pages/Admin/AllStudentsPage";
import TestDetail from "./pages/Admin/TestDetail";
import TestResultsPage from "./pages/Admin/TestResultsPage";
import AddTeacherPage from "./pages/Admin/AddTeacherPage";
<Route path="/test/:testId" element={<MCQTestPage />} />


 
function App() {
  return (
 
 
    <Router>
      <Routes>
        {/* The root path "/" will render the LoginPage */}
        <Route path="/" element={<LoginPage />} />

        {/* The "/signup" path will render the SignupPage */}
        <Route path="/signup" element={<SignupPage />} />

        {/* The "/dashboard" path will render the StudentDashboard */}
        <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/test/:testId" element={<MCQTestPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

         <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/StudentApprovalsPage" element={<StudentApprovalsPage />} />
        <Route path="/admin/manage-tests" element={<ManageTestsPage />} />
        <Route path="/admin/create-test" element={<CreateTestPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/all-students" element={<AllStudentsPage />} />
        <Route path="/admin/tests/:testId" element={<TestDetail />} />
        <Route path="/admin/test-results/:testId" element={<TestResultsPage />} />
        <Route path="/admin/add-teacher" element={<AddTeacherPage />} />
        {/* You can add more routes for other pages here later */}
        {/* e.g., <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Routes>
    </Router>
  );
 
}

export default App;