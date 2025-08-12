// In frontend/src/services/testService.js
import axios from 'axios';

const API_URL = "https://exam-portal-6o7g.onrender.com/api/";

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


//delete test by id
const deleteTestById = async (testId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // This URL is simpler and follows the standard REST pattern.
  const response = await axios.delete(API_URL + testId, config);
  return response.data;
};

// Get the results for a specific test (submitted and not-submitted students)
const getTestResults = async (testId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // This calls the new backend route: GET /api/tests/:id/results
  const response = await axios.get(API_URL + testId + '/results', config);
  return response.data;
};


const testService = {
  createTest,
  getTests,
  getTestById,
  deleteTestById,
  getTestResults // Export the new function
};

export default testService;
