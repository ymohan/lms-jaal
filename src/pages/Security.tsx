import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Activity, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Security() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock security data
  const securityLogs = [
    {
      id: '1',
      action: 'Login Success',
      user: 'admin@lms.com',
      timestamp: '2024-01-15 10:30:00',
      ip: '192.168.1.100',
      status: 'success',
    },
    {
      id: '2',
      action: 'Failed Login Attempt',
      user: 'unknown@example.com',
      timestamp: '2024-01-15 09:45:00',
      ip: '203.0.113.1',
      status: 'failed',
    },
    {
      id: '3',
      action: 'Course Created',
      user: 'teacher@lms.com',
      timestamp: '2024-01-15 08:20:00',
      ip: '192.168.1.101',
      status: 'success',
    },
  ];

  const securityMetrics = [
    { label: 'Total Login Attempts', value: '1,234', status: 'normal' },
    { label: 'Failed Logins (24h)', value: '12', status: 'warning' },
    { label: 'Blocked IPs', value: '3', status: 'normal' },
    { label: 'Active Sessions', value: '89', status: 'normal' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Monitor system security and access logs
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                metric.status === 'warning' 
                  ? 'bg-yellow-100 dark:bg-yellow-900/50' 
                  : 'bg-green-100 dark:bg-green-900/50'
              }`}>
                {metric.status === 'warning' ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'logs', label: 'Security Logs', icon: Activity },
              { id: 'settings', label: 'Security Settings', icon: Lock },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-100 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">System Status</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-800 dark:text-green-200">Firewall</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-800 dark:text-green-200">SSL Certificate</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">Valid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-800 dark:text-green-200">Rate Limiting</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-6 border border-yellow-100 dark:border-yellow-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">Recent Alerts</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      • 12 failed login attempts in the last 24 hours
                    </div>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      • Unusual activity from IP 203.0.113.1
                    </div>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      • Password policy violation detected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Event Logs</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Export Logs
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">IP Address</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{log.action}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{log.user}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{log.timestamp}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{log.ip}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'success' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Configuration</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Authentication Settings</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Session Timeout</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Auto-logout after inactivity</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Access Control</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">IP Whitelisting</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Restrict access to specific IPs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">Rate Limiting</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Limit requests per minute</p>
                    </div>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}