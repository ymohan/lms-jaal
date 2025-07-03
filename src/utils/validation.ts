import { SecurityUtils } from './security';

export class ValidationUtils {
  // Validate course data
  static validateCourse(course: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!course.title || course.title.trim().length < 3) {
      errors.push('Course title must be at least 3 characters long');
    }

    if (!course.description || course.description.trim().length < 10) {
      errors.push('Course description must be at least 10 characters long');
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(course.level)) {
      errors.push('Invalid course level');
    }

    if (!['en', 'hi', 'ta'].includes(course.language)) {
      errors.push('Invalid language selection');
    }

    if (!course.methodology || course.methodology.length === 0) {
      errors.push('At least one methodology must be selected');
    }

    // Validate thumbnail URL if provided
    if (course.thumbnail && !this.validateUrl(course.thumbnail)) {
      errors.push('Invalid thumbnail URL format');
    }

    // Validate learning objectives
    if (course.learningObjectives && course.learningObjectives.length > 0) {
      if (course.learningObjectives.some((obj: string) => obj.trim().length < 5)) {
        errors.push('Learning objectives must be at least 5 characters long');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate lesson data
  static validateLesson(lesson: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!lesson.title || lesson.title.trim().length < 3) {
      errors.push('Lesson title must be at least 3 characters long');
    }

    if (!lesson.type || !['reading', 'writing', 'speaking', 'listening', 'mixed'].includes(lesson.type)) {
      errors.push('Invalid lesson type');
    }

    if (!lesson.content || lesson.content.length === 0) {
      errors.push('Lesson must have at least one content item');
    }

    if (lesson.duration && (lesson.duration < 1 || lesson.duration > 300)) {
      errors.push('Lesson duration must be between 1 and 300 minutes');
    }

    // Validate content items
    if (lesson.content && lesson.content.length > 0) {
      lesson.content.forEach((item: any, index: number) => {
        if (!item.content || item.content.trim().length === 0) {
          errors.push(`Content item ${index + 1} must have content`);
        }

        if (item.type === 'audio' && item.audioUrl && !this.validateUrl(item.audioUrl)) {
          errors.push(`Content item ${index + 1} has an invalid audio URL`);
        }

        if (item.type === 'video' && item.videoUrl && !this.validateUrl(item.videoUrl)) {
          errors.push(`Content item ${index + 1} has an invalid video URL`);
        }

        if (item.type === 'image' && item.imageUrl && !this.validateUrl(item.imageUrl)) {
          errors.push(`Content item ${index + 1} has an invalid image URL`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate quiz data
  static validateQuiz(quiz: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!quiz.title || quiz.title.trim().length < 3) {
      errors.push('Quiz title must be at least 3 characters long');
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      errors.push('Quiz must have at least one question');
    }

    if (quiz.passingScore && (quiz.passingScore < 0 || quiz.passingScore > 100)) {
      errors.push('Passing score must be between 0 and 100');
    }

    if (quiz.timeLimit && quiz.timeLimit < 60) {
      errors.push('Time limit must be at least 60 seconds');
    }

    if (quiz.attempts && quiz.attempts < 1) {
      errors.push('Number of attempts must be at least 1');
    }

    // Validate each question
    quiz.questions?.forEach((question: any, index: number) => {
      const questionErrors = this.validateQuestion(question);
      if (!questionErrors.isValid) {
        errors.push(`Question ${index + 1}: ${questionErrors.errors.join(', ')}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate question data
  static validateQuestion(question: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!question.question || question.question.trim().length < 5) {
      errors.push('Question text must be at least 5 characters long');
    }

    if (!['mcq', 'fill-blank', 'audio', 'tpr', 'speaking', 'matching', 'ordering', 'essay'].includes(question.type)) {
      errors.push('Invalid question type');
    }

    if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
      errors.push('Multiple choice questions must have at least 2 options');
    }

    if (!question.correctAnswer) {
      errors.push('Question must have a correct answer');
    }

    if (question.points && (question.points < 1 || question.points > 100)) {
      errors.push('Question points must be between 1 and 100');
    }

    // Validate media URLs
    if (question.audioUrl && !this.validateUrl(question.audioUrl)) {
      errors.push('Invalid audio URL format');
    }

    if (question.imageUrl && !this.validateUrl(question.imageUrl)) {
      errors.push('Invalid image URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate user input for XSS and injection attacks
  static sanitizeInput(input: string): string {
    return SecurityUtils.sanitizeHtml(input);
  }

  // Validate file uploads
  static validateFileUpload(file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: `File size exceeds limit of ${Math.round(maxSize / (1024 * 1024))}MB` };
    }

    return { isValid: true };
  }

  // Validate URL format
  static validateUrl(url: string): boolean {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate email format with more strict rules
  static validateEmailStrict(email: string): boolean {
    // More comprehensive email regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  // Validate phone number format
  static validatePhone(phone: string): boolean {
    // Basic international phone validation
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    return phoneRegex.test(phone);
  }

  // Validate date format
  static validateDate(date: string): boolean {
    // Check if it's a valid date
    const d = new Date(date);
    return !isNaN(d.getTime());
  }

  // Sanitize filename
  static sanitizeFilename(filename: string): string {
    // Remove path traversal characters and other potentially dangerous characters
    return filename.replace(/[\/\?<>\\:\*\|"]/g, '_');
  }
}