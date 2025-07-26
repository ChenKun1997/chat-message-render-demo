/**
 * Message list component that displays all chat messages
 */
'use client';
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { Message } from './Message';

interface MessageListProps {
  messages: ChatMessage[];
  currentMessage: ChatMessage | null;
  onBlockUpdate?: (blockId: string, updates: any) => void;
}

/**
 * Scrollable list of chat messages with auto-scroll to bottom
 */
export function MessageList({ messages, currentMessage, onBlockUpdate }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Small delay to ensure content is rendered
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, currentMessage]);

  /**
   * Handle scroll to top for loading more messages (future feature)
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    
    // Future: Load more messages when scrolled to top
    if (scrollTop === 0) {
      // console.log('Reached top - could load more messages');
    }
  };

  const allMessages = [...messages];
  if (currentMessage) {
    allMessages.push(currentMessage);
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {allMessages.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Start a conversation
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Send a message to begin chatting with the AI assistant. 
            The assistant can render various content types including charts, tables, and more.
          </p>
        </div>
      ) : (
        /* Message list */
        <>
          {allMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onBlockUpdate={onBlockUpdate}
            />
          ))}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
