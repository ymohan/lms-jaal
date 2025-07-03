import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { Progress } from './pages/Progress';
import { Certificates } from './pages/Certificates';
import { Practice } from './pages/Practice';
import { Calendar } from './pages/Calendar';
import { Messages } from './pages/Messages';
import { Reports } from './pages/Reports';
import { Security } from './pages/Security';
import { Help } from './pages/Help';
import { Profile } from './pages/Profile';
import { SystemStatus } from './pages/SystemStatus';
import { SecurityUtils } from './utils/security';

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseEditData, setCourseEditData] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  // Listen for navigation events from dashboard quick actions
  useEffect(() => {
    const handleNavigate = (event: any) => {
      const { page, courseId, action, view } = event.detail;
      
      console.log('Navigation event received:', { page, courseId, action, view });
      
      // Handle course creation specifically
      if (page === 'courses' && view === 'create') {
        setCurrentPage('create-course');
        setCourseEditData(null);
        return;
      }
      
      // Handle course viewing/editing
      if (page === 'courses' && courseId && action) {
        setCurrentPage('courses');
        setCourseEditData({ courseId, action });
        return;
      }
      
      // Regular navigation - directly set the page
      if (page) {
        console.log('Setting current page to:', page);
        setCurrentPage(page);
        setSidebarOpen(false); // Close mobile sidebar
        
        // Clear course edit data for other pages
        if (page !== 'courses') {
          setCourseEditData(null);
        }
      }
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Security check for page access
  const handlePageChange = (page: string) => {
    if (!user) return;

    console.log('Page change requested:', page);

    // Log page navigation for security monitoring
    SecurityUtils.logSecurityEvent({
      userId: user.id,
      action: 'page_navigation',
      resource: 'navigation',
      success: true,
      details: { from: currentPage, to: page },
    });

    setCurrentPage(page);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleBackToLanding = () => {
    setShowLogin(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading LinguaLearn...</p>
        </div>
      </div>
    );
  }

  // Show login form if requested
  if (showLogin && !user) {
    return <LoginForm onSuccess={handleLoginSuccess} onBack={handleBackToLanding} />;
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage onLoginClick={handleLoginClick} />;
  }

  const renderCurrentPage = () => {
    console.log('Rendering page:', currentPage);
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses currentView="courses" editData={courseEditData} />;
      case 'create-course':
        return <Courses currentView="create-course" />;
      case 'browse-courses':
        return <Courses currentView="browse-courses" />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'progress':
        return <Progress />;
      case 'certificates':
        return <Certificates />;
      case 'practice':
        return <Practice />;
      case 'calendar':
        return <Calendar />;
      case 'messages':
        return <Messages />;
      case 'reports':
        return <Reports />;
      case 'security':
        return <Security />;
      case 'help':
        return <Help />;
      case 'profile':
        return <Profile />;
      case 'system-status':
        return <SystemStatus />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={true}
        onProfileClick={() => handlePageChange('profile')}
      />
      
      <div className="flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
        <Sidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {renderCurrentPage()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;