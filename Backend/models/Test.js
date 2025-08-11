const mongoose = require('mongoose');

// This is the blueprint for each question inside a test
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Defines an array of strings
    required: true,
    validate: [arr => arr.length === 4, 'A question must have exactly 4 options.'],
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

// This is the main blueprint for the Test itself
const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Storing as string e.g., "10:00"
    required: true,
  }, 
  endTime: {
    type: String, // Storing as string e.g., "11:00"
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // A special type for storing document IDs
    ref: 'User', // This creates a link to the User model
    required: true,
  },
  questions: [questionSchema], // An array of questions, each following the questionSchema blueprint
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;