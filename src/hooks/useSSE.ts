/**
 * Custom hook for handling Server-Sent Events (SSE) connections
 */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { SSEMessage, SSEConnectionState, SSEConfig } from '@/types/sse';

/**
 * Hook for managing SSE connections with automatic reconnection and error handling
 */
export function useSSE() {
  const [connectionState, setConnectionState] = useState<SSEConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageHandlerRef = useRef<((message: SSEMessage) => void) | null>(null);

  /**
   * Connect to SSE endpoint
   */
  const connect = useCallback(async (config: SSEConfig) => {
    // Clean up any existing connection
    disconnect();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setConnectionState('connecting');
    setError(null);

    try {
      await fetchEventSource(config.url, {
        signal: abortController.signal,
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          ...config.headers,
        },
        
        onopen: async (response) => {
          if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
            setConnectionState('connected');
            config.onOpen?.();
          } else {
            throw new Error(`Failed to connect: ${response.status} ${response.statusText}`);
          }
        },

        onmessage: (event) => {
          try {
            const message: SSEMessage = JSON.parse(event.data);
            messageHandlerRef.current?.(message);
          } catch (parseError) {
            console.error('Failed to parse SSE message:', parseError);
            setError('Failed to parse server message');
          }
        },

        onerror: (err) => {
          console.error('SSE connection error:', err);
          setConnectionState('error');
          setError(err.message || 'Connection error occurred');
          config.onError?.(err);
          
          // Attempt to reconnect after a delay
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!abortController.signal.aborted) {
              connect(config);
            }
          }, 3000);
        },

        onclose: () => {
          setConnectionState('disconnected');
          config.onClose?.();
        }
      });
    } catch (err) {
      const error = err as Error;
      console.error('Failed to establish SSE connection:', error);
      setConnectionState('error');
      setError(error.message || 'Failed to connect to server');
      config.onError?.(error);
    }
  }, []);

  /**
   * Disconnect from SSE endpoint
   */
  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionState('disconnected');
    setError(null);
  }, []);

  /**
   * Set message handler
   */
  const setMessageHandler = useCallback((handler: (message: SSEMessage) => void) => {
    messageHandlerRef.current = handler;
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    error,
    connect,
    disconnect,
    setMessageHandler,
  };
}
