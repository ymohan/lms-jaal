-- Initialize database tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP,
  profile JSONB,
  preferences JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  language VARCHAR(20) NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES users(id),
  teacher_name VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL,
  lessons JSONB NOT NULL DEFAULT '[]',
  thumbnail VARCHAR(255),
  duration INTEGER NOT NULL DEFAULT 0,
  methodology VARCHAR(255)[] NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  tags VARCHAR(50)[],
  prerequisites VARCHAR(100)[],
  learning_objectives VARCHAR(255)[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  completion_date TIMESTAMP,
  certificate_issued BOOLEAN NOT NULL DEFAULT false,
  certificate_id VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Completions table
CREATE TABLE IF NOT EXISTS completions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  lesson_id VARCHAR(100),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP,
  progress INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  score INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  course_id INTEGER NOT NULL REFERENCES courses(id),
  course_name VARCHAR(255) NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  issued_date TIMESTAMP NOT NULL DEFAULT NOW(),
  verification_code VARCHAR(100) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'issued',
  grade VARCHAR(10),
  score INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', '$2a$10$eCzWvXtK1HBn0xc1L1Lqb.VpYaJfZt6qQM5uBMY.YQxpqZZ7TNEfK', 'admin')
ON CONFLICT (email) DO NOTHING;