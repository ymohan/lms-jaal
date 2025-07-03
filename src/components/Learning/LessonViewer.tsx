import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX, CheckCircle, BookOpen, Clock, Target } from 'lucide-react';
import { Lesson, LessonContent } from '../../types';
import { QuizComponent } from './QuizComponent';

interface LessonViewerProps {
  lesson: Lesson;
  courseTitle: string;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onBack: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  progress: number;
}

export function LessonViewer({
  lesson,
  courseTitle,
  onComplete,
  onNext,
  onPrevious,
  onBack,
  hasNext,
  hasPrevious,
  progress
}: LessonViewerProps) {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lessonStartTime] = useState(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentContent = lesson.content[currentContentIndex];
  const isLastContent = currentContentIndex === lesson.content.length - 1;
  const allContentCompleted = completedContent.size === lesson.content.length;

  useEffect(() => {
    // Auto-mark text content as completed after 3 seconds
    if (currentContent?.type === 'text') {
      const timer = setTimeout(() => {
        markContentCompleted(currentContent.id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentContent]);

  const markContentCompleted = (contentId: string) => {
    setCompletedContent(prev => new Set([...prev, contentId]));
  };

  const handleNextContent = () => {
    if (currentContent) {
      markContentCompleted(currentContent.id);
    }
    
    if (isLastContent) {
      if (lesson.quiz && !showQuiz) {
        setShowQuiz(true);
      } else if (allContentCompleted) {
        handleLessonComplete();
      }
    } else {
      setCurrentContentIndex(prev => prev + 1);
    }
  };

  const handlePreviousContent = () => {
    if (showQuiz) {
      setShowQuiz(false);
    } else if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    }
  };

  const handleLessonComplete = () => {
    const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
    console.log(`Lesson completed in ${timeSpent} seconds`);
    onComplete();
  };

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz completed with score: ${score}%`);
    setShowQuiz(false);
    handleLessonComplete();
  };

  const playAudio = (audioUrl: string) => {
    // Clean up any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.muted = isMuted;
    audio.play().catch(e => console.log('Audio play failed:', e));
    setIsPlaying(true);
    
    audio.onended = () => {
      setIsPlaying(false);
      markContentCompleted(currentContent.id);
    };
  };

  const toggleAudioPlayback = () => {
    if (!currentContent.audioUrl) return;
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAudio(currentContent.audioUrl);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Determine if the next button should be enabled
  const canProceedToNext = () => {
    if (!currentContent) return false;
    
    // For text content, we auto-mark as completed after 3 seconds
    if (currentContent.type === 'text') {
      return completedContent.has(currentContent.id);
    }
    
    // For audio content, enable next button regardless of completion
    if (currentContent.type === 'audio') {
      return true;
    }
    
    // For other content types, check if completed
    return completedContent.has(currentContent.id);
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {content.content}
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="text-center space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Audio Content</h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">{content.content}</p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={toggleAudioPlayback}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
                </button>
                <button
                  onClick={toggleMute}
                  className="p-3 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-4 text-sm text-blue-700 dark:text-blue-300">
                {isPlaying ? 'Playing audio...' : 'Click play to listen'}
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="text-center space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Video Content</h3>
              <p className="text-purple-800 dark:text-purple-200 mb-4">{content.content}</p>
              {content.videoUrl ? (
                <video
                  controls
                  className="w-full max-w-2xl mx-auto rounded-lg"
                  onEnded={() => markContentCompleted(content.id)}
                >
                  <source src={content.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="bg-purple-100 dark:bg-purple-800 rounded-lg p-8">
                  <Play className="h-16 w-16 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
                  <p className="text-purple-700 dark:text-purple-300">Video content would be displayed here</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Visual Learning</h3>
              <p className="text-green-800 dark:text-green-200 mb-4">{content.content}</p>
              {content.imageUrl ? (
                <img
                  src={content.imageUrl}
                  alt="Learning content"
                  className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                  onLoad={() => markContentCompleted(content.id)}
                />
              ) : (
                <div className="bg-green-100 dark:bg-green-800 rounded-lg p-8">
                  <BookOpen className="h-16 w-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
                  <p className="text-green-700 dark:text-green-300">Visual content would be displayed here</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'tpr-activity':
        return (
          <div className="text-center space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">TPR Activity</h3>
              <p className="text-orange-800 dark:text-orange-200 mb-4">{content.content}</p>
              <div className="bg-orange-100 dark:bg-orange-800 rounded-lg p-6 mb-4">
                <p className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Action: {content.metadata?.tprAction}
                </p>
                <p className="text-orange-700 dark:text-orange-300">
                  Perform this action and click "I Did It!" when complete
                </p>
              </div>
              <button
                onClick={() => markContentCompleted(content.id)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                I Did It! ✋
              </button>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="text-center space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Interactive Exercise</h3>
              <p className="text-indigo-800 dark:text-indigo-200 mb-4">{content.content}</p>
              <div className="bg-indigo-100 dark:bg-indigo-800 rounded-lg p-6">
                <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                  Interactive content would be displayed here
                </p>
                <button
                  onClick={() => markContentCompleted(content.id)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Complete Exercise
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">{content.content}</p>
          </div>
        );
    }
  };

  if (showQuiz && lesson.quiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowQuiz(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title} - Quiz</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{courseTitle}</p>
            </div>
          </div>
        </div>
        <QuizComponent
          quiz={lesson.quiz}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{courseTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Content {currentContentIndex + 1} of {lesson.content.length}
          </div>
          {completedContent.has(currentContent?.id || '') && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lesson Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round((completedContent.size / lesson.content.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedContent.size / lesson.content.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[400px]">
        {currentContent && renderContent(currentContent)}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousContent}
          disabled={currentContentIndex === 0 && !showQuiz}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration} min lesson</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Target className="h-4 w-4" />
            <span>{lesson.type} lesson</span>
          </div>
        </div>

        <button
          onClick={handleNextContent}
          disabled={!canProceedToNext()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>
            {isLastContent && allContentCompleted
              ? lesson.quiz
                ? 'Take Quiz'
                : 'Complete Lesson'
              : 'Next'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Lesson Navigation */}
      {(hasNext || hasPrevious) && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous Lesson</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext || !allContentCompleted}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next Lesson</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}