/**
 * Main content renderer that orchestrates different content types
 */

import React from 'react';
import { ContentBlock } from '@/types/content';
import { MarkdownRenderer } from '../content/renderers/MarkdownRenderer';
import { ChartRenderer } from '../content/renderers/ChartRenderer';
import { SkeletonLoader } from '../content/SkeletonLoader';
import { CodeRenderer } from '../content/renderers/CodeRenderer';
import { ThinkingRenderer } from '../content/renderers/ThinkingRenderer';
import { McpToolRenderer } from '../content/renderers/McpToolRenderer';
import { ImageRenderer } from '../content/renderers/ImageRenderer';
import { TableRenderer } from '../content/renderers/TableRenderer';
import {
  defaultContentRendererRegistry,
  getContentRenderer
} from '../content/ContentRendererRegistry';

/**
 * Initialize the default content renderers
 */
function initializeDefaultRenderers() {
  // Register all the default renderers
  defaultContentRendererRegistry.register('markdown', MarkdownRenderer);
  defaultContentRendererRegistry.register('chart', ChartRenderer);
  defaultContentRendererRegistry.register('code', CodeRenderer);
  defaultContentRendererRegistry.register('thinking', ThinkingRenderer);
  defaultContentRendererRegistry.register('mcp_tool', McpToolRenderer);
  defaultContentRendererRegistry.register('image', ImageRenderer);
  defaultContentRendererRegistry.register('table', TableRenderer);
}

// Initialize renderers on module load
initializeDefaultRenderers();

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
        const RendererComponent = getContentRenderer(block.type);

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

// Legacy compatibility functions are now exported from ContentRendererRegistry.ts
// These exports maintain backward compatibility for existing code
export { registerContentRenderer, getRegisteredContentTypes } from '../content/ContentRendererRegistry';
