import React from 'react';
import { Clock, Users, BookOpen, Play, Star, Award } from 'lucide-react';
import { Course } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface CourseCardProps {
  course: Course;
  onStart?: () => void;
  onManage?: () => void;
  userRole?: 'admin' | 'teacher' | 'student';
}

export function CourseCard({ course, onStart, onManage, userRole = 'student' }: CourseCardProps) {
  const { t } = useLanguage();

  const getMethodologyBadges = () => {
    const methodologyLabels = {
      'tpr': { label: 'TPR', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      'natural-reading': { label: 'Natural Reading', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      'joyful-learning': { label: 'Joyful Learning', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'immersive-storytelling': { label: 'Storytelling', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      'conversational-practice': { label: 'Conversation', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
      'visual-learning': { label: 'Visual', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
      'audio-immersion': { label: 'Audio', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      'cultural-integration': { label: 'Cultural', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
      'peer-collaboration': { label: 'Peer Learning', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' },
      'adaptive-learning': { label: 'Adaptive', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    };

    return course.methodology.slice(0, 2).map((method) => {
      const methodInfo = methodologyLabels[method] || { label: method, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
      return (
        <span
          key={method}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${methodInfo.color}`}
        >
          {methodInfo.label}
        </span>
      );
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getProgressPercentage = () => {
    // Mock progress calculation
    return Math.floor(Math.random() * 100);
  };

  const progress = userRole === 'student' ? getProgressPercentage() : null;

  const handleStartClick = () => {
    console.log('Course card start clicked for course:', course.id);
    if (onStart) {
      onStart();
    }
  };

  const handleManageClick = () => {
    console.log('Course card manage clicked for course:', course.id);
    if (onManage) {
      onManage();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Course Level Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {t(course.level)}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium text-gray-900 dark:text-white">4.8</span>
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2">
            {course.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {getMethodologyBadges()}
            {course.methodology.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                +{course.methodology.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>{course.duration} min</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">{course.enrolledStudents.length} students</span>
            <span className="sm:hidden">{course.enrolledStudents.length}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">{course.lessons.length} lessons</span>
            <span className="sm:hidden">{course.lessons.length}</span>
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            By {course.teacherName}
          </div>
          {course.isPublished && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs">Published</span>
            </div>
          )}
        </div>

        {/* Progress Bar for Students */}
        {userRole === 'student' && progress !== null && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-gray-900 dark:text-white font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {userRole === 'student' && (
            <button
              onClick={handleStartClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group text-sm"
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{progress && progress > 0 ? 'Continue' : t('startLearning')}</span>
              <span className="sm:hidden">{progress && progress > 0 ? 'Continue' : 'Start'}</span>
            </button>
          )}
          
          {(userRole === 'teacher' || userRole === 'admin') && (
            <button
              onClick={handleManageClick}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
            >
              Manage Course
            </button>
          )}
        </div>

        {/* Prerequisites */}
        {course.prerequisites.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Prerequisites: {course.prerequisites.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}