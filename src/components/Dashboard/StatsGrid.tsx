import React from 'react';
import { BookOpen, Users, GraduationCap, TrendingUp, Award, Clock, Target, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Stat {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
}

interface StatsGridProps {
  userRole: 'admin' | 'teacher' | 'student';
}

export function StatsGrid({ userRole }: StatsGridProps) {
  const { t } = useLanguage();

  const getStats = (): Stat[] => {
    if (userRole === 'admin') {
      return [
        {
          id: 'courses',
          label: t('totalCourses'),
          value: '24',
          change: '+12%',
          changeType: 'increase',
          icon: BookOpen,
          color: 'blue',
        },
        {
          id: 'students',
          label: t('totalStudents'),
          value: '1,234',
          change: '+18%',
          changeType: 'increase',
          icon: Users,
          color: 'green',
        },
        {
          id: 'teachers',
          label: t('totalTeachers'),
          value: '56',
          change: '+8%',
          changeType: 'increase',
          icon: GraduationCap,
          color: 'purple',
        },
        {
          id: 'completion',
          label: t('completionRate'),
          value: '78%',
          change: '+5%',
          changeType: 'increase',
          icon: TrendingUp,
          color: 'orange',
        },
      ];
    }

    if (userRole === 'teacher') {
      return [
        {
          id: 'courses',
          label: 'My Courses',
          value: '6',
          change: '+2',
          changeType: 'increase',
          icon: BookOpen,
          color: 'blue',
        },
        {
          id: 'students',
          label: 'My Students',
          value: '156',
          change: '+12',
          changeType: 'increase',
          icon: Users,
          color: 'green',
        },
        {
          id: 'completion',
          label: 'Avg Completion',
          value: '84%',
          change: '+7%',
          changeType: 'increase',
          icon: TrendingUp,
          color: 'purple',
        },
        {
          id: 'rating',
          label: 'Course Rating',
          value: '4.8',
          change: '+0.2',
          changeType: 'increase',
          icon: Award,
          color: 'orange',
        },
      ];
    }

    // Student stats
    return [
      {
        id: 'enrolled',
        label: 'Enrolled Courses',
        value: '5',
        change: '+2',
        changeType: 'increase',
        icon: BookOpen,
        color: 'blue',
      },
      {
        id: 'completed',
        label: 'Completed',
        value: '2',
        change: '+1',
        changeType: 'increase',
        icon: Award,
        color: 'green',
      },
      {
        id: 'progress',
        label: 'Avg Progress',
        value: '67%',
        change: '+15%',
        changeType: 'increase',
        icon: Target,
        color: 'purple',
      },
      {
        id: 'streak',
        label: 'Learning Streak',
        value: '7 days',
        change: '+2',
        changeType: 'increase',
        icon: Zap,
        color: 'orange',
      },
    ];
  };

  const stats = getStats();

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
      orange: 'bg-orange-500 text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);
        
        return (
          <div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs sm:text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline">vs last month</span>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses.split(' ')[0]}/10 dark:${colorClasses.split(' ')[0]}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ml-3`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClasses.split(' ')[1]} dark:${colorClasses.split(' ')[1]}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}