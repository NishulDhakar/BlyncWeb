"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Filter,
  CheckSquare,
  Square,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchKey?: (item: T) => string;
  filterOptions?: { label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (val: string) => void;
  bulkActions?: {
    label: string;
    action: (selectedIds: string[]) => void;
    variant?: "default" | "destructive";
  }[];
  onExportCsv?: () => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = "Search...",
  searchKey,
  filterOptions,
  activeFilter,
  onFilterChange,
  bulkActions,
  onExportCsv,
  pageSize = 15,
  emptyTitle = "No records found",
  emptyDescription = "Try changing search terms or filters.",
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter & Search
  const filteredData = useMemo(() => {
    let list = [...data];
    if (search && searchKey) {
      const q = search.toLowerCase();
      list = list.filter((item) => searchKey(item).toLowerCase().includes(q));
    }
    if (sortKey) {
      list.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        return sortOrder === "asc" ? 1 : -1;
      });
    }
    return list;
  }, [data, search, searchKey, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else {
        setSortKey(null);
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(keyExtractor)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          {searchKey && (
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 pl-8 text-xs font-medium"
              />
            </div>
          )}

          {filterOptions && filterOptions.length > 0 && onFilterChange && (
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              <div className="flex items-center rounded-lg border border-border/70 bg-card p-0.5 text-xs">
                {filterOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      onFilterChange(f.value);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                      activeFilter === f.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && bulkActions && (
            <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-foreground">
              <span className="font-semibold tabular-nums">
                {selectedIds.size} selected
              </span>
              <div className="h-3 w-[1px] bg-border mx-1" />
              {bulkActions.map((ba) => (
                <Button
                  key={ba.label}
                  size="sm"
                  variant={ba.variant || "outline"}
                  onClick={() => ba.action(Array.from(selectedIds))}
                  className="h-7 text-xs px-2"
                >
                  {ba.label}
                </Button>
              ))}
            </div>
          )}

          {onExportCsv && (
            <Button
              size="sm"
              variant="outline"
              onClick={onExportCsv}
              className="h-9 gap-1.5 text-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Table Box */}
      <div className="relative overflow-x-auto rounded-xl border border-border/80 bg-card shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
              {bulkActions && (
                <th className="w-8 px-3 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center justify-center cursor-pointer"
                  >
                    {selectedIds.size === paginatedData.length &&
                    paginatedData.length > 0 ? (
                      <CheckSquare className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Square className="h-3.5 w-3.5 opacity-60" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-3.5 py-2.5 font-medium whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable &&
                      "cursor-pointer select-none hover:text-foreground"
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={cn(
                      "inline-flex items-center gap-1",
                      col.align === "right" && "justify-end",
                      col.align === "center" && "justify-center"
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        className={cn(
                          "h-3 w-3",
                          sortKey === col.key
                            ? "text-primary opacity-100"
                            : "opacity-40"
                        )}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {bulkActions && <td className="px-3 py-3 w-8" />}
                  {columns.map((c) => (
                    <td key={c.key} className="px-3.5 py-3">
                      <div className="h-3 w-3/4 rounded bg-muted/60" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (bulkActions ? 1 : 0)}
                  className="py-12"
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={cn(
                      "transition-colors hover:bg-muted/40",
                      isSelected && "bg-primary/[0.04]",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {bulkActions && (
                      <td className="w-8 px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={(e) => toggleSelect(id, e)}
                          className="flex items-center justify-center cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Square className="h-3.5 w-3.5 opacity-50" />
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-3.5 py-2.5 whitespace-nowrap text-foreground",
                          col.align === "right" && "text-right font-mono",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {col.render
                          ? col.render(item)
                          : ((item as any)[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {!loading && filteredData.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/80 px-4 py-2 text-xs text-muted-foreground">
            <span className="tabular-nums">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length} records
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="tabular-nums px-2 font-medium text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
