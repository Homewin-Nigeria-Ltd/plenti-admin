"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Column = {
  key: string;
  label: string;
  className?: string;
};

type DataTableProps<T extends Record<string, React.ReactNode>> = {
  columns: Column[];
  rows: T[];
  page?: number;
  pageSize?: number;
  total?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
};

export default function DataTable<T extends Record<string, React.ReactNode>>({
  columns,
  rows,
  page = 1,
  pageSize = rows.length,
  total = rows.length,
  pageCount,
  onPageChange,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const resolvedPageCount =
    pageCount ?? Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < resolvedPageCount;

  return (
    <div className={cn("bg-white rounded-xl", className)}>
      <Table className="min-w-180">
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead
                key={c.key}
                className={cn(
                  c.className,
                  "text-[#667085] bg-white text-[14px] font-normal"
                )}
              >
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              onClick={() => onRowClick?.(row, idx)}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((c) => (
                <TableCell key={c.key} className={cn(c.className)}>
                  {row[c.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-[#667085]">
          Page {page} of {resolvedPageCount}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={!canPrev}
            onClick={() => onPageChange?.(page - 1)}
            className={cn(
              "rounded-full border border-[#EEF1F6] px-3 py-1 text-sm ml-2",
              !canPrev && "opacity-50 cursor-not-allowed"
            )}
          >
            Previous
          </button>
          <button
            disabled={!canNext}
            onClick={() => onPageChange?.(page + 1)}
            className={cn(
              "rounded-full border border-[#EEF1F6] px-3 py-1 text-sm",
              !canNext && "opacity-50 cursor-not-allowed"
            )}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
