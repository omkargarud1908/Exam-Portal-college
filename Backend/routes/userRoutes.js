// In backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getStudents, updateStudentStatus, loginTeacher, deleteStudent, addTeacher } = require('../controllers/userController.js');
const { protect, teacher } = require('../middleware/authMiddleware.js');

// When a POST request is made to '/signup', call the registerUser controller function
router.post('/signup', registerUser);
router.post('/login', loginUser);
// This route will first run 'protect', then 'getUserProfile'
router.get('/profile', protect, getUserProfile);
router.get('/getStudents', protect,teacher,getStudents);  
router.put('/:id/status', protect,teacher,updateStudentStatus);
// router.post('/submit-exam', protect,submitExam);
router.post('/login-teacher', loginTeacher);
router.delete('/delete-student/:id',protect,teacher,deleteStudent);
router.post('/add-teacher', protect, addTeacher);

module.exports = router;