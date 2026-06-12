'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onAddClick?: () => void;
  addLabel?: string;
  csvName?: string;
  onImportSuccess?: (importedData: any[]) => void;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  onAddClick,
  addLabel = 'Add New',
  csvName = 'table-records',
  onImportSuccess,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sorting Handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 1. Search Filtering
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    return data.filter((item) => {
      const value = item[searchKey as string];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      
      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  // 4. CSV Export
  const exportToCSV = () => {
    try {
      if (data.length === 0) {
        toast.warning('No records available to export.');
        return;
      }

      const headers = columns.map(c => c.header).join(',');
      const rows = data.map(row => {
        return columns.map(col => {
          const val = row[col.accessorKey as string];
          // Escape strings containing commas
          const cellVal = val !== undefined && val !== null ? String(val) : '';
          return cellVal.includes(',') ? `"${cellVal}"` : cellVal;
        }).join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${csvName}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CSV Export downloaded successfully.');
    } catch {
      toast.error('Failed to export CSV.');
    }
  };

  // 5. CSV Import Mock
  const triggerCSVImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1500)),
          {
            loading: 'Reading CSV structure...',
            success: () => {
              // Simulating random imports
              if (onImportSuccess) {
                onImportSuccess([]); // Trigger updates
              }
              return 'CSV records imported successfully into local view cache.';
            },
            error: 'Failed to process CSV file.',
          }
        );
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* Search & Bulk Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-xl border">
        {searchKey ? (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 text-xs"
            />
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" onClick={triggerCSVImport} className="text-xs">
            <Upload className="h-4 w-4 mr-1.5" /> Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV} className="text-xs">
            <Download className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>
          {onAddClick && (
            <Button size="sm" onClick={onAddClick} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
              <Plus className="h-4 w-4 mr-1.5" /> {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className="font-semibold text-xs py-3.5">
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.accessorKey as string)}
                      className="flex items-center hover:text-foreground text-left"
                    >
                      {col.header}
                      {sortConfig?.key === col.accessorKey ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="ml-1 h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="ml-1 h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12 text-sm text-muted-foreground">
                  No records matching search parameters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className="text-xs py-3.5">
                      {col.render ? col.render(row) : row[col.accessorKey as string]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
