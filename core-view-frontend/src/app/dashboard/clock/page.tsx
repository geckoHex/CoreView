'use client';

import React, { useState, useEffect } from 'react';
import { coreAPI } from '@/lib/api';
import { Clock, RefreshCw, Calendar, Globe } from 'lucide-react';

export default function ClockPage() {
  const [serverTime, setServerTime] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchServerTime = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await coreAPI.clock();
      setServerTime(result.content);
    } catch {
      setError('Failed to fetch server time');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalTime = () => {
    setLocalTime(new Date().toLocaleString());
  };

  useEffect(() => {
    // Initial fetch
    fetchServerTime();
    updateLocalTime();

    // Set up intervals
    const serverInterval = autoRefresh ? setInterval(fetchServerTime, 1000) : null;
    const localInterval = setInterval(updateLocalTime, 1000);

    return () => {
      if (serverInterval) clearInterval(serverInterval);
      clearInterval(localInterval);
    };
  }, [autoRefresh]);

  const handleRefresh = () => {
    fetchServerTime();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Clock</h1>
            <p className="text-gray-600">View and monitor server system time</p>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 text-sm">
            <strong>Real-time monitoring:</strong> Compare server time with your local time to monitor 
            system synchronization and detect any time drift issues.
          </p>
        </div>
      </div>

      {/* Time Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Time */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Server Time</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAutoRefresh}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="text-center">
            {error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            ) : (
              <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-2xl font-mono text-orange-900 mb-2">
                  {serverTime || 'Loading...'}
                </div>
                <div className="text-sm text-orange-700">
                  Backend Server Time
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Local Time */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Local Time</h3>
          </div>

          <div className="text-center">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-2xl font-mono text-blue-900 mb-2">
                {localTime}
              </div>
              <div className="text-sm text-blue-700">
                Browser Local Time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Comparison */}
      {serverTime && localTime && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Server Time</h4>
              <p className="text-sm font-mono text-gray-900">{serverTime}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Local Time</h4>
              <p className="text-sm font-mono text-gray-900">{localTime}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Server Time
          </button>

          <button
            onClick={toggleAutoRefresh}
            className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              autoRefresh
                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            }`}
          >
            {autoRefresh ? 'Stop Auto-refresh' : 'Start Auto-refresh'}
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Server Time Source</h4>
            <p className="text-sm text-gray-600 mb-4">
              The server time is retrieved from the backend system clock using the `/clock` API endpoint.
            </p>
            
            <h4 className="text-sm font-medium text-gray-700 mb-2">Update Frequency</h4>
            <p className="text-sm text-gray-600">
              When auto-refresh is enabled, the server time is updated every second to provide real-time monitoring.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Use Cases</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Monitor server time synchronization</li>
              <li>• Debug time-related issues</li>
              <li>• Verify system clock accuracy</li>
              <li>• Check timezone configurations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
