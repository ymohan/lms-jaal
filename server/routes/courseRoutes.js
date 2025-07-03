import express from 'express';
import { body } from 'express-validator';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  getEnrolledCourses,
  addLesson,
  updateLesson,
  deleteLesson
} from '../controllers/courseController.js';
import { protect, authorize, hasPermission } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', protect, getAllCourses);

// Get course by ID
router.get('/:id', protect, getCourseById);

// Create a new course
router.post(
  '/',
  protect,
  authorize('admin', 'teacher'),
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description').notEmpty().withMessage('Description is required').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('language').notEmpty().withMessage('Language is required').isIn(['en', 'hi', 'ta']).withMessage('Invalid language'),
    body('level').notEmpty().withMessage('Level is required').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
    body('methodology').isArray().withMessage('Methodology must be an array').notEmpty().withMessage('At least one methodology is required')
  ],
  createCourse
);

// Update a course
router.put(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  [
    body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description').optional().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('language').optional().isIn(['en', 'hi', 'ta']).withMessage('Invalid language'),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level')
  ],
  updateCourse
);

// Delete a course
router.delete('/:id', protect, authorize('admin', 'teacher'), deleteCourse);

// Get courses by teacher
router.get('/teacher/:teacherId?', protect, getCoursesByTeacher);

// Get enrolled courses for a student
router.get('/student/:studentId?', protect, getEnrolledCourses);

// Add a lesson to a course
router.post(
  '/:id/lessons',
  protect,
  authorize('admin', 'teacher'),
  [
    body('title').notEmpty().withMessage('Lesson title is required').isLength({ min: 3 }).withMessage('Lesson title must be at least 3 characters long'),
    body('type').optional().isIn(['reading', 'writing', 'speaking', 'listening', 'mixed']).withMessage('Invalid lesson type')
  ],
  addLesson
);

// Update a lesson
router.put(
  '/:courseId/lessons/:lessonId',
  protect,
  authorize('admin', 'teacher'),
  [
    body('title').optional().isLength({ min: 3 }).withMessage('Lesson title must be at least 3 characters long'),
    body('type').optional().isIn(['reading', 'writing', 'speaking', 'listening', 'mixed']).withMessage('Invalid lesson type')
  ],
  updateLesson
);

// Delete a lesson
router.delete('/:courseId/lessons/:lessonId', protect, authorize('admin', 'teacher'), deleteLesson);

export default router;