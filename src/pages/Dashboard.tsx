import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StatsGrid } from '../components/Dashboard/StatsGrid';
import { CourseCard } from '../components/Cards/CourseCard';
import { mockCourses } from '../data/mockData';
import { BookOpen, TrendingUp, Award, Users, Plus, BarChart3, Settings, UserPlus, Eye } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getRecentCourses = () => {
    if (user?.role === 'student') {
      return mockCourses.filter(course => 
        course.enrolledStudents.includes(user.id)
      ).slice(0, 3);
    }
    if (user?.role === 'teacher') {
      return mockCourses.filter(course => 
        course.teacherId === user.id
      ).slice(0, 3);
    }
    return mockCourses.slice(0, 3);
  };

  const recentCourses = getRecentCourses();

  const getDashboardTitle = () => {
    if (user?.role === 'admin') return 'Admin Dashboard';
    if (user?.role === 'teacher') return 'Teacher Dashboard';
    return 'My Learning Dashboard';
  };

  const handleQuickAction = (action: string, data?: any) => {
    // Dispatch custom events to trigger navigation
    const event = new CustomEvent('navigate', { 
      detail: { 
        page: action,
        ...data
      } 
    });
    window.dispatchEvent(event);
  };

  const getQuickActions = () => {
    if (user?.role === 'admin') {
      return [
        { 
          id: 'students',
          title: 'Manage Users', 
          icon: Users, 
          color: 'blue', 
          description: 'Add or edit user accounts',
          onClick: () => handleQuickAction('students')
        },
        { 
          id: 'analytics',
          title: 'View Analytics', 
          icon: BarChart3, 
          color: 'green', 
          description: 'View platform statistics',
          onClick: () => handleQuickAction('analytics')
        },
        { 
          id: 'settings',
          title: 'System Settings', 
          icon: Settings, 
          color: 'purple', 
          description: 'Configure platform settings',
          onClick: () => handleQuickAction('settings')
        },
      ];
    }
    if (user?.role === 'teacher') {
      return [
        { 
          id: 'create-course',
          title: 'Create Course', 
          icon: Plus, 
          color: 'blue', 
          description: 'Start a new course',
          onClick: () => handleQuickAction('courses', { view: 'create' })
        },
        { 
          id: 'analytics',
          title: 'View Analytics', 
          icon: BarChart3, 
          color: 'green', 
          description: 'Track student progress',
          onClick: () => handleQuickAction('analytics')
        },
        { 
          id: 'students',
          title: 'My Students', 
          icon: Users, 
          color: 'purple', 
          description: 'Manage your students',
          onClick: () => handleQuickAction('students')
        },
      ];
    }
    return [
      { 
        id: 'courses',
        title: 'Browse Courses', 
        icon: BookOpen, 
        color: 'blue', 
        description: 'Discover new courses',
        onClick: () => handleQuickAction('courses')
      },
      { 
        id: 'practice',
        title: 'Practice Skills', 
        icon: TrendingUp, 
        color: 'green', 
        description: 'Strengthen your abilities',
        onClick: () => handleQuickAction('practice')
      },
      { 
        id: 'certificates',
        title: 'View Certificates', 
        icon: Award, 
        color: 'purple', 
        description: 'See your achievements',
        onClick: () => handleQuickAction('certificates')
      },
    ];
  };

  const quickActions = getQuickActions();

  const handleCourseAction = (courseId: string, action: 'start' | 'manage') => {
    if (action === 'start') {
      // For students, navigate to courses to start learning
      handleQuickAction('courses');
    } else {
      // For teachers/admins, navigate to course management with specific course
      handleQuickAction('courses', { courseId, action: 'view' });
    }
  };

  const handleViewAllCourses = () => {
    handleQuickAction('courses');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t('welcome')}, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{getDashboardTitle()}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString(user?.language === 'hi' ? 'hi-IN' : user?.language === 'ta' ? 'ta-IN' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid userRole={user?.role || 'student'} />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-500 text-blue-600 hover:bg-blue-600',
              green: 'bg-green-500 text-green-600 hover:bg-green-600',
              purple: 'bg-purple-500 text-purple-600 hover:bg-purple-600',
            };
            const colorClass = colorClasses[action.color as keyof typeof colorClasses];
            
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${colorClass.split(' ')[0]}/10 dark:${colorClass.split(' ')[0]}/20 rounded-lg flex items-center justify-center group-hover:${colorClass.split(' ')[2]} transition-colors`}>
                    <Icon className={`h-5 w-5 ${colorClass.split(' ')[1]} dark:${colorClass.split(' ')[1]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{action.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user?.role === 'student' ? 'Continue Learning' : user?.role === 'teacher' ? 'My Courses' : 'Recent Courses'}
          </h2>
          <button 
            onClick={handleViewAllCourses}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1"
          >
            <span>View All</span>
            <Eye className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {recentCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              userRole={user?.role}
              onStart={() => handleCourseAction(course.id, 'start')}
              onManage={() => handleCourseAction(course.id, 'manage')}
            />
          ))}
        </div>
        
        {recentCourses.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {user?.role === 'student' ? 'No enrolled courses yet' : 'No courses created yet'}
            </p>
            <button
              onClick={() => handleQuickAction(user?.role === 'student' ? 'courses' : 'courses', { view: 'create' })}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {user?.role === 'student' ? 'Browse Courses' : 'Create Course'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}