import React from 'react';
import { Users, Target, Award, Globe, BookOpen, Lightbulb, Heart, Zap } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest quality in education and continuously improve our methods.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about languages and helping people connect across cultures.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new technologies and methodologies to enhance learning experiences.',
    },
    {
      icon: Globe,
      title: 'Inclusivity',
      description: 'We believe language learning should be accessible to everyone, everywhere.',
    },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'PhD in Applied Linguistics with 15+ years in language education research.',
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Head of Curriculum',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former university professor specializing in second language acquisition.',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Director of Technology',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Expert in educational technology and AI-powered learning systems.',
    },
    {
      name: 'James Rodriguez',
      role: 'Head of Student Success',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Dedicated to ensuring every student achieves their language learning goals.',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'LinguaLearn was established with a vision to revolutionize language education.',
    },
    {
      year: '2021',
      title: 'First 1,000 Students',
      description: 'Reached our first milestone of 1,000 active learners across 3 languages.',
    },
    {
      year: '2022',
      title: 'TPR Integration',
      description: 'Successfully integrated Total Physical Response methodology into our platform.',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to serve students in over 50 countries worldwide.',
    },
    {
      year: '2024',
      title: 'AI-Powered Learning',
      description: 'Launched adaptive learning algorithms for personalized education paths.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white landing-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            About LinguaLearn
          </h1>
          <p className="text-xl lg:text-2xl text-blue-100">
            We're on a mission to make language learning accessible, effective, and enjoyable 
            for everyone through innovative teaching methodologies and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="landing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                At LinguaLearn, we believe that language is the bridge that connects cultures, 
                opens opportunities, and enriches lives. Our mission is to break down language 
                barriers by providing world-class education that adapts to each learner's unique needs.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We combine scientifically-proven methodologies like Total Physical Response (TPR), 
                Natural Reading, and Joyful Learning with modern technology to create an immersive, 
                effective, and enjoyable learning experience.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Expert Teachers</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">100+</div>
                    <div className="text-sm text-blue-100">Courses</div>
                  </div>
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm text-blue-100">Countries</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm text-blue-100">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">3x</div>
                    <div className="text-sm text-blue-100">Faster Learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="landing-section bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              These core values guide everything we do and shape the way we approach 
              language education and student success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="landing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              Our diverse team of educators, technologists, and language experts is 
              dedicated to creating the best learning experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="landing-section bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">
              From a small startup to a global platform, here are the key milestones 
              that have shaped LinguaLearn's evolution.
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-section hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Be part of a global community of language learners and start your 
            journey to fluency today.
          </p>
          <button className="cta-button">
            Start Learning Now
          </button>
        </div>
      </section>
    </div>
  );
}