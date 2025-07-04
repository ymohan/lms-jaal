/*
  # Initial Schema Setup

  1. New Tables
    - `users` - User accounts with authentication
    - `courses` - Language learning courses
    - `enrollments` - User course enrollments
    - `completions` - Course progress tracking
    - `certificates` - Course completion certificates
    - `security_logs` - Security and audit logs
  
  2. Security
    - Enable RLS on all tables
    - Add policies for proper data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  profile JSONB,
  preferences JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  language TEXT NOT NULL,
  teacher_id uuid NOT NULL REFERENCES users(id),
  teacher_name TEXT NOT NULL,
  level TEXT NOT NULL,
  lessons JSONB NOT NULL DEFAULT '[]',
  thumbnail TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  methodology TEXT[] NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  prerequisites TEXT[],
  learning_objectives TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  completion_date TIMESTAMPTZ,
  certificate_issued BOOLEAN NOT NULL DEFAULT false,
  certificate_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Completions table
CREATE TABLE IF NOT EXISTS completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  lesson_id TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  progress INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  score INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  course_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  issued_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'issued',
  grade TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can read published courses" 
  ON courses FOR SELECT 
  USING (is_published = true OR auth.uid() = teacher_id);

CREATE POLICY "Teachers can create courses" 
  ON courses FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own courses" 
  ON courses FOR UPDATE 
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own courses" 
  ON courses FOR DELETE 
  USING (auth.uid() = teacher_id);

-- Enrollments policies
CREATE POLICY "Users can read their own enrollments" 
  ON enrollments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" 
  ON enrollments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can read enrollments for their courses" 
  ON enrollments FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = enrollments.course_id 
    AND courses.teacher_id = auth.uid()
  ));

-- Completions policies
CREATE POLICY "Users can read their own completions" 
  ON completions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions" 
  ON completions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can read completions for their courses" 
  ON completions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = completions.course_id 
    AND courses.teacher_id = auth.uid()
  ));

-- Certificates policies
CREATE POLICY "Users can read their own certificates" 
  ON certificates FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates" 
  ON certificates FOR SELECT 
  USING (status = 'issued');

CREATE POLICY "Teachers can issue certificates" 
  ON certificates FOR INSERT 
  TO authenticated 
  WITH CHECK (EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = certificates.course_id 
    AND courses.teacher_id = auth.uid()
  ));

-- Security logs policies
CREATE POLICY "Users can read their own security logs" 
  ON security_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all security logs" 
  ON security_logs FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ));