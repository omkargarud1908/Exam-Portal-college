// In backend/controllers/testController.js

const Test = require('../models/Test.js');
const Submission = require('../models/Submission.js');
const User = require('../models/User.js');

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


//delete test by id 
const deleteTestById = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get the results for a specific test
// @route   GET /api/tests/:id/results
// @access  Private/Teacher
const getTestResults = async (req, res) => {
  try {
      const testId = req.params.id;

      // 1. Find the test itself to get its name and total marks
      const test = await Test.findById(testId);
      if (!test) {
          return res.status(404).json({ message: 'Test not found' });
      }

      // 2. Find all submissions for this test and get student details
      const submissions = await Submission.find({ testId }).populate('studentId', 'name prn');
      const submittedStudentIds = submissions.map(sub => sub.studentId._id.toString());

      // 3. Find all students who were eligible
      const allStudents = await User.find({ role: 'student' });

      // 4. Determine who has NOT submitted
      const notSubmittedStudents = allStudents.filter(student => !submittedStudentIds.includes(student._id.toString()));

      // 5. Send back a complete report
      res.json({
          testName: test.name,
          totalMarks: test.totalMarks,
          submittedStudents: submissions,
          notSubmittedStudents: notSubmittedStudents,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createTest, getTests,getTestById,getTestResults,deleteTestById };