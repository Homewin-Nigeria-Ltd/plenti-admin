"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import type { InventoryItem, InventoryStatus } from "@/data/inventory";
import { Ellipsis, Search, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { EditInventoryModal } from "./EditInventoryModal";
import { DeleteInventoryModal } from "./DeleteInventoryModal";

type InventoryTableProps = {
  items: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedWarehouse: string;
  onWarehouseChange: (warehouse: string) => void;
  warehouses: string[];
  onAddStockClick: () => void;
};

export default function InventoryTable({
  items,
  total,
  page,
  pageSize,
  onPageChange,
  searchQuery,
  onSearchChange,
  selectedWarehouse,
  onWarehouseChange,
  warehouses,
  onAddStockClick,
}: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<InventoryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const getStatusBadgeClass = (status: InventoryStatus) => {
    switch (status) {
      case "High Stock":
        return "badge-success";
      case "Medium Stock":
        return "badge-warning";
      case "Low Stock":
        return "badge-danger";
      default:
        return "badge-neutral";
    }
  };

  const columns = [
    { key: "product", label: "Product" },
    { key: "warehouse", label: "Warehouse" },
    { key: "quantity", label: "Quantity" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "status", label: "Status" },
    { key: "batch", label: "Batch" },
    { key: "supplier", label: "Supplier" },
    { key: "actions", label: "Actions" },
  ];

  const tableRows = items.map((item) => ({
    product: (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-primary-700 text-xs sm:text-sm truncate">{item.productName}</p>
          <p className="text-neutral-500 text-xs truncate">ID: {item.productId}</p>
        </div>
      </div>
    ),
    warehouse: (
      <span className="text-neutral-700 text-sm">{item.warehouseId}</span>
    ),
    quantity: (
      <span className="text-neutral-700 text-sm font-medium">{item.quantity}</span>
    ),
    expiryDate: (
      <span className="text-neutral-700 text-sm">
        {item.expiryDate || "N/A"}
      </span>
    ),
    status: (
      <span className={`badge ${getStatusBadgeClass(item.status)}`}>
        {item.status}
      </span>
    ),
    batch: (
      <span className="text-neutral-700 text-sm">{item.batch}</span>
    ),
    supplier: (
      <span className="text-neutral-700 text-sm">{item.supplier}</span>
    ),
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setSelectedItem(item);
              setIsEditModalOpen(true);
            }}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-danger-500"
            onClick={() => {
              setItemToDelete(item);
              setIsDeleteModalOpen(true);
            }}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-[80%]">
          <div className="border border-neutral-300 rounded-[8px] h-[53px] flex items-center gap-2 p-2 px-4 flex-1">
            <Search className="size-5 text-neutral-500 shrink-0" />
            <Input
              className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none h-auto p-0 bg-transparent"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={selectedWarehouse} onValueChange={onWarehouseChange}>
            <SelectTrigger className="form-control flex-1">
              <SelectValue placeholder="All Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouse</SelectItem>
              {warehouses.map((wh) => (
                <SelectItem key={wh} value={wh}>
                  {wh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onAddStockClick}
          className="btn btn-primary w-full sm:w-[20%] shrink-0">
          <Plus className="size-4 mr-2" />
          Add New Stock
        </Button>
      </div>

      {total === 0 ? (
        <div className="text-center py-12 text-neutral-500 bg-white rounded-xl">
          No inventory items found matching your search criteria.
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableHead
                      key={c.key}
                      className="text-[#667085] bg-white text-[14px] font-normal">
                      {c.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-neutral-50 transition-colors">
                    {columns.map((c) => (
                      <TableCell key={c.key}>{row[c.key as keyof typeof row]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-4 py-3">
            <p className="text-xs sm:text-sm text-[#667085] order-3 sm:order-1">
              Page {page} of {pageCount}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center order-1 sm:order-2">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className={`rounded-full border border-[#EEF1F6] p-1 sm:p-1.5 ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
                }`}>
                <ChevronLeft className="size-3 sm:size-4 text-[#667085]" />
              </button>
              {Array.from({ length: Math.min(pageCount, 6) }, (_, i) => {
                let pageNum;
                if (pageCount <= 6) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pageCount - 2) {
                  pageNum = pageCount - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-primary text-white"
                        : "text-[#667085] hover:bg-neutral-50"
                    }`}>
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={page === pageCount}
                onClick={() => onPageChange(page + 1)}
                className={`rounded-full border border-[#EEF1F6] p-1 sm:p-1.5 ${
                  page === pageCount ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50"
                }`}>
                <ChevronRight className="size-3 sm:size-4 text-[#667085]" />
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end order-2 sm:order-3">
              <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className={`btn btn-outline !h-auto px-3 py-1.5 text-xs sm:text-sm flex-1 sm:flex-none ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Previous
              </button>
              <button
                disabled={page === pageCount}
                onClick={() => onPageChange(page + 1)}
                className={`btn btn-outline !h-auto px-3 py-1.5 text-xs sm:text-sm flex-1 sm:flex-none ${
                  page === pageCount ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        warehouses={warehouses}
      />
      <DeleteInventoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        item={itemToDelete}
        onConfirm={() => {
          console.log("Delete inventory item:", itemToDelete?.id);
        }}
      />
    </div>
  );
}
