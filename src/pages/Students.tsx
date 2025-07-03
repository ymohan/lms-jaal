import React, { useState } from 'react';
import { Search, Filter, UserPlus, Edit, Trash2, Eye, Mail, Phone, ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SecurityUtils } from '../utils/security';

export function Students() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock student data
  const [students, setStudents] = useState([
    {
      id: '1',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      enrolledCourses: ['English for Beginners'],
      progress: 75,
      lastActive: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinedDate: '2023-06-15',
      totalLessons: 24,
      completedLessons: 18,
      certificates: 2,
      bio: 'Enthusiastic language learner passionate about English communication.',
      location: 'Mumbai, India',
      dateOfBirth: '1995-03-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      enrolledCourses: ['Hindi Grammar', 'Tamil Introduction'],
      progress: 60,
      lastActive: '1 day ago',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinedDate: '2023-08-20',
      totalLessons: 32,
      completedLessons: 19,
      certificates: 1,
      bio: 'Learning multiple languages to connect with diverse cultures.',
      location: 'Delhi, India',
      dateOfBirth: '1992-11-08',
      status: 'active',
    },
    {
      id: '3',
      name: 'Amit Singh',
      email: 'amit@example.com',
      phone: '+91 76543 21098',
      enrolledCourses: ['English for Beginners', 'Hindi Grammar'],
      progress: 85,
      lastActive: '3 hours ago',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
      joinedDate: '2023-05-10',
      totalLessons: 28,
      completedLessons: 24,
      certificates: 3,
      bio: 'Professional looking to improve communication skills.',
      location: 'Bangalore, India',
      dateOfBirth: '1988-07-22',
      status: 'active',
    },
  ]);

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    dateOfBirth: '',
    enrolledCourses: [],
    status: 'active',
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.enrolledCourses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCourse = !selectedCourse || student.enrolledCourses.some(course => 
      course.toLowerCase().includes(selectedCourse.toLowerCase())
    );
    
    return matchesSearch && matchesCourse;
  });

  const handleViewStudent = (student: any) => {
    setViewingStudent(student);
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent({ ...student });
    setViewingStudent(null);
    setShowAddForm(false);
  };

  const handleAddStudent = () => {
    setShowAddForm(true);
    setViewingStudent(null);
    setEditingStudent(null);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      dateOfBirth: '',
      enrolledCourses: [],
      status: 'active',
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      setIsLoading(true);
      
      setTimeout(() => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setIsLoading(false);
        
        SecurityUtils.logSecurityEvent({
          userId: user?.id,
          action: 'student_deleted',
          resource: 'user',
          success: true,
          details: { studentId },
        });
        
        alert('Student deleted successfully!');
      }, 500);
    }
  };

  const handleSaveStudent = (updatedStudent: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setStudents(prev => prev.map(s => 
        s.id === updatedStudent.id ? updatedStudent : s
      ));
      setEditingStudent(null);
      setIsLoading(false);
      
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'student_updated',
        resource: 'user',
        success: true,
        details: { studentId: updatedStudent.id },
      });
      
      alert('Student updated successfully!');
    }, 500);
  };

  const handleCreateStudent = () => {
    if (!newStudent.name || !newStudent.email) {
      alert('Please fill in required fields (Name and Email)');
      return;
    }

    if (!SecurityUtils.validateEmail(newStudent.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const student = {
        ...newStudent,
        id: Date.now().toString(),
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
        joinedDate: new Date().toISOString().split('T')[0],
        progress: 0,
        lastActive: 'Just joined',
        totalLessons: 0,
        completedLessons: 0,
        certificates: 0,
      };
      
      setStudents(prev => [...prev, student]);
      setShowAddForm(false);
      setIsLoading(false);
      
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'student_created',
        resource: 'user',
        success: true,
        details: { studentEmail: newStudent.email },
      });
      
      alert('Student added successfully!');
    }, 500);
  };

  const handleGoBack = () => {
    if (viewingStudent || editingStudent || showAddForm) {
      setViewingStudent(null);
      setEditingStudent(null);
      setShowAddForm(false);
    } else {
      window.history.back();
    }
  };

  const canManageStudents = user?.role === 'admin' || user?.role === 'teacher';

  // Add Student Form
  if (showAddForm) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Student</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create a new student account
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newStudent.location}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={newStudent.bio}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Tell us about the student..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                <select
                  value={newStudent.status}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStudent}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Adding...' : 'Add Student'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student Profile View
  if (viewingStudent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View and manage student information
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={viewingStudent.avatar}
                  alt={viewingStudent.name}
                  className="w-20 h-20 rounded-full border-4 border-white/30"
                />
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{viewingStudent.name}</h1>
                  <p className="text-blue-100">Student</p>
                  <p className="text-blue-200 text-sm">{viewingStudent.email}</p>
                </div>
              </div>
              {canManageStudents && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditStudent(viewingStudent)}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteStudent(viewingStudent.id)}
                      className="bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{viewingStudent.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{viewingStudent.phone}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{viewingStudent.location}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Joined:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {new Date(viewingStudent.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        viewingStudent.status === 'active' ? 'bg-green-100 text-green-800' :
                        viewingStudent.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {viewingStudent.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bio</h3>
                  <p className="text-gray-600 dark:text-gray-400">{viewingStudent.bio}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{viewingStudent.progress}%</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">Overall Progress</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{viewingStudent.certificates}</div>
                      <div className="text-sm text-green-800 dark:text-green-200">Certificates</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enrolled Courses</h3>
                  <div className="space-y-2">
                    {viewingStudent.enrolledCourses.map((course: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-900 dark:text-white">{course}</span>
                        <span className="text-sm text-gray-500">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Edit Form
  if (editingStudent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGoBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Student</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Update student information and settings
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editingStudent.phone}
                  onChange={(e) => setEditingStudent(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editingStudent.location}
                  onChange={(e) => setEditingStudent(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={editingStudent.bio}
                  onChange={(e) => setEditingStudent(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                <select
                  value={editingStudent.status}
                  onChange={(e) => setEditingStudent(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveStudent(editingStudent)}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'admin' ? 'All Students' : 'My Students'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage student accounts and track their progress
          </p>
        </div>
        
        {canManageStudents && (
          <button 
            onClick={handleAddStudent}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Courses</option>
              <option value="english">English for Beginners</option>
              <option value="hindi">Hindi Grammar</option>
              <option value="tamil">Tamil Introduction</option>
            </select>
            
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Enrolled in: {student.enrolledCourses.join(', ')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{student.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div>Last active</div>
                    <div>{student.lastActive}</div>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <button
                      onClick={() => handleViewStudent(student)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {canManageStudents && (
                      <>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Edit Student"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <UserPlus className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No students found</p>
            <p>Try adjusting your search terms or filters</p>
            {canManageStudents && (
              <button
                onClick={handleAddStudent}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Student
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}