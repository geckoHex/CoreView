'use client';

import React, { useState } from 'react';
import { coreAPI } from '@/lib/api';
import { Calculator, Plus, Equal } from 'lucide-react';

export default function CalculatorPage() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{
    num1: number;
    num2: number;
    operation: string;
    result: number;
    timestamp: string;
  }>>([]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    
    if (isNaN(n1) || isNaN(n2)) {
      setError('Please enter valid numbers');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await coreAPI.add(n1, n2);
      const calculationResult = response.result;
      setResult(calculationResult);
      
      // Add to history
      const historyEntry = {
        num1: n1,
        num2: n2,
        operation: 'add',
        result: calculationResult,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 calculations
      
    } catch {
      setError('Calculation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setNum1('');
    setNum2('');
    setResult(null);
    setError('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleUseHistoryValue = (value: number) => {
    setNum1(value.toString());
    setNum2('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calculator className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculator</h1>
            <p className="text-gray-600">Perform mathematical operations using the backend service</p>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-800 text-sm">
            <strong>Available Operation:</strong> Addition - Add two numbers together using the server-side calculation engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="num1" className="block text-sm font-medium text-gray-700 mb-2">
                  First Number
                </label>
                <input
                  id="num1"
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter first number"
                  step="any"
                  required
                />
              </div>

              <div>
                <label htmlFor="num2" className="block text-sm font-medium text-gray-700 mb-2">
                  Second Number
                </label>
                <input
                  id="num2"
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter second number"
                  step="any"
                  required
                />
              </div>
            </div>

            {/* Operation Display */}
            <div className="flex items-center justify-center space-x-4 py-4">
              <div className="px-4 py-2 bg-gray-100 rounded-lg font-mono text-lg">
                {num1 || '0'}
              </div>
              <Plus className="w-6 h-6 text-purple-600" />
              <div className="px-4 py-2 bg-gray-100 rounded-lg font-mono text-lg">
                {num2 || '0'}
              </div>
              <Equal className="w-6 h-6 text-gray-400" />
              <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg font-mono text-lg min-w-[80px] text-center">
                {result !== null ? result : '?'}
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
                disabled={isLoading || !num1 || !num2}
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* History */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">History</h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No calculations yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((calc, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg text-sm border border-gray-200"
                >
                  <div className="font-mono text-gray-900 mb-1">
                    {calc.num1} + {calc.num2} = {calc.result}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{calc.timestamp}</span>
                    <button
                      onClick={() => handleUseHistoryValue(calc.result)}
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      Use result
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Calculations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="font-mono text-lg text-gray-900 mb-2">10 + 5 = 15</div>
            <div className="text-sm text-gray-600">Simple addition</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="font-mono text-lg text-gray-900 mb-2">3.14 + 2.86 = 6</div>
            <div className="text-sm text-gray-600">Decimal numbers</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="font-mono text-lg text-gray-900 mb-2">-5 + 10 = 5</div>
            <div className="text-sm text-gray-600">Negative numbers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
