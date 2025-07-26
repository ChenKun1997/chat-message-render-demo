/**
 * Demo SSE endpoint for testing the chat interface
 * This simulates the expected SSE message format
 */

import { NextRequest } from 'next/server';

/**
 * Demo chart data for testing
 */
const DEMO_CHART_DATA = {
  type: 'line',
  title: 'Sample Sales Data',
  description: 'Monthly sales performance over the last 6 months',
  data: [
    { month: 'Jan', sales: 4000, target: 3500 },
    { month: 'Feb', sales: 3000, target: 3500 },
    { month: 'Mar', sales: 5000, target: 3500 },
    { month: 'Apr', sales: 4500, target: 3500 },
    { month: 'May', sales: 6000, target: 3500 },
    { month: 'Jun', sales: 5500, target: 3500 },
  ],
  xKey: 'month',
  yKey: 'sales'
};

/**
 * Demo content scenarios
 */
const DEMO_SCENARIOS = [
  {
    name: 'markdown_only',
    content: [
      'Hello! I can help you with various tasks.',
      '\n\n## Features\n\n',
      '- **Markdown rendering** with full GitHub Flavored Markdown support\n',
      '- **Chart generation** with interactive visualizations\n',
      '- **Real-time streaming** for responsive user experience\n\n',
      'What would you like to explore today?'
    ]
  },
  {
    name: 'markdown_with_chart',
    content: [
      'Here\'s an analysis of the sales data:\n\n',
      '## Sales Performance Report\n\n',
      'The data shows interesting trends over the past 6 months.\n\n',
      '[CON',
      'TENT',
      '_STA',
      'RT_',
      'CHART]',
      JSON.stringify(DEMO_CHART_DATA, null, 2),
      '[CONTENT_EN',
      'D_CHART]',
      '\n\n**Key Insights:**\n',
      '- Peak performance in May with 6,000 sales\n',
      '- Consistent performance above target\n',
      '- Growth trend visible from February onwards'
    ]
  },
  {
    name: 'multiple_content_types',
    content: [
      'Let me show you different content types:\n\n',
      '## 1. Regular Markdown\n',
      'This is regular markdown content with **bold** and *italic* text.\n\n',
      '## 2. Chart Visualization\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA, null, 2),
      '[CONTENT_END_CHART]',
      '\n## 3. Code Block\n',
      '[CONTENT_START_CODE]',
      'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      '[CONTENT_END_CODE]',
      '\n## 4. Thinking Process\n',
      '[CONTENT_START_THINKING]',
      'Let me think about this step by step:\n1. First, I need to analyze the data\n2. Then identify patterns\n3. Finally, provide insights',
      '[CONTENT_END_THINKING]',
      '\nThat covers the main content types!'
    ]
  }
];

/**
 * Simulate streaming delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * GET handler for SSE streaming
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get('scenario') || 'markdown_with_chart';
  
  // Find the demo scenario or default to the first one
  const demoScenario = DEMO_SCENARIOS.find(s => s.name === scenario) || DEMO_SCENARIOS[1];

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      /**
       * Send SSE message
       */
      const sendMessage = (eventType: string, data: string) => {
        const message = JSON.stringify({ eventType, data });
        const sseData = `data: ${message}\n\n`;
        controller.enqueue(encoder.encode(sseData));
      };

      try {
        // Send content_start event
        sendMessage('content_start', '');
        await delay(500);

        // Send content chunks with realistic delays
        for (const chunk of demoScenario.content) {
          sendMessage('content', chunk);
          // Vary delay based on chunk size for realism
          const delayMs = Math.min(Math.max(chunk.length * 20, 100), 800);
          await delay(delayMs);
        }

        // Send content_end event
        await delay(300);
        sendMessage('content_end', '');

      } catch (error) {
        console.error('SSE streaming error:', error);
        sendMessage('error', 'An error occurred while streaming content');
      } finally {
        controller.close();
      }
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
