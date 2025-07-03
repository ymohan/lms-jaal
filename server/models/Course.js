import mongoose from 'mongoose';

const lessonContentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'audio', 'video', 'image', 'interactive', 'tpr-activity', 'reading-exercise'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  audioUrl: String,
  videoUrl: String,
  imageUrl: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'fill-blank', 'audio', 'tpr', 'speaking', 'matching', 'ordering', 'essay'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  explanation: String,
  points: {
    type: Number,
    default: 10
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  order: Number,
  audioUrl: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

const quizSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [questionSchema],
  timeLimit: Number,
  passingScore: {
    type: Number,
    default: 70
  },
  attempts: {
    type: Number,
    default: 3
  },
  isRandomized: {
    type: Boolean,
    default: false
  },
  showResults: {
    type: Boolean,
    default: true
  }
});

const lessonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: [lessonContentSchema],
  order: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 30
  },
  type: {
    type: String,
    enum: ['reading', 'writing', 'speaking', 'listening', 'mixed'],
    default: 'mixed'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  prerequisites: [String],
  quiz: quizSchema
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: [3, 'Course title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    minlength: [10, 'Course description must be at least 10 characters long']
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'ta'],
    required: [true, 'Language is required']
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required']
  },
  teacherName: {
    type: String,
    required: [true, 'Teacher name is required']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Course level is required']
  },
  lessons: [lessonSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  methodology: {
    type: [String],
    required: [true, 'At least one methodology must be selected']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [String],
  prerequisites: [String],
  learningObjectives: [String]
}, {
  timestamps: true
});

// Calculate total duration based on lessons
courseSchema.pre('save', function(next) {
  if (this.lessons && this.lessons.length > 0) {
    this.duration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;