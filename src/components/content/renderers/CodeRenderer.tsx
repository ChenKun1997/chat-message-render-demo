/**
 * Code content renderer component with syntax highlighting
 */

import React from 'react';
import { ContentRendererProps } from '@/types/content';

/**
 * Renders code content with syntax highlighting and proper formatting
 */
export function CodeRenderer({ block }: ContentRendererProps) {
  if (!block.content.trim()) {
    return null;
  }

  return (
    <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Code Block</h4>
      <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
        {block.content}
      </pre>
    </div>
  );
}
