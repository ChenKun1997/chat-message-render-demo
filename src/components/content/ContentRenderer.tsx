/**
 * Main content renderer that orchestrates different content types
 */

import React from 'react';
import { ContentBlock, ContentRendererRegistry } from '@/types/content';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ChartRenderer } from './ChartRenderer';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * Registry of content renderers for different content types
 */
const contentRenderers: ContentRendererRegistry = {
  markdown: MarkdownRenderer,
  chart: ChartRenderer,
  // Future renderers can be added here
  image: ({ block }) => (
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h4 className="font-medium mb-2">Image Content</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Image renderer not yet implemented
      </p>
      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        {block.content}
      </pre>
    </div>
  ),
  table: ({ block }) => (
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h4 className="font-medium mb-2">Table Content</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Table renderer not yet implemented
      </p>
      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        {block.content}
      </pre>
    </div>
  ),
  code: ({ block }) => (
    <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Code Block</h4>
      <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
        {block.content}
      </pre>
    </div>
  ),
  thinking: ({ block }) => (
    <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200 flex items-center">
        <span className="mr-2">🤔</span>
        Thinking Process
      </h4>
      <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
        {block.content}
      </div>
    </div>
  ),
  mcp_tool: ({ block }) => (
    <div className="my-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
      <h4 className="font-medium mb-2 text-green-800 dark:text-green-200 flex items-center">
        <span className="mr-2">🔧</span>
        MCP Tool Call
      </h4>
      <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
        {block.content}
      </div>
    </div>
  ),
};

interface ContentRendererProps {
  blocks: ContentBlock[];
  onBlockUpdate?: (blockId: string, updates: Partial<ContentBlock>) => void;
}

/**
 * Main content renderer component that renders a list of content blocks
 */
export function ContentRenderer({ blocks, onBlockUpdate }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {blocks.map((block) => {
        // Show skeleton loader for incomplete blocks
        if (!block.isComplete && block.isLoading) {
          return (
            <SkeletonLoader
              key={block.id}
              type={block.type === 'markdown' ? 'code' : block.type}
              className="my-2"
            />
          );
        }

        // Get the appropriate renderer for this content type
        const RendererComponent = contentRenderers[block.type];

        if (!RendererComponent) {
          // Fallback for unknown content types
          return (
            <div
              key={block.id}
              className="my-4 p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
            >
              <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                Unknown Content Type: {block.type}
              </h4>
              <pre className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">
                {block.content}
              </pre>
            </div>
          );
        }

        return (
          <RendererComponent
            key={block.id}
            block={block}
            onUpdate={onBlockUpdate}
          />
        );
      })}
    </div>
  );
}

/**
 * Register a new content renderer
 */
export function registerContentRenderer(
  type: string,
  component: React.ComponentType<{ block: ContentBlock; onUpdate?: (blockId: string, updates: Partial<ContentBlock>) => void }>
) {
  contentRenderers[type] = component;
}

/**
 * Get all registered content renderer types
 */
export function getRegisteredContentTypes(): string[] {
  return Object.keys(contentRenderers);
}
