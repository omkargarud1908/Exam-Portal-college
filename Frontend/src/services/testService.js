// In frontend/src/services/testService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tests/';

// Create a new test
const createTest = async (testData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, testData, config);
  return response.data;
};

// Get all tests
const getTests = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.get(API_URL, config);
    return response.data;
  };


  // Get a single test by its ID
const getTestById = async (testId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + testId, config);
  return response.data;
};



const testService = {
  createTest,
  getTests,
  getTestById
};

export default testService;