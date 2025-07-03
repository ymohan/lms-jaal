import { Course, User, Progress } from '../types';

export class LocalStorageService {
  private static PREFIX = 'lingualearn_';

  // Course methods
  static saveCourses(courses: Course[]): void {
    localStorage.setItem(`${this.PREFIX}courses`, JSON.stringify(courses));
  }

  static getCourses(): Course[] {
    const courses = localStorage.getItem(`${this.PREFIX}courses`);
    return courses ? JSON.parse(courses) : [];
  }

  static saveCourse(course: Course): void {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c._id === course._id); // 

    
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.push(course);
    }
    
    this.saveCourses(courses);
  }

  static deleteCourse(courseId: string): boolean {
    const courses = this.getCourses();
    const initialLength = courses.length;
    const filteredCourses = courses.filter(c => c._id !== courseId);
    
    if (filteredCourses.length !== initialLength) {
      this.saveCourses(filteredCourses);
      return true;
    }
    
    return false;
  }

  // User methods
  static saveUser(user: User): void {
    localStorage.setItem(`${this.PREFIX}user`, JSON.stringify(user));
  }

  static getUser(): User | null {
    const user = localStorage.getItem(`${this.PREFIX}user`);
    return user ? JSON.parse(user) : null;
  }

  static clearUser(): void {
    localStorage.removeItem(`${this.PREFIX}user`);
    localStorage.removeItem(`${this.PREFIX}sessionToken`);
  }

  // Progress methods
  static saveProgress(progress: Progress): void {
    const allProgress = this.getProgressForUser(progress.userId);
    const index = allProgress.findIndex(
      p => p.userId === progress.userId && p.courseId === progress.courseId && p.lessonId === progress.lessonId
    );
    
    if (index >= 0) {
      allProgress[index] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(`${this.PREFIX}progress_${progress.userId}`, JSON.stringify(allProgress));
  }

  static getProgressForUser(userId: string): Progress[] {
    const progress = localStorage.getItem(`${this.PREFIX}progress_${userId}`);
    return progress ? JSON.parse(progress) : [];
  }

  static getProgressForCourse(userId: string, courseId: string): Progress[] {
    return this.getProgressForUser(userId).filter(p => p.courseId === courseId);
  }

  // Settings methods
  static saveSettings(key: string, value: any): void {
    localStorage.setItem(`${this.PREFIX}settings_${key}`, JSON.stringify(value));
  }

  static getSettings(key: string): any {
    const settings = localStorage.getItem(`${this.PREFIX}settings_${key}`);
    return settings ? JSON.parse(settings) : null;
  }

  // General methods
  static clearAll(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}