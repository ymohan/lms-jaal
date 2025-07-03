// server/controllers/enrollmentController.js
import prisma from '../lib/prisma.js';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

// Enroll in a course
export const enrollInCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { courseId } = req.body;
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if course is published
    if (!course.isPublished && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Course is not available for enrollment'
      });
    }
    
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId
        }
      }
    });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }
    
    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId,
        status: 'active'
      }
    });
    
    // Log enrollment
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'course_enrollment',
        resource: 'enrollment',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId }
      }
    });
    
    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Unenroll from a course
export const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }
    
    // Delete enrollment
    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId
        }
      }
    });
    
    // Log unenrollment
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'course_unenrollment',
        resource: 'enrollment',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId }
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Unenroll from course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user enrollments
export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // If requesting other user's enrollments, must be admin or teacher
    if (userId !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            level: true,
            language: true,
            thumbnail: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get course enrollments (for teachers/admins)
export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user has permission to view enrollments
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profile: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get course enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Issue certificate
export const issueCertificate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, courseId, grade, score } = req.body;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user has permission to issue certificate
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'User is not enrolled in this course'
      });
    }
    
    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
        courseId
      }
    });
    
    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already issued for this course'
      });
    }
    
    // Generate verification code
    const courseCode = course.title.substring(0, 3).toUpperCase();
    const verificationCode = `${courseCode}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        courseName: course.title,
        studentName: user.name,
        verificationCode,
        grade: grade || 'A',
        score: score || 100
      }
    });
    
    // Update enrollment
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      data: {
        certificateIssued: true,
        certificateId: certificate.id
      }
    });
    
    // Log certificate issuance
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'certificate_issued',
        resource: 'certificate',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { 
          studentId: userId, 
          courseId, 
          certificateId: certificate.id,
          verificationCode
        }
      }
    });
    
    res.status(201).json({
      success: true,
      certificate
    });
  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify certificate
export const verifyCertificate = async (req, res) => {
  try {
    const { verificationCode } = req.params;
    
    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    });
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or has been revoked'
      });
    }
    
    if (certificate.status !== 'issued') {
      return res.status(400).json({
        success: false,
        message: 'Certificate has been revoked'
      });
    }
    
    res.status(200).json({
      success: true,
      certificate,
      message: `Certificate for "${certificate.courseName}" issued to ${certificate.studentName} on ${new Date(certificate.issuedDate).toLocaleDateString()} is valid.`
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user certificates
export const getUserCertificates = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // If requesting other user's certificates, must be admin or teacher
    if (userId !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const certificates = await prisma.certificate.findMany({
      where: { 
        userId,
        status: 'issued'
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            level: true,
            language: true,
            thumbnail: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
