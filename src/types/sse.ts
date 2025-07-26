/**
 * SSE (Server-Sent Events) related type definitions
 */

/**
 * SSE event types that can be received from the server
 */
export type SSEEventType = 'content_start' | 'content' | 'content_end';

/**
 * Structure of an SSE message received from the server
 */
export interface SSEMessage {
  eventType: SSEEventType;
  data: string;
}

/**
 * Connection states for SSE
 */
export type SSEConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * SSE connection configuration
 */
export interface SSEConfig {
  url: string;
  headers?: Record<string, string>;
  onOpen?: () => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}
