# Implementation Guide

## Overview

This document provides a comprehensive guide to the AI Chat Interface implementation, including how to test it, extend it, and integrate it with your backend.

## Testing the Implementation

### 1. Start the Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

### 2. Test Demo Scenarios

The interface includes demo controls at the top. Try these scenarios:

1. **Markdown Only**: Tests basic markdown rendering
2. **Markdown + Chart**: Tests content with embedded chart visualization
3. **Multiple Content Types**: Showcases various content renderers

### 3. Manual Testing

You can also type messages manually. The system will default to the "markdown_with_chart" scenario for any custom message.

## Expected Behavior

### SSE Message Flow

1. **content_start**: Initializes a new streaming message
2. **content**: Accumulates content progressively
3. **content_end**: Finalizes the message

### Content Processing

1. **Markdown Content**: Rendered immediately as it streams
2. **Special Markers**: When `[CONTENT_START_CHART]` is detected:
   - Content before marker is rendered as markdown
   - Chart skeleton/loading state is shown
   - Subsequent data is collected for chart
   - When `[CONTENT_END_CHART]` is detected, skeleton is replaced with actual chart

### Real-time Updates

- Content blocks update in real-time as new data arrives
- Loading skeletons show appropriate animations
- Charts render with smooth transitions

## Integration with Your Backend

### 1. Replace the Demo API

Replace `/api/chat/stream/route.ts` with your actual SSE endpoint:

```typescript
// In useChat.ts, update the URL
await connect({
  url: 'https://your-api.com/chat/stream',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### 2. Send User Messages

Modify the `sendMessage` function to actually send messages to your backend:

```typescript
const sendMessage = useCallback(async (content: string) => {
  // Add user message to UI
  const userMessage = { /* ... */ };
  setMessages(prev => [...prev, userMessage]);

  // Send to backend
  await fetch('/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content }),
  });

  // Connect to SSE for response
  await connect({ url: '/api/chat/stream' });
}, []);
```

### 3. Backend SSE Implementation

Your backend should send messages in this format:

```json
{"eventType":"content_start","data":""}
{"eventType":"content","data":"Hello! Here's your analysis:\n\n"}
{"eventType":"content","data":"## Results\n\n"}
{"eventType":"content","data":"[CONTENT_START_CHART]"}
{"eventType":"content","data":"{\"type\":\"line\",\"data\":[...]}"}
{"eventType":"content","data":"[CONTENT_END_CHART]"}
{"eventType":"content_end","data":""}
```

## Adding New Content Types

### 1. Define Content Markers

```typescript
// In src/types/content.ts
export const CONTENT_MARKERS = {
  // ... existing markers
  MY_CONTENT: {
    START: '[CONTENT_START_MY_CONTENT]',
    END: '[CONTENT_END_MY_CONTENT]'
  }
} as const;
```

### 2. Create Renderer Component

```typescript
// src/components/content/MyContentRenderer.tsx
import { ContentRendererProps } from '@/types/content';

export function MyContentRenderer({ block }: ContentRendererProps) {
  if (!block.isComplete) {
    return <SkeletonLoader type="my_content" />;
  }

  // Parse and render your content
  const data = JSON.parse(block.content);
  
  return (
    <div className="my-4 p-4 border rounded-lg">
      <h4>{data.title}</h4>
      {/* Your custom rendering logic */}
    </div>
  );
}
```

### 3. Register the Renderer

```typescript
// In src/components/content/ContentRenderer.tsx
import { MyContentRenderer } from './MyContentRenderer';

const contentRenderers: ContentRendererRegistry = {
  // ... existing renderers
  my_content: MyContentRenderer,
};
```

### 4. Update Content Processor

```typescript
// In src/utils/contentProcessor.ts
const ALL_MARKERS: MarkerConfig[] = [
  // ... existing markers
  { 
    start: CONTENT_MARKERS.MY_CONTENT.START, 
    end: CONTENT_MARKERS.MY_CONTENT.END, 
    type: 'my_content' 
  },
];
```

## Error Handling

### Connection Errors

The system automatically handles:
- Connection failures with retry logic
- Parse errors with error display
- Network interruptions with reconnection

### Content Errors

- Invalid JSON in charts shows error state with raw data
- Unknown content types show fallback renderer
- Incomplete content shows loading states

## Performance Considerations

### Memory Management

- Messages are stored in React state (consider pagination for large conversations)
- SSE connections are properly cleaned up on unmount
- Content processing is optimized for streaming

### Rendering Optimization

- Content blocks are memoized to prevent unnecessary re-renders
- Skeleton loaders provide immediate feedback
- Charts use ResponsiveContainer for proper sizing

## Security Considerations

### Input Sanitization

- Markdown content is sanitized by react-markdown
- Chart data should be validated before rendering
- SSE messages should be validated on the backend

### CORS Configuration

Ensure your SSE endpoint has proper CORS headers:

```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

## Troubleshooting

### Common Issues

1. **SSE Connection Fails**: Check CORS headers and endpoint URL
2. **Charts Don't Render**: Verify JSON format and data structure
3. **Markdown Not Rendering**: Check for content block processing issues
4. **TypeScript Errors**: Ensure all types are properly imported

### Debug Mode

Enable debug logging:

```typescript
// In useSSE.ts
console.log('SSE message received:', message);

// In contentProcessor.ts
console.log('Processing content:', content);
console.log('Generated blocks:', blocks);
```

## Production Deployment

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_SSE_ENDPOINT=https://your-api.com/chat/stream
```

### Build Optimization

```bash
npm run build
npm start
```

### Monitoring

Consider adding:
- Error tracking (Sentry, etc.)
- Performance monitoring
- SSE connection health checks
- User analytics

## Future Enhancements

### Planned Features

1. **Message Persistence**: Save conversations to database
2. **User Authentication**: Integrate with auth providers
3. **File Uploads**: Support for image and document uploads
4. **Voice Input**: Speech-to-text integration
5. **Export Options**: PDF/Word export of conversations
6. **Collaborative Features**: Multi-user chat rooms

### Extensibility Points

1. **Custom Themes**: Tailwind CSS customization
2. **Plugin System**: Dynamic renderer loading
3. **Webhook Integration**: External service notifications
4. **Analytics**: Custom event tracking
5. **Internationalization**: Multi-language support
