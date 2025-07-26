/**
 * Chart content renderer component using Recharts
 */

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ContentRendererProps, ChartData } from '@/types/content';
import { SkeletonLoader } from '../SkeletonLoader';

/**
 * Color palette for charts
 */
const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8dd1e1'
];

/**
 * Parse chart data from content string
 */
function parseChartData(content: string): ChartData | null {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(content);
    
    // Validate the structure
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
      return {
        type: parsed.type || 'line',
        data: parsed.data,
        xKey: parsed.xKey || 'x',
        yKey: parsed.yKey || 'y',
        title: parsed.title,
        description: parsed.description,
      };
    }
  } catch (error) {
    // If JSON parsing fails, try to parse as simple CSV-like format
    const lines = content.trim().split('\n');
    if (lines.length > 1) {
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to parse as number, otherwise keep as string
          row[header] = isNaN(Number(value)) ? value : Number(value);
        });
        return row;
      });

      return {
        type: 'line',
        data,
        xKey: headers[0],
        yKey: headers[1],
      };
    }
  }

  return null;
}

/**
 * Renders different types of charts based on the chart data
 */
export function ChartRenderer({ block }: ContentRendererProps) {
  const chartData = useMemo(() => {
    if (!block.isComplete || !block.content.trim()) {
      return null;
    }
    return parseChartData(block.content);
  }, [block.content, block.isComplete]);

  // Show skeleton loader while loading or if content is incomplete
  if (!block.isComplete || block.isLoading) {
    return <SkeletonLoader type="chart" className="my-4" />;
  }

  // Show error state if chart data couldn't be parsed
  if (!chartData) {
    return (
      <div className="my-4 p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
        <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">Chart Error</h4>
        <p className="text-red-600 dark:text-red-300 text-sm">
          Unable to parse chart data. Expected JSON format with data array.
        </p>
        <details className="mt-2">
          <summary className="text-red-600 dark:text-red-300 text-sm cursor-pointer">
            Show raw data
          </summary>
          <pre className="mt-2 p-2 bg-red-100 dark:bg-red-800 rounded text-xs overflow-x-auto">
            {block.content}
          </pre>
        </details>
      </div>
    );
  }

  const { type, data, xKey, yKey, title, description } = chartData;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill={CHART_COLORS[0]} />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={CHART_COLORS[0]}
              fill={CHART_COLORS[0]}
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS[0] }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
