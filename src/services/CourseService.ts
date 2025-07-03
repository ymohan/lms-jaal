import { Course, Lesson, Quiz } from '../types';
import { LocalStorageService } from '../utils/localStorage';
import { mockCourses } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

export class CourseService {
  // Initialize the courses in local storage if not already present
  static initialize(): void {
    const courses = LocalStorageService.getCourses();
    if (courses.length === 0) {
      LocalStorageService.saveCourses([...mockCourses]);
    }
  }

  // Get all courses
  static getAllCourses(): Course[] {
    return LocalStorageService.getCourses();
  }

  // Get course by ID
  static getCourseById(id: string): Course | undefined {
    return this.getAllCourses().find(course => course.id === id);
  }

  // Get courses by teacher ID
  static getCoursesByTeacher(teacherId: string): Course[] {
    return this.getAllCourses().filter(course => course.teacherId === teacherId);
  }

  // Get courses by student ID (enrolled courses)
  static getCoursesByStudent(studentId: string): Course[] {
    return this.getAllCourses().filter(course => 
      course.enrolledStudents.includes(studentId) && course.isPublished
    );
  }

  // Create a new course
  static createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
    const newCourse: Course = {
      ...course,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const courses = this.getAllCourses();
    courses.push(newCourse);
    LocalStorageService.saveCourses(courses);
    
    // Also update mockCourses for persistence across page refreshes
    mockCourses.push(newCourse);
    
    return newCourse;
  }

  // Update an existing course
  static updateCourse(id: string, updates: Partial<Course>): Course | null {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) return null;
    
    const updatedCourse = {
      ...courses[courseIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    courses[courseIndex] = updatedCourse;
    LocalStorageService.saveCourses(courses);
    
    // Also update in mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === id);
    if (mockIndex !== -1) {
      mockCourses[mockIndex] = updatedCourse;
    }
    
    return updatedCourse;
  }

  // Delete a course
  static deleteCourse(id: string): boolean {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === id);
    
    if (courseIndex === -1) return false;
    
    courses.splice(courseIndex, 1);
    LocalStorageService.saveCourses(courses);
    
    // Also remove from mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === id);
    if (mockIndex !== -1) {
      mockCourses.splice(mockIndex, 1);
    }
    
    return true;
  }

  // Add a lesson to a course
  static addLesson(courseId: string, lesson: Omit<Lesson, 'id'>): Lesson | null {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return null;
    
    const newLesson: Lesson = {
      ...lesson,
      id: uuidv4(),
    };
    
    courses[courseIndex].lessons.push(newLesson);
    courses[courseIndex].updatedAt = new Date();
    
    LocalStorageService.saveCourses(courses);
    
    // Update mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === courseId);
    if (mockIndex !== -1) {
      mockCourses[mockIndex].lessons.push(newLesson);
      mockCourses[mockIndex].updatedAt = new Date();
    }
    
    return newLesson;
  }

  // Update a lesson
  static updateLesson(courseId: string, lessonId: string, updates: Partial<Lesson>): Lesson | null {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return null;
    
    const lessonIndex = courses[courseIndex].lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) return null;
    
    const updatedLesson = {
      ...courses[courseIndex].lessons[lessonIndex],
      ...updates,
    };
    
    courses[courseIndex].lessons[lessonIndex] = updatedLesson;
    courses[courseIndex].updatedAt = new Date();
    
    LocalStorageService.saveCourses(courses);
    
    // Update mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === courseId);
    if (mockIndex !== -1) {
      const mockLessonIndex = mockCourses[mockIndex].lessons.findIndex(l => l.id === lessonId);
      if (mockLessonIndex !== -1) {
        mockCourses[mockIndex].lessons[mockLessonIndex] = updatedLesson;
        mockCourses[mockIndex].updatedAt = new Date();
      }
    }
    
