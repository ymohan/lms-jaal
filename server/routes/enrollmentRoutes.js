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
import { protect, authorize, hasPermission } from '../middleware/auth.js';

const router = express.Router();

// Enroll in a course
router.post(
  '/',
  protect,
  [
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  enrollInCourse
);

// Unenroll from a course
router.delete('/:courseId', protect, unenrollFromCourse);

// Get user enrollments
router.get('/:userId?', protect, getUserEnrollments);

// Get course enrollments (for teachers/admins)
router.get('/course/:courseId', protect, authorize('admin', 'teacher'), getCourseEnrollments);

// Issue certificate
router.post(
  '/certificate',
  protect,
  authorize('admin', 'teacher'),
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required')
  ],
  issueCertificate
);

// Verify certificate
router.get('/certificate/verify/:verificationCode', verifyCertificate);

// Get user certificates
router.get('/certificate/:userId?', protect, getUserCertificates);

export default router;