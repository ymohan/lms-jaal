import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Play, CheckCircle, Lock, Clock, Users, Award } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { LessonViewer } from './LessonViewer';
import { useAuth } from '../../contexts/AuthContext';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
}

export function CoursePlayer({ course, onBack }: CoursePlayerProps) {
  const { user } = useAuth();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showLessonViewer, setShowLessonViewer] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);

  const currentLesson = course.lessons[currentLessonIndex];
  const isEnrolled = course.enrolledStudents.includes(user?.id || '');

  useEffect(() => {
    // Calculate course progress
    const progress = (completedLessons.size / course.lessons.length) * 100;
    setCourseProgress(progress);
  }, [completedLessons, course.lessons.length]);

  const handleStartLesson = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex);
    setShowLessonViewer(true);
  };

  const handleLessonComplete = () => {
    const lessonId = currentLesson.id;
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    
    // Auto-advance to next lesson if available
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // Course completed
      setShowLessonViewer(false);
      alert('Congratulations! You have completed the course!');
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    return completedLessons.has(course.lessons[lessonIndex - 1].id);
  };

  const getLessonStatus = (lesson: Lesson, index: number) => {
    if (completedLessons.has(lesson.id)) return 'completed';
    if (isLessonUnlocked(index)) return 'available';
    return 'locked';
  };

  if (showLessonViewer && currentLesson) {
    return (
      <LessonViewer
        lesson={currentLesson}
        courseTitle={course.title}
        onComplete={handleLessonComplete}
        onNext={handleNextLesson}
        onPrevious={handlePreviousLesson}
        onBack={() => setShowLessonViewer(false)}
        hasNext={currentLessonIndex < course.lessons.length - 1}
        hasPrevious={currentLessonIndex > 0}
        progress={courseProgress}
      />
    );
  }

  if (!isEnrolled) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">by {course.teacherName}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enrollment Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to enroll in this course to access the lessons.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">by {course.teacherName}</p>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Progress</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedLessons.size} of {course.lessons.length} lessons completed
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${courseProgress}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(courseProgress)}%</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Complete</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedLessons.size}</div>
            <div className="text-sm text-green-800 dark:text-green-200">Lessons Done</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{course.lessons.length - completedLessons.size}</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Remaining</div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Lessons</h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => {
                const status = getLessonStatus(lesson, index);
                const isUnlocked = isLessonUnlocked(index);
                
                return (
                  <div
                    key={lesson.id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      status === 'completed'
                        ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900'
                        : status === 'available'
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900 hover:shadow-md cursor-pointer'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }`}
                    onClick={() => isUnlocked && handleStartLesson(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status === 'completed'
                            ? 'bg-green-600 text-white'
                            : status === 'available'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-400 text-white'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : status === 'available' ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className={`font-medium ${
                            status === 'locked' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {lesson.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{lesson.content.length} items</span>
                            </div>
                            <span className="capitalize">{lesson.type}</span>
                            {lesson.quiz && <span>• Quiz included</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : status === 'available'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {status === 'completed' ? 'Completed' : status === 'available' ? 'Start' : 'Locked'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Lesson {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Course Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Total Duration:</span>
                <span className="font-medium text-gray-900 dark:text-white">{course.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Lessons:</span>
                <span className="font-medium text-gray-900 dark:text-white">{course.lessons.length}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Students:</span>
                <span className="font-medium text-gray-900 dark:text-white">{course.enrolledStudents.length}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Level:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{course.level}</span>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {course.learningObjectives.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Objectives</h3>
              <ul className="space-y-2">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Methodology */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teaching Methods</h3>
            <div className="flex flex-wrap gap-2">
              {course.methodology.map((method, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                >
                  {method.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}