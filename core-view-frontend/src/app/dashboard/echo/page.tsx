'use client';

import React, { useState } from 'react';
import { coreAPI } from '@/lib/api';
import { MessageSquare, Send, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Echo Service</CardTitle>
              <CardDescription>Test message echoing functionality</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 p-4">
            <p className="text-blue-800 text-sm">
              <strong>How it works:</strong> Send any message to the server and receive it back unchanged. 
              This service is useful for testing connectivity and basic server functionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message to Echo
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none selectable"
                rows={4}
                placeholder="Enter your message here..."
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              loading={isLoading}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Server Response</CardTitle>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
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
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border border-gray-200 p-4">
              <p className="text-gray-900 whitespace-pre-wrap font-mono text-sm selectable">
                {response}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Simple text:</p>
              <code className="text-sm font-mono text-gray-900 selectable">Hello, World!</code>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">JSON data:</p>
              <code className="text-sm font-mono text-gray-900 selectable">{`{"message": "test", "status": "ok"}`}</code>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Multi-line text:</p>
              <code className="text-sm font-mono text-gray-900 selectable">Line 1{'\n'}Line 2{'\n'}Line 3</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
