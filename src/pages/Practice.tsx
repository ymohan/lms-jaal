import React, { useState } from 'react';
import { Play, Mic, BookOpen, PenTool, Headphones, Target, ArrowLeft } from 'lucide-react';

export function Practice() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const skills = [
    {
      id: 'reading',
      name: 'Reading',
      icon: BookOpen,
      color: 'blue',
      description: 'Improve comprehension with graded texts',
      exercises: 12,
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: PenTool,
      color: 'green',
      description: 'Practice grammar and composition',
      exercises: 8,
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: Mic,
      color: 'purple',
      description: 'Pronunciation and conversation practice',
      exercises: 15,
    },
    {
      id: 'listening',
      name: 'Listening',
      icon: Headphones,
      color: 'orange',
      description: 'Audio comprehension exercises',
      exercises: 10,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 border-blue-200',
      green: 'bg-green-500 text-green-600 border-green-200',
      purple: 'bg-purple-500 text-purple-600 border-purple-200',
      orange: 'bg-orange-500 text-orange-600 border-orange-200',
    };
    return colors[color as keyof typeof colors];
  };

  const handleGoBack = () => {
    if (selectedSkill) {
      setSelectedSkill(null);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {selectedSkill && (
          <button
            onClick={handleGoBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Practice Modules</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Strengthen your language skills with targeted exercises
          </p>
        </div>
      </div>

      {!selectedSkill ? (
        <>
          {/* Skill Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill) => {
              const Icon = skill.icon;
              const colorClasses = getColorClasses(skill.color);
              
              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill.id)}
                  className={`text-left p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500`}
                >
                  <div className={`w-12 h-12 ${colorClasses.split(' ')[0]}/10 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${colorClasses.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{skill.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{skill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {skill.exercises} exercises
                    </span>
                    <Play className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Practice Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {skills.map((skill) => {
                const progress = Math.floor(Math.random() * 100);
                return (
                  <div key={skill.id} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-gray-200 dark:text-gray-600"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={`${progress * 1.76} 176`}
                          className={getColorClasses(skill.color).split(' ')[1]}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{progress}%</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{skill.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{skill.exercises} completed</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Practice Content */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {skills.find(s => s.id === selectedSkill)?.name} Practice
            </h2>
          </div>

          {selectedSkill === 'reading' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Reading Comprehension</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The sun was setting over the mountains, painting the sky in brilliant shades of orange and pink. 
                    Maria stood on the balcony of her small apartment, watching the day slowly fade into night. 
                    She had lived in this city for three years now, but the beauty of the sunset never failed to amaze her.
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Questions:</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="q1" className="text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Maria has lived in the city for 2 years</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="q1" className="text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Maria has lived in the city for 3 years</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="q1" className="text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Maria has lived in the city for 4 years</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSkill === 'writing' && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Writing Exercise</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Write a short paragraph (50-100 words) describing your daily routine.
                </p>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Start writing here..."
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Word count: 0/100</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedSkill === 'speaking' && (
            <div className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Pronunciation Practice</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Click the microphone and repeat the following phrase:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700 mb-4">
                  <p className="text-lg font-medium text-center text-gray-900 dark:text-white">"The quick brown fox jumps over the lazy dog"</p>
                </div>
                <div className="text-center">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto">
                    <Mic className="h-5 w-5" />
                    <span>Start Recording</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedSkill === 'listening' && (
            <div className="space-y-6">
              <div className="bg-orange-50 dark:bg-orange-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">Listening Comprehension</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Listen to the audio clip and answer the questions below:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700 mb-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button className="bg-orange-600 text-white p-3 rounded-full hover:bg-orange-700 transition-colors">
                      <Play className="h-6 w-6" />
                    </button>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full w-1/3"></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">0:45 / 2:30</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">What was the main topic discussed?</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="listening" className="text-orange-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Weather forecast</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="listening" className="text-orange-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Travel plans</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="listening" className="text-orange-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Restaurant review</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}