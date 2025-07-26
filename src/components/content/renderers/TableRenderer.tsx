/**
 * Table content renderer component with CSV/JSON parsing and sorting capabilities
 */

import React, { useState, useMemo } from 'react';
import { ContentRendererProps } from '@/types/content';

interface TableData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * Parse table data from content string
 */
function parseTableData(content: string): TableData | null {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(content);
    
    if (parsed && typeof parsed === 'object') {
      // Handle array of objects format
      if (Array.isArray(parsed) && parsed.length > 0) {
        const headers = Object.keys(parsed[0]);
        const rows = parsed.map(row => headers.map(header => row[header] ?? ''));
        return { headers, rows };
      }
      
      // Handle explicit table format
      if (parsed.headers && Array.isArray(parsed.headers) && 
          parsed.rows && Array.isArray(parsed.rows)) {
        return {
          headers: parsed.headers,
          rows: parsed.rows,
          title: parsed.title,
        };
      }
    }
  } catch {
    // If JSON parsing fails, try to parse as CSV
    const lines = content.trim().split('\n');
    if (lines.length >= 2) {
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const rows = lines.slice(1).map(line => {
        return line.split(',').map(cell => {
          const trimmed = cell.trim().replace(/^["']|["']$/g, '');
          // Try to parse as number, otherwise keep as string
          const num = Number(trimmed);
          return isNaN(num) ? trimmed : num;
        });
      });
      
      return { headers, rows };
    }
  }

  return null;
}

/**
 * Renders table content with sorting and responsive design
 */
export function TableRenderer({ block }: ContentRendererProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const tableData = useMemo(() => {
    if (!block.content.trim()) return null;
    return parseTableData(block.content);
  }, [block.content]);

  const sortedData = useMemo(() => {
    if (!tableData || sortColumn === null || sortDirection === null) {
      return tableData;
    }

    const sortedRows = [...tableData.rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      // Handle different data types
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return {
      ...tableData,
      rows: sortedRows,
    };
  }, [tableData, sortColumn, sortDirection]);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  // Show error state if table data couldn't be parsed
  if (!sortedData) {
    return (
      <div className="my-4 p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Invalid Table Data</h4>
        <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-2">
          Unable to parse table data. Expected CSV format or JSON with headers and rows.
        </p>
        <details className="mt-2">
          <summary className="text-yellow-600 dark:text-yellow-300 text-sm cursor-pointer">
            Show raw data
          </summary>
          <pre className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-xs overflow-x-auto">
            {block.content}
          </pre>
        </details>
      </div>
    );
  }

  const { headers, rows, title } = sortedData;

  return (
    <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {title && (
        <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
          {title}
        </h4>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              {headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    {sortColumn === index && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {rows.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {rows.length} row{rows.length !== 1 ? 's' : ''} • Click column headers to sort
        </p>
      )}
    </div>
  );
}
