import React from 'react';
import { ArrowRight, Play, BookOpen, Users, Award, Star, CheckCircle, Globe, Zap, Target } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
  onViewCourses: () => void;
}

export function Home({ onGetStarted, onViewCourses }: HomeProps) {
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description: 'Engage with dynamic content through TPR, storytelling, and immersive experiences.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Expert Teachers',
      description: 'Learn from certified language instructors with years of teaching experience.',
      color: 'green',
    },
    {
      icon: Globe,
      title: 'Multiple Languages',
      description: 'Master English, Hindi, Tamil, and more with our comprehensive curriculum.',
      color: 'purple',
    },
    {
      icon: Zap,
      title: 'Accelerated Learning',
      description: 'Advanced methodologies designed to help you learn faster and retain more.',
      color: 'orange',
    },
    {
      icon: Target,
      title: 'Personalized Path',
      description: 'Adaptive learning that adjusts to your pace and learning style.',
      color: 'pink',
    },
    {
      icon: Award,
      title: 'Certified Progress',
      description: 'Earn recognized certificates as you complete courses and milestones.',
      color: 'indigo',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Learners' },
    { number: '50+', label: 'Expert Teachers' },
    { number: '100+', label: 'Courses Available' },
    { number: '95%', label: 'Success Rate' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'LinguaLearn transformed my English speaking skills. The TPR methodology made learning so natural and fun!',
      rating: 5,
    },
    {
      name: 'Rajesh Kumar',
      role: 'Business Analyst',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'The interactive storytelling approach helped me master Hindi grammar in just 3 months. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Anita Patel',
      role: 'Teacher',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'As an educator myself, I appreciate the innovative teaching methods. The platform is truly revolutionary.',
      rating: 5,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      pink: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
      indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white landing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
                Master Languages with
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Revolutionary Methods
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 animate-fade-in">
                Experience accelerated language learning through TPR, immersive storytelling, 
                and joyful learning methodologies designed for the modern learner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
                <button
                  onClick={onGetStarted}
                  className="cta-button flex items-center justify-center space-x-2"
                >
                  <span>Start Learning Today</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={onViewCourses}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-white/30 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
            
            <div className="relative animate-float">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="stat-number">{stat.number}</div>
                      <div className="text-blue-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose LinguaLearn?</h2>
            <p className="section-subtitle">
              Our innovative approach combines proven methodologies with cutting-edge technology 
              to deliver an unparalleled language learning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = getColorClasses(feature.color);
              
              return (
                <div key={index} className="feature-card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className={`w-12 h-12 ${colorClasses} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodologies Section */}
      <section className="landing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Teaching Methodologies</h2>
            <p className="section-subtitle">
              Experience language learning through scientifically-proven methods that make 
              learning natural, engaging, and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤸‍♂️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Total Physical Response (TPR)
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Learn through movement and gestures, making language acquisition natural and memorable.
              </p>
              <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Proven Effective</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Natural Reading
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Develop reading skills through graded materials with audio support and comprehension exercises.
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Research-Based</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Joyful Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Gamified experiences that make learning fun, engaging, and highly motivating.
              </p>
              <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Highly Engaging</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="landing-section bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Learners Say</h2>
            <p className="section-subtitle">
              Join thousands of successful language learners who have transformed their 
              communication skills with LinguaLearn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of learners who are already mastering new languages with our 
            innovative platform. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="cta-button flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onViewCourses}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-white/30"
            >
              Explore Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}