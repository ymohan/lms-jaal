import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LinguaLearn
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                Courses
              </Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Master Languages with <span className="text-blue-600 dark:text-blue-400">Revolutionary Methods</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Experience accelerated language learning through TPR, immersive storytelling, and joyful learning methodologies.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link to="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link to="/courses" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                  Explore courses
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
              Our Teaching Methodologies
            </h2>
            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🤸‍♂️</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Physical Response</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                      Learn through physical movement and gestures, making language acquisition natural and memorable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Natural Reading</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                      Develop reading skills through graded materials with audio support and comprehension exercises.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎮</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Joyful Learning</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                      Gamified experiences that make learning fun, engaging, and highly motivating.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-between">
            <p className="text-base text-gray-500 dark:text-gray-400">
              &copy; 2025 LinguaLearn. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}