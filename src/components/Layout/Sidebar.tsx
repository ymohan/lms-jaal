import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Settings,
  Award,
  PlayCircle,
  FileText,
  Shield,
  Calendar,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePermissions } from '../../hooks/usePermissions';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen?: boolean;
}

export function Sidebar({ currentPage, onPageChange, isOpen = true }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { hasPermission } = usePermissions();

  const handleGoBack = () => {
    if (currentPage !== 'dashboard') {
      onPageChange('dashboard');
    } else {
      window.history.back();
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { 
        id: 'dashboard', 
        label: t('dashboard'), 
        icon: LayoutDashboard,
        permission: 'dashboard:view'
      },
      { 
        id: 'courses', 
        label: t('courses'), 
        icon: BookOpen,
        permission: 'course:read'
      },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { 
          id: 'students', 
          label: t('students'), 
          icon: Users,
          permission: 'user:read'
        },
        { 
          id: 'teachers', 
          label: t('teachers'), 
          icon: GraduationCap,
          permission: 'user:read'
        },
        { 
          id: 'analytics', 
          label: t('analytics'), 
          icon: BarChart3,
          permission: 'analytics:view'
        },
        { 
          id: 'certificates', 
          label: 'Certificates', 
          icon: Award,
          permission: 'certificate:manage'
        },
        { 
          id: 'reports', 
          label: 'Reports', 
          icon: FileText,
          permission: 'report:view'
        },
        { 
          id: 'security', 
          label: 'Security', 
          icon: Shield,
          permission: 'security:view'
        },
        { 
          id: 'settings', 
          label: t('settings'), 
          icon: Settings,
          permission: 'system:configure'
        },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { 
          id: 'students', 
          label: 'My Students', 
          icon: Users,
          permission: 'student:read'
        },
        { 
          id: 'analytics', 
          label: t('analytics'), 
          icon: BarChart3,
          permission: 'analytics:view'
        },
        { 
          id: 'certificates', 
          label: 'Certificates', 
          icon: Award,
          permission: 'certificate:issue'
        },
        { 
          id: 'calendar', 
          label: 'Calendar', 
          icon: Calendar,
          permission: 'calendar:view'
        },
        { 
          id: 'messages', 
          label: 'Messages', 
          icon: MessageSquare,
          permission: 'message:read'
        },
      ];
    }

    // Student navigation
    return [
      ...baseItems,
      { 
        id: 'progress', 
        label: 'My Progress', 
        icon: BarChart3,
        permission: 'progress:read'
      },
      { 
        id: 'certificates', 
        label: 'My Certificates', 
        icon: Award,
        permission: 'certificate:download'
      },
      { 
        id: 'practice', 
        label: 'Practice', 
        icon: PlayCircle,
        permission: 'practice:access'
      },
      { 
        id: 'calendar', 
        label: 'Schedule', 
        icon: Calendar,
        permission: 'calendar:view'
      },
      { 
        id: 'messages', 
        label: 'Messages', 
        icon: MessageSquare,
        permission: 'message:read'
      },
      { 
        id: 'help', 
        label: 'Help & Support', 
        icon: HelpCircle,
        permission: 'help:access'
      },
    ];
  };

  const navigationItems = getNavigationItems().filter(item => 
    hasPermission(item.permission.split(':')[0], item.permission.split(':')[1])
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onPageChange(currentPage)}></div>
        <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinguaLearn
              </div>
              <button
                onClick={() => onPageChange(currentPage)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              {currentPage !== 'dashboard' && (
                <div className="px-4 mb-4">
                  <button
                    onClick={handleGoBack}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">Back to Dashboard</span>
                  </button>
                </div>
              )}

              <nav className="px-2 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={`group flex items-center px-3 py-3 text-base font-medium rounded-md transition-all duration-200 w-full text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Quick Actions */}
              <div className="px-4 mt-6">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </div>
                <div className="space-y-2">
                  {user?.role === 'teacher' && (
                    <button
                      onClick={() => onPageChange('create-course')}
                      className="w-full text-left px-3 py-3 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    >
                      + Create Course
                    </button>
                  )}
                  {user?.role === 'student' && (
                    <button
                      onClick={() => onPageChange('browse-courses')}
                      className="w-full text-left px-3 py-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                    >
                      + Browse Courses
                    </button>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => onPageChange('system-status')}
                      className="w-full text-left px-3 py-3 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                    >
                      System Status
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full`}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Back Button */}
          {currentPage !== 'dashboard' && (
            <div className="px-4 mb-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Dashboard</span>
              </button>
            </div>
          )}

          {/* Navigation Header */}
          <div className="px-4 mb-6">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 mt-6">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </div>
            <div className="space-y-2">
              {user?.role === 'teacher' && (
                <button
                  onClick={() => onPageChange('create-course')}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  + Create Course
                </button>
              )}
              {user?.role === 'student' && (
                <button
                  onClick={() => onPageChange('browse-courses')}
                  className="w-full text-left px-3 py-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                >
                  + Browse Courses
                </button>
              )}
              {user?.role === 'admin' && (
                <button
                  onClick={() => onPageChange('system-status')}
                  className="w-full text-left px-3 py-2 text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                >
                  System Status
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* User Role Badge */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {user?.role}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate">
                  {user?.name}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}