export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  methodology: string;
  teacherId: string;
  teacherName: string;
  level: string;
  language: string;
  duration: number;
  isPublished: boolean;
  tags: string[];
  thumbnail: string;
  lessons: {
    id: string;
    title: string;
    quiz?: Quiz;
  }[];
  enrolledStudents?: string[];
}
