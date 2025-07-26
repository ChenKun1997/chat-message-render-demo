/**
 * Demo controls for testing different SSE scenarios
 */
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DemoControlsProps {
  onTriggerDemo: (scenario: string) => void;
  isLoading: boolean;
}

/**
 * Demo scenarios available for testing
 */
const DEMO_SCENARIOS = [
  {
    id: 'markdown_only',
    name: 'Markdown Only',
    description: 'Simple markdown content with formatting'
  },
  {
    id: 'markdown_with_chart',
    name: 'Markdown + Chart',
    description: 'Markdown content with embedded chart visualization'
  },
  {
    id: 'multiple_content_types',
    name: 'Multiple Content Types',
    description: 'Showcase of various content renderers'
  }
];

/**
 * Demo controls component for testing different scenarios
 */
export function DemoControls({ onTriggerDemo, isLoading }: DemoControlsProps) {
  const [selectedScenario, setSelectedScenario] = useState('markdown_with_chart');

  const handleTriggerDemo = () => {
    onTriggerDemo(selectedScenario);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Demo Controls
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Demo Scenario:
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full sm:w-auto min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {DEMO_SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleTriggerDemo}
            disabled={isLoading}
            isLoading={isLoading}
            className="shrink-0"
          >
            {isLoading ? 'Streaming...' : 'Start Demo'}
          </Button>
        </div>

        {/* Scenario description */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>
              {DEMO_SCENARIOS.find(s => s.id === selectedScenario)?.name}:
            </strong>{' '}
            {DEMO_SCENARIOS.find(s => s.id === selectedScenario)?.description}
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>
            <strong>Note:</strong> This demo simulates SSE streaming from a real backend. 
            In production, you would connect to your actual SSE endpoint that processes user messages.
          </p>
        </div>
      </div>
    </div>
  );
}
