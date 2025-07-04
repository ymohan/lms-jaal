import express from 'express';
import pool from '../db/postgres.js';

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // In a real app, you would hash the password here
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, role || 'student']
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;