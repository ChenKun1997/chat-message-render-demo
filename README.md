# AI Chat Interface Demo

A comprehensive streaming chat interface built with Next.js that processes Server-Sent Events (SSE) and renders different types of content dynamically, including markdown, charts, images, tables, code blocks, and more.

## Features

- **Real-time SSE Streaming**: Uses `@microsoft/fetch-event-source` for robust SSE handling
- **Dynamic Content Rendering**: Supports multiple content types with extensible renderer system
- **Modular Architecture**: Decoupled UI rendering layer from message processing
- **TypeScript**: Comprehensive type safety throughout the application
- **Modern UI**: Built with Tailwind CSS v4 and responsive design
- **Extensible**: Easy to add new content renderers without modifying core logic

## Supported Content Types

- **Markdown**: GitHub Flavored Markdown with syntax highlighting
- **Charts**: Interactive charts using Recharts (line, bar, pie, area)
- **Code Blocks**: Syntax-highlighted code with copy functionality
- **Thinking Process**: Special rendering for AI reasoning steps
- **MCP Tool Calls**: Formatted tool execution results
- **Images**: (Placeholder - ready for implementation)
- **Tables**: (Placeholder - ready for implementation)

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## SSE Message Format

The system expects SSE messages in this format:

```json
{"eventType":"content_start","data":""}
{"eventType":"content","data":"Hello"}
{"eventType":"content","data":"## Markdown"}
{"eventType":"content","data":"[CONTENT_START_CHART]"}
{"eventType":"content","data":"Chart data"}
{"eventType":"content","data":"[CONTENT_END_CHART]"}
{"eventType":"content_end","data":""}
```

## Content Markers

Special markers are used to identify different content types:

- `[CONTENT_START_CHART]` / `[CONTENT_END_CHART]` - Chart data
- `[CONTENT_START_CODE]` / `[CONTENT_END_CODE]` - Code blocks
- `[CONTENT_START_THINKING]` / `[CONTENT_END_THINKING]` - AI reasoning
- `[CONTENT_START_IMAGE]` / `[CONTENT_END_IMAGE]` - Images
- `[CONTENT_START_TABLE]` / `[CONTENT_END_TABLE]` - Tables
- `[CONTENT_START_MCP_TOOL]` / `[CONTENT_END_MCP_TOOL]` - Tool calls

## Architecture

### Core Components

1. **Message Processing Layer**: Handles SSE events and accumulates content
2. **Content Detection Layer**: Identifies special markers like `[CONTENT_START_CHART]`
3. **Rendering Layer**: Renders different content types based on detected markers

### Key Files

```
src/
├── hooks/
│   ├── useSSE.ts          # SSE connection management
│   ├── useChat.ts         # Main chat orchestration
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx    # Main chat component
│   │   ├── MessageList.tsx      # Message display
│   │   ├── Message.tsx          # Individual message
│   │   └── ChatInput.tsx        # Input component
│   ├── content/
│   │   ├── ContentRenderer.tsx  # Main content orchestrator
│   │   ├── MarkdownRenderer.tsx # Markdown rendering
│   │   ├── ChartRenderer.tsx    # Chart visualization
│   │   └── SkeletonLoader.tsx   # Loading states
│   └── ui/
│       └── Button.tsx           # Reusable button
├── types/
│   ├── sse.ts            # SSE message types
│   ├── chat.ts           # Chat state types
│   └── content.ts        # Content rendering types
└── utils/
    └── contentProcessor.ts # Content parsing logic
```

## Adding New Content Renderers

1. **Create a new renderer component**:
```tsx
// src/components/content/MyRenderer.tsx
import { ContentRendererProps } from '@/types/content';

export function MyRenderer({ block }: ContentRendererProps) {
  return (
    <div className="my-4 p-4 border rounded-lg">
      <h4>My Custom Content</h4>
      <pre>{block.content}</pre>
    </div>
  );
}
```

2. **Register the renderer**:
```tsx
// In ContentRenderer.tsx
import { MyRenderer } from './MyRenderer';

const contentRenderers: ContentRendererRegistry = {
  // ... existing renderers
  my_content: MyRenderer,
};
```

3. **Add content markers**:
```tsx
// In src/types/content.ts
export const CONTENT_MARKERS = {
  // ... existing markers
  MY_CONTENT: {
    START: '[CONTENT_START_MY_CONTENT]',
    END: '[CONTENT_END_MY_CONTENT]'
  }
} as const;
```

## Chart Data Format

Charts expect JSON data in this format:

```json
{
  "type": "line",
  "title": "Sample Chart",
  "description": "Chart description",
  "data": [
    {"x": "Jan", "y": 100},
    {"x": "Feb", "y": 200}
  ],
  "xKey": "x",
  "yKey": "y"
}
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **@microsoft/fetch-event-source** - SSE handling
- **react-markdown** - Markdown rendering
- **recharts** - Chart visualization
- **remark-gfm** - GitHub Flavored Markdown

## Demo API

The project includes a demo SSE endpoint at `/api/chat/stream` with scenarios:
- `markdown_only` - Simple markdown content
- `markdown_with_chart` - Markdown with embedded chart
- `multiple_content_types` - Showcase of various renderers

## License

MIT License
