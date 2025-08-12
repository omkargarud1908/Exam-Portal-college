// In backend/controllers/submissionController.js

const Submission = require('../models/Submission.js');
const Test = require('../models/Test.js');

// @desc    Submit a test
// @route   POST /api/submissions
// @access  Private
const submitTest = async (req, res) => {
    try {
        const { testId, answers } = req.body;
        const studentId = req.user._id;

        // Check if the student has already submitted this test
        const existingSubmission = await Submission.findOne({ studentId, testId });
        if (existingSubmission) {
            return res.status(400).json({ message: 'You have already submitted this test.' });
        }

        // Fetch the test to get the correct answers
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Calculate the score on the backend
        let score = 0;
        const answerMap = new Map(test.questions.map(q => [q._id.toString(), q.correctAnswer]));
        
        answers.forEach(studentAnswer => {
            // Use selectedOption to match the frontend's data structure
            if (answerMap.get(studentAnswer.questionId) === studentAnswer.selectedOption) {
                score++;
            }
        });

        // Create the submission
        const submission = await Submission.create({
            studentId,
            testId,
            answers,
            score,
        });

        // THE FIX: Send back a clear result object with the score and total questions.
        res.status(201).json({
            message: 'Test submitted successfully!',
            score: score,
            totalQuestions: test.questions.length,
            submission: submission,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not submit test.' });
    }
};

// @desc    Get my submissions
// @route   GET /api/submissions/mysubmissions
// @access  Private
const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user._id })
            .populate('testId', 'name date totalMarks'); // Populate with test details

        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not fetch submissions.' });
    }
};

module.exports = { submitTest, getMySubmissions };