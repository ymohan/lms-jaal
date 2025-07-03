// server/controllers/courseController.js
import prisma from '../lib/prisma.js';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../index.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { 
      level, 
      language, 
      methodology, 
      isPublished, 
      search,
      teacherId,
      limit = 20,
      page = 1
    } = req.query;
    
    const where = {};
    
    // Apply filters
    if (level) where.level = level;
    if (language) where.language = language;
    if (methodology) where.methodology = { has: methodology };
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';
    if (teacherId) where.teacherId = teacherId;
    
    // Search in title, description, and tags
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }
    
    // For students, only show published courses
    if (req.user.role === 'student') {
      where.isPublished = true;
    }
    
    // For teachers, only show their own courses
    if (req.user.role === 'teacher') {
      where.teacherId = req.user.id;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courses = await prisma.course.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.course.count({ where });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user has access to this course
    if (req.user.role === 'student' && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Only teachers and admins can create courses
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      // Log security event
      await prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'unauthorized_course_create',
          resource: 'course',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      description,
      language,
      level,
      thumbnail,
      methodology,
      isPublished,
      tags,
      prerequisites,
      learningObjectives,
      lessons
    } = req.body;

    // Get teacher name
    const teacher = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Process lessons to ensure they have unique IDs
    const processedLessons = lessons && lessons.length > 0 ? lessons.map(lesson => ({
      ...lesson,
      id: lesson.id || uuidv4(),
      content: lesson.content && lesson.content.length > 0 ? lesson.content.map(content => ({
        ...content,
        id: content.id || uuidv4()
      })) : [],
      quiz: lesson.quiz ? {
        ...lesson.quiz,
        id: lesson.quiz.id || uuidv4(),
        questions: lesson.quiz.questions && lesson.quiz.questions.length > 0 ? lesson.quiz.questions.map(question => ({
          ...question,
          id: question.id || uuidv4()
        })) : []
      } : undefined
    })) : [];

    // Create new course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        language,
        teacherId: req.user.id,
        teacherName: teacher.name,
        level,
        thumbnail: thumbnail || '',
        methodology: methodology || [],
        isPublished: isPublished || false,
        tags: tags || [],
        prerequisites: prerequisites || [],
        learningObjectives: learningObjectives || [],
        lessons: processedLessons || []
      }
    });

    // Log course creation
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'course_created',
        resource: 'course',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id }
      }
    });

    // Emit course update event
    io.emit('courseUpdate', course);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      // Log security event
      await prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'unauthorized_course_update',
          resource: 'course',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { courseId: course.id }
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      description,
      language,
      level,
      thumbnail,
      methodology,
      isPublished,
      tags,
      prerequisites,
      learningObjectives,
      lessons
    } = req.body;

    // Process lessons to ensure they have unique IDs
    const processedLessons = lessons && lessons.length > 0 ? lessons.map(lesson => ({
      ...lesson,
      id: lesson.id || uuidv4(),
      content: lesson.content && lesson.content.length > 0 ? lesson.content.map(content => ({
        ...content,
        id: content.id || uuidv4()
      })) : [],
      quiz: lesson.quiz ? {
        ...lesson.quiz,
        id: lesson.quiz.id || uuidv4(),
        questions: lesson.quiz.questions && lesson.quiz.questions.length > 0 ? lesson.quiz.questions.map(question => ({
          ...question,
          id: question.id || uuidv4()
        })) : []
      } : undefined
    })) : course.lessons;

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        title: title || undefined,
        description: description || undefined,
        language: language || undefined,
        level: level || undefined,
        thumbnail: thumbnail !== undefined ? thumbnail : undefined,
        methodology: methodology || undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        tags: tags || undefined,
        prerequisites: prerequisites || undefined,
        learningObjectives: learningObjectives || undefined,
        lessons: processedLessons || undefined
      }
    });

    // Log course update
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'course_updated',
        resource: 'course',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id }
      }
    });

    // Emit course update event
    io.emit('courseUpdate', updatedCourse);

    res.status(200).json({
      success: true,
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has permission to delete this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      // Log security event
      await prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'unauthorized_course_delete',
          resource: 'course',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { courseId: course.id }
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete related data
    await prisma.enrollment.deleteMany({
      where: { courseId: course.id }
    });
    
    await prisma.completion.deleteMany({
      where: { courseId: course.id }
    });
    
    await prisma.certificate.deleteMany({
      where: { courseId: course.id }
    });

    // Delete the course
    await prisma.course.delete({
      where: { id: course.id }
    });

    // Log course deletion
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'course_deleted',
        resource: 'course',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id }
      }
    });

    // Emit course delete event
    io.emit('courseDelete', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get courses by teacher
export const getCoursesByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId || req.user.id;
    
    // Check if teacher exists
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId }
    });
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    // If requesting other teacher's courses, must be admin
    if (teacherId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const courses = await prisma.course.findMany({
      where: { teacherId }
    });
    
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get courses by teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get enrolled courses for a student
export const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    
    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // If requesting other student's courses, must be admin or teacher
    if (studentId !== req.user.id && req.user.role === 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Get enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      select: { courseId: true }
    });
    
    const courseIds = enrollments.map(enrollment => enrollment.courseId);
    
    // Get courses
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } }
    });
    
    // Get completions for progress data
    const completions = await prisma.completion.findMany({
      where: { 
        userId: studentId,
        courseId: { in: courseIds }
      }
    });
    
    // Add progress data to courses
    const coursesWithProgress = courses.map(course => {
      const completion = completions.find(c => c.courseId === course.id);
      return {
        ...course,
        progress: completion ? completion.progress : 0,
        completed: completion ? completion.completed : false
      };
    });
    
    res.status(200).json({
      success: true,
      count: coursesWithProgress.length,
      courses: coursesWithProgress
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add a lesson to a course
export const addLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      title,
      content,
      order,
      duration,
      type,
      isPublished,
      prerequisites
    } = req.body;

    // Process content to ensure they have unique IDs
    const processedContent = content && content.length > 0 ? content.map(item => ({
      ...item,
      id: item.id || uuidv4()
    })) : [];

    // Create new lesson
    const newLesson = {
      id: uuidv4(),
      title,
      content: processedContent,
      order: order || course.lessons.length + 1,
      duration: duration || 30,
      type: type || 'mixed',
      isPublished: isPublished !== undefined ? isPublished : false,
      prerequisites: prerequisites || []
    };

    // Add lesson to course
    const lessons = [...course.lessons, newLesson];
    
    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { lessons }
    });

    // Log lesson creation
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'lesson_created',
        resource: 'course',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id, lessonId: newLesson.id }
      }
    });

    // Emit course update event
    io.emit('courseUpdate', updatedCourse);

    res.status(201).json({
      success: true,
      lesson: newLesson,
      course: updatedCourse
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a lesson
export const updateLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find the lesson
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === req.params.lessonId);
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const {
      title,
      content,
      order,
      duration,
      type,
      isPublished,
      prerequisites
    } = req.body;

    // Process content to ensure they have unique IDs
    const processedContent = content && content.length > 0 ? content.map(item => ({
      ...item,
      id: item.id || uuidv4()
    })) : course.lessons[lessonIndex].content;

    // Update lesson
    const lessons = [...course.lessons];
    lessons[lessonIndex] = {
      ...lessons[lessonIndex],
      title: title || lessons[lessonIndex].title,
      content: processedContent,
      order: order !== undefined ? order : lessons[lessonIndex].order,
      duration: duration !== undefined ? duration : lessons[lessonIndex].duration,
      type: type || lessons[lessonIndex].type,
      isPublished: isPublished !== undefined ? isPublished : lessons[lessonIndex].isPublished,
      prerequisites: prerequisites || lessons[lessonIndex].prerequisites
    };

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { lessons }
    });

    // Log lesson update
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'lesson_updated',
        resource: 'course',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id, lessonId: req.params.lessonId }
      }
    });

    // Emit course update event
    io.emit('courseUpdate', updatedCourse);

    res.status(200).json({
      success: true,
      lesson: lessons[lessonIndex],
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find the lesson
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === req.params.lessonId);
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Remove the lesson
    const lessons = [...course.lessons];
    lessons.splice(lessonIndex, 1);

    // Update order of remaining lessons
    lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { lessons }
    });

    // Log lesson deletion
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'lesson_deleted',
        resource: 'course',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id, lessonId: req.params.lessonId }
      }
    });

    // Emit course update event
    io.emit('courseUpdate', updatedCourse);

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
