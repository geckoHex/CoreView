'use client';

import React, { useState, useEffect } from 'react';
import { coreAPI } from '@/lib/api';
import { Activity, MessageSquare, RotateCcw, Calculator, Clock, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

interface HealthStatus {
  status: 'online' | 'offline' | 'checking';
  message?: string;
}

export default function DashboardPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({ status: 'checking' });
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    checkHealth();
    fetchTime();
    
    // Set up intervals
    const healthInterval = setInterval(checkHealth, 30000); // Check every 30 seconds
    const timeInterval = setInterval(fetchTime, 1000); // Update time every second

    return () => {
      clearInterval(healthInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const checkHealth = async () => {
    try {
      await coreAPI.health();
      setHealthStatus({ status: 'online', message: 'All systems operational' });
    } catch {
      setHealthStatus({ status: 'offline', message: 'Backend service unavailable' });
    }
  };

  const fetchTime = async () => {
    try {
      const response = await coreAPI.clock();
      setCurrentTime(response.content);
    } catch {
      setCurrentTime(new Date().toLocaleString());
    }
  };

  const services = [
    {
      name: 'Echo Service',
      description: 'Test message echoing functionality',
      icon: MessageSquare,
      href: '/dashboard/echo',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Text Reverser',
      description: 'Reverse any text string',
      icon: RotateCcw,
      href: '/dashboard/reverse',
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Calculator',
      description: 'Perform mathematical operations',
      icon: Calculator,
      href: '/dashboard/calculator',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'System Clock',
      description: 'View server system time',
      icon: Clock,
      href: '/dashboard/clock',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      name: 'File Manager',
      description: 'Browse and manage system files',
      icon: FolderOpen,
      href: '/dashboard/files',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      name: 'Health Monitor',
      description: 'Monitor system health and status',
      icon: Activity,
      href: '/dashboard/health',
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent>
          <CardTitle className="mb-2">Welcome to CoreView</CardTitle>
          <CardDescription>
            Manage and monitor your backend services from this centralized dashboard.
          </CardDescription>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Status */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="mb-1">System Health</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${
                    healthStatus.status === 'online' ? 'bg-green-500' :
                    healthStatus.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    healthStatus.status === 'online' ? 'text-green-700' :
                    healthStatus.status === 'offline' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {healthStatus.status === 'online' ? 'Online' :
                     healthStatus.status === 'offline' ? 'Offline' : 'Checking...'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {healthStatus.message || 'Checking system status...'}
                </p>
              </div>
              <Activity className={`w-8 h-8 ${
                healthStatus.status === 'online' ? 'text-green-500' :
                healthStatus.status === 'offline' ? 'text-red-500' : 'text-yellow-500'
              }`} />
            </div>
          </CardContent>
        </Card>

        {/* Current Time */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="mb-1">Server Time</CardTitle>
                <p className="text-xl font-mono text-blue-600 mb-1">
                  {currentTime || 'Loading...'}
                </p>
                <p className="text-sm text-gray-500">Live system time</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.name}
                href={service.href}
                className="block"
              >
                <Card hover>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${service.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Backend URL</h4>
              <p className="text-sm text-gray-600 font-mono">http://localhost:5001</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Session Timeout</h4>
              <p className="text-sm text-gray-600">5 minutes</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Version</h4>
              <p className="text-sm text-gray-600">1.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
