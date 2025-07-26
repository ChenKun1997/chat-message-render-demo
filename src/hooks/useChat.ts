/**
 * Custom hook for managing chat functionality with SSE streaming
 */
'use client';
import { useCallback, useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSSE } from './useSSE';
import { ChatMessage, UseChatReturn } from '@/types/chat';
import { SSEMessage } from '@/types/sse';
import { processContent } from '@/utils/contentProcessor';

/**
 * Main chat hook that orchestrates SSE communication and message management
 */
export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  console.log({messages});
  
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { connectionState, error: sseError, connect, disconnect, setMessageHandler } = useSSE();
  const currentContentRef = useRef<string>('');
  const currentMessageIdRef = useRef<string | null>(null);

  /**
   * Handle incoming SSE messages
   */
  const handleSSEMessage = useCallback((message: SSEMessage) => {
    switch (message.eventType) {
      case 'content_start':
        // Initialize a new streaming message
        const messageId = uuidv4();
        currentMessageIdRef.current = messageId;
        currentContentRef.current = '';
        
        const newMessage: ChatMessage = {
          id: messageId,
          role: 'assistant',
          content: '',
          contentBlocks: [],
          timestamp: new Date(),
          isStreaming: true,
        };
        
        setCurrentMessage(newMessage);
        setIsLoading(true);
        break;

      case 'content':
        // Accumulate content data
        if (currentMessageIdRef.current) {
          currentContentRef.current += message.data;
          
          // Process content and update current message
          const contentBlocks = processContent(currentContentRef.current);
          
          setCurrentMessage(prev => prev ? {
            ...prev,
            content: currentContentRef.current,
            contentBlocks,
          } : null);
        }
        break;

      case 'content_end':
        // Finalize the message
        if (currentMessage && currentMessageIdRef.current) {
          const finalContentBlocks = processContent(currentContentRef.current);
          
          const finalMessage: ChatMessage = {
            ...currentMessage,
            content: currentContentRef.current,
            contentBlocks: finalContentBlocks,
            isStreaming: false,
          };

          // Add to messages list and clear current message
          setMessages(prev => [...prev, finalMessage]);
          setCurrentMessage(null);
          setIsLoading(false);
          
          // Reset refs
          currentContentRef.current = '';
          currentMessageIdRef.current = null;
        }
        break;

      default:
        console.warn('Unknown SSE event type:', message.eventType);
    }
  }, [currentMessage]);

  /**
   * Set up SSE message handler
   */
  useEffect(() => {
    setMessageHandler(handleSSEMessage);
  }, [setMessageHandler, handleSSEMessage]);

  /**
   * Send a message and initiate SSE connection
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Determine demo scenario from message content
    let scenario = 'markdown_with_chart'; // default
    if (content.includes('Demo: ')) {
      scenario = content.replace('Demo: ', '');
    }

    // Connect to SSE endpoint for streaming response
    try {
      await connect({
        url: `/api/chat/stream?scenario=${content.trim()}`,
        headers: {
          'Content-Type': 'application/json',
        },
        onError: (error) => {
          console.error('SSE connection error:', error);
          setIsLoading(false);
        },
        onClose: () => {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  }, [isLoading, connect]);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentMessage(null);
    currentContentRef.current = '';
    currentMessageIdRef.current = null;
    disconnect();
  }, [disconnect]);

  /**
   * Retry connection
   */
  const retryConnection = useCallback(async () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        await sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  /**
   * Stop streaming
   */
  const stopStreaming = useCallback(() => {
    disconnect();
    setIsLoading(false);
    
    // If there's a current message, finalize it
    if (currentMessage && currentContentRef.current) {
      const finalContentBlocks = processContent(currentContentRef.current);
      const finalMessage: ChatMessage = {
        ...currentMessage,
        content: currentContentRef.current,
        contentBlocks: finalContentBlocks,
        isStreaming: false,
      };
      
      setMessages(prev => [...prev, finalMessage]);
      setCurrentMessage(null);
    }
    
    currentContentRef.current = '';
    currentMessageIdRef.current = null;
  }, [currentMessage, disconnect]);

  return {
    messages,
    currentMessage,
    connectionState,
    isLoading,
    error: sseError,
    sendMessage,
    clearMessages,
    retryConnection,
    stopStreaming,
  };
}
