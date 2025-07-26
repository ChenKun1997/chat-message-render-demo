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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="relative backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/50 shadow-lg shadow-black/5">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
                <svg
                  className="w-6 h-6 text-white"
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
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse shadow-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                AI Chat Interface
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Streaming chat with dynamic content rendering
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Connection status indicator */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  connectionState === 'connected' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' :
                  connectionState === 'connecting' ? 'bg-amber-500 shadow-lg shadow-amber-500/50 animate-pulse' :
                  connectionState === 'error' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                  'bg-gray-400 shadow-lg shadow-gray-400/50'
                }`} />
                {connectionState === 'connected' && (
                  <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize tracking-wide">
                {connectionState}
              </span>
            </div>

            {/* Action buttons */}
            {isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopStreaming}
                className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                Stop
              </Button>
            )}

            {error && (
              <Button
                variant="outline"
                size="sm"
                onClick={retryConnection}
                className="backdrop-blur-sm bg-red-50/60 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-900/40 transition-all duration-200"
              >
                Retry
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0 && !currentMessage}
              className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 disabled:opacity-40"
            >
              Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="relative backdrop-blur-md bg-gradient-to-r from-red-50/90 to-rose-50/90 dark:from-red-900/30 dark:to-rose-900/30 border-b border-red-200/50 dark:border-red-700/50 shadow-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Connection Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={retryConnection}
              className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 text-red-700 dark:text-red-300 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-white/20 dark:border-gray-700/50 transition-all duration-200"
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
