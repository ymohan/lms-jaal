import CryptoJS from "crypto-js"; 
import DOMPurify from 'dompurify';

const SECRET_KEY = 'lingualearn-secure-key-2025'; // In production, use environment variable

export class SecurityUtils {
  // Sanitize HTML content to prevent XSS
  static sanitizeHtml(content: string): string {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['class', 'id'],
      KEEP_CONTENT: false
    });
  }

  // Encrypt sensitive data
  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  }

  // Decrypt sensitive data
  static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    const token = CryptoJS.lib.WordArray.random(32).toString();
    localStorage.setItem('csrfToken', token);
    return token;
  }

  // Validate CSRF token
  static validateCSRFToken(token: string): boolean {
    const storedToken = localStorage.getItem('csrfToken');
    return token === storedToken;
  }

  // Hash password
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password + SECRET_KEY).toString();
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    else errors.push('Password must contain at least one uppercase letter');
    
    if (/[a-z]/.test(password)) score += 1;
    else errors.push('Password must contain at least one lowercase letter');
    
    if (/\d/.test(password)) score += 1;
    else errors.push('Password must contain at least one number');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else errors.push('Password must contain at least one special character');
    
    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome'];
    if (commonPasswords.includes(password.toLowerCase())) {
      score = 0;
      errors.push('Password is too common and easily guessable');
    }

    return {
      isValid: score >= 4 && password.length >= 8,
      errors: errors,
      score: score,
    };
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Rate limiting check
  static checkRateLimit(identifier: string, action: string): boolean {
    const key = `ratelimit_${identifier}_${action}`;
    const attempts = localStorage.getItem(key);
    const now = Date.now();
    
    if (!attempts) {
      localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    
    const data = JSON.parse(attempts);
    const timeDiff = now - data.timestamp;
    
    // Reset after 15 minutes
    if (timeDiff > 15 * 60 * 1000) {
      localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    
    // Allow max 5 attempts per 15 minutes
    if (data.count >= 5) {
      return false;
    }
    
    data.count++;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }

  // Log security events
  static logSecurityEvent(event: {
    userId?: string;
    action: string;
    resource: string;
    success: boolean;
    details?: any;
  }): void {
    const logEntry = {
      ...event,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      ipAddress: 'client-side', // In production, get from server
      userAgent: navigator.userAgent,
    };
    
    // Store in local storage for persistence
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only the last 100 logs to prevent storage issues
    if (logs.length > 100) {
      logs.shift();
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
    
    // In production, also send to server
    console.log('Security Event:', logEntry);
  }

  // Get security logs
  static getSecurityLogs(): any[] {
    return JSON.parse(localStorage.getItem('security_logs') || '[]');
  }

  // Validate user permissions
  static hasPermission(user: any, resource: string, action: string): boolean {
    if (!user || !user.permissions) return false;
    
    const permission = `${resource}:${action}`;
    return user.permissions.includes(permission) || user.permissions.includes('*:*');
  }

  // Generate secure session token
  static generateSessionToken(): string {
    const token = CryptoJS.lib.WordArray.random(64).toString();
    const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    // Store token with expiry
    localStorage.setItem('sessionTokenExpiry', expiry.toString());
    
    return token;
  }

  // Validate session token
  static validateSessionToken(token: string): boolean {
    if (!token) return false;
    
    const expiry = localStorage.getItem('sessionTokenExpiry');
    if (!expiry) return false;
    
    const expiryTime = parseInt(expiry, 10);
    const now = Date.now();
    
    // Check if token is expired
    if (now > expiryTime) {
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('sessionTokenExpiry');
      return false;
    }
    
    return true;
  }

  // Sanitize URL
  static sanitizeUrl(url: string): string {
    // Only allow http:// and https:// protocols
    if (!/^(https?:)?\/\//i.test(url)) {
      return '';
    }
    
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch (e) {
      return '';
    }
  }
  
  // Detect suspicious activity
  static detectSuspiciousActivity(activity: any): boolean {
    // Implement rules to detect suspicious activity
    // For example, multiple failed login attempts, unusual access patterns, etc.
    return false;
  }
  
  // Validate JWT token
  static validateJwtToken(token: string): boolean {
    try {
      // Simple validation - check if token has three parts
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // In a real implementation, you would verify the signature
      return true;
    } catch (e) {
      return false;
    }
  }
}