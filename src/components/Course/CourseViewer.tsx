import React, { useState } from 'react';
import { ArrowLeft, Play, BookOpen, Users, Clock, Award, Edit, Trash2, Eye, Star, Download } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onEnroll?: () => void;
  onStartLesson?: (lessonId: string) => void;
  isDeleting?: boolean;
}

export function CourseViewer({ 
  course, 
  onBack, 
  onEdit, 
  onDelete, 
  onEnroll, 
  onStartLesson,
  isDeleting = false
}: CourseViewerProps) {
  const { user } = useAuth();
  const { canEditCourse, canDeleteCourse } = usePermissions();
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'students' | 'analytics'>('overview');

  const isEnrolled = course.enrolledStudents.includes(user?.id || '');
  const canManage = user?.role === 'admin' || (user?.role === 'teacher' && course.teacherId === user.id);

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

    return course.methodology.map((method) => {
      const methodInfo = methodologyLabels[method as keyof typeof methodologyLabels] || { label: method, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
      return (
        <span
          key={method}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${methodInfo.color}`}
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

  const handleDownloadCourse = () => {
    const courseData = JSON.stringify(course, null, 2);
    const blob = new Blob([courseData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title.replace(/\s+/g, '-').toLowerCase()}-course.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            By {course.teacherName} • {course.enrolledStudents.length} students enrolled
          </p>
        </div>
        
        {canManage && (
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadCourse}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            {canEditCourse(course.id) && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Course</span>
              </button>
            )}
            {canDeleteCourse(course.id) && (
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Course Hero */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Course Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                {course.language.toUpperCase()}
              </span>
              {course.isPublished && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-100 backdrop-blur-sm">
                  <Award className="h-3 w-3 mr-1" />
                  Published
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-6 text-white text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons.length} lessons</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents.length} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Actions */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {getMethodologyBadges()}
            </div>
            
            <div className="flex space-x-3">
              {user?.role === 'student' && !isEnrolled && (
                <button
                  onClick={onEnroll}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Enroll Now
                </button>
              )}
              {user?.role === 'student' && isEnrolled && (
                <button
                  onClick={() => onStartLesson?.(course.lessons[0]?.id)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Continue Learning</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'lessons', label: 'Lessons' },
              ...(canManage ? [
                { id: 'students', label: 'Students' },
                { id: 'analytics', label: 'Analytics' }
              ] : [])
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.description}</p>
              </div>

              {course.learningObjectives.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.prerequisites.map((prerequisite, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                      >
                        {prerequisite}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {course.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Lessons</h3>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{lesson.duration} min</span>
                            <span>{lesson.content.length} content items</span>
                            <span className="capitalize">{lesson.type}</span>
                            {lesson.quiz && <span>• Quiz included</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {(isEnrolled || canManage) && (
                          <button
                            onClick={() => onStartLesson?.(lesson.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>Start</span>
                          </button>
                        )}
                        {canManage && (
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && canManage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enrolled Students ({course.enrolledStudents.length})
                </h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Students
                </button>
              </div>
              
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Student management interface would go here</p>
                <p className="text-sm">Show enrolled students, progress, and performance</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && canManage && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Completion Rate</h4>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">78%</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Average completion</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Average Score</h4>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">85%</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Quiz performance</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Study Time</h4>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">2.5h</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Average per student</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}