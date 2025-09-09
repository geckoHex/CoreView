'use client';

import React, { useState } from 'react';
import { coreAPI } from '@/lib/api';
import { MessageSquare, Send, Copy, Check } from 'lucide-react';

export default function EchoPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const result = await coreAPI.echo(message);
      setResponse(result.content);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = response;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Echo Service</h1>
            <p className="text-gray-600">Test message echoing functionality</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>How it works:</strong> Send any message to the server and receive it back unchanged. 
            This service is useful for testing connectivity and basic server functionality.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message to Echo
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Enter your message here..."
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      {/* Response */}
      {response && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Server Response</h3>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
              {response}
            </p>
          </div>
        </div>
      )}

      {/* Usage Examples */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Examples</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Simple text:</p>
            <code className="text-sm font-mono text-gray-900">Hello, World!</code>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">JSON data:</p>
            <code className="text-sm font-mono text-gray-900">{`{"message": "test", "status": "ok"}`}</code>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Multi-line text:</p>
            <code className="text-sm font-mono text-gray-900">Line 1{'\n'}Line 2{'\n'}Line 3</code>
          </div>
        </div>
      </div>
    </div>
  );
}
