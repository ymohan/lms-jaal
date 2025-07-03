import express from 'express';
import { body } from 'express-validator';
import {
  getUserCompletions,
  getCourseCompletion,
  updateCompletion,
  getCourseCompletionStats
} from '../controllers/completionController.js';
import { protect, authorize, hasPermission } from '../middleware/auth.js';

const router = express.Router();

// Get user completions
router.get('/:userId?', protect, getUserCompletions);

// Get completion for a specific course
router.get('/course/:courseId/:userId?', protect, getCourseCompletion);

// Create or update completion
router.post(
  '/',
  protect,
  [
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('progress').optional().isNumeric().withMessage('Progress must be a number').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
  ],
  updateCompletion
);

// Get course completion statistics (for teachers/admins)
router.get('/stats/:courseId', protect, authorize('admin', 'teacher'), getCourseCompletionStats);

export default router;