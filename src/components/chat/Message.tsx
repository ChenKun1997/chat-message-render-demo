/**
 * Individual chat message component
 */
'use client';
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { LoadingDots } from '@/components/content/SkeletonLoader';

interface MessageProps {
  message: ChatMessage;
  onBlockUpdate?: (blockId: string, updates: any) => void;
}

/**
 * Renders a single chat message with appropriate styling for user/assistant
 */
export function Message({ message, onBlockUpdate }: MessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8 group`}>
      <div className={`${isUser ? 'max-w-[85%] sm:max-w-[75%]' : 'max-w-[95%] sm:max-w-[90%]'} ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message header with role and timestamp */}
        <div className={`flex items-center mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-center space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-transform duration-200 group-hover:scale-105 ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25 ring-2 ring-blue-500/20'
                : 'bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 text-white shadow-gray-600/25 ring-2 ring-gray-500/20'
            }`}>
              {isUser ? 'U' : 'AI'}
              {!isUser && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-sm"></div>
              )}
            </div>

            {/* Role and timestamp */}
            <div className={`text-xs ${isUser ? 'text-right' : 'text-left'}`}>
              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {isUser ? 'You' : 'Assistant'}
              </div>
              <div className="text-gray-500 dark:text-gray-400 font-medium">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Message content */}
        <div className={`relative rounded-2xl px-5 py-4 shadow-lg transition-all duration-200 group-hover:shadow-xl ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-auto shadow-blue-500/25 ring-1 ring-blue-500/20'
            : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 shadow-gray-900/10 dark:shadow-gray-100/10 ring-1 ring-gray-200/50 dark:ring-gray-700/50'
        }`}>
          {/* For user messages, show simple text */}
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            /* For assistant messages, render content blocks */
            <div>
              {message.contentBlocks && message.contentBlocks.length > 0 ? (
                <ContentRenderer 
                  blocks={message.contentBlocks} 
                  onBlockUpdate={onBlockUpdate}
                />
              ) : message.content ? (
                /* Fallback to plain text if no content blocks */
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              ) : (
                /* Show loading state for empty streaming messages */
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <span>Thinking</span>
                  <LoadingDots />
                </div>
              )}
              
              {/* Show streaming indicator */}
              {isStreaming && (
                <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Streaming...
                  </div>
                  <LoadingDots className="scale-75" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
