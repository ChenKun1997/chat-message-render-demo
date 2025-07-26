/**
 * Class-based content renderer registry for managing different content type renderers
 */

import React from 'react';
import { ContentBlock, ContentRendererProps } from '@/types/content';

/**
 * Type definition for content renderer components
 */
export type ContentRendererComponent = React.ComponentType<ContentRendererProps>;

/**
 * Content renderer registry class that manages registration and retrieval of content renderers
 */
export class ContentRendererRegistry {
  private renderers: Map<string, ContentRendererComponent> = new Map();

  /**
   * Register a new content renderer for a specific content type
   * @param type - The content type identifier
   * @param component - The React component that renders this content type
   */
  register(type: string, component: ContentRendererComponent): void {
    this.renderers.set(type, component);
  }

  /**
   * Get a renderer component for a specific content type
   * @param type - The content type identifier
   * @returns The renderer component or undefined if not found
   */
  get(type: string): ContentRendererComponent | undefined {
    return this.renderers.get(type);
  }

  /**
   * Check if a renderer is registered for a specific content type
   * @param type - The content type identifier
   * @returns True if a renderer is registered, false otherwise
   */
  has(type: string): boolean {
    return this.renderers.has(type);
  }

  /**
   * Get all registered content types
   * @returns Array of registered content type identifiers
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.renderers.keys());
  }

  /**
   * Unregister a content renderer
   * @param type - The content type identifier to unregister
   * @returns True if the renderer was removed, false if it wasn't registered
   */
  unregister(type: string): boolean {
    return this.renderers.delete(type);
  }

  /**
   * Clear all registered renderers
   */
  clear(): void {
    this.renderers.clear();
  }

  /**
   * Get the number of registered renderers
   * @returns The count of registered renderers
   */
  size(): number {
    return this.renderers.size;
  }

  /**
   * Create a registry with default renderers pre-registered
   * @param defaultRenderers - Object mapping content types to renderer components
   * @returns A new registry instance with the default renderers registered
   */
  static createWithDefaults(defaultRenderers: Record<string, ContentRendererComponent>): ContentRendererRegistry {
    const registry = new ContentRendererRegistry();
    
    Object.entries(defaultRenderers).forEach(([type, component]) => {
      registry.register(type, component);
    });

    return registry;
  }
}

/**
 * Default singleton instance of the content renderer registry
 * This maintains backward compatibility with the existing static approach
 */
export const defaultContentRendererRegistry = new ContentRendererRegistry();

/**
 * Legacy compatibility functions that delegate to the default registry instance
 * These maintain the same API as the original static functions
 */

/**
 * Register a new content renderer (legacy compatibility function)
 * @param type - The content type identifier
 * @param component - The React component that renders this content type
 */
export function registerContentRenderer(type: string, component: ContentRendererComponent): void {
  defaultContentRendererRegistry.register(type, component);
}

/**
 * Get all registered content renderer types (legacy compatibility function)
 * @returns Array of registered content type identifiers
 */
export function getRegisteredContentTypes(): string[] {
  return defaultContentRendererRegistry.getRegisteredTypes();
}

/**
 * Get a renderer component for a specific content type (legacy compatibility function)
 * @param type - The content type identifier
 * @returns The renderer component or undefined if not found
 */
export function getContentRenderer(type: string): ContentRendererComponent | undefined {
  return defaultContentRendererRegistry.get(type);
}
