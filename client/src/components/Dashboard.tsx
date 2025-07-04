import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LinguaLearn
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/dashboard" className="text-gray-900 dark:text-white px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Courses
              </Link>
              <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
            </nav>
            <div>
              <button
                onClick={logout}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome, {user?.name}!
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  You are logged in as a {user?.role}.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-blue-50 dark:bg-blue-900 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                        My Courses
                      </h3>
                      <div className="mt-2 text-3xl font-semibold text-blue-900 dark:text-blue-100">
                        3
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/courses"
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          View all courses →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                        Progress
                      </h3>
                      <div className="mt-2 text-3xl font-semibold text-green-900 dark:text-green-100">
                        67%
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/progress"
                          className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          View progress →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200">
                        Certificates
                      </h3>
                      <div className="mt-2 text-3xl font-semibold text-purple-900 dark:text-purple-100">
                        2
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/certificates"
                          className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        >
                          View certificates →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <div className="mt-4 bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-600">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Completed Lesson 3
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            English for Beginners
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          2 hours ago
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Started New Course
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Hindi Grammar Basics
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Yesterday
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Earned Certificate
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Tamil Introduction
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          3 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}