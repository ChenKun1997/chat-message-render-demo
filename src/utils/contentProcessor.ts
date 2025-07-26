/**
 * Content processing utilities for parsing and splitting content by markers
 */

import { v4 as uuidv4 } from 'uuid';
import { ContentBlock, ContentType, CONTENT_MARKERS } from '@/types/content';

/**
 * Marker configuration for content type detection
 */
interface MarkerConfig {
  start: string;
  end: string;
  type: ContentType;
}

/**
 * All supported content markers
 */
const ALL_MARKERS: MarkerConfig[] = [
  { start: CONTENT_MARKERS.CHART.START, end: CONTENT_MARKERS.CHART.END, type: 'chart' },
  { start: CONTENT_MARKERS.IMAGE.START, end: CONTENT_MARKERS.IMAGE.END, type: 'image' },
  { start: CONTENT_MARKERS.TABLE.START, end: CONTENT_MARKERS.TABLE.END, type: 'table' },
  { start: CONTENT_MARKERS.CODE.START, end: CONTENT_MARKERS.CODE.END, type: 'code' },
  { start: CONTENT_MARKERS.THINKING.START, end: CONTENT_MARKERS.THINKING.END, type: 'thinking' },
  { start: CONTENT_MARKERS.MCP_TOOL.START, end: CONTENT_MARKERS.MCP_TOOL.END, type: 'mcp_tool' },
];

/**
 * Find the next marker in the content
 */
function findNextMarker(content: string, startIndex: number = 0): {
  marker: MarkerConfig;
  index: number;
  isStart: boolean;
} | null {
  let closestIndex = Infinity;
  let closestMarker: MarkerConfig | null = null;
  let isStart = false;

  for (const marker of ALL_MARKERS) {
    // Check for start marker
    const startIdx = content.indexOf(marker.start, startIndex);
    if (startIdx !== -1 && startIdx < closestIndex) {
      closestIndex = startIdx;
      closestMarker = marker;
      isStart = true;
    }

    // Check for end marker
    const endIdx = content.indexOf(marker.end, startIndex);
    if (endIdx !== -1 && endIdx < closestIndex) {
      closestIndex = endIdx;
      closestMarker = marker;
      isStart = false;
    }
  }

  if (closestMarker && closestIndex !== Infinity) {
    return {
      marker: closestMarker,
      index: closestIndex,
      isStart
    };
  }

  return null;
}

/**
 * Process content and split it into content blocks
 */
export function processContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let currentIndex = 0;
  const openBlocks: Map<ContentType, { startIndex: number; marker: MarkerConfig;blockId?:string }> = new Map();

  while (currentIndex < content.length) {
    const nextMarker = findNextMarker(content, currentIndex);

    if (!nextMarker) {
      // No more markers, add remaining content as markdown
      const remainingContent = content.slice(currentIndex).trim();
      if (remainingContent) {
        // Check if this content is part of an open special block
        let isPartOfSpecialBlock = false;
        for (const [type, { startIndex }] of openBlocks) {
          if (currentIndex >= startIndex) {
            isPartOfSpecialBlock = true;
            break;
          }
        }
        
        if (!isPartOfSpecialBlock) {
          blocks.push({
            id: uuidv4(),
            type: 'markdown',
            content: remainingContent,
            isComplete: true
          });
        }
      }
      break;
    }

    const { marker, index, isStart } = nextMarker;

    if (isStart) {
      // Add any content before this marker as markdown
      const beforeContent = content.slice(currentIndex, index).trim();
      if (beforeContent) {
        blocks.push({
          id: uuidv4(),
          type: 'markdown',
          content: beforeContent,
          isComplete: true
        });
      }

      // Start a new special content block with loading state
      const blockId = uuidv4();
      openBlocks.set(marker.type, { 
        startIndex: index + marker.start.length, 
        marker,
        blockId 
      });
      
      // Immediately create a loading block
      // blocks.push({
      //   id: blockId,
      //   type: marker.type,
      //   content: '',
      //   isComplete: false,
      //   isLoading: true
      // });
      
      currentIndex = index + marker.start.length;
    } else {
      // End marker found
      const openBlock = openBlocks.get(marker.type);
      if (openBlock) {
        // Find the existing loading block and update it with actual content
        const blockContent = content.slice(openBlock.startIndex, index).trim();
        const loadingBlockIndex = blocks.findIndex(block => block.id === openBlock.blockId);
        
        if (loadingBlockIndex !== -1) {
          // Update the existing loading block with actual content
          blocks[loadingBlockIndex] = {
            ...blocks[loadingBlockIndex],
            content: blockContent,
            isComplete: true,
            isLoading: false
          };
        } else {
          // Fallback: create new block if somehow the loading block was lost
          blocks.push({
            id: uuidv4(),
            type: marker.type,
            content: blockContent,
            isComplete: true
          });
        }

        openBlocks.delete(marker.type);
        currentIndex = index + marker.end.length;
      } else {
        // End marker without start, treat as regular content
        currentIndex = index + 1;
      }
    }
  }

  // Handle any unclosed blocks (still loading)
  for (const [type, { startIndex }] of openBlocks) {
    const blockContent = content.slice(startIndex).trim();
    blocks.push({
      id: uuidv4(),
      type,
      content: blockContent,
      isComplete: false,
      isLoading: true
    });
  }

  return blocks;
}

/**
 * Update content blocks with new content (for streaming)
 */
export function updateContentBlocks(
  existingBlocks: ContentBlock[],
  newContent: string
): ContentBlock[] {
  // Simply re-process the entire content
  // This ensures consistency with the initial processing
  return processContent(newContent);
}

/**
 * Check if content contains any special markers
 */
export function hasSpecialMarkers(content: string): boolean {
  return ALL_MARKERS.some(marker => 
    content.includes(marker.start) || content.includes(marker.end)
  );
}
