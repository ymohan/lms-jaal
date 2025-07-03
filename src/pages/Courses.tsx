import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Edit, Trash2, Eye, Play, FileQuestion } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import { CourseCard } from '../components/Cards/CourseCard';
import { CourseBuilder } from '../components/Course/CourseBuilder';
import { CourseViewer } from '../components/Course/CourseViewer';
import { CoursePlayer } from '../components/Learning/CoursePlayer';
import { QuizComponent } from '../components/Learning/QuizComponent';
import { QuizBuilder } from '../components/Quiz/QuizBuilder';
import { Course, Quiz } from '../types';
import { SecurityUtils } from '../utils/security';
import { courseAPI, quizAPI, enrollmentAPI, completionAPI } from '../api';
import { socket } from '../api';

interface CoursesProps {
  currentView?: string;
  editData?: any;
}

export function Courses({ currentView = 'courses', editData }: CoursesProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { canCreateCourse, canEditCourse, canDeleteCourse } = usePermissions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedMethodology, setSelectedMethodology] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(currentView === 'create-course');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses and completions
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await courseAPI.getAllCourses();
        setCourses(response.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCompletions = async () => {
      if (user?.role === 'student') {
        try {
          const response = await completionAPI.getUserCompletions();
          setCompletions(response.completions);
        } catch (error) {
          console.error('Error fetching completions:', error);
        }
      }
    };

    fetchCourses();
    fetchCompletions();
  }, [user]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    socket.on('courseUpdate', (course: Course) => {
      setCourses((prevCourses) => {
        const index = prevCourses.findIndex((c) => c._id === course._id);
        if (index >= 0) {
          const updatedCourses = [...prevCourses];
          updatedCourses[index] = course;
          return updatedCourses;
        } else {
          return [...prevCourses, course];
        }
      });
    });

    socket.on('courseDelete', (courseId: string) => {
      setCourses((prevCourses) => prevCourses.filter((c) => c._id !== courseId));
      if (viewingCourse?._id === courseId) setViewingCourse(null);
    });

    socket.on('progressUpdate', (completion: any) => {
      setCompletions((prevCompletions) => {
        const index = prevCompletions.findIndex(
          (c) => c.courseId === completion.courseId && c.userId === completion.userId
        );
        if (index >= 0) {
          const updatedCompletions = [...prevCompletions];
          updatedCompletions[index] = completion;
          return updatedCompletions;
        } else {
          return [...prevCompletions, completion];
        }
      });
    });

    socket.on('quizUpdate', (quiz: Quiz) => {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === quiz.courseId
            ? {
                ...course,
                lessons: course.lessons.map((lesson) =>
                  lesson.quiz?.id === quiz.id ? { ...lesson, quiz } : lesson
                ),
              }
            : course
        )
      );
    });

    return () => {
      socket.off('courseUpdate');
      socket.off('courseDelete');
      socket.off('progressUpdate');
      socket.off('quizUpdate');
    };
  }, [viewingCourse]);

  // Handle edit data from dashboard navigation
  useEffect(() => {
    if (editData?.courseId) {
      const course = courses.find((c) => c._id === editData.courseId);
      if (course) {
        if (editData.action === 'edit' && canEditCourse(course._id)) {
          setEditingCourse(course);
          setViewingCourse(null);
          setShowCreateModal(false);
          setPlayingCourse(null);
        } else if (editData.action === 'view') {
          setViewingCourse(course);
          setEditingCourse(null);
          setShowCreateModal(false);
          setPlayingCourse(null);
        }
      }
    }
  }, [editData, canEditCourse, courses]);

  // Handle view changes
  useEffect(() => {
    if (currentView === 'create-course') {
      setShowCreateModal(true);
      setEditingCourse(null);
      setViewingCourse(null);
      setPlayingCourse(null);
    } else {
      setShowCreateModal(false);
    }
  }, [currentView]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesLanguage = !selectedLanguage || course.language === selectedLanguage;
    const matchesMethodology = !selectedMethodology || course.methodology.includes(selectedMethodology);
    
    if (user?.role === 'student') {
      return matchesSearch && matchesLevel && matchesLanguage && matchesMethodology && course.isPublished;
    }
    if (user?.role === 'teacher') {
      return matchesSearch && matchesLevel && matchesLanguage && matchesMethodology && course.teacherId === user.id;
    }
    return matchesSearch && matchesLevel && matchesLanguage && matchesMethodology;
  });

  const handleCreateCourse = () => {
    if (!canCreateCourse()) {
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'unauthorized_course_create',
        resource: 'course',
        success: false,
      });
      return;
    }
    setShowCreateModal(true);
    setEditingCourse(null);
    setViewingCourse(null);
    setPlayingCourse(null);
  };

  const handleCreateQuiz = () => {
    setEditingQuiz(null);
    setSelectedLessonId(null);
    setShowQuizBuilder(true);
    setShowQuiz(false);
  };

  const handleEditCourse = (course: Course) => {
    if (!canEditCourse(course._id)) {
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'unauthorized_course_edit',
        resource: 'course',
        success: false,
        details: { courseId: course._id },
      });
      return;
    }
    setEditingCourse(course);
    setShowCreateModal(false);
    setViewingCourse(null);
    setPlayingCourse(null);
  };

  const handleEditQuiz = (quiz: Quiz, lessonId?: string) => {
    setEditingQuiz(quiz);
    setSelectedLessonId(lessonId || null);
    setShowQuizBuilder(true);
    setShowQuiz(false);
  };

  const handleDeleteQuiz = async (quizId: string, lessonId?: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        await quizAPI.deleteQuiz(quizId);
        socket.emit('quizDelete', quizId);
        alert('Quiz deleted successfully!');
        setShowQuiz(false);
        setShowQuizBuilder(false);
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz.');
      }
    }
  };

  const handleViewCourse = (course: Course) => {
    setViewingCourse(course);
    setEditingCourse(null);
    setShowCreateModal(false);
    setPlayingCourse(null);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!canDeleteCourse(courseId)) {
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'unauthorized_course_delete',
        resource: 'course',
        success: false,
        details: { courseId },
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setIsDeleting(courseId);
      try {
        await courseAPI.deleteCourse(courseId);
        socket.emit('courseDelete', courseId);
        SecurityUtils.logSecurityEvent({
          userId: user?.id,
          action: 'course_deleted',
          resource: 'course',
          success: true,
          details: { courseId },
        });
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSaveCourse = async (course: Course) => {
    try {
      let response;
      if (editingCourse) {
        response = await courseAPI.updateCourse(editingCourse._id, course);
      } else {
        response = await courseAPI.createCourse(course);
      }
      
      socket.emit('courseUpdate', response.course);
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: editingCourse ? 'course_updated' : 'course_created',
        resource: 'course',
        success: true,
        details: { courseId: response.course._id },
      });
      alert('Course saved successfully!');
      setShowCreateModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course.');
    }
  };

  const handleSaveQuiz = async (quiz: Quiz) => {
    try {
      let response;
      if (editingQuiz) {
        response = await quizAPI.updateQuiz(editingQuiz.id, quiz);
      } else {
        response = await quizAPI.createQuiz({ ...quiz, lessonId: selectedLessonId });
      }
      
      socket.emit('quizUpdate', response.quiz);
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: editingQuiz ? 'quiz_updated' : 'quiz_created',
        resource: 'quiz',
        success: true,
        details: { quizId: quiz.id, lessonId: selectedLessonId },
      });
      alert('Quiz saved successfully!');
      setShowQuizBuilder(false);
      setEditingQuiz(null);
      setSelectedLessonId(null);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz.');
    }
  };

  const handleCancelEdit = () => {
    setShowCreateModal(false);
    setEditingCourse(null);
    setViewingCourse(null);
    setPlayingCourse(null);
    setShowQuizBuilder(false);
    setEditingQuiz(null);
    setSelectedLessonId(null);
  };

  const handleStartCourse = async (course: Course) => {
    if (user?.role === 'student') {
      setPlayingCourse(course);
      setViewingCourse(null);
      setEditingCourse(null);
      setShowCreateModal(false);
      try {
        await completionAPI.updateCompletion({ courseId: course._id, progress: 0 });
      } catch (error) {
        console.error('Error starting course:', error);
      }
    } else {
      handleViewCourse(course);
    }
  };

  const handleTakeQuiz = async (course: Course, lessonId?: string) => {
    const lesson = lessonId ? course.lessons.find((l) => l.id === lessonId) : course.lessons[0];
    if (lesson?.quiz) {
      setSelectedCourse(course);
      setSelectedLessonId(lessonId || lesson.id);
      setShowQuiz(true);
      setShowQuizBuilder(false);
    } else {
      try {
        const response = await quizAPI.getQuizById(course._id);
        if (response.quiz) {
          setSelectedCourse(course);
          setSelectedLessonId(lessonId || lesson?.id || null);
          setShowQuiz(true);
          setShowQuizBuilder(false);
        } else {
          alert('No quiz available for this lesson.');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        alert('No quiz available for this lesson.');
      }
    }
  };

  const handleQuizComplete = async (score: number) => {
    setShowQuiz(false);
    setSelectedCourse(null);
    setSelectedLessonId(null);
    const message = score >= 70
      ? `Congratulations! You scored ${score}% and passed the quiz!`
      : `You scored ${score}%. You need 70% to pass. Keep practicing!`;
    alert(message);
    if (score >= 70 && selectedCourse) {
      try {
        await completionAPI.updateCompletion({ 
          courseId: selectedCourse._id, 
          progress: 100,
          score
        });
      } catch (error) {
        console.error('Error updating completion:', error);
      }
    }
  };

  const handleEnrollCourse = async (course: Course) => {
    try {
      await enrollmentAPI.enrollInCourse(course._id);
      alert(`Successfully enrolled in: ${course.title}`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course.');
    }
  };

  const handleStartLesson = async (lessonId: string) => {
    alert(`Starting lesson: ${lessonId}`);
    if (selectedCourse) {
      try {
        const completion = completions.find((c) => c.courseId === selectedCourse._id);
        const progress = completion?.progress || 0;
        await completionAPI.updateCompletion({ 
          courseId: selectedCourse._id, 
          lessonId,
          progress: Math.min(progress + 10, 100) 
        });
      } catch (error) {
        console.error('Error updating lesson progress:', error);
      }
    }
  };

  // Show course player if playing a course
  if (playingCourse) {
    return (
      <CoursePlayer
        course={playingCourse}
        onBack={() => setPlayingCourse(null)}
      />
    );
  }

  // Show quiz builder if creating or editing quiz
  if (showQuizBuilder) {
    return (
      <QuizBuilder
        quiz={editingQuiz || undefined}
        lessonId={selectedLessonId || undefined}
        onSave={handleSaveQuiz}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Show course builder if creating or editing
  if (showCreateModal || editingCourse) {
    return (
      <CourseBuilder
        course={editingCourse || undefined}
        onSave={handleSaveCourse}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Show course viewer if viewing a course
  if (viewingCourse) {
    return (
      <CourseViewer
        course={viewingCourse}
        onBack={() => setViewingCourse(null)}
        onEdit={() => handleEditCourse(viewingCourse)}
        onDelete={() => handleDeleteCourse(viewingCourse._id)}
        onEnroll={() => handleEnrollCourse(viewingCourse)}
        onStartLesson={handleStartLesson}
        isDeleting={isDeleting === viewingCourse._id}
      />
    );
  }

  // Show quiz if selected
  if (showQuiz && selectedCourse) {
    const lesson = selectedLessonId
      ? selectedCourse.lessons.find((l) => l.id === selectedLessonId)
      : selectedCourse.lessons[0];
    
    if (lesson?.quiz) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse.title}</h1>
            <div className="flex space-x-2">
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <>
                  <button
                    onClick={() => handleEditQuiz(lesson.quiz!, lesson.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Quiz</span>
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(lesson.quiz!.id, lesson.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Quiz</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setShowQuiz(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Back to Course
              </button>
            </div>
          </div>
          <QuizComponent
            quiz={lesson.quiz}
            onComplete={handleQuizComplete}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('courses')}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {user?.role === 'student'
              ? 'Discover and enroll in courses'
              : user?.role === 'teacher'
              ? 'Manage your courses'
              : 'All platform courses'}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              List
            </button>
          </div>

          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <>
              <button
                onClick={handleCreateQuiz}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-sm"
              >
                <FileQuestion className="h-4 w-4" />
                <span>Create Quiz</span>
              </button>
              <button
                onClick={handleCreateCourse}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>{t('createCourse')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, teachers, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Levels</option>
              <option value="beginner">{t('beginner')}</option>
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
            </select>
            
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
            </select>

            <select
              value={selectedMethodology}
              onChange={(e) => setSelectedMethodology(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Methods</option>
              <option value="tpr">TPR</option>
              <option value="natural-reading">Natural Reading</option>
              <option value="joyful-learning">Joyful Learning</option>
              <option value="immersive-storytelling">Immersive Storytelling</option>
              <option value="conversational-practice">Conversational Practice</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-300">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Course Grid/List */}
      {!isLoading && !error && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course._id} className="relative group">
                <CourseCard
                  course={course}
                  userRole={user?.role}
                  onStart={() => handleStartCourse(course)}
                  onManage={() => handleViewCourse(course)}
                />
                
                {(user?.role === 'admin' || (user?.role === 'teacher' && course.teacherId === user.id)) && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleViewCourse(course)}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="View Course"
                      >
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      {course.lessons[0]?.quiz && (
                        <button
                          onClick={() => handleTakeQuiz(course, course.lessons[0].id)}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                          title="Take Quiz"
                        >
                          <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </button>
                      )}
                      {canDeleteCourse(course._id) && (
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          disabled={isDeleting === course._id}
                          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Course"
                        >
                          {isDeleting === course._id ? (
                            <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <div key={course._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{course.teacherName}</span>
                          <span>•</span>
                          <span>{course.level}</span>
                          <span>•</span>
                          <span>{course.duration} min</span>
                          <span>•</span>
                          <span>{course.enrolledStudents?.length || 0} students</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {user?.role === 'student' && (
                        <button
                          onClick={() => handleStartCourse(course)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Learning
                        </button>
                      )}
                      
                      {(user?.role === 'teacher' || user?.role === 'admin') && (
                        <>
                          <button
                            onClick={() => handleViewCourse(course)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="View Course"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Edit Course"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          {course.lessons[0]?.quiz && (
                            <button
                              onClick={() => handleTakeQuiz(course, course.lessons[0].id)}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Take Quiz"
                            >
                              <Play className="h-5 w-5" />
                            </button>
                          )}
                          {canDeleteCourse(course._id) && (
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              disabled={isDeleting === course._id}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Course"
                            >
                              {isDeleting === course._id ? (
                                <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {!isLoading && !error && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm ? 'Try adjusting your search terms or filters' : 'No courses match your current filters'}
          </p>
          {canCreateCourse() && (
            <button
              onClick={handleCreateCourse}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t('createCourse')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}