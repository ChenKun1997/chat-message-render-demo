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

const DEMO_CHART_DATA_BAR = {
  type: 'bar',
  title: 'Product Category Sales',
  description: 'Sales distribution across product categories',
  data: [
    { category: 'Electronics', revenue: 45000, units: 150 },
    { category: 'Clothing', revenue: 32000, units: 400 },
    { category: 'Home & Garden', revenue: 28000, units: 200 },
    { category: 'Sports', revenue: 22000, units: 180 },
    { category: 'Books', revenue: 15000, units: 500 },
  ],
  xKey: 'category',
  yKey: 'revenue'
};

const DEMO_CHART_DATA_PIE = {
  type: 'pie',
  title: 'Market Share Distribution',
  description: 'Market share by company',
  data: [
    { name: 'Company A', value: 35 },
    { name: 'Company B', value: 25 },
    { name: 'Company C', value: 20 },
    { name: 'Company D', value: 15 },
    { name: 'Others', value: 5 },
  ]
};

const DEMO_TABLE_DATA = {
  title: 'Employee Performance Report',
  description: 'Q3 2024 performance metrics',
  headers: ['Employee', 'Department', 'Sales', 'Target', 'Achievement'],
  rows: [
    ['Alice Johnson', 'Sales', '$85,000', '$80,000', '106%'],
    ['Bob Smith', 'Sales', '$92,000', '$85,000', '108%'],
    ['Carol Davis', 'Marketing', '$78,000', '$75,000', '104%'],
    ['David Wilson', 'Sales', '$88,000', '$90,000', '98%'],
    ['Eva Brown', 'Tech', '$95,000', '$85,000', '112%'],
  ]
};