    return updatedLesson;
  }

  // Delete a lesson
  static deleteLesson(courseId: string, lessonId: string): boolean {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return false;
    
    const initialLength = courses[courseIndex].lessons.length;
    courses[courseIndex].lessons = courses[courseIndex].lessons.filter(lesson => lesson.id !== lessonId);
    
    if (courses[courseIndex].lessons.length === initialLength) return false;
    
    courses[courseIndex].updatedAt = new Date();
    LocalStorageService.saveCourses(courses);
    
    // Update mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === courseId);
    if (mockIndex !== -1) {
      mockCourses[mockIndex].lessons = mockCourses[mockIndex].lessons.filter(l => l.id !== lessonId);
      mockCourses[mockIndex].updatedAt = new Date();
    }
    
    return true;
  }

  // Add or update a quiz for a lesson
  static saveQuiz(courseId: string, lessonId: string, quiz: Quiz): Quiz | null {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return null;
    
    const lessonIndex = courses[courseIndex].lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (lessonIndex === -1) return null;
    
    courses[courseIndex].lessons[lessonIndex].quiz = quiz;
    courses[courseIndex].updatedAt = new Date();
    
    LocalStorageService.saveCourses(courses);
    
    // Update mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === courseId);
    if (mockIndex !== -1) {
      const mockLessonIndex = mockCourses[mockIndex].lessons.findIndex(l => l.id === lessonId);
      if (mockLessonIndex !== -1) {
        mockCourses[mockIndex].lessons[mockLessonIndex].quiz = quiz;
        mockCourses[mockIndex].updatedAt = new Date();
      }
    }
    
    return quiz;
  }

  // Enroll a student in a course
  static enrollStudent(courseId: string, studentId: string): boolean {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return false;
    
    if (courses[courseIndex].enrolledStudents.includes(studentId)) return true;
    
    courses[courseIndex].enrolledStudents.push(studentId);
    courses[courseIndex].updatedAt = new Date();
    
    LocalStorageService.saveCourses(courses);
    
    // Update mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === courseId);
    if (mockIndex !== -1) {
      mockCourses[mockIndex].enrolledStudents.push(studentId);
      mockCourses[mockIndex].updatedAt = new Date();
    }
    
    return true;
  }

  // Unenroll a student from a course
  static unenrollStudent(courseId: string, studentId: string): boolean {
    const courses = this.getAllCourses();
    const courseIndex = courses.findIndex(course => course.id === courseId);
    
    if (courseIndex === -1) return false;
    
    const initialLength = courses[courseIndex].enrolledStudents.length;
    courses[courseIndex].enrolledStudents = courses[courseIndex].enrolledStudents.filter(id => id !== studentId);
    
    if (courses[courseIndex].enrolledStudents.length === initialLength) return false;
    
    courses[courseIndex].updatedAt = new Date();
    LocalStorageService.saveCourses(courses);
    
    // Update mockCourses
    const mockIndex = mockCourses.findIndex(c => c.id === courseId);
    if (mockIndex !== -1) {
      mockCourses[mockIndex].enrolledStudents = mockCourses[mockIndex].enrolledStudents.filter(id => id !== studentId);
      mockCourses[mockIndex].updatedAt = new Date();
    }
    
    return true;
  }

  // Search courses
  static searchCourses(query: string, filters: any = {}): Course[] {
    const courses = this.getAllCourses();
    
    return courses.filter(course => {
      // Search in title, description, and tags
      const matchesQuery = query ? 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        course.teacherName.toLowerCase().includes(query.toLowerCase())
        : true;
      
      // Apply filters
      const matchesLevel = filters.level ? course.level === filters.level : true;
      const matchesLanguage = filters.language ? course.language === filters.language : true;
      const matchesMethodology = filters.methodology ? 
        course.methodology.includes(filters.methodology) : true;
      const matchesPublished = filters.published !== undefined ? 
        course.isPublished === filters.published : true;
      
      return matchesQuery && matchesLevel && matchesLanguage && 
             matchesMethodology && matchesPublished;
    });
  }
}

// Initialize courses on module load
CourseService.initialize();