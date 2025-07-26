/**
 * MCP Tool call content renderer component
 */

import React from 'react';
import { ContentRendererProps } from '@/types/content';

/**
 * Renders MCP tool call content with distinctive green styling
 */
export function McpToolRenderer({ block }: ContentRendererProps) {
  if (!block.content.trim()) {
    return null;
  }

  return (
    <div className="my-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
      <h4 className="font-medium mb-2 text-green-800 dark:text-green-200 flex items-center">
        <span className="mr-2">🔧</span>
        MCP Tool Call
      </h4>
      <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
        {block.content}
      </div>
    </div>
  );
}
