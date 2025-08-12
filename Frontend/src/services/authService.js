// frontend/src/services/authService.js
import axios from 'axios';

// ✅ Base API URL without /api/
const API_URL = "https://exam-portal-6o7g.onrender.com/";

// Register
const register = async (userData) => {
  const response = await axios.post(API_URL + 'signup', userData);
  return response.data;
};

// Login
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
};

// Get profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'profile', config);
  return response.data;
};

// Delete student
const deleteStudent = async (id) => {
  const response = await axios.delete(API_URL + 'delete-student/' + id);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  deleteStudent
};

export default authService;
