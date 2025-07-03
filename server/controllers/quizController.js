// server/controllers/quizController.js
import prisma from '../lib/prisma.js';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../index.js';

// Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    // Find course with the lesson containing the quiz
    const courses = await prisma.course.findMany({
      where: {
        lessons: {
          path: ['$[*].quiz.id'],
          equals: req.params.id
        }
      }
    });
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const course = courses[0];
    
    // Find the lesson with the quiz
    const lesson = course.lessons.find(lesson => lesson.quiz && lesson.quiz.id === req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user has access to this quiz
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
      quiz: lesson.quiz,
      lessonId: lesson.id,
      courseId: course.id
    });
  } catch (error) {
    console.error('Get quiz by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lessonId, ...quizData } = req.body;

    // Find the course and lesson
    const courses = await prisma.course.findMany({
      where: {
        lessons: {
          path: ['$[*].id'],
          equals: lessonId
        }
      }
    });
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    const course = courses[0];

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      // Log security event
      await prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'unauthorized_quiz_create',
          resource: 'quiz',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { courseId: course.id, lessonId }
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find the lesson
    const lessons = course.lessons;
    const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Process questions to ensure they have unique IDs
    const processedQuestions = quizData.questions && quizData.questions.length > 0 
      ? quizData.questions.map(question => ({
          ...question,
          id: question.id || uuidv4()
        }))
      : [];

    // Create new quiz
    const newQuiz = {
      id: uuidv4(),
      ...quizData,
      questions: processedQuestions
    };

    // Add quiz to lesson
    lessons[lessonIndex].quiz = newQuiz;
    
    // Update course with modified lessons
    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { lessons }
    });

    // Log quiz creation
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'quiz_created',
        resource: 'quiz',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id, lessonId, quizId: newQuiz.id }
      }
    });

    // Emit quiz update event
    io.emit('quizUpdate', { ...newQuiz, courseId: course.id, lessonId });

    res.status(201).json({
      success: true,
      quiz: newQuiz,
      lessonId,
      courseId: course.id
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Find the course with the quiz
    const courses = await prisma.course.findMany({
      where: {
        lessons: {
          path: ['$[*].quiz.id'],
          equals: req.params.id
        }
      }
    });
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const course = courses[0];

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      // Log security event
      await prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'unauthorized_quiz_update',
          resource: 'quiz',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { courseId: course.id, quizId: req.params.id }
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find the lesson with the quiz
    const lessons = [...course.lessons];
    const lessonIndex = lessons.findIndex(lesson => lesson.quiz && lesson.quiz.id === req.params.id);
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const { questions, title, description, timeLimit, passingScore, attempts, isRandomized, showResults } = req.body;

    // Process questions to ensure they have unique IDs
    const processedQuestions = questions && questions.length > 0 
      ? questions.map(question => ({
          ...question,
          id: question.id || uuidv4()
        }))
      : lessons[lessonIndex].quiz.questions;

    // Update quiz
    lessons[lessonIndex].quiz = {
      ...lessons[lessonIndex].quiz,
      title: title || lessons[lessonIndex].quiz.title,
      description: description !== undefined ? description : lessons[lessonIndex].quiz.description,
      questions: processedQuestions,
      timeLimit: timeLimit !== undefined ? timeLimit : lessons[lessonIndex].quiz.timeLimit,
      passingScore: passingScore !== undefined ? passingScore : lessons[lessonIndex].quiz.passingScore,
      attempts: attempts !== undefined ? attempts : lessons[lessonIndex].quiz.attempts,
      isRandomized: isRandomized !== undefined ? isRandomized : lessons[lessonIndex].quiz.isRandomized,
      showResults: showResults !== undefined ? showResults : lessons[lessonIndex].quiz.showResults
    };

    // Update course with modified lessons
    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: { lessons }
    });

    // Log quiz update
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'quiz_updated',
        resource: 'quiz',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id, lessonId: lessons[lessonIndex].id, quizId: req.params.id }
      }
    });

    // Emit quiz update event
    io.emit('quizUpdate', { 
      ...lessons[lessonIndex].quiz, 
      courseId: course.id, 
      lessonId: lessons[lessonIndex].id 
    });

    res.status(200).json({
      success: true,
      quiz: lessons[lessonIndex].quiz,
      lessonId: lessons[lessonIndex].id,
      courseId: course.id
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    // Find the course with the quiz
    const courses = await prisma.course.findMany({
      where: {
        lessons: {
          path: ['$[*].quiz.id'],
          equals: req.params.id
        }
      }
    });
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const course = courses[0];

    // Check if user has permission to update this course
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      // Log security event
      await prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'unauthorized_quiz_delete',
          resource: 'quiz',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { courseId: course.id, quizId: req.params.id }
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find the lesson with the quiz
    const lessons = [...course.lessons];
    const lessonIndex = lessons.findIndex(lesson => lesson.quiz && lesson.quiz.id === req.params.id);
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Store lesson ID for logging
    const lessonId = lessons[lessonIndex].id;

    // Remove the quiz
    lessons[lessonIndex].quiz = undefined;
    
    // Update course with modified lessons
    await prisma.course.update({
      where: { id: course.id },
      data: { lessons }
    });

    // Log quiz deletion
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'quiz_deleted',
        resource: 'quiz',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { courseId: course.id, lessonId, quizId: req.params.id }
      }
    });

    // Emit quiz delete event
    io.emit('quizDelete', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Submit quiz answers
export const submitQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { answers } = req.body;

    // Find the course with the quiz
    const courses = await prisma.course.findMany({
      where: {
        lessons: {
          path: ['$[*].quiz.id'],
          equals: req.params.id
        }
      }
    });
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    const course = courses[0];

    // Find the lesson with the quiz
    const lesson = course.lessons.find(lesson => lesson.quiz && lesson.quiz.id === req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;

    lesson.quiz.questions.forEach(question => {
      totalPoints += question.points || 10;
      const userAnswer = answers[question.id];

      if (userAnswer !== undefined) {
        if (Array.isArray(question.correctAnswer)) {
          if (Array.isArray(userAnswer) && 
              userAnswer.length === question.correctAnswer.length &&
              userAnswer.every(ans => question.correctAnswer.includes(ans))) {
            correctAnswers += question.points || 10;
          }
        } else {
          if (userAnswer === question.correctAnswer) {
            correctAnswers += question.points || 10;
          }
        }
      }
    });

    const score = totalPoints > 0 ? Math.round((correctAnswers / totalPoints) * 100) : 0;
    const passed = score >= (lesson.quiz.passingScore || 70);

    // Update completion if passed
    if (passed) {
      // Find or create completion record
      let completion = await prisma.completion.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId: course.id
          }
        }
      });

      if (!completion) {
        // Create new completion
        completion = await prisma.completion.create({
          data: {
            userId: req.user.id,
            courseId: course.id,
            lessonId: lesson.id,
            progress: 0
          }
        });
      }

      // Calculate new progress
      const lessonIndex = course.lessons.findIndex(l => l.id === lesson.id);
      const newProgress = Math.max(completion.progress || 0, 
        Math.round((lessonIndex + 1) / course.lessons.length * 100));
      
      // Prepare update data
      const updateData = {
        progress: newProgress,
        lastAccessed: new Date(),
        attempts: (completion.attempts || 0) + 1,
        score
      };
      
      // Mark as completed if progress is 100%
      if (newProgress >= 100) {
        updateData.completed = true;
        updateData.completedAt = new Date();
      }

      // Update completion
      completion = await prisma.completion.update({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId: course.id
          }
        },
        data: updateData
      });

      // Emit progress update event
      io.emit('progressUpdate', completion);
    }

    // Log quiz submission
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'quiz_submitted',
        resource: 'quiz',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { 
          courseId: course.id, 
          lessonId: lesson.id, 
          quizId: req.params.id,
          score,
          passed
        }
      }
    });

    res.status(200).json({
      success: true,
      score,
      passed,
      correctAnswers,
      totalPoints,
      passingScore: lesson.quiz.passingScore || 70
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
