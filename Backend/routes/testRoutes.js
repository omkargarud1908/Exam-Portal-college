// In backend/routes/testRoutes.js

const express = require('express');
const router = express.Router();
const { createTest,getTests, getTestById,deleteTestById,getTestResults} = require('../controllers/testController.js');
const { protect, teacher } = require('../middleware/authMiddleware.js');

// When a POST request is made to '/', first check for a valid teacher token,
 

// --- Teacher-Only Route ---
router.post('/', protect, teacher, createTest);

// --- Private Route (for any logged-in user) ---
router.get('/', protect, getTests);


router.get('/:id', protect, getTestById);

router.delete('/:id', protect, teacher, deleteTestById);

// This route will get the full results for a test, including submitted and not-submitted lists.
router.get('/:id/results', protect, getTestResults);

module.exports = router;