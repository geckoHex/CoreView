'use client';

import React, { useState } from 'react';
import { coreAPI } from '@/lib/api';
import { RotateCcw, ArrowRight, Copy, Check } from 'lucide-react';

export default function ReversePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const result = await coreAPI.reverse(input);
      setOutput(result.content);
    } catch {
      setError('Failed to reverse text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <RotateCcw className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Text Reverser</h1>
            <p className="text-gray-600">Reverse any text string character by character</p>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            <strong>How it works:</strong> Enter any text and the service will return it 
            with all characters in reverse order. Perfect for creating mirror text or testing text processing.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="space-y-3">
              <label htmlFor="input" className="block text-sm font-medium text-gray-700">
                Original Text
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Enter text to reverse..."
                required
              />
              <div className="text-xs text-gray-500">
                Characters: {input.length}
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <ArrowRight className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Reverse</span>
              </div>
            </div>

            {/* Output */}
            <div className="space-y-3 lg:col-start-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Reversed Text
                </label>
                {output && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[144px]">
                {output ? (
                  <p className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
                    {output}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Reversed text will appear here...
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Characters: {output.length}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Reversing...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reverse Text
                </>
              )}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Input:</div>
            <code className="text-sm font-mono text-gray-900">Hello World!</code>
            <div className="text-sm font-medium text-gray-700 mt-3 mb-2">Output:</div>
            <code className="text-sm font-mono text-green-600">!dlroW olleH</code>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">Input:</div>
            <code className="text-sm font-mono text-gray-900">12345</code>
            <div className="text-sm font-medium text-gray-700 mt-3 mb-2">Output:</div>
            <code className="text-sm font-mono text-green-600">54321</code>
          </div>
        </div>
      </div>
    </div>
  );
}
