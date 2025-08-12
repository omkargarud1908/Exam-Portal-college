"// In frontend/src/services/authService.js

import axios from 'axios';

// The base URL for our user-related API endpoints
// This comes from the "proxy" we set in package.json
const API_URL = 'https://exam-portal-6o7g.onrender.com';

// Register user function
const register = async (userData) => {
  // Make the POST request to the signup endpoint
  const response = await axios.post(API_URL + 'signup', userData);

  // axios puts the server's response in the `data` property
  return response.data;
};


// Login user function
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  // If login is successful, the response will include user data and a token.
  // We should store this in localStorage so the user stays logged in.
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};


// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'profile', config);
  return response.data;
};

//delete student by id
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

export default authService;"
