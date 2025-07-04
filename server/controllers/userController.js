import User from '../models/User.js';
import pool from '../db/postgres.js';
import { validationResult } from 'express-validator';

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create security log
    await pool.query(
      'INSERT INTO security_logs (user_id, action, resource, success, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.id, 'user_registered', 'auth', true, req.ip, req.headers['user-agent']]
    );

    // Generate token
    const token = User.generateToken(user);

    // Remove password from response
    delete user.password;

    res.status(201).json({
      success: true,
      token,
      user
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      // Log failed login attempt
      await pool.query(
        'INSERT INTO security_logs (action, resource, success, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5, $6)',
        ['login_failed', 'auth', false, req.ip, req.headers['user-agent'], JSON.stringify({ email, reason: 'user_not_found' })]
      );

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      // Log failed login attempt
      await pool.query(
        'INSERT INTO security_logs (user_id, action, resource, success, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.id, 'login_failed', 'auth', false, req.ip, req.headers['user-agent'], JSON.stringify({ email, reason: 'account_inactive' })]
      );

      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      // Log failed login attempt
      await pool.query(
        'INSERT INTO security_logs (user_id, action, resource, success, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.id, 'login_failed', 'auth', false, req.ip, req.headers['user-agent'], JSON.stringify({ email, reason: 'invalid_password' })]
      );

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Generate token
    const token = User.generateToken(user);

    // Log successful login
    await pool.query(
      'INSERT INTO security_logs (user_id, action, resource, success, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user.id, 'login_success', 'auth', true, req.ip, req.headers['user-agent'], JSON.stringify({ email, role: user.role })]
    );

    // Remove password from response
    delete user.password;

    res.status(200).json({
      success: true,
      token,
      user
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

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    delete user.password;

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

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, last_login, profile, preferences, created_at, updated_at FROM users'
    );
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      users: result.rows
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, avatar, bio, phone, location, language, interests, profession } = req.body;

    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already in use
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      
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
    const updatedUser = await User.update(req.user.id, {
      name: name || undefined,
      email: email || undefined,
      profile,
      preferences
    });

    // Log profile update
    await pool.query(
      'INSERT INTO security_logs (user_id, action, resource, success, ip_address, user_agent, details) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user.id, 'profile_updated', 'user', true, req.ip, req.headers['user-agent'], JSON.stringify({ updatedFields: Object.keys(req.body) })]
    );

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