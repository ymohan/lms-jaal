// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

// Protect routes - renamed from protect to authenticateToken
export const authenticateToken = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      
      // Get user from token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if user is active
      if (!user.isActive) {
        // Log security event
        await prisma.securityLog.create({
          data: {
            userId: user.id,
            action: 'auth_failed',
            resource: 'auth',
            success: false,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: { reason: 'account_inactive' }
          }
        });
        
        return res.status(401).json({
          success: false,
          message: 'Account is inactive'
        });
      }
      
      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      // Log security event
      await prisma.securityLog.create({
        data: {
          action: 'auth_failed',
          resource: 'auth',
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { reason: 'invalid_token', error: error.message }
        }
      });
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Authorize roles - renamed from authorize to requireRole
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // Log security event
      prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'authorization_failed',
          resource: req.originalUrl,
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { 
            requiredRoles: roles,
            userRole: req.user.role
          }
        }
      }).catch(err => console.error('Error logging security event:', err));
      
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check permission
export const checkPermission = (permission) => {
  return (req, res, next) => {
    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user has the required permission
    const userPermissions = req.user.preferences?.permissions || [];
    if (!userPermissions.includes(permission) && !userPermissions.includes('*:*')) {
      // Log security event
      prisma.securityLog.create({
        data: {
          userId: req.user.id,
          action: 'permission_denied',
          resource: req.originalUrl,
          success: false,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { 
            requiredPermission: permission,
            userPermissions
          }
        }
      }).catch(err => console.error('Error logging security event:', err));
      
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${permission}`
      });
    }
    
    next();
  };
};