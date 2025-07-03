import express from 'express';
import { body } from 'express-validator';
import {
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
} from '../controllers/quizController.js';
import { authenticateToken, requireRole, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get quiz by ID
router.get('/:id', authenticateToken, getQuizById);

// Create a new quiz
router.post(
  '/',
  authenticateToken,
  requireRole('admin', 'teacher'),
  [
    body('title').notEmpty().withMessage('Quiz title is required').isLength({ min: 3 }).withMessage('Quiz title must be at least 3 characters long'),
    body('lessonId').notEmpty().withMessage('Lesson ID is required'),
    body('questions').isArray().withMessage('Questions must be an array')
  ],
  createQuiz
);

// Update a quiz
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin', 'teacher'),
  [
    body('title').optional().isLength({ min: 3 }).withMessage('Quiz title must be at least 3 characters long'),
    body('questions').optional().isArray().withMessage('Questions must be an array')
  ],
  updateQuiz
);

// Delete a quiz
router.delete('/:id', authenticateToken, requireRole('admin', 'teacher'), deleteQuiz);

// Submit quiz answers
router.post(
  '/:id/submit',
  authenticateToken,
  [
    body('answers').isObject().withMessage('Answers must be an object')
  ],
  submitQuiz
);

export default router;