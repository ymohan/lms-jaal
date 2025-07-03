import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Award, Clock, Download, FileText, Printer, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Analytics() {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock download functionality
    const data = {
      timeRange: selectedTimeRange,
      metric: selectedMetric,
      generatedAt: new Date().toISOString(),
      data: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${selectedTimeRange}.${format === 'excel' ? 'xlsx' : format}`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  // Comprehensive analytics data
  const analyticsData = {
    overview: {
      totalUsers: 1234,
      totalCourses: 24,
      totalEnrollments: 3456,
      completionRate: 78,
      avgStudyTime: 2.5,
      certificatesIssued: 456
    },
    userMetrics: {
      activeUsers: 890,
      newRegistrations: 123,
      userRetention: 85,
      avgSessionDuration: 45
    },
    courseMetrics: {
      mostPopularCourses: [
        { name: 'English for Beginners', enrollments: 456, completion: 85 },
        { name: 'Hindi Grammar Basics', enrollments: 324, completion: 78 },
        { name: 'Tamil Introduction', enrollments: 198, completion: 72 }
      ].filter(course => 
        !searchTerm || course.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      coursesByLanguage: {
        english: 12,
        hindi: 8,
        tamil: 4
      }
    },
    teacherMetrics: {
      totalTeachers: 56,
      avgCoursesPerTeacher: 3.2,
      avgStudentsPerTeacher: 22,
      topPerformingTeachers: [
        { name: 'Dr. Priya Sharma', courses: 8, students: 156, rating: 4.8 },
        { name: 'Prof. Rajesh Kumar', courses: 5, students: 89, rating: 4.6 }
      ].filter(teacher => 
        !searchTerm || teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    },
    learningMetrics: {
      methodologyUsage: {
        'tpr': 45,
        'natural-reading': 38,
        'joyful-learning': 42,
        'immersive-storytelling': 25,
        'conversational-practice': 33
      },
      skillProgress: {
        reading: 82,
        writing: 75,
        speaking: 68,
        listening: 79
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {user?.role === 'admin' ? 'Comprehensive platform analytics and insights' : 'Your teaching analytics and student progress'}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            
            <div className="relative group">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Download as PDF
                </button>
                <button
                  onClick={() => handleDownloadReport('excel')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Download as Excel
                </button>
                <button
                  onClick={() => handleDownloadReport('csv')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Download as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.completionRate}%</p>
              <p className="text-sm text-green-600 dark:text-green-400">+5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalCourses}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">3 new this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Issued</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.certificatesIssued}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">+23 this week</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar for Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, teachers, or metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Detailed Analytics Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'courses', label: 'Courses' },
              { id: 'teachers', label: 'Teachers' },
              { id: 'learning', label: 'Learning Progress' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedMetric(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedMetric === tab.id
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
          {selectedMetric === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enrollment Trends</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chart visualization would go here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Performance</h3>
                <div className="space-y-4">
                  {analyticsData.courseMetrics.mostPopularCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{course.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{course.enrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">{course.completion}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">completion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedMetric === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Active Users</h4>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.userMetrics.activeUsers}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Currently active</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">New Registrations</h4>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analyticsData.userMetrics.newRegistrations}</div>
                <div className="text-sm text-green-700 dark:text-green-300">This month</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">User Retention</h4>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.userMetrics.userRetention}%</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">30-day retention</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-6">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Avg Session</h4>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analyticsData.userMetrics.avgSessionDuration}min</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Session duration</div>
              </div>
            </div>
          )}

          {selectedMetric === 'courses' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Courses by Language</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">English</span>
                      <span className="font-medium text-gray-900 dark:text-white">{analyticsData.courseMetrics.coursesByLanguage.english}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Hindi</span>
                      <span className="font-medium text-gray-900 dark:text-white">{analyticsData.courseMetrics.coursesByLanguage.hindi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Tamil</span>
                      <span className="font-medium text-gray-900 dark:text-white">{analyticsData.courseMetrics.coursesByLanguage.tamil}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Top Performing Courses</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Course</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Enrollments</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Completion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.courseMetrics.mostPopularCourses.map((course, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 text-sm text-gray-900 dark:text-white">{course.name}</td>
                            <td className="py-2 text-sm text-gray-700 dark:text-gray-300">{course.enrollments}</td>
                            <td className="py-2 text-sm">
                              <span className="text-green-600 dark:text-green-400 font-medium">{course.completion}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMetric === 'teachers' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Total Teachers</h4>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyticsData.teacherMetrics.totalTeachers}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Avg Courses/Teacher</h4>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analyticsData.teacherMetrics.avgCoursesPerTeacher}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Avg Students/Teacher</h4>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.teacherMetrics.avgStudentsPerTeacher}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Top Performing Teachers</h4>
                <div className="space-y-3">
                  {analyticsData.teacherMetrics.topPerformingTeachers.map((teacher, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{teacher.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{teacher.courses} courses • {teacher.students} students</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{teacher.rating} ⭐</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedMetric === 'learning' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Methodology Usage</h4>
                <div className="space-y-3">
                  {Object.entries(analyticsData.learningMetrics.methodologyUsage).map(([method, percentage]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{method.replace('-', ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Skill Progress</h4>
                <div className="space-y-3">
                  {Object.entries(analyticsData.learningMetrics.skillProgress).map(([skill, progress]) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{skill}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}