import React, { useState, useCallback } from 'react';
import { Save, Plus, Settings, Eye, Users, BookOpen, Download, FileText, Image as ImageIcon, X } from 'lucide-react';
import { Course, Lesson, LessonContent, Question } from '../../types';
import { DragDropBuilder } from '../DragDrop/DragDropBuilder';
import { MethodologyManager } from './MethodologyManager';
import { ImageUploader } from './ImageUploader';
import { ValidationUtils } from '../../utils/validation';
import { usePermissions } from '../../hooks/usePermissions';
import { v4 as uuidv4 } from 'uuid';

interface CourseBuilderProps {
  course?: Course;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export function CourseBuilder({ course, onSave, onCancel }: CourseBuilderProps) {
  const { canCreateCourse, canEditCourse } = usePermissions();
  const [currentCourse, setCurrentCourse] = useState<Course>(
    course || {
      id: uuidv4(),
      title: '',
      description: '',
      language: 'en',
      teacherId: '',
      teacherName: '',
      level: 'beginner',
      lessons: [],
      enrolledStudents: [],
      thumbnail: '',
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      methodology: [],
      isPublished: false,
      tags: [],
      prerequisites: [],
      learningObjectives: [],
    }
  );

  const [activeTab, setActiveTab] = useState<'details' | 'lessons' | 'settings'>('details');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Extended learning methodologies with management
  const [availableMethodologies, setAvailableMethodologies] = useState([
    { 
      id: 'tpr', 
      label: 'Total Physical Response (TPR)', 
      description: 'Learn through physical movement and gestures',
      icon: '🤸‍♂️',
      category: 'traditional' as const
    },
    { 
      id: 'natural-reading', 
      label: 'Natural Reading', 
      description: 'Graded reading materials with audio support',
      icon: '📚',
      category: 'traditional' as const
    },
    { 
      id: 'joyful-learning', 
      label: 'Joyful Learning', 
      description: 'Gamified and engaging learning experiences',
      icon: '🎮',
      category: 'interactive' as const
    },
    { 
      id: 'immersive-storytelling', 
      label: 'Immersive Storytelling', 
      description: 'Learn through interactive narratives and stories',
      icon: '📖',
      category: 'modern' as const
    },
    { 
      id: 'conversational-practice', 
      label: 'Conversational Practice', 
      description: 'Real-world dialogue simulation and practice',
      icon: '💬',
      category: 'collaborative' as const
    },
    { 
      id: 'visual-learning', 
      label: 'Visual Learning', 
      description: 'Image-based vocabulary and concept learning',
      icon: '🖼️',
      category: 'modern' as const
    },
    { 
      id: 'audio-immersion', 
      label: 'Audio Immersion', 
      description: 'Extensive listening practice with native speakers',
      icon: '🎧',
      category: 'traditional' as const
    },
    { 
      id: 'cultural-integration', 
      label: 'Cultural Integration', 
      description: 'Learn language through cultural context and traditions',
      icon: '🌍',
      category: 'modern' as const
    },
    { 
      id: 'peer-collaboration', 
      label: 'Peer Collaboration', 
      description: 'Group learning and peer-to-peer practice',
      icon: '👥',
      category: 'collaborative' as const
    },
    { 
      id: 'adaptive-learning', 
      label: 'Adaptive Learning', 
      description: 'AI-powered personalized learning paths',
      icon: '🤖',
      category: 'modern' as const
    }
  ]);

  const handleCourseUpdate = (field: string, value: any) => {
    setCurrentCourse(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
  };

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: uuidv4(),
      title: `Lesson ${currentCourse.lessons.length + 1}`,
      content: [],
      order: currentCourse.lessons.length + 1,
      duration: 30,
      type: 'mixed',
      isPublished: false,
      prerequisites: [],
    };

    setCurrentCourse(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson],
    }));

    setSelectedLesson(newLesson.id);
  };

  const handleLessonUpdate = (lessonId: string, updates: Partial<Lesson>) => {
    setCurrentCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      ),
    }));
  };

  const handleLessonContentUpdate = (lessonId: string, content: LessonContent[]) => {
    handleLessonUpdate(lessonId, { content });
  };

  const handleAddLessonContent = (lessonId: string) => {
    const newContent: LessonContent = {
      id: uuidv4(),
      type: 'text',
      content: '',
      order: 1,
    };

    const lesson = currentCourse.lessons.find(l => l.id === lessonId);
    if (lesson) {
      const updatedContent = [...lesson.content, newContent];
      handleLessonUpdate(lessonId, { content: updatedContent });
    }
  };

  const handleSave = () => {
    const validation = ValidationUtils.validateCourse(currentCourse);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSave(currentCourse);
  };

  const handleExportCourse = () => {
    const courseData = JSON.stringify(currentCourse, null, 2);
    const blob = new Blob([courseData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCourse.title.replace(/\s+/g, '-').toLowerCase()}-course.json`;
    a.click();
  };

  const handleImageSelect = useCallback((imageUrl: string) => {
    setCurrentCourse(prev => ({
      ...prev,
      thumbnail: imageUrl,
      updatedAt: new Date(),
    }));
    setShowImageUploader(false);
  }, []);

  const canEdit = course ? canEditCourse(course.id) : canCreateCourse();

  if (!canEdit) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Users className="h-16 w-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to edit this course.</p>
      </div>
    );
  }

  const selectedLessonData = selectedLesson 
    ? currentCourse.lessons.find(l => l.id === selectedLesson)
    : null;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {course ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Build engaging language learning experiences with advanced methodologies
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportCourse}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
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
              <span>Save Course</span>
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

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'details', label: 'Course Details', icon: BookOpen },
            { id: 'lessons', label: 'Lessons & Content', icon: Plus },
            { id: 'settings', label: 'Settings & Publishing', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={currentCourse.title}
                  onChange={(e) => handleCourseUpdate('title', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language *
                </label>
                <select
                  value={currentCourse.language}
                  onChange={(e) => handleCourseUpdate('language', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Description *
              </label>
              <textarea
                value={currentCourse.description}
                onChange={(e) => handleCourseUpdate('description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your course and its learning objectives"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level *
                </label>
                <select
                  value={currentCourse.level}
                  onChange={(e) => handleCourseUpdate('level', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={currentCourse.duration}
                  onChange={(e) => handleCourseUpdate('duration', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={currentCourse.thumbnail}
                    onChange={(e) => handleCourseUpdate('thumbnail', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    onClick={() => setShowImageUploader(!showImageUploader)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    title="Upload Image"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Uploader */}
            {showImageUploader && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Thumbnail Image</h3>
                  <button
                    onClick={() => setShowImageUploader(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ImageUploader 
                  onImageSelect={handleImageSelect}
                  currentImageUrl={currentCourse.thumbnail}
                />
              </div>
            )}

            {/* Thumbnail Preview */}
            {currentCourse.thumbnail && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Preview
                </label>
                <div className="relative w-full max-w-md h-48 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <img 
                    src={currentCourse.thumbnail} 
                    alt="Course thumbnail" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Methodology Manager */}
            <MethodologyManager
              methodologies={availableMethodologies}
              onMethodologiesChange={setAvailableMethodologies}
              selectedMethodologies={currentCourse.methodology}
              onSelectionChange={(selected) => handleCourseUpdate('methodology', selected)}
            />
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lessons List */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lessons</h3>
                <button
                  onClick={handleAddLesson}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>

              <div className="space-y-2">
                {currentCourse.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLesson === lesson.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{lesson.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lesson.content.length} content items • {lesson.duration} min
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">#{index + 1}</div>
                    </div>
                  </button>
                ))}

                {currentCourse.lessons.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No lessons created yet</p>
                    <p className="text-sm">Click "Add" to create your first lesson</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Editor */}
            <div className="lg:col-span-2">
              {selectedLessonData ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edit Lesson: {selectedLessonData.title}
                    </h3>
                    <button
                      onClick={() => setSelectedLesson(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lesson Title
                      </label>
                      <input
                        type="text"
                        value={selectedLessonData.title}
                        onChange={(e) => handleLessonUpdate(selectedLessonData.id, { title: e.target.value })}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lesson Type
                      </label>
                      <select
                        value={selectedLessonData.type}
                        onChange={(e) => handleLessonUpdate(selectedLessonData.id, { type: e.target.value as any })}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="reading">Reading</option>
                        <option value="writing">Writing</option>
                        <option value="speaking">Speaking</option>
                        <option value="listening">Listening</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <DragDropBuilder
                    type="lesson"
                    items={selectedLessonData.content}
                    onItemsChange={(items) => handleLessonContentUpdate(selectedLessonData.id, items as LessonContent[])}
                    onAddItem={() => handleAddLessonContent(selectedLessonData.id)}
                  />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Select a lesson to edit</p>
                  <p>Choose a lesson from the list to start editing its content</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentCourse.isPublished}
                      onChange={(e) => handleCourseUpdate('isPublished', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published (visible to students)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={currentCourse.tags.join(', ')}
                  onChange={(e) => handleCourseUpdate('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="grammar, vocabulary, conversation"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prerequisites (comma-separated)
              </label>
              <input
                type="text"
                value={currentCourse.prerequisites.join(', ')}
                onChange={(e) => handleCourseUpdate('prerequisites', e.target.value.split(',').map(req => req.trim()).filter(Boolean))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Basic English, Alphabet knowledge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Objectives (one per line)
              </label>
              <textarea
                value={currentCourse.learningObjectives.join('\n')}
                onChange={(e) => handleCourseUpdate('learningObjectives', e.target.value.split('\n').filter(Boolean))}
                rows={6}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Students will be able to introduce themselves&#10;Students will learn basic greetings&#10;Students will understand simple conversations"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}