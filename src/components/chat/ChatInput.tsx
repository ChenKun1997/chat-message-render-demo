/**
 * Chat input component for sending messages
 */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Chat input component with auto-resize textarea and send functionality
 */
export function ChatInput({
  onSendMessage,
  isLoading,
  disabled = false,
  placeholder = 'Type your message...'
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Auto-resize textarea based on content
   */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !isLoading && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '48px', maxHeight: '200px' }}
        />
        
        {/* Character count indicator for long messages */}
        {message.length > 500 && (
          <div className="absolute bottom-1 right-2 text-xs text-gray-400">
            {message.length}/2000
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        isLoading={isLoading}
        className="shrink-0"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}
