"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

type ApiList<T> = { data: T } | T;

export type StandardDataTableProps<T extends Record<string, any>> = {
  columns: ColumnDef<T>[];
  listUrl: string;
  createHref: string;
  createLabel?: string;
  rowId?: (row: T) => string | number;
  onDeleteUrl?: (id: string | number) => string;
  searchPlaceholder?: string;
  emptyText?: string;
};

export default function StandardDataTable<T extends Record<string, any>>({
  columns: userColumns,
  listUrl,
  createHref,
  createLabel = "Tambah Data",
  rowId = (row) => (row as any).id as string | number,
  onDeleteUrl,
  searchPlaceholder = "Filter...",
  emptyText = "Tidak ada data",
}: StandardDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageSize, setPageSize] = useState(10);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnsOpen, setColumnsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<ApiList<T[]>>("GET", listUrl);
        const payload = Array.isArray(res) ? res : (res as any).data;
        if (mounted) setData(payload ?? []);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Gagal memuat data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [listUrl]);

  const selectionCol = useMemo<ColumnDef<T>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? undefined : false)}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox aria-label="Select row" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
      ),
      size: 40,
    }),
    []
  );

  const columns = useMemo<ColumnDef<T>[]>(() => [selectionCol, ...userColumns], [selectionCol, userColumns]);

  async function handleDelete(id: string | number) {
    if (!onDeleteUrl) return;
    if (!confirm("Yakin menghapus data ini?")) return;
    setDeletingId(id);
    try {
      await apiRequest("DELETE", onDeleteUrl(id));
      setData((rows) => rows.filter((r) => rowId(r) !== id));
    } catch (e: any) {
      alert(e?.message ?? "Gagal menghapus");
    } finally {
      setDeletingId(null);
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
    meta: onDeleteUrl ? { onDelete: handleDelete } : undefined,
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="space-y-4">
      <Card className="border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 w-full"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 relative">
              <Button asChild>
                <Link href={createHref}>{createLabel}</Link>
              </Button>
              <Button variant="outline" onClick={() => setColumnsOpen((v) => !v)}>Columns ▾</Button>
              {columnsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-sm p-2 z-10">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Tampilkan kolom</div>
                  <div className="max-h-64 overflow-auto pr-1">
                    {table.getAllLeafColumns().map((col) => (
                      <label key={col.id} className="flex items-center gap-2 px-2 py-1 text-sm">
                        <input
                          type="checkbox"
                          checked={col.getIsVisible()}
                          onChange={col.getToggleVisibilityHandler()}
                          className="size-4 rounded border-input"
                        />
                        {col.columnDef.header as string}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="hover:bg-transparent">
                    {hg.headers.map((h) => (
                      <TableHead
                        key={h.id}
                        className={h.column.getCanSort() ? "cursor-pointer select-none" : ""}
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === "asc" && <span className="ml-1 text-xs opacity-70">▲</span>}
                        {h.column.getIsSorted() === "desc" && <span className="ml-1 text-xs opacity-70">▼</span>}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="py-6 text-center text-muted-foreground">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                )}
                {error && !loading && (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="py-6 text-center text-red-600">
                      {error}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !error && table.getRowModel().rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="py-6 text-center text-muted-foreground">
                      {emptyText}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !error && table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {deletingId !== null && <div className="mt-2 text-xs text-muted-foreground">Menghapus ID: {String(deletingId)}...</div>}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/hal
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="size-4" />
                <span className="sr-only sm:not-sr-only">Previous</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight className="size-4" />
                <span className="sr-only sm:not-sr-only">Next</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

