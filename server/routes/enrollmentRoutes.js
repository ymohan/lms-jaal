import express from 'express';
import { body } from 'express-validator';
import {
  enrollInCourse,
  unenrollFromCourse,
  getUserEnrollments,
  getCourseEnrollments,
  issueCertificate,
  verifyCertificate,
  getUserCertificates
} from '../controllers/enrollmentController.js';
import { authenticateToken, requireRole, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Enroll in a course
router.post(
  '/',
  authenticateToken,
  [
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  enrollInCourse
);

// Unenroll from a course
router.delete('/:courseId', authenticateToken, unenrollFromCourse);

// Get user enrollments
router.get('/:userId?', authenticateToken, getUserEnrollments);

// Get course enrollments (for teachers/admins)
router.get('/course/:courseId', authenticateToken, requireRole('admin', 'teacher'), getCourseEnrollments);

// Issue certificate
router.post(
  '/certificate',
  authenticateToken,
  requireRole('admin', 'teacher'),
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  issueCertificate
);

// Verify certificate
router.get('/certificate/verify/:verificationCode', verifyCertificate);

// Get user certificates
router.get('/certificate/:userId?', authenticateToken, getUserCertificates);

export default router;