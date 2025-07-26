/**
 * Content rendering related type definitions
 */

/**
 * Supported content types for rendering
 */
export type ContentType = 'markdown' | 'chart' | 'image' | 'table' | 'code' | 'thinking' | 'mcp_tool';

/**
 * Content markers used to identify different content types
 */
export const CONTENT_MARKERS = {
  CHART: {
    START: '[CONTENT_START_CHART]',
    END: '[CONTENT_END_CHART]'
  },
  IMAGE: {
    START: '[CONTENT_START_IMAGE]',
    END: '[CONTENT_END_IMAGE]'
  },
  TABLE: {
    START: '[CONTENT_START_TABLE]',
    END: '[CONTENT_END_TABLE]'
  },
  CODE: {
    START: '[CONTENT_START_CODE]',
    END: '[CONTENT_END_CODE]'
  },
  THINKING: {
    START: '[CONTENT_START_THINKING]',
    END: '[CONTENT_END_THINKING]'
  },
  MCP_TOOL: {
    START: '[CONTENT_START_MCP_TOOL]',
    END: '[CONTENT_END_MCP_TOOL]'
  }
} as const;

/**
 * A processed content block with type and content
 */
export interface ContentBlock {
  id: string;
  type: ContentType;
  content: string;
  isComplete: boolean;
  isLoading?: boolean;
}

/**
 * Chart data structure for chart rendering
 */
export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: Array<Record<string, any>>;
  xKey?: string;
  yKey?: string;
  title?: string;
  description?: string;
}

/**
 * Props for content renderers
 */
export interface ContentRendererProps {
  block: ContentBlock;
  onUpdate?: (blockId: string, updates: Partial<ContentBlock>) => void;
}

/**
 * Registry entry for content renderers
 */
export interface ContentRendererRegistry {
  [key: string]: React.ComponentType<ContentRendererProps>;
}
