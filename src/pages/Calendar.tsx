import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, Users, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Calendar() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock events
  const events = [
    {
      id: '1',
      title: 'English Grammar Class',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'class',
      participants: 15,
    },
    {
      id: '2',
      title: 'Hindi Pronunciation Workshop',
      date: '2024-01-16',
      time: '2:00 PM',
      type: 'workshop',
      participants: 8,
    },
    {
      id: '3',
      title: 'Tamil Reading Session',
      date: '2024-01-17',
      time: '11:00 AM',
      type: 'session',
      participants: 12,
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Schedule' : 'Calendar'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'student' 
              ? 'View your upcoming classes and sessions'
              : 'Manage classes and schedule events'
            }
          </p>
        </div>
        
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Schedule Event</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`p-2 text-center text-sm cursor-pointer rounded-lg transition-colors ${
                  day
                    ? 'hover:bg-gray-100'
                    : ''
                } ${
                  day === new Date().getDate() &&
                  selectedDate.getMonth() === new Date().getMonth() &&
                  selectedDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-blue-600 text-white'
                    : day
                    ? 'text-gray-900'
                    : ''
                }`}
              >
                {day && (
                  <div>
                    <div>{day}</div>
                    {/* Event indicators */}
                    {events.some(event => new Date(event.date).getDate() === day) && (
                      <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Video className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.type === 'class' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'workshop' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">English Grammar Class</h4>
              <p className="text-sm text-gray-600">10:00 AM - 11:00 AM</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
              Join
            </button>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-12 bg-gray-400 rounded-full"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Break</h4>
              <p className="text-sm text-gray-600">11:00 AM - 11:15 AM</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-12 bg-green-600 rounded-full"></div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Hindi Pronunciation Workshop</h4>
              <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}