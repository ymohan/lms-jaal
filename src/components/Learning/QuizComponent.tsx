import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Volume2, Mic, ArrowLeft, RotateCcw } from 'lucide-react';
import { Quiz, Question } from '../../types';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export function QuizComponent({ quiz, onComplete, onBack }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit || 0);
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    if (quiz.timeLimit && timeLeft > 0 && quizStarted && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz.timeLimit && quizStarted) {
      handleQuizComplete();
    }
  }, [timeLeft, quizStarted, showResults]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(quiz.timeLimit || 0);
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizComplete = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);
    setQuizStarted(false);
    onComplete(calculatedScore);
  };

  const handleRetakeQuiz = () => {
    if (attemptCount < quiz.attempts) {
      setAttemptCount(attemptCount + 1);
      setQuizStarted(false);
      setShowResults(false);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeLeft(quiz.timeLimit || 0);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (Array.isArray(question.correctAnswer)) {
        if (Array.isArray(userAnswer) && 
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every(ans => question.correctAnswer.includes(ans))) {
          correct += question.points;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct += question.points;
        }
      }
    });
    
    return totalPoints > 0 ? Math.round((correct / totalPoints) * 100) : 0;
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, implement actual speech recognition
    setTimeout(() => {
      setIsRecording(false);
      // Mock answer for demo
      handleAnswer(currentQuestion.id, 'recorded_answer');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      'mcq': 'Multiple Choice',
      'fill-blank': 'Fill in the Blank',
      'audio': 'Audio Question',
      'tpr': 'TPR Activity',
      'speaking': 'Speaking Exercise',
      'matching': 'Matching',
      'ordering': 'Ordering',
      'essay': 'Essay Question'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Quiz Start Screen
  if (!quizStarted && !showResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {quiz.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {quiz.description}
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{totalQuestions}</div>
                <div className="text-gray-500 dark:text-gray-400">Questions</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {quiz.timeLimit ? formatTime(quiz.timeLimit) : 'No limit'}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Time Limit</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{quiz.passingScore}%</div>
                <div className="text-gray-500 dark:text-gray-400">Passing Score</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {attemptCount} / {quiz.attempts}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Attempts</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 justify-center">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const passed = score >= quiz.passingScore;
    const canRetake = attemptCount < quiz.attempts;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {passed ? (
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Complete!
          </h2>
          
          <div className="text-4xl font-bold mb-4">
            <span className={passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {score}%
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {passed 
              ? 'Congratulations! You passed the quiz.' 
              : `You need ${quiz.passingScore}% to pass. ${canRetake ? 'You can try again!' : 'No more attempts remaining.'}`
            }
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <span className="text-gray-500 dark:text-gray-400">Score:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{score}%</div>
              </div>
              <div className="text-center">
                <span className="text-gray-500 dark:text-gray-400">Correct:</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {Math.round((score / 100) * quiz.questions.length)} / {quiz.questions.length}
                </div>
              </div>
              <div className="text-center">
                <span className="text-gray-500 dark:text-gray-400">Attempt:</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {attemptCount} / {quiz.attempts}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 justify-center">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Course</span>
              </button>
            )}
            {canRetake && (
              <button
                onClick={handleRetakeQuiz}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        
        {quiz.timeLimit && (
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs font-medium">
                {getQuestionTypeLabel(currentQuestion.type)}
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                {currentQuestion.points} points
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h3>
          </div>
          {currentQuestion.audioUrl && (
            <button
              onClick={() => playAudio(currentQuestion.audioUrl)}
              className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Question Types */}
        {currentQuestion.type === 'mcq' && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'fill-blank' && (
          <input
            type="text"
            placeholder="Type your answer here..."
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        )}

        {currentQuestion.type === 'speaking' && (
          <div className="text-center">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isRecording
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
              }`}
            >
              <Mic className="h-5 w-5" />
              <span>{isRecording ? 'Recording...' : 'Start Recording'}</span>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Click to record your answer (3 seconds)
            </p>
          </div>
        )}

        {currentQuestion.type === 'tpr' && (
          <div className="text-center bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
            <p className="text-lg text-purple-800 dark:text-purple-200 mb-4">
              Perform this action: <strong>{currentQuestion.metadata?.tprAction}</strong>
            </p>
            <button
              onClick={() => handleAnswer(currentQuestion.id, currentQuestion.metadata?.tprAction || '')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              I performed the action
            </button>
          </div>
        )}

        {currentQuestion.type === 'essay' && (
          <textarea
            placeholder="Write your essay answer here..."
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={handleNextQuestion}
          disabled={!answers[currentQuestion.id]}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}