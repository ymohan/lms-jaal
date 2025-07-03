import React, { useState } from 'react';
import { LandingHeader } from '../../components/Landing/LandingHeader';
import { LandingFooter } from '../../components/Landing/LandingFooter';
import { Home } from './Home';
import { About } from './About';
import { LandingCourses } from './LandingCourses';
import { Contact } from './Contact';

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState('home');

  const handleGetStarted = () => {
    onLoginClick();
  };

  const handleViewCourses = () => {
    setCurrentPage('courses');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            onGetStarted={handleGetStarted}
            onViewCourses={handleViewCourses}
          />
        );
      case 'about':
        return <About />;
      case 'courses':
        return <LandingCourses onGetStarted={handleGetStarted} />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <Home 
            onGetStarted={handleGetStarted}
            onViewCourses={handleViewCourses}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <LandingHeader
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLoginClick={onLoginClick}
      />
      
      <main>
        {renderCurrentPage()}
      </main>
      
      <LandingFooter />
    </div>
  );
}