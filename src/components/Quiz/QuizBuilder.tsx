import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit, Clock, Target, Shuffle, Eye, ArrowLeft } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { DragDropBuilder } from '../DragDrop/DragDropBuilder';
import { ValidationUtils } from '../../utils/validation';
import { usePermissions } from '../../hooks/usePermissions';
import { v4 as uuidv4 } from 'uuid';

interface QuizBuilderProps {
  quiz?: Quiz;
  lessonId?: string;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

export function QuizBuilder({ quiz, lessonId, onSave, onCancel }: QuizBuilderProps) {
  const { canCreateCourse, canEditCourse } = usePermissions();
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(
    quiz || {
      id: uuidv4(),
      title: '',
      description: '',
      questions: [],
      timeLimit: 1800, // 30 minutes default
      passingScore: 70,
      attempts: 3,
      isRandomized: false,
      showResults: true,
    }
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleQuizUpdate = (field: string, value: any) => {
    setCurrentQuiz(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10,
      difficulty: 'easy',
      tags: [],
      order: currentQuiz.questions.length + 1,
    };

    setCurrentQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const handleQuestionUpdate = (questionId: string, updates: Partial<Question>) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const handleQuestionsUpdate = (questions: Question[]) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions,
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setCurrentQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId),
      }));
    }
  };

  const handleSave = () => {
    const validation = ValidationUtils.validateQuiz(currentQuiz);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSave(currentQuiz);
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const canEdit = quiz ? canEditCourse(lessonId || '') : canCreateCourse();

  if (!canEdit) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Target className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to edit quizzes.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Build interactive quizzes to test student knowledge
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Quiz</span>
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mt-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">Please fix the following errors:</h4>
            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quiz Settings */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Settings</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                value={currentQuiz.title}
                onChange={(e) => handleQuizUpdate('title', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter quiz title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={currentQuiz.description}
                onChange={(e) => handleQuizUpdate('description', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe what this quiz covers"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={Math.floor(currentQuiz.timeLimit! / 60)}
                  onChange={(e) => handleQuizUpdate('timeLimit', parseInt(e.target.value) * 60)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                  max="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={currentQuiz.passingScore}
                  onChange={(e) => handleQuizUpdate('passingScore', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Attempts
                </label>
                <input
                  type="number"
                  value={currentQuiz.attempts}
                  onChange={(e) => handleQuizUpdate('attempts', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-3 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentQuiz.isRandomized}
                    onChange={(e) => handleQuizUpdate('isRandomized', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Randomize questions</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentQuiz.showResults}
                    onChange={(e) => handleQuizUpdate('showResults', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show results immediately</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Questions ({currentQuiz.questions.length})
          </h3>
          <button
            onClick={handleAddQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>

        {previewMode ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quiz Preview</h4>
            <div className="space-y-6">
              {currentQuiz.questions.map((question, index) => (
                <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      Question {index + 1}: {question.question}
                    </h5>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {question.points} pts
                    </span>
                  </div>
                  
                  {question.type === 'mcq' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center space-x-2">
                          <input type="radio" name={`preview-${question.id}`} className="text-blue-600" />
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'fill-blank' && (
                    <input
                      type="text"
                      placeholder="Type your answer here..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <DragDropBuilder
            type="quiz"
            items={currentQuiz.questions}
            onItemsChange={handleQuestionsUpdate}
            onAddItem={handleAddQuestion}
          />
        )}

        {currentQuiz.questions.length === 0 && !previewMode && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              No questions added yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Click "Add Question" to get started
            </p>
            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Your First Question
            </button>
          </div>
        )}
      </div>

      {/* Quiz Summary */}
      {currentQuiz.questions.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentQuiz.questions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {currentQuiz.questions.reduce((sum, q) => sum + q.points, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(currentQuiz.timeLimit! / 60)}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Limit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {currentQuiz.passingScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Passing Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}