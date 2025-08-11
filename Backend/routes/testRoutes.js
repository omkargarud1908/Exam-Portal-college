// In backend/routes/testRoutes.js

const express = require('express');
const router = express.Router();
const { createTest,getTests, getTestById} = require('../controllers/testController.js');
const { protect, teacher } = require('../middleware/authMiddleware.js');

// When a POST request is made to '/', first check for a valid teacher token,
// then run the createTest controller function.
router.post('/', protect, teacher, createTest);

// --- Teacher-Only Route ---
router.post('/', protect, teacher, createTest);

// --- Private Route (for any logged-in user) ---
router.get('/', protect, getTests);


router.get('/:id', protect, getTestById);



module.exports = router;