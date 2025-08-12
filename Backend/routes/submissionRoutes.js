    // In backend/routes/submissionRoutes.js

    const express = require('express');
    const router = express.Router();
    const { submitTest, getMySubmissions } = require('../controllers/submissionController.js');
    const { protect } = require('../middleware/authMiddleware.js');

    // A student can submit a test
    router.post('/', protect, submitTest);

    // A student can view their own submissions
    router.get('/mysubmissions', protect, getMySubmissions);

    module.exports = router;