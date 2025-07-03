import React from 'react';
import { TrendingUp, Award, Clock, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Progress() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-green-600">+1 this month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">7 days</p>
              <p className="text-sm text-blue-600">Keep it up!</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold text-gray-900">45h</p>
              <p className="text-sm text-purple-600">+8h this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Quiz Score</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-orange-600">+5% improvement</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Courses</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">English for Beginners</h3>
              <span className="text-sm text-gray-500">75% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Lesson 6 of 8</span>
              <span>Next: Grammar Basics</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Hindi Grammar</h3>
              <span className="text-sm text-gray-500">45% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Lesson 3 of 7</span>
              <span>Next: Verb Conjugation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-medium text-gray-900">First Course</h3>
            <p className="text-sm text-gray-600">Completed your first course</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="font-medium text-gray-900">Week Streak</h3>
            <p className="text-sm text-gray-600">7 days of continuous learning</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-medium text-gray-900">Quiz Master</h3>
            <p className="text-sm text-gray-600">Scored 90%+ on 5 quizzes</p>
          </div>
        </div>
      </div>

      {/* Learning Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity</h2>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          <div className="font-medium text-gray-600 py-2">Mon</div>
          <div className="font-medium text-gray-600 py-2">Tue</div>
          <div className="font-medium text-gray-600 py-2">Wed</div>
          <div className="font-medium text-gray-600 py-2">Thu</div>
          <div className="font-medium text-gray-600 py-2">Fri</div>
          <div className="font-medium text-gray-600 py-2">Sat</div>
          <div className="font-medium text-gray-600 py-2">Sun</div>
          
          {/* Calendar days with activity indicators */}
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded flex items-center justify-center text-xs ${
                Math.random() > 0.7
                  ? 'bg-green-200 text-green-800'
                  : Math.random() > 0.5
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-gray-600">High activity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span className="text-gray-600">Some activity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span className="text-gray-600">No activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}