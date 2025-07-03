import React, { useState } from 'react';
import { Search, Filter, UserPlus, Edit, Trash2, Eye, Mail, Phone, BookOpen, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SecurityUtils } from '../utils/security';

export function Teachers() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [viewingTeacher, setViewingTeacher] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock teacher data
  const [teachers, setTeachers] = useState([
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@lingualearn.com',
      phone: '+91 98765 43210',
      specialization: ['English', 'Hindi'],
      coursesCreated: 8,
      studentsEnrolled: 156,
      rating: 4.8,
      joinedDate: '2023-01-15',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      bio: 'Experienced language educator with 10+ years in multilingual instruction.',
      location: 'Mumbai, India',
      education: 'PhD in Applied Linguistics',
      experience: '12 years',
      certifications: ['TESOL', 'CELTA', 'Hindi Teaching Certificate'],
      status: 'active',
    },
    {
      id: '2',
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.kumar@lingualearn.com',
      phone: '+91 87654 32109',
      specialization: ['Tamil', 'English'],
      coursesCreated: 5,
      studentsEnrolled: 89,
      rating: 4.6,
      joinedDate: '2023-03-20',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      bio: 'Tamil language specialist with expertise in cultural integration methods.',
      location: 'Chennai, India',
      education: 'MA in Tamil Literature',
      experience: '8 years',
      certifications: ['Tamil Teaching Certificate', 'Cultural Studies Diploma'],
      status: 'active',
    },
    {
      id: '3',
      name: 'Ms. Anita Patel',
      email: 'anita.patel@lingualearn.com',
      phone: '+91 98765 12345',
      specialization: ['Hindi', 'English'],
      coursesCreated: 6,
      studentsEnrolled: 124,
      rating: 4.9,
      joinedDate: '2023-02-10',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      bio: 'Passionate educator specializing in innovative teaching methodologies.',
      location: 'Ahmedabad, India',
      education: 'MA in Education',
      experience: '15 years',
      certifications: ['Advanced Teaching Methods', 'Digital Learning Specialist'],
      status: 'active',
    },
  ]);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    education: '',
    experience: '',
    specialization: [],
    certifications: [],
    status: 'active',
  });

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialization = !selectedSpecialization || 
                                 teacher.specialization.some(spec => spec.toLowerCase().includes(selectedSpecialization.toLowerCase()));
    
    return matchesSearch && matchesSpecialization;
  });

  const handleViewTeacher = (teacher: any) => {
    setViewingTeacher(teacher);
    setEditingTeacher(null);
    setShowAddForm(false);
  };

  const handleEditTeacher = (teacher: any) => {
    setEditingTeacher({ ...teacher });
    setViewingTeacher(null);
    setShowAddForm(false);
  };

  const handleAddTeacher = () => {
    setShowAddForm(true);
    setViewingTeacher(null);
    setEditingTeacher(null);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      education: '',
      experience: '',
      specialization: [],
      certifications: [],
      status: 'active',
    });
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      setIsLoading(true);
      
      setTimeout(() => {
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        setIsLoading(false);
        
        SecurityUtils.logSecurityEvent({
          userId: user?.id,
          action: 'teacher_deleted',
          resource: 'user',
          success: true,
          details: { teacherId },
        });
        
        alert('Teacher deleted successfully!');
      }, 500);
    }
  };

  const handleSaveTeacher = (updatedTeacher: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setTeachers(prev => prev.map(t => 
        t.id === updatedTeacher.id ? updatedTeacher : t
      ));
      setEditingTeacher(null);
      setIsLoading(false);
      
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'teacher_updated',
        resource: 'user',
        success: true,
        details: { teacherId: updatedTeacher.id },
      });
      
      alert('Teacher updated successfully!');
    }, 500);
  };

  const handleCreateTeacher = () => {
    if (!newTeacher.name || !newTeacher.email) {
      alert('Please fill in required fields (Name and Email)');
      return;
    }

    if (!SecurityUtils.validateEmail(newTeacher.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const teacher = {
        ...newTeacher,
        id: Date.now().toString(),
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
        joinedDate: new Date().toISOString().split('T')[0],
        coursesCreated: 0,
        studentsEnrolled: 0,
        rating: 0,
      };
      
      setTeachers(prev => [...prev, teacher]);
      setShowAddForm(false);
      setIsLoading(false);
      
      SecurityUtils.logSecurityEvent({
        userId: user?.id,
        action: 'teacher_created',
        resource: 'user',
        success: true,
        details: { teacherEmail: newTeacher.email },
      });
      
      alert('Teacher added successfully!');
    }, 500);
  };

  const handleGoBack = () => {
    if (viewingTeacher || editingTeacher || showAddForm) {
      setViewingTeacher(null);
      setEditingTeacher(null);
      setShowAddForm(false);
    } else {
      window.history.back();
    }
  };

  const canManageTeachers = user?.role === 'admin';

  // Add Teacher Form
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Teacher</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create a new teacher account
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
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
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
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
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
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
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
                  value={newTeacher.location}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  value={newTeacher.education}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, education: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., PhD in Applied Linguistics"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 10 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTeacher.specialization.join(', ')}
                  onChange={(e) => setNewTeacher(prev => ({ 
                    ...prev, 
                    specialization: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., English, Hindi, Tamil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={newTeacher.bio}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Tell us about the teacher..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                <select
                  value={newTeacher.status}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, status: e.target.value }))}
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
              onClick={handleCreateTeacher}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Adding...' : 'Add Teacher'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Profile View
  if (viewingTeacher) {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Profile</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View and manage teacher information
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={viewingTeacher.avatar}
                  alt={viewingTeacher.name}
                  className="w-20 h-20 rounded-full border-4 border-white/30"
                />
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{viewingTeacher.name}</h1>
                  <p className="text-green-100">Teacher</p>
                  <p className="text-green-200 text-sm">{viewingTeacher.email}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-300">★</span>
                    <span className="ml-1 font-medium">{viewingTeacher.rating}</span>
                  </div>
                </div>
              </div>
              {canManageTeachers && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTeacher(viewingTeacher)}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(viewingTeacher.id)}
                    className="bg-red-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
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
                      <span className="text-gray-600 dark:text-gray-400">{viewingTeacher.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{viewingTeacher.phone}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{viewingTeacher.location}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{viewingTeacher.experience}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Education:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{viewingTeacher.education}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bio</h3>
                  <p className="text-gray-600 dark:text-gray-400">{viewingTeacher.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingTeacher.certifications.map((cert: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teaching Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{viewingTeacher.coursesCreated}</div>
                      <div className="text-sm text-green-800 dark:text-green-200">Courses Created</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{viewingTeacher.studentsEnrolled}</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">Students Enrolled</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingTeacher.specialization.map((spec: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">Created new course</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">Updated lesson content</span>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Edit Form
  if (editingTeacher) {
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Teacher</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Update teacher information and settings
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
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editingTeacher.location}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  value={editingTeacher.education}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, education: e.target.value }))}
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
                  value={editingTeacher.bio}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience (years)
                </label>
                <input
                  type="text"
                  value={editingTeacher.experience}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specializations
                </label>
                <input
                  type="text"
                  value={editingTeacher.specialization.join(', ')}
                  onChange={(e) => setEditingTeacher(prev => ({ 
                    ...prev, 
                    specialization: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                  placeholder="e.g., English, Hindi, Tamil"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                <select
                  value={editingTeacher.status}
                  onChange={(e) => setEditingTeacher(prev => ({ ...prev, status: e.target.value }))}
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
              onClick={() => handleSaveTeacher(editingTeacher)}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage teacher accounts and monitor their performance
          </p>
        </div>
        
        {canManageTeachers && (
          <button 
            onClick={handleAddTeacher}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Teacher</span>
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
              placeholder="Search teachers by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Specializations</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="tamil">Tamil</option>
            </select>
            
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{teacher.name}</h3>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <span className="text-sm">★</span>
                  <span className="text-sm font-medium">{teacher.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{teacher.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="h-4 w-4" />
                <span>Specializes in: {teacher.specialization.join(', ')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teacher.coursesCreated}</div>
                <div className="text-sm text-blue-800 dark:text-blue-200">Courses</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{teacher.studentsEnrolled}</div>
                <div className="text-sm text-green-800 dark:text-green-200">Students</div>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Joined: {new Date(teacher.joinedDate).toLocaleDateString()}
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => handleViewTeacher(teacher)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>View Profile</span>
              </button>
              {canManageTeachers && (
                <>
                  <button 
                    onClick={() => handleEditTeacher(teacher)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <UserPlus className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No teachers found</p>
            <p>Try adjusting your search terms or filters</p>
            {canManageTeachers && (
              <button
                onClick={handleAddTeacher}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Teacher
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}