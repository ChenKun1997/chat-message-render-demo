/**
 * Image content renderer component with support for URLs, base64, and error handling
 */

import React, { useState, useCallback } from 'react';
import { ContentRendererProps } from '@/types/content';

interface ImageData {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

/**
 * Parse image data from content string
 */
function parseImageData(content: string): ImageData | null {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && parsed.src) {
      return {
        src: parsed.src,
        alt: parsed.alt || 'Image',
        title: parsed.title,
        width: parsed.width,
        height: parsed.height,
      };
    }
  } catch {
    // If JSON parsing fails, treat the content as a direct URL or base64 string
    const trimmedContent = content.trim();
    
    // Check if it's a valid URL or base64 data
    if (trimmedContent.startsWith('http') || 
        trimmedContent.startsWith('data:image/') ||
        trimmedContent.startsWith('/') ||
        trimmedContent.startsWith('./')) {
      return {
        src: trimmedContent,
        alt: 'Image',
      };
    }
  }

  return null;
}

/**
 * Renders image content with lazy loading, error handling, and responsive design
 */
export function ImageRenderer({ block }: ContentRendererProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageData = parseImageData(block.content);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
  }, []);

  // Show error state if image data couldn't be parsed
  if (!imageData) {
    return (
      <div className="my-4 p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Invalid Image Data</h4>
        <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-2">
          Unable to parse image data. Expected a URL, base64 data, or JSON with src property.
        </p>
        <details className="mt-2">
          <summary className="text-yellow-600 dark:text-yellow-300 text-sm cursor-pointer">
            Show raw data
          </summary>
          <pre className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-xs overflow-x-auto">
            {block.content}
          </pre>
        </details>
      </div>
    );
  }

  const { src, alt, title, width, height } = imageData;

  return (
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {title && (
        <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
          {title}
        </h4>
      )}
      
      <div className="relative">
        {/* Loading skeleton */}
        {isLoading && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        )}
        
        {/* Error state */}
        {imageError ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Failed to load image
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 break-all">
              {src}
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            title={title}
            width={width}
            height={height}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`max-w-full h-auto rounded shadow-sm ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-200`}
            loading="lazy"
          />
        )}
      </div>
      
      {alt && alt !== 'Image' && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
          {alt}
        </p>
      )}
    </div>
  );
}
