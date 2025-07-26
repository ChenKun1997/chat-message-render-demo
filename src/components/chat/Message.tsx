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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message header with role and timestamp */}
        <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-center space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isUser 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 text-white'
            }`}>
              {isUser ? 'U' : 'AI'}
            </div>
            
            {/* Role and timestamp */}
            <div className={`text-xs text-gray-500 dark:text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
              <div className="font-medium">
                {isUser ? 'You' : 'Assistant'}
              </div>
              <div>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Message content */}
        <div className={`rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white ml-auto'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
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
