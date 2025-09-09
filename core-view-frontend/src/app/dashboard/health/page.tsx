'use client';

import React, { useState, useEffect } from 'react';
import { coreAPI } from '@/lib/api';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';

interface HealthCheck {
  timestamp: string;
  status: 'online' | 'offline';
  responseTime?: number;
  message?: string;
}

export default function HealthPage() {
  const [currentStatus, setCurrentStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [history, setHistory] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoCheck, setAutoCheck] = useState(true);
  const [uptime, setUptime] = useState({ online: 0, total: 0 });

  const performHealthCheck = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      await coreAPI.health();
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      
      setCurrentStatus('online');
      setResponseTime(responseTimeMs);
      
      const healthCheck: HealthCheck = {
        timestamp: new Date().toLocaleTimeString(),
        status: 'online',
        responseTime: responseTimeMs,
        message: 'Server is responsive'
      };
      
      setHistory(prev => [healthCheck, ...prev.slice(0, 49)]); // Keep last 50 checks
      
    } catch {
      setCurrentStatus('offline');
      setResponseTime(null);
      
      const healthCheck: HealthCheck = {
        timestamp: new Date().toLocaleTimeString(),
        status: 'offline',
        message: 'Server is not responding'
      };
      
      setHistory(prev => [healthCheck, ...prev.slice(0, 49)]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const calculateUptime = () => {
      if (history.length === 0) return;
      
      const online = history.filter(check => check.status === 'online').length;
      const total = history.length;
      setUptime({ online, total });
    };
    
    calculateUptime();
  }, [history]);

  useEffect(() => {
    // Initial check
    performHealthCheck();

    // Set up interval for auto-checking
    const interval = autoCheck ? setInterval(performHealthCheck, 10000) : null; // Check every 10 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoCheck]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5" />;
      case 'offline':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const uptimePercentage = uptime.total > 0 ? ((uptime.online / uptime.total) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Activity className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Monitor</h1>
            <p className="text-gray-600">Monitor system health and server availability</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <strong>Continuous monitoring:</strong> Track server health status, response times, 
            and availability metrics in real-time.
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Current Status</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
                {getStatusIcon(currentStatus)}
                <span className="capitalize">{currentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Response Time</h3>
          <div className="text-2xl font-bold text-gray-900">
            {responseTime !== null ? `${responseTime}ms` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {responseTime !== null && responseTime < 100 ? 'Excellent' :
             responseTime !== null && responseTime < 500 ? 'Good' :
             responseTime !== null ? 'Slow' : 'No data'}
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Uptime</h3>
          <div className="text-2xl font-bold text-gray-900">
            {uptimePercentage}%
          </div>
          <div className="text-sm text-gray-500">
            {uptime.online}/{uptime.total} checks
          </div>
        </div>

        {/* Last Check */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Last Check</h3>
          <div className="text-lg font-semibold text-gray-900">
            {history[0]?.timestamp || 'Never'}
          </div>
          <div className="text-sm text-gray-500">
            Auto-check: {autoCheck ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monitor Controls</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={performHealthCheck}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Checking...' : 'Check Now'}
          </button>

          <button
            onClick={() => setAutoCheck(!autoCheck)}
            className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              autoCheck
                ? 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            {autoCheck ? 'Stop Auto-check' : 'Start Auto-check'}
          </button>

          <button
            onClick={() => setHistory([])}
            disabled={history.length === 0}
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Health History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Health Check History</h3>
          <p className="text-sm text-gray-600">Recent health check results (last 50 checks)</p>
        </div>
        
        <div className="p-6">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No health checks performed yet</p>
              <p className="text-sm text-gray-400">Click &quot;Check Now&quot; to start monitoring</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((check, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    check.status === 'online' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${getStatusColor(check.status)}`}>
                      {getStatusIcon(check.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {check.status === 'online' ? 'Server Online' : 'Server Offline'}
                      </div>
                      <div className="text-sm text-gray-600">{check.message}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {check.timestamp}
                    </div>
                    {check.responseTime && (
                      <div className="text-xs text-gray-500">
                        {check.responseTime}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
