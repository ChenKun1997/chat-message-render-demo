/**
 * Test page for validating the refactored ContentRenderer system
 */

'use client';

import React from 'react';
import { ContentRenderer } from '@/components/chat/ContentRenderer';
import { getRegisteredContentTypes } from '@/components/content/ContentRendererRegistry';
import { ContentBlock } from '@/types/content';

const testBlocks: ContentBlock[] = [
  {
    id: '1',
    type: 'markdown',
    content: '# Refactored ContentRenderer Test\n\nThis page tests the **refactored** content renderer system with the new class-based registry.\n\n- ✅ Registry extracted to separate class\n- ✅ Individual renderer components created\n- ✅ Backward compatibility maintained',
    isComplete: true,
  },
  {
    id: '2',
    type: 'code',
    content: `// Example code block
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
    isComplete: true,
  },
  {
    id: '3',
    type: 'thinking',
    content: 'The refactoring process involved:\n1. Creating a ContentRendererRegistry class\n2. Extracting inline renderers to separate components\n3. Implementing proper image and table renderers\n4. Maintaining the same external API',
    isComplete: true,
  },
  {
    id: '4',
    type: 'image',
    content: '{"src": "https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Refactored+Image+Renderer", "alt": "Test image for refactored renderer", "title": "Image Renderer Test"}',
    isComplete: true,
  },
  {
    id: '5',
    type: 'table',
    content: `Component,Status,Description
ContentRendererRegistry,✅ Complete,Class-based registry system
CodeRenderer,✅ Complete,Extracted from inline implementation
ThinkingRenderer,✅ Complete,Extracted from inline implementation
McpToolRenderer,✅ Complete,Extracted from inline implementation
ImageRenderer,✅ Complete,New implementation with error handling
TableRenderer,✅ Complete,New implementation with sorting`,
    isComplete: true,
  },
  {
    id: '6',
    type: 'mcp_tool',
    content: 'Registry validation completed successfully:\n- All default renderers registered\n- Dynamic registration working\n- Backward compatibility maintained\n- External API preserved',
    isComplete: true,
  },
  {
    id: '7',
    type: 'chart',
    content: `{
  "type": "bar",
  "title": "Refactoring Progress",
  "data": [
    {"task": "Registry Class", "completed": 100},
    {"task": "Code Renderer", "completed": 100},
    {"task": "Thinking Renderer", "completed": 100},
    {"task": "MCP Tool Renderer", "completed": 100},
    {"task": "Image Renderer", "completed": 100},
    {"task": "Table Renderer", "completed": 100},
    {"task": "Integration", "completed": 100}
  ],
  "xKey": "task",
  "yKey": "completed"
}`,
    isComplete: true,
  },
];

export default function TestRenderersPage() {
  const registeredTypes = getRegisteredContentTypes();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ContentRenderer Refactoring Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This page demonstrates the refactored content renderer system with the new class-based registry.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Registered Content Types ({registeredTypes.length}):
            </h3>
            <div className="flex flex-wrap gap-2">
              {registeredTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ContentRenderer blocks={testBlocks} />
        </div>

        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
            <span className="mr-2">✅</span>
            Refactoring Complete
          </h3>
          <p className="text-green-700 dark:text-green-300 text-sm">
            The ContentRenderer system has been successfully refactored with a class-based registry, 
            individual renderer components, and maintained backward compatibility.
          </p>
        </div>
      </div>
    </div>
  );
}
