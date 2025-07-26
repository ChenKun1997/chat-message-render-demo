/**
 * Main chat interface component that orchestrates the entire chat experience
 */
'use client';
import React from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/Button';
import { DemoControls } from '@/components/demo/DemoControls';

/**
 * Complete chat interface with header, messages, and input
 */
export function ChatInterface() {
  const {
    messages,
    currentMessage,
    connectionState,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryConnection,
    stopStreaming,
  } = useChat();

  /**
   * Handle block updates (for future extensibility)
   */
  const handleBlockUpdate = (blockId: string, updates: any) => {
    // Future: Handle real-time block updates
    console.log('Block update:', blockId, updates);
  };

  /**
   * Handle demo scenario trigger
   */
  const handleTriggerDemo = (scenario: string) => {
    // Simulate sending a message that triggers the demo scenario
    const demoMessage = `Demo: ${scenario}`;
    sendMessage(demoMessage);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Chat Interface
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Streaming chat with dynamic content rendering
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Connection status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionState === 'connected' ? 'bg-green-500' :
              connectionState === 'connecting' ? 'bg-yellow-500' :
              connectionState === 'error' ? 'bg-red-500' :
              'bg-gray-400'
            }`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {connectionState}
            </span>
          </div>

          {/* Action buttons */}
          {isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopStreaming}
            >
              Stop
            </Button>
          )}
          
          {error && (
            <Button
              variant="outline"
              size="sm"
              onClick={retryConnection}
            >
              Retry
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            disabled={messages.length === 0 && !currentMessage}
          >
            Clear
          </Button>
        </div>
      </header>

      {/* Demo Controls */}
      <DemoControls
        onTriggerDemo={handleTriggerDemo}
        isLoading={isLoading}
      />

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={retryConnection}
              className="text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        currentMessage={currentMessage}
        onBlockUpdate={handleBlockUpdate}
      />

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        disabled={connectionState === 'error'}
        placeholder={
          connectionState === 'error' 
            ? 'Connection error - please retry'
            : 'Type your message...'
        }
      />
    </div>
  );
}
