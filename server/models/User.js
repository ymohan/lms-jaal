import pool from '../db/postgres.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class User {
  // Find user by ID
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Create a new user
  static async create(userData) {
    const { name, email, password, role = 'student' } = userData;
    
    try {
      // Check if user exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert user
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Update user
  static async update(id, updates) {
    try {
      const fields = Object.keys(updates).filter(key => updates[key] !== undefined);
      
      if (fields.length === 0) return null;
      
      const setString = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
      const values = fields.map(field => updates[field]);
      
      const query = `
        UPDATE users 
        SET ${setString}, updated_at = NOW() 
        WHERE id = $${fields.length + 1} 
        RETURNING *
      `;
      
      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Delete user
  static async delete(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Compare password
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  // Generate JWT token
  static generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }
}

export default User;