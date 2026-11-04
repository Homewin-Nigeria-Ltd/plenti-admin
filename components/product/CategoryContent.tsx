"use client";

import DataTable from "@/components/common/DataTable";
import { CreateCategoryModal } from "@/components/product/CreateCategoryModal";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { flattenAdminCategories } from "@/lib/mappers/categories";
import { getProductPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import type { AdminCategory } from "@/types/ProductTypes";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function findCategory(
  categories: AdminCategory[],
  id: number,
): AdminCategory | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    const sub = cat.subcategories?.find((item) => item.id === id);
    if (sub) {
      return {
        ...sub,
        parent_id: sub.parent_id ?? cat.id,
        subcategories: [],
      };
    }
  }
  return null;
}

export default function CategoryContent() {
  const account = useAccountStore((state) => state.account);
  const {
    canCreateProducts,
    canEditProducts,
    canDeleteProducts,
  } = React.useMemo(() => getProductPermissions(account), [account]);

  const {
    categories,
    loadingCategories,
    categoriesError,
    deletingById,
    fetchCategories,
    deleteCategory,
  } = useCategoryStore();

  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<AdminCategory | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<{
    id: number;
    name: string;
  } | null>(null);

  React.useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const rows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const flattened = flattenAdminCategories(categories);
    if (!query) return flattened;
    return flattened.filter((row) =>
      [row.name, row.slug, row.parentName, row.type]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [categories, search]);

  const handleEdit = (id: number) => {
    const found = findCategory(categories, id);
    if (!found) return;
    setEditingCategory(found);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const ok = await deleteCategory(pendingDelete.id);
    if (ok) {
      toast.success("Category deleted");
      setPendingDelete(null);
    } else {
      toast.error(
        useCategoryStore.getState().deleteCategoryError ??
          "Failed to delete category",
      );
    }
  };

  const columns = [
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "parent", label: "Parent" },
    { key: "slug", label: "Slug" },
    { key: "created", label: "Date created" },
    { key: "actions", label: "Actions" },
  ];

  const tableRows = rows.map((row) => ({
    id: row.id,
    image: row.imageUrl ? (
      <div className="relative size-10 overflow-hidden rounded-md bg-[#F2F4F7]">
        <Image
          src={row.imageUrl}
          alt={row.name}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      </div>
    ) : (
      <div className="size-10 rounded-md bg-[#F2F4F7]" />
    ),
    name: (
      <span className="font-medium text-[#101928]">{row.name}</span>
    ),
    type: <span className="text-[#667085]">{row.type}</span>,
    parent: <span className="text-[#667085]">{row.parentName}</span>,
    slug: <span className="text-[#667085]">{row.slug || "—"}</span>,
    created: (
      <span className="text-[#667085] whitespace-nowrap">
        {formatDate(row.created_at)}
      </span>
    ),
    actions: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#EAECF0] text-[#667085] hover:bg-[#F9FAFB]"
            aria-label={`Actions for ${row.name}`}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          {canEditProducts ? (
            <DropdownMenuItem onSelect={() => handleEdit(row.id)}>
              Edit
            </DropdownMenuItem>
          ) : null}
          {canDeleteProducts ? (
            <DropdownMenuItem
              variant="destructive"
              disabled={Boolean(deletingById[row.id])}
              onSelect={() => setPendingDelete({ id: row.id, name: row.name })}
            >
              Delete
            </DropdownMenuItem>
          ) : null}
          {!canEditProducts && !canDeleteProducts ? (
            <DropdownMenuItem disabled>No actions</DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }));

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="border border-neutral-100 rounded-xl h-12.5 flex items-center gap-1 p-2 px-4 shadow-sm flex-1 max-w-full sm:max-w-md">
          <Search className="size-5 text-neutral-500 shrink-0" />
          <Input
            className="w-full placeholder:text-primary-700 border-0 outline-none focus-visible:ring-0 shadow-none"
            placeholder="Search categories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {canCreateProducts ? (
          <Button
            className="btn btn-primary w-full sm:w-auto rounded-lg"
            onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add Category
          </Button>
        ) : null}
      </div>

      {categoriesError ? (
        <p className="text-sm text-red-600">{categoriesError}</p>
      ) : null}

      {loadingCategories && categories.length === 0 ? (
        <div className="space-y-3 rounded-xl border border-[#EEF1F6] p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-[#EEF1F6] bg-white p-8 text-center">
          <p className="text-base font-medium text-[#101928]">
            {search.trim()
              ? "No categories match your search"
              : "No categories yet"}
          </p>
          <p className="mt-1 text-sm text-[#667085]">
            {search.trim()
              ? "Try a different keyword."
              : "Create a category to organize products."}
          </p>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto">
          <DataTable columns={columns} rows={tableRows} />
        </div>
      )}

      <CreateCategoryModal
        isOpen={modalOpen}
        category={editingCategory}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
      />

      <AlertDialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open && pendingDelete && !deletingById[pendingDelete.id]) {
            setPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-[12px] border-0 p-6 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-[#0B1E66] text-[18px]">
              Delete {pendingDelete?.name ?? "this category"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-[#667085]">
              This cannot be undone. Products in this category may need to be
              reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={pendingDelete != null && Boolean(deletingById[pendingDelete.id])}
              className="rounded-[8px] h-[52px] border border-[#D42620] bg-transparent hover:bg-white hover:text-[#D42620] text-[#D42620] disabled:opacity-70"
              onClick={() => void confirmDelete()}
            >
              {pendingDelete != null && deletingById[pendingDelete.id] ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </span>
              ) : (
                "Delete"
              )}
            </Button>
            <AlertDialogCancel
              disabled={pendingDelete != null && Boolean(deletingById[pendingDelete.id])}
              className="rounded-[8px] h-[52px] bg-[#0B1E66] text-white hover:bg-[#0B1E66] hover:text-white"
              onClick={() => setPendingDelete(null)}
            >
              Close
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
