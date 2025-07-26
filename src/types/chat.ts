/**
 * Chat related type definitions
 */

import { ContentBlock } from './content';
import { SSEConnectionState } from './sse';

/**
 * Chat message from user or assistant
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentBlocks?: ContentBlock[];
  timestamp: Date;
  isStreaming?: boolean;
}

/**
 * Chat state interface
 */
export interface ChatState {
  messages: ChatMessage[];
  currentMessage: ChatMessage | null;
  connectionState: SSEConnectionState;
  isLoading: boolean;
  error: string | null;
}

/**
 * Chat actions
 */
export interface ChatActions {
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  retryConnection: () => void;
  stopStreaming: () => void;
}

/**
 * Combined chat hook return type
 */
export interface UseChatReturn extends ChatState, ChatActions {}
