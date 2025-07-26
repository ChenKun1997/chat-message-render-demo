/**
 * Thinking process content renderer component
 */

import React from 'react';
import { ContentRendererProps } from '@/types/content';

/**
 * Renders thinking process content with distinctive blue styling
 */
export function ThinkingRenderer({ block }: ContentRendererProps) {
  if (!block.content.trim()) {
    return null;
  }

  return (
    <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200 flex items-center">
        <span className="mr-2">🤔</span>
        Thinking Process
      </h4>
      <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
        {block.content}
      </div>
    </div>
  );
}
