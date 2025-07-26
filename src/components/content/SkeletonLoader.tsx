/**
 * Skeleton loader component for showing loading states
 */

import React from 'react';

interface SkeletonLoaderProps {
  type: 'chart' | 'image' | 'table' | 'code' | 'thinking' | 'mcp_tool';
  className?: string;
}

/**
 * Skeleton loader that adapts to different content types
 */
export function SkeletonLoader({ type, className = '' }: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  switch (type) {
    case 'chart':
      return (
        <div className={`space-y-4 p-4 border rounded-lg ${className}`}>
          <div className={`h-4 w-1/3 ${baseClasses}`} />
          <div className="space-y-2">
            <div className={`h-32 w-full ${baseClasses}`} />
            <div className="flex space-x-2">
              <div className={`h-3 w-16 ${baseClasses}`} />
              <div className={`h-3 w-16 ${baseClasses}`} />
              <div className={`h-3 w-16 ${baseClasses}`} />
            </div>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className={`space-y-2 ${className}`}>
          <div className={`h-48 w-full ${baseClasses}`} />
          <div className={`h-3 w-2/3 ${baseClasses}`} />
        </div>
      );

    case 'table':
      return (
        <div className={`space-y-2 ${className}`}>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`h-8 ${baseClasses}`} />
            ))}
          </div>
        </div>
      );

    case 'code':
      return (
        <div className={`space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
          <div className={`h-3 w-1/4 ${baseClasses}`} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-4 w-${['full', '3/4', 'full', '1/2', '5/6'][i]} ${baseClasses}`} />
          ))}
        </div>
      );

    case 'thinking':
      return (
        <div className={`space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 ${className}`}>
          <div className="flex items-center space-x-2">
            <div className={`h-4 w-4 rounded-full ${baseClasses}`} />
            <div className={`h-3 w-20 ${baseClasses}`} />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-3 w-${['full', '4/5', '3/4'][i]} ${baseClasses}`} />
          ))}
        </div>
      );

    case 'mcp_tool':
      return (
        <div className={`space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 ${className}`}>
          <div className="flex items-center space-x-2">
            <div className={`h-5 w-5 rounded ${baseClasses}`} />
            <div className={`h-4 w-24 ${baseClasses}`} />
          </div>
          <div className={`h-16 w-full ${baseClasses}`} />
          <div className={`h-3 w-1/2 ${baseClasses}`} />
        </div>
      );

    default:
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-4 w-full ${baseClasses}`} />
          ))}
        </div>
      );
  }
}

/**
 * Pulsing dot animation for active loading states
 */
export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}
