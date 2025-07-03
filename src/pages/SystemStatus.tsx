import React from 'react';
import { Server, Database, Wifi, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export function SystemStatus() {
  const systemComponents = [
    {
      name: 'Web Application',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '120ms',
      icon: Server,
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '45ms',
      icon: Database,
    },
    {
      name: 'API Services',
      status: 'degraded',
      uptime: '98.5%',
      responseTime: '250ms',
      icon: Wifi,
    },
    {
      name: 'Security Services',
      status: 'operational',
      uptime: '100%',
      responseTime: '30ms',
      icon: Shield,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
      case 'down':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Status</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Real-time status of all system components and services
        </p>
      </div>

      {/* Overall Status */}
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">All Systems Operational</h2>
            <p className="text-green-700 dark:text-green-300">All services are running normally</p>
          </div>
        </div>
      </div>

      {/* System Components */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">System Components</h2>
        <div className="space-y-4">
          {systemComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{component.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Uptime: {component.uptime}</span>
                      <span>Response: {component.responseTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(component.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(component.status)}`}>
                    {component.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Response Time</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">120ms</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average response time</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uptime</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-green-600 dark:bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Users</h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">234</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Currently online</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Incidents</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 dark:text-yellow-100">API Response Degradation</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Increased response times for API endpoints. Investigating the issue.
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">Started: 2 hours ago • Status: Investigating</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-100">Database Maintenance Completed</h3>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Scheduled database maintenance completed successfully. All services restored.
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-2">Resolved: 1 day ago • Duration: 30 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Scheduled Maintenance</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Database Optimization</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">Routine database maintenance and optimization</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Jan 20, 2024</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">2:00 AM - 4:00 AM IST</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}