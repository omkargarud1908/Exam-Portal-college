// In backend/controllers/testController.js

const Test = require('../models/Test.js');

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private/Teacher
const createTest = async (req, res) => {
  try {
    // Get all the test data from the request body
    const { name, date, startTime, endTime, totalMarks, questions } = req.body;

    // Create a new test object
    const test = new Test({
      name,
      date,
      startTime,
      endTime,
      totalMarks,
      questions,
      createdBy: req.user._id, // The 'protect' middleware gives us req.user
    });

    // Save the new test to the database
    const createdTest = await test.save();
    res.status(201).json(createdTest); // 201 means "Created"

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Could not create test.' });
  }
};


// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
const getTests = async (req, res) => {
    try {
      // Find all tests and populate the 'createdBy' field with the teacher's name
      const tests = await Test.find({}).populate('createdBy', 'name');
      res.json(tests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Could not get tests.' });
    }
  };


  
// @route   GET /api/tests/:id
// @access  Private
const getTestById = async (req, res) => {
  try {
    // Find the test by the ID provided in the URL
    const test = await Test.findById(req.params.id);

    if (test) {
      res.json(test);
    } else {
      res.status(404).json({ message: 'Test not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = { createTest, getTests,getTestById };