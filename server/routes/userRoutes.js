import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSecurityLogs
} from '../controllers/userController.js';
import { authenticateToken, requireRole, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Invalid role')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
    body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Invalid role')
  ],
  login
);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

router.put(
  '/profile',
  authenticateToken,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('language').optional().isIn(['en', 'hi', 'ta']).withMessage('Invalid language'),
    body('interests').optional().isArray().withMessage('Interests must be an array')
  ],
  updateProfile
);

router.put(
  '/password',
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
  ],
  changePassword
);

// Admin routes
router.get('/all', authenticateToken, requireRole('admin'), getAllUsers);

router.get('/logs', authenticateToken, requireRole('admin'), getSecurityLogs);

router.get('/:id', authenticateToken, requireRole('admin', 'teacher'), getUserById);

router.put(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('role').optional().isIn(['student', 'teacher', 'admin']).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
  ],
  updateUser
);

router.delete('/:id', authenticateToken, requireRole('admin'), deleteUser);

export default router;