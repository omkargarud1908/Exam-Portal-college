// In frontend/src/services/teacherService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

// Get all students (requires teacher token)
const getStudents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL+'getStudents', config);
  return response.data;
};

// --- ADD THIS NEW FUNCTION ---
// Update a student's status (approve/reject)
const updateStudentStatus = async (studentId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Make a PUT request to update the status
  const response = await axios.put(
    API_URL + `${studentId}/status`,
    { status: status }, // The request body containing the new status
    config
  );
  return response.data;
};

const teacherService = {
  getStudents,
  updateStudentStatus, // <-- Add the new function to the export
};




export default teacherService;