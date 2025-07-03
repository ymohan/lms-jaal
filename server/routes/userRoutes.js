import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }),
  body('role').isIn(['admin', 'teacher', 'student'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, role } = req.body;

    // For demo purposes, create a mock user if it doesn't exist
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      // If database is not available, use mock authentication
      console.warn('Database not available, using mock authentication');
      
      // Mock users for demo
      const mockUsers = {
        'admin@lms.com': { id: '1', email: 'admin@lms.com', name: 'Admin User', role: 'admin' },
        'teacher@lms.com': { id: '2', email: 'teacher@lms.com', name: 'Teacher User', role: 'teacher' },
        'student@lms.com': { id: '3', email: 'student@lms.com', name: 'Student User', role: 'student' }
      };

      if (mockUsers[email] && password === 'password' && mockUsers[email].role === role) {
        const token = jwt.sign(
          { userId: mockUsers[email].id, email: mockUsers[email].email, role: mockUsers[email].role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        );

        return res.json({
          success: true,
          token,
          user: mockUsers[email]
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check role
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: 'Role mismatch'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register route
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 1 }),
  body('role').isIn(['admin', 'teacher', 'student'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, name, role } = req.body;

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }
    } catch (error) {
      console.warn('Database not available for user check');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Database error during registration:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });
    } catch (error) {
      // Fallback to token data if database is not available
      user = {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name || 'User',
        role: req.user.role
      };
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update profile
router.put('/profile', authenticateToken, [
  body('name').optional().isLength({ min: 1 }),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    try {
      const user = await prisma.user.update({
        where: { id: req.user.userId },
        data: updates,
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Database error during profile update:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;