const DEMO_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop'
];

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
  },
  {
    name: 'all_content_types_complete',
    content: [
      '# Complete Content Types Demo\n\n',
      'Here\'s a comprehensive demonstration of all supported content types:\n\n',
      '## 1. Line Chart\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA, null, 2),
      '[CONTENT_END_CHART]',
      '\n\n## 2. Bar Chart\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA_BAR, null, 2),
      '[CONTENT_END_CHART]',
      '\n\n## 3. Pie Chart\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA_PIE, null, 2),
      '[CONTENT_END_CHART]',
      '\n\n## 4. Data Table\n',
      '[CONTENT_START_TABLE]',
      JSON.stringify(DEMO_TABLE_DATA, null, 2),
      '[CONTENT_END_TABLE]',
      '\n\n## 5. Code Examples\n',
      '### Python Data Analysis\n',
      '[CONTENT_START_CODE]',
      'import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load sales data\ndf = pd.read_csv("sales_data.csv")\n\n# Calculate monthly totals\nmonthly_sales = df.groupby("month")["sales"].sum()\n\n# Create visualization\nplt.figure(figsize=(10, 6))\nmonthly_sales.plot(kind="bar")\nplt.title("Monthly Sales Performance")\nplt.xlabel("Month")\nplt.ylabel("Sales")\nplt.show()',
      '[CONTENT_END_CODE]',
      '\n### JavaScript Frontend\n',
      '[CONTENT_START_CODE]',
      'async function fetchSalesData() {\n  try {\n    const response = await fetch(\'/api/sales\');\n    const data = await response.json();\n    \n    return data.map(item => ({\n      month: item.month,\n      sales: parseFloat(item.sales)\n    }));\n  } catch (error) {\n    console.error("Error fetching sales data:", error);\n    return [];\n  }\n}',
      '[CONTENT_END_CODE]',
      '\n## 6. Image Gallery\n',
      '[CONTENT_START_IMAGE]',
      JSON.stringify({ url: DEMO_IMAGE_URLS[0], alt: "Modern office workspace" }),
      '[CONTENT_END_IMAGE]',
      '\n\n[CONTENT_START_IMAGE]',
      JSON.stringify({ url: DEMO_IMAGE_URLS[1], alt: "Team collaboration" }),
      '[CONTENT_END_IMAGE]',
      '\n\n[CONTENT_START_IMAGE]',
      JSON.stringify({ url: DEMO_IMAGE_URLS[2], alt: "Data visualization" }),
      '[CONTENT_END_IMAGE]',
      '\n\n## 7. Thinking Process\n',
      '[CONTENT_START_THINKING]',
      'Analyzing the comprehensive dataset:\n\n1. **Data Overview**: We have sales data spanning 6 months with clear trends\n2. **Key Patterns**: \n   - Consistent growth from Feb to May\n   - Above-target performance throughout\n   - Seasonal variations visible\n\n3. **Recommendations**:\n   - Investigate May peak factors for replication\n   - Address February dip causes\n   - Consider Q4 projections based on trends\n\n4. **Next Steps**:\n   - Deep dive into regional performance\n   - Analyze product category contributions\n   - Predict Q4 outcomes',
      '[CONTENT_END_THINKING]',
      '\n\n## 8. MCP Tool Usage\n',
      '[CONTENT_START_MCP_TOOL]',
      JSON.stringify({
        tool: "sales_analyzer",
        action: "generate_report",
        parameters: {
          period: "Q3-2024",
          metrics: ["revenue", "growth", "target_achievement"],
          format: "executive_summary"
        },
        result: {
          status: "success",
          summary: "Q3 2024 exceeded targets by 12% with $550K revenue",
          insights: [
            "Electronics category drove 45% of total revenue",
            "New customer acquisition up 28% vs Q2",
            "Average deal size increased to $8,500"
          ]
        }
      }, null, 2),
      '[CONTENT_END_MCP_TOOL]',
      '\n\nThis comprehensive demo showcases all available content rendering capabilities!'
    ]
  },
  {
    name: 'interactive_dashboard',
    content: [
      '# Interactive Dashboard Demo\n\n',
      'Welcome to the interactive dashboard!\n\n',
      '## Executive Summary\n',
      '**Q3 Performance Highlights**\n\n',
      '- **Total Revenue**: $550,000 (12% above target)\n',
      '- **New Customers**: 1,250 (+28% vs Q2)\n',
      '- **Average Deal Size**: $8,500 (+15% growth)\n\n',
      '## Key Visualizations\n\n',
      '### Revenue Trends\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA, null, 2),
      '[CONTENT_END_CHART]',
      '\n\n### Category Performance\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA_BAR, null, 2),
      '[CONTENT_END_CHART]',
      '\n\n### Market Position\n',
      '[CONTENT_START_CHART]',
      JSON.stringify(DEMO_CHART_DATA_PIE, null, 2),
      '[CONTENT_END_CHART]',
      '\n\n## Detailed Breakdown\n',
      '### Employee Performance Table\n',
      '[CONTENT_START_TABLE]',
      JSON.stringify(DEMO_TABLE_DATA, null, 2),
      '[CONTENT_END_TABLE]',
      '\n\n### Code for Analysis\n',
      '[CONTENT_START_CODE]',
      '# Python script for Q3 analysis\nimport pandas as pd\nimport numpy as np\n\n# Load Q3 data\nq3_data = pd.read_csv("q3_sales.csv")\n\n# Calculate key metrics\ntotal_revenue = q3_data["revenue"].sum()\navg_deal_size = q3_data["deal_size"].mean()\ngrowth_rate = ((total_revenue - q2_revenue) / q2_revenue) * 100\n\nprint(f"Q3 Revenue: ${total_revenue:,.0f}")\nprint(f"Growth Rate: {growth_rate:.1f}%")\nprint(f"Avg Deal Size: ${avg_deal_size:,.0f}")',
      '[CONTENT_END_CODE]',
      '\n\n### Real-time Insights\n',
      '[CONTENT_START_THINKING]',
      'Processing dashboard insights:\n\n1. **Revenue Analysis**: $550K exceeded $490K target by 12.2%\n2. **Growth Drivers**: Electronics (+45%), B2B segment (+38%)\n3. **Risk Factors**: Seasonal dip in September, increased competition\n4. **Opportunities**: Holiday season Q4 projection shows 20% potential growth\n5. **Action Items**: \n   - Increase marketing spend for Q4 push\n   - Focus on high-margin electronics\n   - Expand B2B outreach programs',
      '[CONTENT_END_THINKING]',
      '\n\n### Generated Report\n',
      '[CONTENT_START_MCP_TOOL]',
      JSON.stringify({
        tool: "dashboard_generator",
        action: "create_executive_report",
        parameters: {
          quarter: "Q3-2024",
          include_forecasts: true,
          format: "presentation"
        },
        result: {
          status: "completed",
          slides_generated: 12,
          key_metrics: {
            revenue: 550000,
            growth: 12.2,
            customer_satisfaction: 94.5
          },
          recommendations: [
            "Increase Q4 marketing budget by 15%",
            "Launch new electronics product line",
            "Implement customer retention program"
          ]
        }
      }, null, 2),
      '[CONTENT_END_MCP_TOOL]',
      '\n\nDashboard analysis complete! 🚀'
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
