"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const BANNER_COLUMNS = [
  "Created Date",
  "Image",
  "Heading",
  "Sub-heading",
  "Link",
  "Screen Location",
  "Sort",
  "Type",
  "Status",
];

const ROW_COUNT = 6;

export function BannersTableSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-x-auto">
      <Table className="">
        <TableHeader>
          <TableRow>
            {BANNER_COLUMNS.map((label) => (
              <TableHead
                key={label}
                className="text-[#667085] bg-white text-[14px] font-normal"
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: ROW_COUNT }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-10 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28 max-w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-14 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
