// server/controllers/userController.js
import prisma from '../lib/prisma.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register a new user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
      }
    });

    // Log security event
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: 'user_registered',
        resource: 'auth',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { email, role }
      }
    });

    // Generate token
    const token = generateAuthToken(user);

    // Return user data without password
    const userData = { ...user };
    delete userData.password;

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, role } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Log failed login attempt
      await prisma.securityLog.create({
        data: {
          action: 'login_failed',
          resource: 'auth',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { email, reason: 'user_not_found' }
        }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user role matches
    if (role && user.role !== role) {
      // Log failed login attempt
      await prisma.securityLog.create({
        data: {
          userId: user.id,
          action: 'login_failed',
          resource: 'auth',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { email, reason: 'role_mismatch' }
        }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      // Log failed login attempt
      await prisma.securityLog.create({
        data: {
          userId: user.id,
          action: 'login_failed',
          resource: 'auth',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { email, reason: 'account_inactive' }
        }
      });

      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login attempt
      await prisma.securityLog.create({
        data: {
          userId: user.id,
          action: 'login_failed',
          resource: 'auth',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { email, reason: 'invalid_password' }
        }
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate token
    const token = generateAuthToken(user);

    // Log successful login
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: 'login_success',
        resource: 'auth',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { email, role: user.role }
      }
    });

    // Return user data without password
    const userData = { ...user };
    delete userData.password;

    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, avatar, bio, phone, location, language, interests, profession } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already in use
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
    }

    // Prepare profile data
    let profile = user.profile || {};
    if (avatar !== undefined) profile.avatar = avatar;
    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    
    // Prepare preferences data
    let preferences = user.preferences || {};
    if (language) preferences.language = language;
    if (interests) preferences.interests = interests;
    if (profession !== undefined) preferences.profession = profession;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || user.name,
        email: email || user.email,
        profile,
        preferences
      }
    });

    // Log profile update
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: 'profile_updated',
        resource: 'user',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { updatedFields: Object.keys(req.body) }
      }
    });

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // Log failed password change
      await prisma.securityLog.create({
        data: {
          userId: user.id,
          action: 'password_change_failed',
          resource: 'user',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { reason: 'invalid_current_password' }
        }
      });

      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    // Log successful password change
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        action: 'password_changed',
        resource: 'user',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        profile: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        profile: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, role, isActive, permissions } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already in use
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
    }

    // Update preferences if permissions are provided
    let preferences = user.preferences || {};
    if (permissions) {
      preferences.permissions = permissions;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: name || undefined,
        email: email || undefined,
        role: role || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        preferences
      }
    });

    // Log user update
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'user_updated',
        resource: 'user',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { targetUserId: user.id, updatedFields: Object.keys(req.body) }
      }
    });

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    // Log user deletion
    await prisma.securityLog.create({
      data: {
        userId: req.user.id,
        action: 'user_deleted',
        resource: 'user',
        success: true,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { deletedUserId: req.params.id }
      }
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get security logs (admin only)
export const getSecurityLogs = async (req, res) => {
  try {
    const { userId, action, success, startDate, endDate, limit = 100, page = 1 } = req.query;
    
    const where = {};
    
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (success !== undefined) where.success = success === 'true';
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const logs = await prisma.securityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    const total = await prisma.securityLog.count({ where });
    
    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      logs
    });
  } catch (error) {
    console.error('Get security logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to generate JWT token
function generateAuthToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
}
