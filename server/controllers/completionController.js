// server/controllers/completionController.js
import prisma from '../lib/prisma.js';
import { validationResult } from 'express-validator';
import { io } from '../index.js';

// Get completions for a user
export const getUserCompletions = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // If requesting other user's completions, must be admin or teacher
    if (userId !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const completions = await prisma.completion.findMany({
      where: { userId }
    });
    
    res.status(200).json({
      success: true,
      count: completions.length,
      completions
    });
  } catch (error) {
    console.error('Get user completions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get completion for a specific course
export const getCourseCompletion = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { courseId } = req.params;
    
    // If requesting other user's completion, must be admin or teacher
    if (userId !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
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
    
    // If teacher, check if they own the course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id && userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const completion = await prisma.completion.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });
    
    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'Completion record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      completion
    });
  } catch (error) {
    console.error('Get course completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create or update completion
export const updateCompletion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { courseId, lessonId, progress, timeSpent, score } = req.body;
    
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
    
    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      // Auto-enroll the user
      await prisma.enrollment.create({
        data: {
          userId: req.user.id,
          courseId,
          status: 'active'
        }
      });
    }
    
    // Find or create completion record
    let completion = await prisma.completion.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId
        }
      }
    });
    
    const now = new Date();
    
    if (!completion) {
      // Create new completion record
      completion = await prisma.completion.create({
        data: {
          userId: req.user.id,
          courseId,
          lessonId,
          progress: progress || 0,
          timeSpent: timeSpent || 0,
          score,
          lastAccessed: now
        }
      });
    } else {
      // Update existing completion record
      const updateData = {
        lastAccessed: now
      };
      
      if (lessonId) updateData.lessonId = lessonId;
      if (progress !== undefined) updateData.progress = progress;
      if (timeSpent) updateData.timeSpent = (completion.timeSpent || 0) + timeSpent;
      if (score !== undefined) updateData.score = score;
      
      // Check if course is completed
      if (progress >= 100) {
        updateData.completed = true;
        updateData.completedAt = now;
        
        // Update enrollment status
        if (enrollment) {
          await prisma.enrollment.update({
            where: {
              userId_courseId: {
                userId: req.user.id,
                courseId
              }
            },
            data: {
              status: 'completed',
              completionDate: now
            }
          });
        }
      }
      
      completion = await prisma.completion.update({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId
          }
        },
        data: updateData
      });
    }
    
    // Log completion update
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'completion_updated',
        resource: 'completion',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId, lessonId, progress }
      }
    });
    
    // Emit progress update event
    io.emit('progressUpdate', completion);
    
    res.status(200).json({
      success: true,
      completion
    });
  } catch (error) {
    console.error('Update completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get course completion statistics (for teachers/admins)
export const getCourseCompletionStats = async (req, res) => {
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
    
    // Check if user has permission to view stats
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
    
    // Get all completions for this course
    const completions = await prisma.completion.findMany({
      where: { courseId }
    });
    
    // Get total enrolled students
    const enrollments = await prisma.enrollment.count({
      where: { courseId }
    });
    
    // Calculate statistics
    const totalStudents = enrollments;
    const completedStudents = completions.filter(c => c.completed).length;
    const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
    const averageProgress = completions.length > 0 
      ? completions.reduce((sum, c) => sum + c.progress, 0) / completions.length 
      : 0;
    const completionsWithScore = completions.filter(c => c.score !== null);
    const averageScore = completionsWithScore.length > 0
      ? completionsWithScore.reduce((sum, c) => sum + c.score, 0) / completionsWithScore.length
      : 0;
    
    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        completedStudents,
        completionRate,
        averageProgress,
        averageScore,
        completions
      }
    });
  } catch (error) {
    console.error('Get course completion stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
